import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { MangaChapter } from '@/services/apiManga';
import { useRouter } from 'next/navigation';
import {
  useIncreaseMangaViewMutation,
  useIncreaseChapterViewMutation
} from '@/services/apiManga';
import { useState } from 'react';

interface ReaderBottomControlsProps {
  mangaId: number;
  prevChapter: MangaChapter | null;
  nextChapter: MangaChapter | null;
  chaptersLoading: boolean;
  currentImageIndex: number;
  totalImages: number;
  imagesLoading: boolean;
  isVisible: boolean;
  keepControlsVisible: () => void;
  hideControlsWithDelay: () => void;
}

const ReaderBottomControls: React.FC<ReaderBottomControlsProps> = ({
  mangaId,
  prevChapter,
  nextChapter,
  chaptersLoading,
  currentImageIndex,
  totalImages,
  imagesLoading,
  isVisible,
  keepControlsVisible,
  hideControlsWithDelay
}) => {
  const router = useRouter();
  const [increaseMangaView] = useIncreaseMangaViewMutation();
  const [increaseChapterView] = useIncreaseChapterViewMutation();
  const [navigationInProgress, setNavigationInProgress] = useState(false);

  // Track views and navigate programmatically
  const handleChapterNavigation = (
    event: React.MouseEvent<HTMLAnchorElement>,
    chapterId: number | null,
    targetUrl: string
  ) => {
    // Prevent default link behavior
    event.preventDefault();

    // Don't allow multiple navigation attempts
    if (navigationInProgress || !chapterId) return;

    setNavigationInProgress(true);

    // Track manga view (non-blocking)
    increaseMangaView({ mangaId })
      .unwrap()
      .catch((err) => {
        console.log('error to increase manga view count:', err);
        // We don't block navigation on tracking failure
      });

    // Track chapter view (non-blocking)
    increaseChapterView({ chapterId })
      .unwrap()
      .catch((err) => {
        console.log('error increase chapter view count:', err);
        // We don't block navigation on tracking failure
      });

    // Navigate immediately without waiting for the tracking to complete
    router.push(targetUrl);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed right-0 bottom-0 left-0 z-50 bg-gradient-to-t from-black/90 to-transparent p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={keepControlsVisible}
      onMouseLeave={hideControlsWithDelay}
    >
      <div className="container mx-auto flex flex-col items-center justify-center">
        <div className="mb-4 flex w-full max-w-lg justify-between px-4">
          <Button
            variant="outline"
            disabled={!prevChapter || chaptersLoading || navigationInProgress}
            asChild={!!prevChapter && !chaptersLoading && !navigationInProgress}
            className="rounded-full border-white/20 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10"
          >
            {prevChapter ? (
              <Link
                href={`/manga/${mangaId}/chapters/${prevChapter.chap_id}`}
                onClick={(e) =>
                  handleChapterNavigation(
                    e,
                    prevChapter.chap_id,
                    `/manga/${mangaId}/chapters/${prevChapter.chap_id}`
                  )
                }
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
              </Link>
            ) : (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous Chapter
              </>
            )}
          </Button>

          <Button
            variant="outline"
            disabled={!nextChapter || chaptersLoading || navigationInProgress}
            asChild={!!nextChapter && !chaptersLoading && !navigationInProgress}
            className="rounded-full border-white/20 bg-black/50 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/10"
          >
            {nextChapter ? (
              <Link
                href={`/manga/${mangaId}/chapters/${nextChapter.chap_id}`}
                onClick={(e) =>
                  handleChapterNavigation(
                    e,
                    nextChapter.chap_id,
                    `/manga/${mangaId}/chapters/${nextChapter.chap_id}`
                  )
                }
              >
                Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            ) : (
              <>
                Next Chapter <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Page indicator */}
        <div className="mb-4 text-sm text-white/70">
          {imagesLoading ? (
            <Skeleton className="h-4 w-24 rounded bg-gray-800/50" />
          ) : (
            `Page ${currentImageIndex + 1} of ${totalImages}`
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReaderBottomControls;
