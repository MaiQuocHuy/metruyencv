import Link from 'next/link';
import {
  X,
  ZoomOut,
  ZoomIn,
  Maximize,
  Minimize,
  Home,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { motion } from 'framer-motion';
import { MangaType, MangaChapterDetail } from '@/services/apiManga';
import { ReportChapterDialog } from '../chapter/ReportChapterDialog';
import { useState } from 'react';
import { useCreateReportMutation } from '@/services/apiError';
import { useAppSelector } from '@/lib/redux/hook';

interface ReaderTopControlsProps {
  manga: MangaType;
  chapterDetails: MangaChapterDetail | undefined;
  zoom: number;
  setZoom: (value: number) => void;
  fullscreen: boolean;
  toggleFullscreen: () => void;
  isVisible: boolean;
  keepControlsVisible: () => void;
  hideControlsWithDelay: () => void;
}

const ReaderTopControls: React.FC<ReaderTopControlsProps> = ({
  manga,
  chapterDetails,
  zoom,
  setZoom,
  fullscreen,
  toggleFullscreen,
  isVisible,
  keepControlsVisible,
  hideControlsWithDelay
}) => {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false); // State for dialog
  const auth = useAppSelector((state) => state.auth);
  const [reportChapter] = useCreateReportMutation();
  if (!isVisible) return null;
  console.log('x-client-id', auth.clientId);
  return (
    <>
      <motion.div
        className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-b from-black/90 to-transparent p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={keepControlsVisible}
        onMouseLeave={hideControlsWithDelay}
      >
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full text-white hover:bg-white/10"
            >
              <Link href={`/manga/${manga.manga_id}`}>
                <X className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="ml-2 hidden font-medium text-white md:block">
              <span className="text-purple-300">{manga.manga_title}</span> -
              Chapter {chapterDetails?.chap_number ?? '...'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="rounded-full text-white hover:bg-white/10"
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <Slider
              className="w-24 md:w-32"
              value={[zoom]}
              min={50}
              max={150}
              step={10}
              onValueChange={(value) => setZoom(value[0])}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="rounded-full text-white hover:bg-white/10"
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="rounded-full text-white hover:bg-white/10"
            >
              {fullscreen ? (
                <Minimize className="h-5 w-5" />
              ) : (
                <Maximize className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full text-white hover:bg-white/10"
            >
              <Link href={`/manga/${manga.manga_id}`}>
                <Home className="h-5 w-5" />
              </Link>
            </Button>
            {auth.clientId && Number(auth.clientId) != 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsReportDialogOpen(true)} // Open dialog on click
                className="rounded-full text-white hover:bg-white/10"
                aria-label="Report Chapter" // Add aria-label for accessibility
              >
                <Flag className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </motion.div>
      <ReportChapterDialog
        open={isReportDialogOpen}
        onOpenChange={setIsReportDialogOpen}
        chapterId={chapterDetails?.chap_id}
        mangaId={manga?.manga_id}
        reportChapter={reportChapter}
      />
    </>
  );
};

export default ReaderTopControls;
