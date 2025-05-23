'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Pencil,
  Star,
  Tag,
  Trash,
  User
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  MangaCategory,
  useGetMangaByIdQuery,
  useGetMangaChaptersQuery
} from '@/services/apiManga';

// Mock data for a single manga
export default function MangaDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams(); // Get search params from URL

  const mangaId = params.mangaid;

  const {
    data: manga,
    isLoading,
    error
  } = useGetMangaByIdQuery({
    id: Number(mangaId),
    isPublished: searchParams.get('status')
  });
  console.log('Thumb', manga);
  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError
  } = useGetMangaChaptersQuery(Number(mangaId));
  console.log(chapters);
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="bg-muted h-8 w-64 animate-pulse rounded-md"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-muted aspect-[2/3] animate-pulse rounded-md"></div>
          <div className="space-y-4 md:col-span-2">
            <div className="bg-muted h-8 w-full animate-pulse rounded-md"></div>
            <div className="bg-muted h-32 w-full animate-pulse rounded-md"></div>
            <div className="bg-muted h-8 w-full animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/manga">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>Failed to load manga details. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/manga">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {manga.manga_title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link
              href={`/dashboard/manga/${mangaId}/edit?status=${searchParams.get('status')}`}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Manga
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/manga/${mangaId}/chapters`}>
              <FileText className="mr-2 h-4 w-4" />
              Manage Chapters
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg border">
          <Image
            src={
              !manga.manga_thumb
                ? '/placeholder.jpg'
                : `${process.env.NEXT_PUBLIC_API_URL_IPFS}${manga.manga_thumb}`
            }
            alt={manga.manga_title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            priority
          />
          <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-yellow-500/90 text-white hover:bg-yellow-500/80"
              >
                <Star className="mr-1 h-3 w-3" />
                {manga.manga_ratings_count}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-blue-500/90 text-white hover:bg-blue-500/80"
              >
                <Eye className="mr-1 h-3 w-3" />
                {manga.createdAt &&
                  `${new Date(manga.createdAt).getDate()}/${
                    new Date(manga.createdAt).getMonth() + 1
                  }`}{' '}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-green-500/90 text-white hover:bg-green-500/80"
              >
                <BookOpen className="mr-1 h-3 w-3" />
                {chapters?.length} Ch
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>
                Basic information about this manga
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Description</h3>
                <p className="text-muted-foreground text-sm">
                  {manga.manga_description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Author</h3>
                  <p className="text-muted-foreground flex items-center text-sm">
                    <User className="mr-2 h-4 w-4" />
                    {manga.manga_author}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Artist</h3>
                  <p className="text-muted-foreground flex items-center text-sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    {manga.manga_author}
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Status</h3>
                  <p className="flex items-center text-sm">
                    <Badge
                      variant={
                        manga.manga_status === 'ongoing'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {manga.manga_status}
                    </Badge>
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Release Year</h3>
                  <p className="text-muted-foreground flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    {manga.createdAt
                      ? new Date(manga.createdAt).getFullYear()
                      : ''}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {manga.categories &&
                    manga.categories.map(
                      (item: MangaCategory, index: number) => (
                        <Badge key={index} variant="outline">
                          {item.category_name}
                        </Badge>
                      )
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Recent Chapters</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/manga/${mangaId}/chapters`}>
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chapters &&
                  [...chapters] // Create a shallow copy
                    .sort((a, b) => a.chap_number - b.chap_number)
                    .map((chapter, index: number) => (
                      <div key={chapter.chap_id}>
                        <div className="flex items-center justify-between">
                          <div>
                            <Link
                              href={`/dashboard/manga/${mangaId}/chapters/${chapter.chap_id}`}
                              className="font-medium hover:underline"
                            >
                              Chapter {chapter.chap_number}:{' '}
                              {chapter.chap_title}
                            </Link>
                            <p className="text-muted-foreground text-sm">
                              Released on{' '}
                              {chapter?.createdAt
                                ? new Date(
                                    chapter.createdAt
                                  ).toLocaleDateString()
                                : 'unknown date'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground flex items-center text-sm">
                              <Eye className="mr-1 inline-block h-3 w-3" />
                              {chapter.chap_views}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/dashboard/manga/${mangaId}/chapters/${chapter.chap_id}`}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        {index < chapters.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`/dashboard/manga/${mangaId}/chapters`}>
                  Add New Chapter
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
