import React from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ImageFile } from './types';

interface ImageItemProps {
  /** The image data to display */
  image: ImageFile;
  /** Index of this image in the array */
  index: number;
  /** Total number of images */
  totalImages: number;
  /** Function called when the image is removed */
  onRemove: (id: string) => void;
  /** Function called to move image left */
  onMoveLeft: (index: number) => void;
  /** Function called to move image right */
  onMoveRight: (index: number) => void;
}

/**
 * A component representing an image in the gallery with reordering controls
 */
export const ImageItem: React.FC<ImageItemProps> = ({
  image,
  index,
  totalImages,
  onRemove,
  onMoveLeft,
  onMoveRight
}) => {
  // Format file size to human-readable format
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      className={cn(
        'group bg-card relative flex flex-col overflow-hidden rounded-md border',
        'aspect-square w-full sm:w-[150px]',
        'transition-all duration-200'
      )}
    >
      {/* Image preview */}
      <div className="bg-muted relative flex-grow overflow-hidden">
        <img
          src={image.preview}
          alt={image.file.name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* File info overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      {/* File size */}
      <div className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-xs font-medium text-white">
        {formatFileSize(image.file.size)}
      </div>

      {/* Reorder controls */}
      <div className="absolute right-2 bottom-2 flex space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full bg-black/50 text-white"
          onClick={() => onMoveLeft(index)}
          disabled={index === 0}
        >
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full bg-black/50 text-white"
          onClick={() => onMoveRight(index)}
          disabled={index === totalImages - 1}
        >
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Remove button */}
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
        onClick={() => onRemove(image.id)}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};
