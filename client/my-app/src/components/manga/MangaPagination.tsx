'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'; // Assuming shadcn UI components are here
import { useAppDispatch } from '@/lib/redux/hook';
import { setCurrentPage } from '@/lib/redux/slices/uiSlice'; // Adjust path if needed

interface MangaPaginationProps {
  totalPages: number;
  currentPage: number;
  // onPageChange is removed as we dispatch directly
}

// Helper function to generate pagination items with ellipsis
const generatePaginationItems = (
  currentPage: number,
  totalPages: number,
  onPageClick: (page: number) => void
) => {
  const items = [];
  const pageNeighbours = 1; // How many pages to show around the current page

  // Previous Button
  items.push(
    <PaginationItem key="prev">
      <PaginationPrevious
        href="#" // Use href="#" for client-side handling
        onClick={(e) => {
          e.preventDefault(); // Prevent navigation
          if (currentPage > 1) {
            onPageClick(currentPage - 1);
          }
        }}
        className={
          currentPage === 1
            ? 'text-muted-foreground pointer-events-none opacity-50'
            : 'cursor-pointer'
        }
        aria-disabled={currentPage === 1}
      />
    </PaginationItem>
  );

  // Page Numbers Logic
  const startPage = Math.max(1, currentPage - pageNeighbours);
  const endPage = Math.min(totalPages, currentPage + pageNeighbours);

  // Ellipsis at the beginning?
  if (startPage > 1) {
    items.push(
      <PaginationItem key="start-page">
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageClick(1);
          }}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    if (startPage > 2) {
      items.push(<PaginationEllipsis key="start-ellipsis" />);
    }
  }

  // Page numbers around current
  for (let page = startPage; page <= endPage; page++) {
    items.push(
      <PaginationItem key={page}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageClick(page);
          }}
          isActive={currentPage === page}
          className={currentPage !== page ? 'cursor-pointer' : ''}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    );
  }

  // Ellipsis at the end?
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push(<PaginationEllipsis key="end-ellipsis" />);
    }
    items.push(
      <PaginationItem key="end-page">
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageClick(totalPages);
          }}
          className="cursor-pointer"
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );
  }

  // Next Button
  items.push(
    <PaginationItem key="next">
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) {
            onPageClick(currentPage + 1);
          }
        }}
        className={
          currentPage === totalPages
            ? 'text-muted-foreground pointer-events-none opacity-50'
            : 'cursor-pointer'
        }
        aria-disabled={currentPage === totalPages}
      />
    </PaginationItem>
  );

  return items;
};

const MangaPagination: React.FC<MangaPaginationProps> = ({
  totalPages,
  currentPage
}) => {
  const dispatch = useAppDispatch();

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      dispatch(setCurrentPage(page));
      // Optional: Scroll to top or results section after page change
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  return (
    <Pagination className="mt-8 mb-4">
      <PaginationContent>
        {generatePaginationItems(currentPage, totalPages, handlePageChange)}
      </PaginationContent>
    </Pagination>
  );
};

export default MangaPagination;
