'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { setSearchQuery, setCurrentPage } from '@/lib/redux/slices/uiSlice';
import { useGetAllMangaQuery } from '@/services/apiManga';
import MangaHero from '@/components/manga/MangaHero';
import MangaFiltersLayout from '@/components/manga/MangaFiltersLayout';

const PopularManga = () => {
  const dispatch = useAppDispatch();
  const { currentPage } = useAppSelector((state) => state.ui);
  const itemsPerPage = 10;

  const { data: allManga, isLoading } = useGetAllMangaQuery({
    page: currentPage,
    limit: itemsPerPage
  });

  // Reset search on unmount
  useEffect(() => {
    return () => {
      dispatch(setSearchQuery(''));
      dispatch(setCurrentPage(1));
    };
  }, [dispatch]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container mx-auto py-4 md:py-8">
        <MangaHero />

        <MangaFiltersLayout
          mangaData={allManga}
          isLoading={isLoading}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default PopularManga;
