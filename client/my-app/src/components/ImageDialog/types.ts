/**
 * Common types used for the image dialog components
 */

/**
 * Represents a file with preview URL for display in the component
 */
export interface ImageFile {
  /** Original file object */
  file: File;
  /** Preview URL for displaying the image */
  preview: string;
  /** Unique identifier for the image */
  id: string;
}

/**
 * Props for the OuterDialog component
 */
export interface OuterDialogProps {
  /** Array of files currently selected */
  images: File[];
  /** Called when images are added, removed or reordered */
  onChange: (images: File[]) => void;
  /** Optional trigger button text */
  triggerText?: string;
  /** Chapter ID for the images */
  chapterId: number;
}

/**
 * Props for the InnerDialog component
 */
export interface InnerDialogProps {
  /** Initial images to display */
  initialImages: ImageFile[];
  /** Called when the dialog is closed with the final image selection */
  onSave: (images: File[]) => void;
  /** Called when the dialog is closed without saving */
  onCancel: () => void;
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the open state changes */
  onOpenChange: (open: boolean) => void;
}

/**
 * Props for the ImageDropzone component
 */
export interface ImageDropzoneProps {
  /** Called when files are added */
  onFilesAdded: (files: File[]) => void;
}

/**
 * Props for the SortableGallery component
 */
export interface SortableGalleryProps {
  /** Images to display in the gallery */
  images: ImageFile[];
  /** Called when an image is removed */
  onRemoveImage: (id: string) => void;
  /** Called when images are reordered */
  onReorder: (images: ImageFile[]) => void;
}

/**
 * Props for the SortableItem component
 */
export interface SortableItemProps {
  /** The image to display */
  image: ImageFile;
  /** Unique ID for the item */
  id: string;
  /** Called when the image is removed */
  onRemove: (id: string) => void;
}
