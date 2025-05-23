import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MangaPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
  isTablet: boolean; // To adjust visible buttons
}

export default function MangaPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onNextPage,
  onPrevPage,
  isTablet
}: MangaPaginationProps) {
  if (totalPages <= 1) {
    return null; // Don't render pagination if only one page
  }

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = isTablet ? 5 : 3;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? 'default' : 'outline'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(i)}
          aria-label={`Go to page ${i}`}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="text-muted-foreground mt-4 flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
      <div className="order-2 sm:order-1">
        Showing {startItem}-{endItem} of {totalItems} manga
      </div>
      <div className="order-1 flex gap-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onPrevPage}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {renderPaginationButtons()}

        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
