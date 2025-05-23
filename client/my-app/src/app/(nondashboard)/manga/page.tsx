'use client';
import MangaGrid from '@/components/manga/MangaGrid';
import { Button } from '@/components/ui/button';
import { ChevronRight, TrendingUp } from 'lucide-react';
import FeaturedManga from '@/components/manga/FeatureManga';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { useGetAllMangaQuery } from '@/services/apiManga';

// Define a type for the manga item
interface MangaItem {
  id: string;
  title: string;
  coverImage: string;
  author: string;
  averageRating: string;
  createdAt: string;
  updatedAt: string;
  followers: number;
  views: number;
  status: string;
  [key: string]: any;
}

const Index = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const { data, error, isLoading } = useGetAllMangaQuery({
    page,
    limit
  });

  // Sort the data client-side
  const sortedByPopularity = useMemo(() => {
    if (!data?.mangas) return [];
    return [...data.mangas].sort(
      (a, b) => (b.manga_views || 0) - (a.manga_views || 0)
    );
  }, [data?.mangas]);

  const sortedByLatest = useMemo(() => {
    if (!data?.mangas) return [];

    return [...data.mangas].sort(
      (a, b) =>
        (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) -
        (a.updatedAt ? new Date(a.updatedAt).getTime() : 0)
    );
  }, [data?.mangas]);

  const sortedByFavorite = useMemo(() => {
    if (!data?.mangas) return [];
    return [...data.mangas].sort(
      (a, b) => b.manga_number_of_followers - a.manga_number_of_followers
    );
  }, [data?.mangas]);

  console.log('Sorted by Popularity:', sortedByPopularity);
  console.log('Sorted by Latest:', sortedByLatest);
  console.log('Sorted by Favorite:', sortedByFavorite);

  return (
    <>
      <FeaturedManga />
      <div className="flex flex-col items-center">
        <section className="manga-section bg-accent/30 container py-12">
          <div className="container">
            <MangaGrid
              title="Latest Updates"
              manga={sortedByLatest.slice(0, 8)}
              isLoading={isLoading}
              limit={8}
              action={
                <Button
                  variant="link"
                  className="text-manga-400 hover:text-manga-300"
                  asChild
                >
                  <Link href="/manga/list" className="flex items-center">
                    <TrendingUp className="mr-1 h-4 w-4" />
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              }
            />
          </div>
        </section>

        <section className="manga-section container">
          <MangaGrid
            title="Popular Manga"
            manga={sortedByPopularity.slice(0, 8)}
            isLoading={isLoading}
            limit={8}
            action={
              <Button
                variant="link"
                className="text-manga-400 hover:text-manga-300"
                asChild
              >
                <Link href="/manga/list" className="flex items-center">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            }
          />
        </section>

        <section className="manga-section container">
          <MangaGrid
            title="High Followers Manga"
            manga={sortedByFavorite.slice(0, 8)}
            isLoading={isLoading}
            limit={8}
            action={
              <Button
                variant="link"
                className="text-manga-400 hover:text-manga-300"
                asChild
              >
                <Link href="/manga/list" className="flex items-center">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            }
          />
        </section>

        <section className="bg-manga-800 flex w-full flex-col items-center py-16 text-white">
          <div className="container text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Join Our Manga Community
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-lg">
              Create an account to track your favorite manga, get personalized
              recommendations, and join discussions with fellow manga
              enthusiasts.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-manga-600 hover:bg-manga-700"
                asChild
              >
                <Link href="/register">Sign Up Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-manga-500 text-manga-300 hover:bg-manga-900"
                asChild
              >
                <Link href="/list">Browse Manga Search</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
