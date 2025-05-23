import React, { useState } from 'react'; // Import useState
import Link from 'next/link';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import MangaActions from './MangaActions';
import { MangaAdmin } from '@/services/apiManga';

interface MangaTableRowProps {
  item: MangaAdmin;
  isSelected: boolean;
  onSelectChange: (id: number, checked: boolean) => void;
  onTogglePublish: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
  isCompact: boolean;
  isDesktop: boolean;
}

export default function MangaTableRow({
  item,
  isSelected,
  onSelectChange,
  onTogglePublish,
  onDelete,
  isCompact,
  isDesktop
}: MangaTableRowProps) {
  const [isImageLoading, setIsImageLoading] = useState(true); // State for image loading
  const isPublished = item.is_published === 1 || item.is_published === true;
  const placeholderSrc = '/placeholder.jpg'; // Consistent placeholder

  const handleImageLoadComplete = () => {
    setIsImageLoading(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderSrc; // Use consistent fallback image
    e.currentTarget.style.opacity = '0.8';
    setIsImageLoading(false); // Also stop loading state on error
  };

  // Determine image source and optimization status
  let imageUrl = placeholderSrc;
  let shouldOptimize = false; // Don't optimize placeholders by default

  if (item.manga_thumb) {
    if (item.manga_thumb.startsWith('http')) {
      // Check for http or https
      imageUrl = placeholderSrc;
      shouldOptimize = true; // Optimize external URLs
    } else {
      // Assume it's an IPFS hash or relative path needing the prefix
      imageUrl = `${process.env.NEXT_PUBLIC_API_URL_IPFS}${item.manga_thumb}`;
      shouldOptimize = true; // Optimize constructed URLs
    }
  }

  // Reset loading state if item changes (important if component is reused without unmounting)
  React.useEffect(() => {
    if (item.manga_thumb) {
      setIsImageLoading(false); // Reset loading state when item changes
    } else {
      setIsImageLoading(true); // Reset based on initial URL determination
    }
  }, [item.manga_thumb]); // Depend on item ID and the determined URL

  return (
    <tr className="border-manga-600/10 hover:bg-manga-600/5 border-t">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Container to hold image or skeleton */}
          <div className="h-12 w-8 flex-shrink-0">
            {isImageLoading ? ( // Show skeleton only if loading a real image
              <Skeleton className="h-full w-full rounded-sm" />
            ) : (
              <Image
                src={imageUrl} // Use determined image URL
                alt={item.manga_title}
                width={48} // Keep original width/height for aspect ratio hint
                height={72}
                className="border-manga-600/20 h-full w-full rounded-sm border object-cover shadow-sm"
                onError={handleImageError}
                onLoad={handleImageLoadComplete} // Set loading to false on load
                unoptimized={!shouldOptimize}
                priority={false} // Avoid prioritizing list images usually
              />
            )}
          </div>
          <span className="line-clamp-1 font-medium">{item.manga_title}</span>
        </div>
      </td>
      {isDesktop && (
        <td className="px-4 py-3">{item.manga_author || 'Unknown'}</td>
      )}
      <td className="px-4 py-3">
        {isPublished ? (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Published
          </Badge>
        ) : (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Unpublished
          </Badge>
        )}
      </td>
      <td className="px-4 py-3">{(item.manga_views || 0).toLocaleString()}</td>
      {(!isCompact || isDesktop) && (
        <td className="w-[80px] px-4 py-3 text-right">
          <MangaActions
            item={item}
            onTogglePublish={onTogglePublish}
            onDelete={onDelete}
          />
        </td>
      )}
    </tr>
  );
}
