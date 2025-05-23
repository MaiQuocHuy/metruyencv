'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
import { useGetChapterDetailQuery } from '@/services/apiManga';
import UpdateChapterDialog from '@/components/chapter/UpdateChapterDialog';
import {
  ChapterCarousel,
  ImageSkeleton
} from '@/components/chapter/ChapterCarousel';

const imageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0
  })
};

const transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  opacity: { duration: 0.2 }
};

export default function ChapterViewPage() {
  const params = useParams();
  const mangaid = params.mangaid as string;
  const chapterid = params.chapterid as string;
  const router = useRouter();

  // Simplified state management
  const [currentPage, setCurrentPage] = useState(0);
  const [images, setImages] = useState<{ url: string; page: number }[]>([]);
  const [isLoadingIPFS, setIsLoadingIPFS] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: chapter,
    isLoading: chapterLoading,
    error: chapterError
  } = useGetChapterDetailQuery({
    mangaId: parseInt(mangaid),
    chapterId: parseInt(chapterid)
  });

  console.log('chapter', chapter);

  // Generate page URLs from IPFS CID when chapter data is loaded
  useEffect(() => {
    if (!chapter?.chap_content) return;

    const cid = chapter.chap_content;
    setIsLoadingIPFS(true);

    const gateways = [
      `https://gateway.pinata.cloud/ipfs/${cid}`
      // `https://gold-blank-bovid-152.mypinata.cloud/ipfs/${cid}`,
      // `https://ipfs.io/ipfs/${cid}`
      // Có thể thêm nhiều gateway khác ở đây
    ];

    console.log('gateways', gateways);

    const fetchIPFSData = async () => {
      for (const gateway of gateways) {
        try {
          const response = await fetch(gateway);
          console.log('response', response);
          if (!response.ok) {
            const errorText = await response.text();
            console.warn(
              `Fetch failed from ${gateway}: ${response.status} - ${errorText}`
            );
            continue;
          }

          const data = await response.json();
          if (!Array.isArray(data)) {
            console.warn(`Data from ${gateway} is not an array, skipping...`);
            continue;
          }
          console.log('data', data);
          const formattedImages = data.map((item) => {
            let imageUrl = item.image;
            let CID;
            if (imageUrl && !imageUrl.startsWith('http')) {
              CID = imageUrl.split('/ipfs/')[1];
            }

            return {
              url: CID,
              page: item.page
            };
          });

          formattedImages.sort((a, b) => a.page - b.page);
          console.log(`Successfully loaded images from ${gateway}`);
          setImages(formattedImages);
          return; // Thành công rồi thì return luôn
        } catch (error) {
          console.error(`Error fetching from ${gateway}:`, error);
          // Nếu lỗi thì thử tiếp gateway khác
        }
      }

      console.error('All IPFS gateways failed.');
      setImages([]);
    };

    fetchIPFSData().finally(() => setIsLoadingIPFS(false));
  }, [chapter]);

  if (chapterLoading) {
    return <ImageSkeleton />;
  }

  if (chapterError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/manga/${mangaid}/chapters`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Error</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>Failed to load chapter details. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/dashboard/manga/${mangaid}/chapters`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Not Found</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>Chapter not found.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/dashboard/manga/${mangaid}/chapters`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Number Chapter: {chapter.chap_number}
              </h1>
              <p className="text-muted-foreground">{chapter.chap_title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/manga/${mangaid}/chapters/${chapterid}/views?cid=${chapter.chap_content}`
                )
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              View Full
            </Button>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Chapter
            </Button>
            <Button variant="outline" asChild>
              <Link
                href={`/dashboard/manga/${mangaid}/chapters/${chapterid}/images`}
              >
                <FileText className="mr-2 h-4 w-4" />
                Manage Images
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <ChapterCarousel images={images} />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/manga/${mangaid}/chapters`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chapters
            </Link>
          </Button>
        </div>
      </div>
      <UpdateChapterDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        chapterId={chapterid}
        chapterTitle={String(chapter.chap_title)}
        chapterNumber={String(chapter.chap_number)}
      />
    </>
  );
}
