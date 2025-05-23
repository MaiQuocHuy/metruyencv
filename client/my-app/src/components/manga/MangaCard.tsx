import { Star, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export interface MangaCardProps {
  id: string;
  title: string;
  coverImage: string;
  rating: number;
  chapters?: number;
  className?: string;
  isNew?: boolean;
  isUpdated?: boolean;
}

const MangaCard = ({
  id,
  title,
  coverImage,
  rating,
  chapters,
  className,
  isNew,
  isUpdated
}: MangaCardProps) => {
  // Format the cover image URL correctly
  const imageUrl = coverImage.startsWith('http')
    ? 'https://sonikaagarwal.in/wp-content/uploads/2021/01/b500sample_cover.jpg'
    : coverImage.includes('ipfs.io/ipfs/')
      ? coverImage
      : `${process.env.NEXT_PUBLIC_API_URL_IPFS}${coverImage}`;

  return (
    <Link href={`/manga/${id}`}>
      <div
        className={cn(
          'manga-card group relative aspect-[2/3] overflow-hidden rounded-md',
          className
        )}
      >
        {/* Single responsive image with proper attributes */}
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          placeholder="blur"
          loading="lazy"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAySURBVHgB7c0xAQAACAIw7f+PA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg8sP8AYvOQMVcDAAAAAElFTkSuQmCC"
        />

        {/* Gradient overlay for better text readability */}
        <div className="manga-card-overlay absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
          <h3 className="mb-1 line-clamp-2 font-bold text-white">{title}</h3>

          {/* Status badges */}
          {(isNew || isUpdated) && (
            <div className="mb-2 flex gap-2">
              {isNew && (
                <Badge className="bg-manga-600 hover:bg-manga-700">New</Badge>
              )}
              {isUpdated && !isNew && (
                <Badge
                  variant="outline"
                  className="border-manga-400 text-manga-300"
                >
                  Updated
                </Badge>
              )}
            </div>
          )}

          {/* Rating and chapters */}
          <div className="flex items-center justify-between text-xs text-white">
            {/* {rating !== undefined && (
              <div className="flex items-center">
                <Star className="mr-1 h-3 w-3 text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )} */}
            {chapters !== undefined && (
              <div className="flex items-center">
                <BookOpen className="text-manga-300 mr-1 h-3 w-3" />
                <span>{chapters} chapters</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MangaCard;
