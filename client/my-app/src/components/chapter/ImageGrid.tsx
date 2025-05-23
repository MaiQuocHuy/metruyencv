import type React from 'react';
import Image from 'next/image';
import { X, Upload as UploadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface ChapterImage {
  id: string;
  url: string;
  pageNumber: number;
}

interface UpdateImageData extends ChapterImage {
  newFile?: File;
}

interface ImageGridProps {
  images: ChapterImage[];
  selectedImages: UpdateImageData[];
  onToggleSelection: (image: ChapterImage) => void;
  onConfirmDelete: (imageId: string) => void;
  mangaId: number;
  chapterId: number;
  onViewChapterClick: () => void;
}

export function ImageGrid({
  images,
  selectedImages,
  onToggleSelection,
  onConfirmDelete,
  mangaId,
  chapterId,
  onViewChapterClick
}: ImageGridProps) {
  const isSelectionMode = selectedImages.length > 0;
  console.log('Images', images);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Chapter Images</CardTitle>
            <CardDescription>
              {images.length === 0
                ? "No images uploaded yet. Click 'Upload Images' to add images to this chapter."
                : isSelectionMode
                  ? `${selectedImages.length} of ${images.length} images selected for update.`
                  : `${images.length} images. Click images to select for update.`}
            </CardDescription>
          </div>
          {images.length > 0 && (
            <div className="text-muted-foreground text-right text-xs">
              {isSelectionMode
                ? 'Click image to toggle selection'
                : 'Click image to select for update'}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
            <div className="text-center">
              <UploadIcon className="text-muted-foreground mx-auto h-10 w-10" />
              <p className="text-muted-foreground mt-2 text-sm">
                No images uploaded yet
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {images.map((image, index) => {
              console.log('VIew Images', image);
              const isSelected = selectedImages.some(
                (img) => img.id === image.id
              );
              const parts = image.url.split('/');
              const cid = parts[parts.length - 1];

              return (
                <div
                  key={index}
                  className={`group relative aspect-[2/3] cursor-pointer overflow-hidden rounded-md border transition-all duration-150 ease-in-out ${
                    isSelected
                      ? 'ring-primary scale-95 ring-2'
                      : 'hover:scale-[1.02]'
                  } ${isSelectionMode ? '' : 'hover:shadow-md'}`}
                  onClick={() => onToggleSelection(image)}
                  aria-label={`Page ${image.pageNumber}, ${isSelected ? 'selected' : 'click to select'}`}
                >
                  {/* Page Number Badge */}
                  <div className="absolute top-1 left-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 p-1 text-[10px] font-bold text-white ring-1 ring-white/50 md:top-2 md:left-2 md:h-6 md:w-6 md:text-xs">
                    {image.pageNumber}
                  </div>

                  {/* Delete Button (Show on hover when NOT selecting) */}
                  {!isSelectionMode && (
                    <div className="absolute top-1 right-1 z-10 opacity-0 transition-opacity group-hover:opacity-100 md:top-2 md:right-2">
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-6 w-6 md:h-7 md:w-7"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent selection toggle
                          onConfirmDelete(image.id);
                        }}
                        aria-label={`Delete page ${image.pageNumber}`}
                      >
                        <X className="h-3 w-3 md:h-4 md:w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="bg-primary/40 absolute inset-0 z-20 flex items-center justify-center">
                      <div className="bg-primary rounded-full p-1.5 shadow-lg md:p-2">
                        <svg
                          className="text-primary-foreground h-4 w-4 md:h-5 md:w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  <Image
                    src={
                      `${process.env.NEXT_PUBLIC_API_URL_IPFS}${cid}` ||
                      '/placeholder.svg'
                    }
                    alt={`Page ${image.pageNumber}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className={`object-cover transition-transform duration-150 ease-in-out ${isSelected ? '' : 'group-hover:scale-105'}`}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAySURBVHgB7c0xAQAACAIw7f+PA4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg8sP8AYvOQMVcDAAAAAElFTkSuQmCC"
                  />

                  {/* Optional: Add subtle overlay on hover when not selected */}
                  {!isSelected && (
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10"></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </p>
        {images.length > 0 && (
          <Button variant="outline" onClick={onViewChapterClick}>
            View Chapter
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
