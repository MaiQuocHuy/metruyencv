'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Heart,
  Share2,
  Star,
  BookMarked,
  Calendar,
  Eye
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'; // Import useRouter
import {
  useAddFavoriteMutation,
  useGetListFavMangaQuery,
  useGetMangaByIdQuery,
  useGetMangaChaptersQuery,
  useRemoveFavoriteMutation,
  useIncreaseMangaViewMutation, // Import manga view mutation
  useIncreaseChapterViewMutation, // Import chapter view mutation
  useRatingMangaMutation
} from '@/services/apiManga';
import Image from 'next/image';
import { useAppSelector } from '@/lib/redux/hook';
import { MangaDetailSkeleton } from '@/components/manga/MangaSkeleton';
import MangaRating from '@/components/manga/MangaRating';
import { toast } from 'sonner';

const MangaDetails = () => {
  const params = useParams();
  const router = useRouter(); // Initialize router
  const mangaid = params.mangaid as string;
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const auth = useAppSelector((state) => state.auth);
  console.log('x-client-id', auth.clientId);
  // --- Data Fetching Hooks ---
  const {
    data: manga,
    isLoading: mangaLoading,
    isError: mangaError
  } = useGetMangaByIdQuery({
    id: Number(mangaid),
    isPublished: 'publish'
  });

  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError
  } = useGetMangaChaptersQuery(Number(mangaid));

  const {
    data: favorites,
    isLoading: favoritesLoading,
    error: favoritesError
  } = useGetListFavMangaQuery(undefined, {
    skip: !auth.isAuthenticated // Skip if user is not authenticated
  });

  // --- Mutation Hooks ---
  const [addFav] = useAddFavoriteMutation();
  const [removeFav] = useRemoveFavoriteMutation();
  const [increaseMangaView] = useIncreaseMangaViewMutation();
  const [increaseChapterView] = useIncreaseChapterViewMutation();
  const [ratingManga] = useRatingMangaMutation(); // Assuming this is for rating

  // --- Event Handlers ---

  const handleToggleHeart = async (mangaId: number) => {
    if (!auth.isAuthenticated) {
      // Optionally prompt user to login
      console.log('User not authenticated to manage favorites.');
      return;
    }
    if (mangaId && checkMangaIdInFavorites(mangaId)) {
      try {
        await removeFav(mangaId).unwrap();
        console.log('Removed from favorites');
      } catch (err) {
        console.log('Failed to remove favorite:', err);
      }
    } else if (mangaId && !checkMangaIdInFavorites(mangaId)) {
      try {
        await addFav(mangaId).unwrap();
        console.log('Added to favorites');
      } catch (err) {
        console.log('Failed to add favorite:', err);
      }
    }
  };

  // Handler for clicking a read link (Start Reading or specific chapter)
  const handleReadClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    chapterId: number,
    targetUrl: string
  ) => {
    event.preventDefault(); // Prevent default link navigation

    // Fire off mutations in the background - don't await them
    if (auth.isAuthenticated) {
      increaseMangaView({
        mangaId: Number(mangaid)
      })
        .unwrap()
        .catch((err: any) =>
          console.log('Failed to increase manga view:', err)
        ); // Log errors silently

      increaseChapterView({
        chapterId: Number(chapterId)
      })
        .unwrap()
        .catch((err: any) =>
          console.log('Failed to increase chapter view:', err)
        ); // Log errors silently
    }

    // Navigate immediately
    router.push(targetUrl);
  };

  // --- Helper Functions ---
  const checkMangaIdInFavorites = (mangaId: number) => {
    if (favorites && favorites.length > 0) {
      return favorites.some((fav) => fav.manga_id === mangaId);
    }
    return false;
  };

  // --- Render Logic ---
  if (mangaLoading) {
    // Use the skeleton component
    return <MangaDetailSkeleton />;
  }

  if (mangaError || !manga) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="mb-4 text-2xl font-bold">Manga Not Found</h1>
        <p className="mb-6">
          The manga you're looking for doesn't exist or couldn't be loaded.
        </p>
        <Button asChild>
          <Link href="/library">Back to Library</Link>
        </Button>
      </div>
    );
  }

  const firstChapterId =
    chapters && chapters.length > 0 ? chapters[0].chap_id : null;
  const startReadingUrl = firstChapterId
    ? `/manga/${mangaid}/chapters/${firstChapterId}`
    : '#';

  const handleRatingChange = (newRating: number) => {
    toast('Rating Submitted', {
      description: `Thank you for rating ${newRating} stars!`
    });
    console.log(`Rating changed to ${newRating}`);
    try {
      ratingManga({
        mangaId: Number(mangaid),
        rating: newRating
      }).unwrap();
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
    }
    // Here you would typically send this rating to your backend
  };

  return (
    <div className="flex flex-col items-center">
      {/* Banner Image */}
      <div className="bg-card relative h-[40vh] w-full overflow-hidden">
        <div className="from-background via-background/80 absolute inset-0 z-10 bg-gradient-to-t to-transparent" />
        <Image
          src={
            !manga.manga_thumb
              ? '/placeholder.jpg'
              : `${process.env.NEXT_PUBLIC_API_URL_IPFS}${manga.manga_thumb}`
          }
          alt={`${manga.manga_title} Banner`} // More descriptive alt text
          fill // Use fill for responsive background-like image
          style={{ objectFit: 'cover', objectPosition: 'center' }} // Use style prop with fill
          priority // Prioritize loading banner image
        />
      </div>

      <div className="container py-6 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {/* Left Column - Cover & Metadata */}
          <div className="col-span-1">
            <div className="sticky top-20">
              {/* Cover Image */}
              <div className="border-border mb-6 overflow-hidden rounded-lg border">
                {/* Removed duplicate div */}
                <Image
                  src={
                    !manga.manga_thumb
                      ? '/placeholder.jpg'
                      : `${process.env.NEXT_PUBLIC_API_URL_IPFS}${manga.manga_thumb}`
                  }
                  alt={`${manga.manga_title} Cover`} // More descriptive alt text
                  width={300}
                  height={400}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              {/* Rating Component */}
              {/* <div className="bg-card border-border mb-6 rounded-lg border p-4">
                <h3 className="mb-3 text-lg font-medium">Rating</h3>
                <div className="flex flex-col gap-4">
                  {auth.isAuthenticated && (
                    <div className="border-border flex flex-col gap-2 border-t pt-2">
                      <span className="text-muted-foreground text-sm">
                        Rate this manga:
                      </span>
                      <MangaRating onRatingChange={handleRatingChange} />
                    </div>
                  )}
                </div>
              </div> */}

              {/* Info Box */}
              <div className="bg-card border-border mb-6 rounded-lg border p-4">
                <h3 className="mb-3 text-lg font-medium">Information</h3>
                <div className="space-y-3 text-sm">
                  {/* ... Info items ... */}
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Status</span>
                    <span className="capitalize">{manga.manga_status}</span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Author</span>
                    <span>{manga.manga_author || 'N/A'}</span>
                  </div>
                  {/* <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Total Stars</span>
                    <span>{manga.manga_total_star_rating || '0'}</span>
                  </div> */}
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Released</span>
                    <span>
                      {manga.createdAt
                        ? new Date(manga.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2">
                    <span className="text-muted-foreground">Chapters</span>
                    <span>
                      {chaptersLoading ? '...' : (chapters?.length ?? 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Start Reading Button */}
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full" // Use primary color
                  disabled={chaptersLoading || !firstChapterId}
                  asChild
                >
                  <Link
                    href={startReadingUrl}
                    onClick={(e) => {
                      if (firstChapterId) {
                        handleReadClick(e, firstChapterId, startReadingUrl);
                      } else {
                        e.preventDefault(); // Prevent navigation if no chapter
                      }
                    }}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {chaptersLoading
                      ? 'Loading...'
                      : firstChapterId
                        ? 'Start Reading'
                        : 'No Chapters'}
                  </Link>
                </Button>

                {/* Favorite/Bookmark/Share Buttons */}
                <div
                  className={`grid ${auth.isAuthenticated && Number(auth!!.clientId) != Number(1) ? 'grid-cols-1' : ''} gap-3`}
                >
                  {auth.isAuthenticated &&
                    Number(auth!!.clientId) != Number(1) && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleToggleHeart(manga.manga_id)}
                        disabled={favoritesLoading} // Disable while favs are loading
                      >
                        <Heart
                          className={`h-4 w-4 transition-colors ${
                            checkMangaIdInFavorites(manga.manga_id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Tabs */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <div className="mb-6">
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                {manga.manga_title}
              </h1>

              {/* Statistics */}
              <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center">
                  <BookOpen className="text-primary mr-1 h-4 w-4" />{' '}
                  {/* Use primary color */}
                  <span>
                    {chaptersLoading ? '...' : (chapters?.length ?? 0)} chapters
                  </span>
                </div>
                <div className="flex items-center">
                  <Eye className="text-muted-foreground mr-1 h-4 w-4" />
                  {/* Format views */}
                  <span>
                    {new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short'
                    }).format(manga.manga_views || 0)}{' '}
                    views
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="text-muted-foreground mr-1 h-4 w-4" />
                  <span>
                    {manga.createdAt
                      ? new Date(manga.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4 flex flex-wrap gap-2">
                {manga.categories &&
                  manga.categories.map((category) => (
                    <Badge key={category.category_id} variant="secondary">
                      {' '}
                      {/* Use secondary variant */}
                      {category.category_name}
                    </Badge>
                  ))}
              </div>

              {/* Synopsis */}
              <div className="bg-card border-border mb-6 rounded-lg border p-4">
                <h3 className="mb-2 font-medium">Description</h3>
                <p
                  className={`text-muted-foreground text-sm ${
                    // Smaller text for description
                    !isDescExpanded && 'line-clamp-4'
                  }`}
                >
                  {manga.manga_description || 'No description available.'}
                </p>
                {/* Conditionally render Read More only if description exists and is long */}
                {manga.manga_description &&
                  manga.manga_description.length > 200 && ( // Adjust length threshold
                    <Button
                      variant="link"
                      className="text-primary mt-1 h-auto p-0 text-sm" // Use primary color, smaller text
                      onClick={() => setIsDescExpanded(!isDescExpanded)}
                    >
                      {isDescExpanded ? 'Show Less' : 'Read More'}
                    </Button>
                  )}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="chapters" className="w-full">
                <TabsList className="bg-card border-border w-full justify-start rounded-none border-b">
                  <TabsTrigger value="chapters" className="flex-1 md:flex-none">
                    Chapters (
                    {chaptersLoading ? '...' : (chapters?.length ?? 0)}){' '}
                    {/* Show count */}
                  </TabsTrigger>
                  {/* Add other tabs like Comments here if needed */}
                </TabsList>

                {/* Chapters Tab */}
                <TabsContent value="chapters" className="pt-4">
                  <div className="space-y-3">
                    {' '}
                    {/* Reduced spacing */}
                    {chaptersLoading ? (
                      // Add Chapter List Skeleton
                      <div>Loading chapters...</div>
                    ) : chapters && chapters.length > 0 ? (
                      [...chapters] // Create a shallow copy
                        .sort((a, b) => b.chap_number - a.chap_number) // Sort descending
                        .map((chapter) => {
                          const chapterUrl = `/manga/${mangaid}/chapters/${chapter.chap_id}`;
                          return (
                            <Link
                              key={chapter.chap_id}
                              href={chapterUrl}
                              onClick={(e) =>
                                handleReadClick(e, chapter.chap_id, chapterUrl)
                              }
                              className="border-border bg-card hover:border-primary block rounded-lg border p-3 transition-colors" // Use primary color on hover
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-medium">
                                    Chapter {chapter.chap_number}
                                    {chapter.chap_title &&
                                      `: ${chapter.chap_title}`}{' '}
                                    {/* Add title if exists */}
                                  </h4>
                                  <p className="text-muted-foreground text-xs">
                                    {' '}
                                    {/* Smaller date */}
                                    {chapter.createdAt
                                      ? `Released: ${new Date(chapter.createdAt).toLocaleDateString()}`
                                      : ''}
                                  </p>
                                </div>
                                {/* Optional: Add read status icon */}
                              </div>
                            </Link>
                          );
                        })
                    ) : (
                      <p className="text-muted-foreground text-center">
                        No chapters available yet.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetails;
