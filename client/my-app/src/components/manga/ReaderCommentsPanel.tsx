import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CommentSection from '@/components/manga/CommentSection';

interface ReaderCommentsPanelProps {
  mangaId: string;
  chapterId: string;
  showComments: boolean;
  toggleComments: () => void;
}

const ReaderCommentsPanel: React.FC<ReaderCommentsPanelProps> = ({
  mangaId,
  chapterId,
  showComments,
  toggleComments
}) => {
  const commentsContainerRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {showComments && (
        <motion.div
          ref={commentsContainerRef}
          className="fixed right-0 bottom-0 left-0 z-40 max-h-[70vh] overflow-y-auto bg-black/95 backdrop-blur-md"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="container mx-auto py-6">
            <div className="mb-4 flex items-center justify-between px-4">
              <h2 className="text-xl font-semibold text-white">Comments</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleComments}
                className="rounded-full text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Card className="overflow-hidden rounded-xl border-purple-600/30 bg-black/80 shadow-xl shadow-purple-500/10">
              <CardContent className="p-0">
                <div className="animate-fade-in">
                  <Separator className="bg-purple-600/20" />
                  <CommentSection mangaId={mangaId} chapterId={chapterId} />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReaderCommentsPanel;
