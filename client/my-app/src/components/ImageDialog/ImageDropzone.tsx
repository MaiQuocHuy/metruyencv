import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageDropzoneProps } from './types';

/**
 * A component for uploading images via click or drag-and-drop
 *
 * @param onFilesAdded - Callback when files are added
 */
export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  onFilesAdded
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isDragAccept, setIsDragAccept] = useState(false);
  const [isDragReject, setIsDragReject] = useState(false);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);

    // Check if files are images
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const isAcceptable = Array.from(e.dataTransfer.items).every(
        (item) => item.kind === 'file' && item.type.startsWith('image/')
      );
      setIsDragAccept(isAcceptable);
      setIsDragReject(!isAcceptable);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    setIsDragAccept(false);
    setIsDragReject(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      setIsDragAccept(false);
      setIsDragReject(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const imageFiles = Array.from(e.dataTransfer.files).filter((file) =>
          file.type.startsWith('image/')
        );

        if (imageFiles.length) {
          onFilesAdded(imageFiles);
        }
      }
    },
    [onFilesAdded]
  );

  // Handle file selection via input
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const imageFiles = Array.from(e.target.files).filter((file) =>
          file.type.startsWith('image/')
        );

        if (imageFiles.length) {
          onFilesAdded(imageFiles);
        }
      }
    },
    [onFilesAdded]
  );

  const handleClick = () => {
    const fileInput = document.getElementById(
      'file-upload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
        'min-h-[200px] w-full text-center',
        isDragActive && 'border-primary bg-primary/5',
        isDragAccept && 'border-green-500 bg-green-50',
        isDragReject && 'border-red-500 bg-red-50',
        !isDragActive && 'hover:border-primary border-gray-300'
      )}
    >
      <input
        id="file-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
      />

      <Upload className="text-muted-foreground mb-4 h-10 w-10" />

      <p className="text-lg font-medium">
        {isDragActive
          ? isDragAccept
            ? 'Drop the images here'
            : 'This file type is not supported'
          : 'Drag & drop images here or click to select'}
      </p>

      <p className="text-muted-foreground mt-2 text-sm">
        Images only (JPG, PNG, GIF, etc.)
      </p>
    </div>
  );
};
