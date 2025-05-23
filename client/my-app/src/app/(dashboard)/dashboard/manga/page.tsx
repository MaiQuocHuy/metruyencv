'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  useDeleteMangaMutation,
  useGetAllMangaQuery,
  usePublishMangaMutation,
  useUnpublishMangaMutation
} from '@/services/apiManga';
import { useMangaPagination } from '@/hooks/useMangaPagination';
import { useMangaFilters } from '@/hooks/useMangaFilters';
import { useMangaSelection } from '@/hooks/useMangaSelection';
import { MangaFilters, MangaPagination, MangaTable } from '@/components/admin';

interface MangaPageProps {
  className?: string;
  variant?: 'default' | 'compact'; // Keep variant if needed for layout differences
  limit?: number; // Keep limit if needed for compact view
  title?: string;
}

// Renamed component to reflect it's the page content
export default function MangaManagementPage({
  className = '',
  variant = 'default',
  limit,
  title
}: MangaPageProps) {
  // --- Hooks ---
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  const [isMobileFiltersVisible, setIsMobileFiltersVisible] = useState(false);

  // Custom Hooks for State Management
  const { currentPage, itemsPerPage, goToPage, goToNextPage, goToPrevPage } =
    useMangaPagination(1, 10); // Pass dependencies if needed, e.g., [sortBy]
  const { searchTerm, setSearchTerm, sortBy, setSortBy, resetFilters } =
    useMangaFilters('published');

  // --- Data Fetching ---
  const {
    data: mangaData,
    isLoading,
    isError,
    error, // Capture error object
    refetch
  } = useGetAllMangaQuery({
    page: currentPage,
    limit: itemsPerPage,
    sort: sortBy
    // Add search query param if API supports server-side search:
    // search: searchTerm,
  });

  const [publishManga, { isLoading: isPublishing }] = usePublishMangaMutation();
  const [unpublishManga, { isLoading: isUnpublishing }] =
    useUnpublishMangaMutation();
  // Add delete mutation hook here if available
  const [deleteManga, { isLoading: isDeleting }] = useDeleteMangaMutation();
  // const [bulkDeleteManga, { isLoading: isBulkDeleting }] = useBulkDeleteMangaMutation();

  // --- Derived State & Data Processing ---
  const mangaList = useMemo(() => mangaData?.mangas || [], [mangaData]);
  const totalItems = useMemo(() => mangaData?.total || 0, [mangaData]);
  const totalPages = useMemo(() => mangaData?.totalPages || 1, [mangaData]);

  // Client-side filtering (only if API doesn't support server-side search)
  const filteredMangaList = useMemo(() => {
    // If API handles search, just return mangaList
    // if (mangaData?.mangas) return mangaList;

    if (!searchTerm.trim()) return mangaList;
    const searchLower = searchTerm.toLowerCase();
    return mangaList.filter(
      (item) =>
        item.manga_title.toLowerCase().includes(searchLower) ||
        item.manga_author?.toLowerCase().includes(searchLower) ||
        item.manga_description?.toLowerCase().includes(searchLower)
    );
  }, [mangaList, searchTerm /*, mangaData */]); // Add mangaData if checking server-side search support

  const mangaToShow = useMemo(() => {
    // Use filtered list if client-side filtering, otherwise use raw list
    const dataToUse = searchTerm ? filteredMangaList : mangaList;
    return limit ? dataToUse.slice(0, limit) : dataToUse;
  }, [filteredMangaList, mangaList, limit, searchTerm]);

  // Selection Hook
  const { selectedManga, toggleSelectManga, toggleSelectAll, resetSelection } =
    useMangaSelection(mangaToShow); // Pass the currently visible list

  // --- Event Handlers ---
  const handleDelete = useCallback(
    async (id: number) => {
      // Replace with actual API call using deleteManga mutation
      console.log(`Delete manga with ID: ${id}`);
      try {
        await deleteManga(id).unwrap();
        toast.success('Manga deleted successfully');
      } catch (err) {
        toast.error('Failed to delete manga');
        console.log('Delete error:', err);
      }
      toast.warning(`Delete functionality for ID ${id} implemented.`); // Placeholder
    },
    [
      /* deleteManga, resetSelection, refetch */
    ]
  );

  const handleTogglePublishStatus = useCallback(
    async (id: number, newStatus: string) => {
      console.log(`Toggling manga ${id} ${newStatus} status`);

      // Create loading toast with auto-dismiss after 5 seconds
      const loadingToastId = toast.loading(
        `${newStatus === 'published' ? 'Publishing' : 'Unpublishing'} manga...`
      );

      try {
        if (newStatus === 'published') {
          await publishManga(id).unwrap();
          // Dismiss loading toast explicitly and show success
          toast.dismiss(loadingToastId);
          toast.success('Manga published successfully');
        } else if (newStatus === 'unpublished') {
          await unpublishManga(id).unwrap();
          // Dismiss loading toast explicitly and show success
          toast.dismiss(loadingToastId);
          toast.success('Manga unpublished successfully');
        }
      } catch (err) {
        // Dismiss loading toast and show error
        toast.dismiss(loadingToastId);
        toast.error('Failed to update manga status');
        console.error('Publish/Unpublish error:', err);
      }
    },
    [publishManga, unpublishManga]
  );

  const handleResetFilters = useCallback(() => {
    resetFilters();
    // If using client-side search, resetting filters doesn't require page reset
    // If using server-side search triggered by searchTerm, uncomment below:
    // setCurrentPage(1);
  }, [resetFilters /*, setCurrentPage */]);

  // --- Render Logic ---
  const isCompact = variant === 'compact';

  // Error State
  if (isError) {
    return (
      <Card className="border-destructive/50 bg-destructive/10 text-destructive p-6">
        <CardHeader>
          <CardTitle>Error Loading Manga</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not fetch manga data. Please try again later.</p>
          {process.env.NODE_ENV === 'development' && error && (
            <pre className="mt-2 text-xs">{JSON.stringify(error, null, 2)}</pre>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-card/50 border-manga-600/20 animate-fade-in shadow-lg backdrop-blur-sm ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">
          {title || (isCompact ? 'Top Manga' : 'Manga Management')}
        </CardTitle>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {!isCompact && (
            <Button
              size="sm"
              className="bg-manga-600 hover:bg-manga-700"
              onClick={() => router.push('/dashboard/manga/new')}
            >
              <Plus className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Add Manga</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}

          {/* Mobile Filter Toggle */}
          {!isCompact && !isTablet && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsMobileFiltersVisible(!isMobileFiltersVisible)}
              className="sm:hidden"
              aria-label="Toggle filters"
              aria-expanded={isMobileFiltersVisible}
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Filters */}
      {!isCompact && (
        <MangaFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          isVisible={isTablet || isMobileFiltersVisible}
        />
      )}

      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="text-manga-400 h-8 w-8 animate-spin" />
            <span className="text-manga-400 ml-2">Loading manga...</span>
          </div>
        )}

        {/* Manga Table */}
        {!isLoading && !isError && (
          <MangaTable
            mangaToShow={mangaToShow}
            selectedManga={selectedManga}
            onSelectAllChange={toggleSelectAll}
            onRowSelectChange={toggleSelectManga}
            onTogglePublish={handleTogglePublishStatus}
            onDelete={handleDelete}
            isCompact={isCompact}
            isDesktop={isDesktop}
            searchTerm={searchTerm}
          />
        )}

        {/* Pagination */}
        {!isLoading &&
          !isError &&
          !isCompact &&
          totalPages > 1 &&
          !searchTerm && ( // Hide pagination during client-side search
            <MangaPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => goToPage(page, totalPages)}
              onNextPage={() => goToNextPage(totalPages)}
              onPrevPage={goToPrevPage}
              isTablet={isTablet}
            />
          )}

        {/* Client-side search results count */}
        {!isLoading && !isError && !isCompact && searchTerm && (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            Found {filteredMangaList.length} manga matching "{searchTerm}"
          </div>
        )}

        {/* Compact view count */}
        {!isLoading && !isError && isCompact && mangaToShow.length > 0 && (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            {limit && totalItems > limit
              ? `Showing top ${limit} of ${totalItems} manga`
              : `Total: ${totalItems} manga`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
