import React from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface HistoryPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isTransitioning?: boolean;
}

const HistoryPagination: React.FC<HistoryPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
  isTransitioning = false
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading || isTransitioning}
        className="relative"
      >
        {(isLoading || isTransitioning) && (
          <Loader2 className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin" />
        )}
        <span className={isLoading || isTransitioning ? 'opacity-0' : ''}>
          Previous
        </span>
      </Button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className="flex items-center gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{
            duration: 0.2,
            delay: isTransitioning ? 0.3 : 0 // Add delay when transitioning
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`relative transition-all duration-200 ${
                currentPage === page ? 'bg-manga-500' : ''
              }`}
            >
              {isLoading && page === currentPage && (
                <Loader2 className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin" />
              )}
              <span
                className={isLoading && page === currentPage ? 'opacity-0' : ''}
              >
                {page}
              </span>
            </Button>
          ))}
        </motion.div>
      </AnimatePresence>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading || isTransitioning}
        className="relative"
      >
        {(isLoading || isTransitioning) && (
          <Loader2 className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 animate-spin" />
        )}
        <span className={isLoading || isTransitioning ? 'opacity-0' : ''}>
          Next
        </span>
      </Button>
    </div>
  );
};

export default HistoryPagination;
