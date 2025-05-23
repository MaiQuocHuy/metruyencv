'use client';

import { useMemo, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';

import { MangaListResult, useSearchMangaQuery } from '@/services/apiManga';
import MangaGrid from '@/components/manga/MangaGrid';
import MobileFilters from './MobileFilters';
import MangaSorting from './MangaSorting';
import MangaPagination from './MangaPagination';

interface MangaResultsProps {
  mangaData?: MangaListResult;
  isLoading: boolean;
  itemsPerPage: number;
}

const MangaResults = ({
  mangaData,
  isLoading: propIsLoading,
  itemsPerPage
}: MangaResultsProps) => {
  const { searchQuery, selectedCategory, selectedStatus, sortBy, currentPage } =
    useAppSelector((state) => state.ui);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Only trigger search query when filters or search are applied
  const shouldUseSearch =
    searchQuery ||
    selectedCategory.length > 0 ||
    selectedStatus.length > 0 ||
    (sortBy.key && sortBy.value == true);

  const { data: searchData, isLoading: searchIsLoading } = useSearchMangaQuery(
    {
      category_id:
        selectedCategory.length > 0 ? Number(selectedCategory[0]) : undefined,
      manga_status: selectedStatus.length > 0 ? selectedStatus[0] : undefined,
      keyword: searchQuery ? String(searchQuery) : undefined,
      page: currentPage,
      limit: itemsPerPage,
      sortMangaByItem: sortBy // Pass the sortBy object directly
    },
    { skip: !shouldUseSearch }
  );

  console.log('SortBy', sortBy);

  // Determine which data source to use and loading state
  const activeData = shouldUseSearch ? searchData : mangaData;
  const isLoading = shouldUseSearch ? searchIsLoading : propIsLoading;

  // Use API provided pagination values when available
  const apiTotalPages = activeData?.totalPages;
  const totalPages =
    apiTotalPages || Math.ceil((activeData?.mangas.length || 0) / itemsPerPage);

  // Results info with API data
  const resultsInfo = () => {
    if (isLoading) return 'Loading manga...';

    // If using API pagination
    if (activeData?.total) {
      const start = (currentPage - 1) * (activeData?.limit || itemsPerPage) + 1;
      const end = Math.min(
        start + (activeData.mangas.length - 1),
        activeData?.total
      );
      return `Showing ${start}-${end} of ${activeData.total} manga`;
    }

    // Fallback to client-side calculation
    return `Showing ${activeData?.mangas.length} manga`;
  };

  // Close mobile search when searching
  useEffect(() => {
    if (searchQuery && showMobileSearch) {
      setShowMobileSearch(false);
    }
  }, [searchQuery, showMobileSearch]);

  // Get title based on sort
  const getTitle = () => {
    if (searchQuery) return 'Search Results';

    switch (sortBy.key) {
      case 'manga_views':
        return 'Most Popular Manga';
      case 'updatedAt':
        return 'New Releases';
      case 'createdAt':
        return sortBy.value == true ? 'Classic Manga' : 'Recently Added';
      case 'manga_number_of_followers':
        return 'Most Followed Manga';
      default:
        return 'Manga Results';
    }
  };

  return (
    <main className="flex-1">
      {/* Mobile Search & Filter Bar */}
      <MobileFilters
        showMobileSearch={showMobileSearch}
        setShowMobileSearch={setShowMobileSearch}
      />

      {/* Sorting Options & Title for desktop */}
      <div className="mb-6 hidden flex-col items-start justify-between gap-4 sm:flex sm:flex-row sm:items-center lg:flex">
        {/* Dynamic Title based on Sort */}
        <h2 className="manga-heading text-xl font-semibold sm:text-2xl">
          {getTitle()}
        </h2>

        {/* Desktop Sort Dropdown */}
        <MangaSorting />
      </div>

      {/* Results info with updated text */}
      <div className="text-muted-foreground mb-4 text-sm">{resultsInfo()}</div>

      {/* MangaGrid - display sorted manga data */}
      {activeData?.mangas && (
        <MangaGrid
          manga={activeData?.mangas}
          columns={3}
          isLoading={isLoading}
          emptyMessage={
            shouldUseSearch
              ? 'No manga found matching your search and filters.'
              : 'No manga available.'
          }
        />
      )}

      {/* Pagination component */}
      {totalPages > 1 && !isLoading && (
        <MangaPagination totalPages={totalPages} currentPage={currentPage} />
      )}
    </main>
  );
};

export default MangaResults;
