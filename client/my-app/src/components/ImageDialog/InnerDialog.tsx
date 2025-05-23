import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageDropzone } from './ImageDropzone';
import { InnerDialogProps, ImageFile } from './types';
import { SortableGallery } from './SortableGallery';

/**
 * Inner dialog component for image management with upload and reordering functionality
 *
 * @param initialImages - Images to display initially
 * @param onSave - Function called with final image selection when Save is clicked
 * @param onCancel - Function called when dialog is canceled
 * @param open - Whether the dialog is open
 * @param onOpenChange - Function called when dialog open state changes
 */
export const InnerDialog: React.FC<InnerDialogProps> = ({
  initialImages,
  onSave,
  onCancel,
  open,
  onOpenChange
}) => {
  const [images, setImages] = useState<ImageFile[]>([]);

  // Initialize images when dialog opens
  useEffect(() => {
    if (open) {
      setImages(initialImages);
    }
  }, [initialImages, open]);

  // Handle adding new files
  const handleFilesAdded = (newFiles: File[]) => {
    const newImages = newFiles.map((file) => {
      // Create object URL for preview
      const preview = URL.createObjectURL(file);
      // Generate a unique ID
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      return { file, preview, id };
    });

    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  // Handle removing an image
  const handleRemoveImage = (id: string) => {
    setImages((prevImages) => {
      // Find the image to remove
      const imageToRemove = prevImages.find((img) => img.id === id);

      // Revoke object URL to prevent memory leaks
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      // Filter out the removed image
      return prevImages.filter((img) => img.id !== id);
    });
  };

  // Handle image reordering
  const handleReorder = (newOrder: ImageFile[]) => {
    setImages(newOrder);
  };

  // Handle save button click
  const handleSave = () => {
    const files = images.map((img) => img.file);
    onSave(files);
  };

  // Cleanup object URLs when dialog closes or component unmounts
  useEffect(() => {
    return () => {
      if (!open) {
        images.forEach((image) => {
          URL.revokeObjectURL(image.preview);
        });
      }
    };
  }, [images, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Manage Images</DialogTitle>
        </DialogHeader>

        <div className="flex-grow space-y-6 overflow-y-auto py-4">
          {/* Image upload zone */}
          <div>
            <h3 className="mb-2 text-sm font-medium">Upload Images</h3>
            <ImageDropzone onFilesAdded={handleFilesAdded} />
          </div>

          {/* Image gallery */}
          <div>
            <h3 className="mb-2 text-sm font-medium">
              Gallery ({images.length}{' '}
              {images.length === 1 ? 'image' : 'images'})
            </h3>
            <SortableGallery
              images={images}
              onRemoveImage={handleRemoveImage}
              onReorder={handleReorder}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
