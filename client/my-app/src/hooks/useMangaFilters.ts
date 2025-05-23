import { useState, useEffect, useCallback } from 'react';

export function useMangaFilters(initialSortBy = 'published') {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(initialSortBy);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSortBy(initialSortBy);
  }, [initialSortBy]);

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    resetFilters
  };
}
