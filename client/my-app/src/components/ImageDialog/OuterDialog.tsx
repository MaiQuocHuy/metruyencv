import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InnerDialog } from './InnerDialog';
import { OuterDialogProps, ImageFile } from './types';
import { useUpdateChapterMutation } from '@/services/apiManga';
import { toast } from 'sonner';
import { useAppSelector } from '@/lib/redux/hook';

/**
 * OuterDialog component that displays selected images and allows opening InnerDialog for editing
 *
 * @param images - Array of selected images
 * @param onChange - Function called when images are updated
 * @param triggerText - Optional text for the trigger button
 */
export const OuterDialog: React.FC<OuterDialogProps> = ({
  images,
  onChange,
  triggerText = 'Manage Images',
  chapterId
}) => {
  const [open, setOpen] = useState(false);
  const [innerDialogOpen, setInnerDialogOpen] = useState(false);
  const [updateChapter] = useUpdateChapterMutation();
  const chapterImages = useAppSelector((state) => state.chapterImages.images);

  // Create image files with previews for the inner dialog
  const createImageFilesWithPreviews = useCallback((): ImageFile[] => {
    return images.map((file) => {
      // Create object URL for preview
      const preview = URL.createObjectURL(file);
      // Generate a unique ID
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      return { file, preview, id };
    });
  }, [images]);

  // Open inner dialog with current images
  const handleEditImages = () => {
    setInnerDialogOpen(true);
  };

  // Handle save from inner dialog
  const handleSaveImages = (updatedImages: File[]) => {
    setInnerDialogOpen(false);
    onChange(updatedImages);
  };

  // Handle cancel from inner dialog
  const handleCancelEdit = () => {
    setInnerDialogOpen(false);
  };

  const fetchExistingImages = (): { pageNumber: number }[] => {
    return chapterImages || [];
  };

  // Handle update images from inner dialog
  const handleUpdateImages = async () => {
    const toastLoading = toast.loading('Updating images...');
    let pageNumbers: number[] = [];

    try {
      console.log('Chapter Images:', chapterImages);
      const existingImages = fetchExistingImages();
      const highestPageNumber =
        existingImages.length > 0
          ? Math.max(...existingImages.map((img) => img.pageNumber))
          : 0;
      pageNumbers = images.map((_, index) => highestPageNumber + index + 1);
      console.log('Page Numbers:', pageNumbers);
      const formData = new FormData();
      pageNumbers.forEach((pageNum) => {
        formData.append('chap_img_pages', pageNum.toString());
      });
      images.forEach((file) => {
        formData.append('chap_content', file, file.name);
      });

      // Call the update chapter mutation with the form data
      await updateChapter({
        chap_id: chapterId,
        formData
      }).unwrap();
      toast.success('Images updated successfully!');
      onChange([]);
    } catch (error) {
      console.error('Error updating images:', error);
      toast.error('Failed to update images. Please try again.');
    } finally {
      toast.dismiss(toastLoading);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{triggerText}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selected Images</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {images.map((file, index) => (
                  <div
                    key={index}
                    className="bg-muted aspect-square overflow-hidden rounded-md border"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Selected image ${index + 1}`}
                      className="h-full w-full object-cover"
                      onLoad={(e) => {
                        // Clean up the object URL after the image loads
                        URL.revokeObjectURL((e.target as HTMLImageElement).src);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-muted-foreground">No images selected</p>
              </div>
            )}
          </div>

          <DialogFooter>
            {images.length > 0 ? (
              <div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setInnerDialogOpen(false);
                    setOpen(false);
                    onChange([]);
                  }}
                >
                  Cancel
                </Button>

                <Button
                  onClick={() => {
                    setInnerDialogOpen(false);
                    setOpen(false);
                    handleUpdateImages();
                  }}
                >
                  Add / Reorder Images
                </Button>
              </div>
            ) : (
              <Button onClick={handleEditImages}>Add Images</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inner dialog for image management */}
      <InnerDialog
        initialImages={createImageFilesWithPreviews()}
        onSave={handleSaveImages}
        onCancel={handleCancelEdit}
        open={innerDialogOpen}
        onOpenChange={setInnerDialogOpen}
      />
    </>
  );
};
