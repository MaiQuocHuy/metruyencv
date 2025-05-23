'use client';

import { useUpdateChapterMutation } from '@/services/apiManga';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

interface ImagePreview {
  id: string;
  file: File;
  previewUrl: string;
}

// Add this new interface for image selection
interface UpdateImageData {
  id: string;
  pageNumber: number;
  url: string;
  newFile?: File;
}

export function UploadImagesDialog({
  open,
  onOpenChange,
  chapterId,
  currentImages,
  selectedImages = [],
  updateMode = false
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapterId: number;
  currentImages: { id: string; url: string; pageNumber: number }[];
  selectedImages?: UpdateImageData[];
  updateMode?: boolean;
}) {
  const [selectedFiles, setSelectedFiles] = useState<ImagePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState<'add' | 'update'>(
    updateMode ? 'update' : 'add'
  );
  const [updatePageNumbers, setUpdatePageNumbers] = useState<number[]>(
    selectedImages.length > 0 ? selectedImages.map((img) => img.pageNumber) : []
  );
  const [updateChapter] = useUpdateChapterMutation();

  // Initialize with selected images if in update mode
  useEffect(() => {
    if (updateMode && selectedImages.length > 0) {
      setUploadMode('update');
      setUpdatePageNumbers(selectedImages.map((img) => img.pageNumber));
    }
  }, [updateMode, selectedImages]);

  // Clean up object URLs when component unmounts or dialog closes
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => URL.revokeObjectURL(file.previewUrl));
    };
  }, [selectedFiles]);

  useEffect(() => {
    if (!open) {
      setSelectedFiles([]);
      setUploadProgress(0);
      setIsUploading(false);
    }
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(2, 11),
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setSelectedFiles((prev) => [...prev, ...newFiles]);

    // If in update mode with pre-selected images, auto-assign page numbers
    if (uploadMode === 'update' && selectedImages.length > 0) {
      if (selectedImages.length >= newFiles.length) {
        setUpdatePageNumbers(
          selectedImages.map((img) => img.pageNumber).slice(0, newFiles.length)
        );
      }
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((file) => file.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((file) => file.id !== id);
    });
  };

  const fetchExistingImages = (): { pageNumber: number }[] => {
    return currentImages || [];
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.warning('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const imageFiles = selectedFiles.map((preview) => preview.file);
      let pageNumbers: number[] = [];

      // Determine page numbers based on upload mode
      if (uploadMode === 'add') {
        const existingImages = fetchExistingImages();
        const highestPageNumber =
          existingImages.length > 0
            ? Math.max(...existingImages.map((img) => img.pageNumber))
            : 0;

        pageNumbers = imageFiles.map(
          (_, index) => highestPageNumber + index + 1
        );
      } else {
        // In update mode, ensure we have the correct number of page numbers
        if (updatePageNumbers.length !== imageFiles.length) {
          // If the arrays don't match in length, create new page numbers
          // This ensures we always have the right number of page numbers for our files
          if (updateMode && selectedImages.length === imageFiles.length) {
            // If we're in updateMode and have the correct number of selectedImages,
            // use their page numbers
            pageNumbers = selectedImages.map((img) => img.pageNumber);
          } else {
            // Otherwise, just assign sequential numbers starting from 1
            pageNumbers = Array(imageFiles.length)
              .fill(0)
              .map((_, index) => index + 1);
          }
        } else {
          // If the arrays match in length, use the existing page numbers
          pageNumbers = updatePageNumbers;
        }
      }

      console.log(
        `${uploadMode === 'add' ? 'Adding' : 'Updating'} images with page numbers:`,
        pageNumbers
      );

      // Progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 5;
        });
      }, 200);
      // Prepare the FormData for the API call
      const formData = new FormData();

      // Add each page number as a separate field
      pageNumbers.forEach((pageNum) => {
        formData.append('chap_img_pages', pageNum.toString());
      });

      // Add each file as binary content
      imageFiles.forEach((file) => {
        formData.append('chap_content', file);
      });

      // Make the API call using the FormData
      await updateChapter({
        chap_id: chapterId,
        formData
      }).unwrap();

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        onOpenChange(false);
        toast.success('Images uploaded successfully');
      }, 500);
    } catch (error) {
      console.log('failed:', error);
      toast.error('Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {updateMode ? 'Update Selected Images' : 'Upload Chapter Images'}
          </DialogTitle>
          <DialogDescription>
            {updateMode
              ? `Select new images to replace ${selectedImages.length} selected page(s).`
              : 'Select multiple image files to upload for this chapter.'}
          </DialogDescription>
        </DialogHeader>

        {/* Make this div scrollable with flex-1 and overflow-y-auto */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {!updateMode && (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Upload Mode</h3>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={uploadMode === 'add'}
                      onChange={() => setUploadMode('add')}
                      className="form-radio"
                    />
                    <span>Add New Pages</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Rest of your content here */}
          {updateMode && selectedImages.length > 0 && (
            <div className="rounded-md border p-4">
              <h3 className="mb-2 font-medium">Selected Pages to Update</h3>
              <div className="grid grid-cols-4 gap-2">
                {selectedImages.map((img) => (
                  <div key={img.id} className="text-center">
                    <div className="relative mb-1 aspect-[2/3] w-full overflow-hidden rounded-md border">
                      <Image
                        src={`https://${img.url}` || '/placeholder.svg'}
                        alt={`Page ${img.pageNumber}`}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-1 left-1 rounded-full bg-black px-2 py-0.5 text-xs text-white">
                        #{img.pageNumber}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* File upload area */}
          <div
            className="hover:bg-muted/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple={!updateMode || selectedImages.length > 1}
              accept="image/*"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            <Upload className="text-muted-foreground mb-2 h-10 w-10" />
            <p className="font-medium">
              Click to select {updateMode ? 'replacement' : ''} images
            </p>
            <p className="text-muted-foreground text-sm">
              or drag and drop files here
            </p>
          </div>

          {/* Selected files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                Selected Files ({selectedFiles.length})
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {selectedFiles.map((file) => (
                  <div key={file.id} className="group relative">
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md border">
                      <Image
                        src={file.previewUrl}
                        alt={file.file.name}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        aria-label="Remove file"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      {file.file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning message */}
          {updateMode &&
            selectedImages.length > 0 &&
            selectedFiles.length > 0 &&
            selectedFiles.length !== selectedImages.length && (
              <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                <p>
                  Warning: You've selected {selectedFiles.length} new files to
                  replace {selectedImages.length} existing images.
                </p>

                <p className="mt-1 font-semibold">
                  Please select exactly {selectedImages.length} file(s) for
                  replacement.
                </p>
              </div>
            )}

          {/* Upload progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Uploading images...</p>
                <p className="text-muted-foreground text-sm">
                  {uploadProgress}%
                </p>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={uploadFiles}
            disabled={
              selectedFiles.length === 0 ||
              isUploading ||
              (updateMode && selectedImages.length !== selectedFiles.length)
            }
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading
              ? 'Uploading...'
              : updateMode
                ? 'Update Images'
                : 'Upload Images'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
