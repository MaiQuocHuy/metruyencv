import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { setSearchQuery } from '@/lib/redux/slices/uiSlice';
import { SearchInput } from '@/components/custom-component/search-input';

const MangaHero = () => {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.ui);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Debounce search query updates
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localSearchQuery !== searchQuery) {
        dispatch(setSearchQuery(localSearchQuery));
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(debounceTimer);
  }, [localSearchQuery, dispatch, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setLocalSearchQuery('');
    dispatch(setSearchQuery(''));
  };

  return (
    <section className="relative mb-6 overflow-hidden rounded-xl md:mb-10">
      <div className="from-background via-background/80 to-background/10 absolute inset-0 z-10 bg-gradient-to-r" />
      <img
        src="https://images.unsplash.com/photo-1560932684-5e552e2894e9?q=80&w=1287&auto=format&fit=crop"
        alt="Discover Manga"
        className="h-40 w-full object-cover sm:h-56 md:h-80"
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-6 md:px-16">
        <h1 className="mb-2 text-2xl font-bold text-white md:mb-4 md:text-4xl lg:text-5xl">
          Discover Popular Manga
        </h1>
        <p className="mb-4 max-w-xl text-sm text-white/80 md:mb-6 md:text-lg">
          Explore the most popular manga series, filter by category, and find
          your next reading adventure.
        </p>
        <div className="relative hidden max-w-md sm:block">
          <SearchInput
            value={localSearchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            placeholder="Search by title or author..."
            variant="hero"
            className="max-w-md"
            aria-label="Search manga"
          />
        </div>
      </div>
    </section>
  );
};

export default MangaHero;
