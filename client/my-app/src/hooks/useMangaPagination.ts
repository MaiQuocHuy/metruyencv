import { useState, useEffect, useCallback } from 'react';

export function useMangaPagination(
  initialPage = 1,
  initialItemsPerPage = 10,
  dependencies: any[] = []
) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Reset to first page when dependencies change (e.g., filters)
  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const goToPage = useCallback((page: number, totalPages: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, []);

  const goToNextPage = useCallback((totalPages: number) => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, []);

  const goToPrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    currentPage,
    setCurrentPage, // Keep if direct setting is needed
    itemsPerPage,
    setItemsPerPage,
    goToPage,
    goToNextPage,
    goToPrevPage
  };
}
