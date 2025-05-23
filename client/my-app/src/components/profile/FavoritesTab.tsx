import { Button } from '@/components/ui/button';
import { BookMarked, Loader2 } from 'lucide-react';
import { useGetListFavMangaQuery } from '@/services/apiManga';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

const FavoritesTab = () => {
  // Fetch user favorites
  const { data: favorites = [], isLoading: isLoadingFavorites } =
    useGetListFavMangaQuery();
  console.log('favorites', favorites);
  return (
    <>
      <h3 className="mb-6 text-xl font-semibold">My Favorites</h3>
      {isLoadingFavorites ? (
        <div className="flex justify-center py-8">
          <Loader2 className="text-manga-500 h-8 w-8 animate-spin" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="py-8 text-center text-gray-400">
          <BookMarked className="mx-auto mb-3 h-12 w-12 opacity-30" />
          <p>No favorites yet. Add manga to your favorites to see them here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {favorites.map((manga) => (
            <div key={manga.manga_id} className="group relative">
              <Image
                src={
                  manga.manga.manga_thumb.includes('https://')
                    ? '/placeholder.jpg'
                    : `${process.env.NEXT_PUBLIC_API_URL_IPFS}${manga.manga.manga_thumb}`
                }
                alt={manga.manga.manga_title}
                className="aspect-[3/4] w-full rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
                width={300}
                height={400}
                priority
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              <div className="absolute inset-0 rounded-md bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute right-0 bottom-0 left-0 p-3">
                  <p className="text-sm font-medium text-white">
                    {manga.manga.manga_title}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Link
                      href={`/manga/${manga.manga_id}`}
                      className="rounded-lg border-white/20 px-5 py-2 text-xs text-white hover:bg-white/10"
                    >
                      View
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-white hover:bg-white/10"
                      onClick={() =>
                        toast('Removed from favorites', {
                          description: `${manga.manga.manga_title} has been removed from your favorites.`
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FavoritesTab;
