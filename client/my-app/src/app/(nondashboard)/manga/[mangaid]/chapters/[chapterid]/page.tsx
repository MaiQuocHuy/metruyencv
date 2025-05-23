'use client';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ReaderTopControls from '@/components/manga/ReaderTopControls';
import ReaderBottomControls from '@/components/manga/ReaderBottomControls';
import ReaderImageDisplay from '@/components/manga/ReaderImageDisplay';
import ReaderCommentsPanel from '@/components/manga/ReaderCommentsPanel';

import { ChapterImage } from '@/app/(dashboard)/dashboard/manga/[mangaid]/chapters/[chapterid]/images/page';
import {
  useGetChapterDetailQuery,
  useGetMangaByIdQuery,
  useGetMangaChaptersQuery
} from '@/services/apiManga';
import { fetchAndParseIPFSData } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { toggleNavbar } from '@/lib/redux/slices/uiSlice';

const MangaReader = () => {
  const { mangaid, chapterid } = useParams<{
    mangaid: string;
    chapterid: string;
  }>();
  const dispatch = useAppDispatch();

  // --- Data Fetching ---
  const mangaIdNum = Number(mangaid);
  const chapterIdNum = Number(chapterid);

  const { data: manga, isLoading: isMangaLoading } = useGetMangaByIdQuery({
    id: mangaIdNum,
    isPublished: 'publish'
  });

  const { data: chapterDetails, isLoading: isChapterDetailsLoading } =
    useGetChapterDetailQuery({
      mangaId: mangaIdNum,
      chapterId: chapterIdNum
    });

  const { data: chapters, isLoading: isChaptersLoading } =
    useGetMangaChaptersQuery(mangaIdNum);

  const auth = useAppSelector((state) => state.auth);

  // --- State ---
  const [images, setImages] = useState<ChapterImage[]>([]);
  const [isLoadingIPFS, setIsLoadingIPFS] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [fullscreen, setFullscreen] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isInteractionActive, setIsInteractionActive] = useState(true); // Start as active

  const controlsVisible = isInteractionActive || showComments;

  // --- Refs ---
  const readerContainerRef = useRef<HTMLDivElement>(null);
  const interactionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Effects ---
  // Fetch IPFS data when chapter details are available
  useEffect(() => {
    if (chapterDetails?.chap_content) {
      const cid = chapterDetails.chap_content;
      setIsLoadingIPFS(true);
      setImages([]); // Clear previous images
      fetchAndParseIPFSData(cid)
        .then(setImages)
        .catch((err) => {
          console.log('fetch failed:', err);
          setImages([]);
        })
        .finally(() => setIsLoadingIPFS(false));
    } else {
      setImages([]); // Clear images if no content CID
    }
  }, [chapterDetails]);

  // Hide main app navbar
  useEffect(() => {
    dispatch(toggleNavbar(true));
    return () => {
      dispatch(toggleNavbar(false));
    };
  }, [dispatch]);

  // Disable body scroll
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // Control reader container scroll based on comments
  useEffect(() => {
    if (readerContainerRef.current) {
      readerContainerRef.current.style.overflow = showComments
        ? 'hidden'
        : 'auto';
    }
  }, [showComments]);

  // Track reading progress and current image index
  useEffect(() => {
    const container = readerContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      // Prevent division by zero or negative scrollHeight
      const totalScrollableHeight = Math.max(1, scrollHeight - clientHeight);
      const progress = (scrollTop / totalScrollableHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));

      if (images.length > 0) {
        // Estimate image height more robustly
        const avgImageHeight = scrollHeight / images.length;
        const currentIndex = Math.min(
          images.length - 1,
          Math.floor(scrollTop / avgImageHeight)
        );
        setCurrentImageIndex(currentIndex);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [images.length]); // Re-run only if image count changes

  // --- Interaction Handling for Controls Visibility ---
  const activateInteraction = useCallback(() => {
    setIsInteractionActive(true);
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    interactionTimerRef.current = setTimeout(() => {
      // Only deactivate if comments are not shown
      if (!showComments) {
        setIsInteractionActive(false);
      }
    }, 3000); // Hide after 3 seconds of inactivity
  }, [showComments]); // Dependency on showComments to check before deactivating

  // Keep controls visible when comments are shown
  useEffect(() => {
    if (showComments) {
      setIsInteractionActive(true); // Ensure active
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current); // Clear timer
      }
    } else {
      // If comments just closed, restart the timer
      activateInteraction();
    }
  }, [showComments, activateInteraction]);

  // Initial activation and cleanup
  useEffect(() => {
    activateInteraction(); // Activate on mount
    return () => {
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current); // Cleanup timer on unmount
      }
    };
  }, [activateInteraction]);

  // --- Event Handlers ---
  const handleMouseMove = useCallback(() => {
    if (!showComments) {
      activateInteraction();
    }
  }, [activateInteraction, showComments]);

  const keepControlsVisible = useCallback(() => {
    setIsInteractionActive(true);
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
  }, []);

  const hideControlsWithDelay = useCallback(() => {
    // This is called onMouseLeave from controls; restart the main timer
    if (!showComments) {
      activateInteraction();
    }
  }, [activateInteraction, showComments]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setFullscreen(true);
      });
    } else {
      document.exitFullscreen?.().then(() => {
        setFullscreen(false);
      });
    }
  }, []);

  const toggleComments = useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  // --- Chapter Navigation ---
  const sortedChapters = useMemo(() => {
    if (!chapters || !Array.isArray(chapters)) return [];
    return [...chapters].sort((a, b) => a.chap_number - b.chap_number);
  }, [chapters]);

  const currentChapterIndex = useMemo(() => {
    if (!sortedChapters.length) return -1;
    return sortedChapters.findIndex((ch) => ch.chap_id === chapterIdNum);
  }, [sortedChapters, chapterIdNum]);

  const prevChapter = useMemo(() => {
    return currentChapterIndex > 0
      ? sortedChapters[currentChapterIndex - 1]
      : null;
  }, [sortedChapters, currentChapterIndex]);

  const nextChapter = useMemo(() => {
    return currentChapterIndex >= 0 &&
      currentChapterIndex < sortedChapters.length - 1
      ? sortedChapters[currentChapterIndex + 1]
      : null;
  }, [sortedChapters, currentChapterIndex]);

  // --- Render Logic ---
  if (isMangaLoading) {
    // Simplified loading state for initial manga info
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        Loading Info...
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white">
        <h1 className="mb-4 text-2xl font-bold">Manga Not Found</h1>
        <Button asChild variant="secondary">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black"
      onMouseMove={handleMouseMove}
      // onMouseLeave is not needed here as the timer handles inactivity
    >
      {/* Reading progress bar */}
      <div className="fixed top-0 right-0 left-0 z-[60] h-1">
        {' '}
        {/* Ensure progress is above controls */}
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Top Controls */}
      <AnimatePresence>
        <ReaderTopControls
          manga={manga}
          chapterDetails={chapterDetails}
          zoom={zoom}
          setZoom={setZoom}
          fullscreen={fullscreen}
          toggleFullscreen={toggleFullscreen}
          isVisible={controlsVisible && !showComments} // Only show if comments are closed
          keepControlsVisible={keepControlsVisible}
          hideControlsWithDelay={hideControlsWithDelay}
        />
      </AnimatePresence>

      {/* Side controls */}
      <div className="fixed top-1/2 left-4 z-40 -translate-y-1/2">
        <motion.div
          initial={{ opacity: 0.4 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={toggleComments}
            className={`rounded-full backdrop-blur-sm ${
              showComments
                ? 'bg-blue-500/20 text-blue-500 hover:bg-blue-500/30'
                : 'bg-black/30 text-white hover:bg-white/20'
            }`}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      {/* Reading Content */}
      <div
        ref={readerContainerRef}
        className={`reader-container scrollbar-thin scrollbar-track-black scrollbar-thumb-gray-600 absolute inset-0 h-full w-full ${
          showComments ? 'overflow-hidden' : 'overflow-y-auto'
        }`}
      >
        <ReaderImageDisplay
          images={images}
          zoom={zoom}
          isLoading={isLoadingIPFS || isChapterDetailsLoading}
        />
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        <ReaderBottomControls
          mangaId={mangaIdNum}
          prevChapter={prevChapter}
          nextChapter={nextChapter}
          chaptersLoading={isChaptersLoading}
          currentImageIndex={currentImageIndex}
          totalImages={images.length}
          imagesLoading={isLoadingIPFS || isChapterDetailsLoading}
          isVisible={controlsVisible && !showComments} // Only show if comments are closed
          keepControlsVisible={keepControlsVisible}
          hideControlsWithDelay={hideControlsWithDelay}
        />
      </AnimatePresence>

      {/* Comments Panel */}
      <ReaderCommentsPanel
        mangaId={mangaid}
        chapterId={chapterid}
        showComments={showComments}
        toggleComments={toggleComments}
      />
    </div>
  );
};

export default MangaReader;
