'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { type DropResult } from '@hello-pangea/dnd';
import { toast } from 'sonner';

// --- UI Imports ---
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; // Keep for error state button
import { Card, CardContent, CardHeader } from '@/components/ui/card'; // Keep for error state card
import { ArrowLeft } from 'lucide-react'; // Keep for error state icon

// --- Service Imports ---
import {
  useGetChapterDetailQuery,
  useUpdateChapterMutation,
  useDeleteImageInChapterMutation
} from '@/services/apiManga'; // Assuming correct path

// --- Component Imports ---
import { ChapterHeader } from '@/components/chapter/ChapterHeader'; // Adjust path as needed
import { ImageGrid } from '@/components/chapter/ImageGrid'; // Adjust path as needed
import { DeleteConfirmationDialog } from '@/components/custom-component/DeleteConfirmationDialog'; // Adjust path as needed
import { UploadImagesDialog } from '@/components/custom-component/UploadImagesDialog';
import { fetchAndParseIPFSData } from '@/lib/utils';
import { useAppDispatch } from '@/lib/redux/hook';
import { setCurrentImages } from '@/lib/redux/slices/chapterImagesSlice';

// --- Type Imports ---
// Consider moving these to a shared types file (e.g., types/chapter.ts)
export interface ChapterImage {
  id: string; // Use string ID consistent with draggable
  url: string;
  pageNumber: number;
}

interface UpdateImageData extends ChapterImage {
  newFile?: File;
}

// --- Main Component ---
export default function ChapterImagesPage() {
  const params = useParams();
  const router = useRouter();
  const mangaId = Number(params.mangaid);
  const chapterId = Number(params.chapterid);

  const dispatch = useAppDispatch();

  // --- State ---
  const [images, setImages] = useState<ChapterImage[]>([]);
  const [chapterDetails, setChapterDetails] = useState<{
    number: number | null;
    title: string | null;
  }>({ number: null, title: null });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDeleteId, setImageToDeleteId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<UpdateImageData[]>([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isLoadingIPFS, setIsLoadingIPFS] = useState(false);

  // --- RTK Query Hooks ---
  const {
    data: chapterData,
    isLoading: isChapterLoading,
    error: chapterError,
    refetch: refetchChapterData
  } = useGetChapterDetailQuery(
    { mangaId, chapterId },
    { skip: !mangaId || !chapterId }
  );

  const [updateChapter, { isLoading: isUpdatingChapter }] =
    useUpdateChapterMutation(); // Use mutation state if needed

  const [deleteImageInChapter, { isLoading: isDeletingImages }] =
    useDeleteImageInChapterMutation();

  // --- Effects ---
  // Effect to fetch and process IPFS data when chapterData loads/changes
  useEffect(() => {
    if (chapterData?.chap_content) {
      console.log(chapterData);
      setChapterDetails({
        number: chapterData.chap_number,
        title: chapterData.chap_title || null
      });
      const cid = chapterData.chap_content;
      setIsLoadingIPFS(true);
      fetchAndParseIPFSData(cid)
        .then((parsedImages) => {
          console.log('ParsedImages', parsedImages);
          setImages(parsedImages);
          // ✅ correct
          dispatch(setCurrentImages(parsedImages));
          setHasChanges(false); // Reset changes when data is loaded initially
        })
        .catch((err) => {
          console.log('IPFS fetch failed:', err);
          setImages([]); // Clear images on error
        })
        .finally(() => setIsLoadingIPFS(false));
    } else if (chapterData) {
      // Handle case where chapter exists but has no content CID
      setChapterDetails({
        number: chapterData.chap_number,
        title: chapterData.chap_title || null
      });
      setImages([]);
      setIsLoadingIPFS(false);
    }
  }, [chapterData, dispatch]);

  // --- Callback Handlers ---
  const handleDragEnd = useCallback((result: DropResult) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return;
    }

    setImages((prevImages) => {
      const items = Array.from(prevImages);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      // Re-assign page numbers based on the new order
      const updatedItems = items.map((item, index) => ({
        ...item,
        pageNumber: index + 1
      }));
      return updatedItems;
    });

    setHasChanges(true);
  }, []);

  const confirmDeleteImage = useCallback((imageId: string) => {
    setImageToDeleteId(imageId);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedImages.length === 0) return;
    setIsDeleteDialogOpen(true);
  }, [selectedImages]);

  const handleDeleteImage = useCallback(async () => {
    try {
      // Set deletion loading state
      const toastId = toast.loading(
        `Deleting ${
          selectedImages.length > 0
            ? `${selectedImages.length} images`
            : 'image'
        }...`,
        { duration: 10000 }
      );

      if (selectedImages.length > 0) {
        // Extract CIDs from the image URLs
        const contentCids = selectedImages.map((img) => {
          // Extract CID from URL format: ipfs.io/ipfs/CID or just CID
          const url = img.url;
          if (url.includes('ipfs.io/ipfs/')) {
            return url.split('ipfs.io/ipfs/')[1];
          }
          return url; // Assume it's already a CID
        });

        // Call the API to delete the images
        await deleteImageInChapter({
          chapterId,
          contentCids
        }).unwrap();

        // Update UI after successful deletion
        const deletedIds = selectedImages.map((img) => img.id);
        const updatedImages = images.filter(
          (img) => !deletedIds.includes(img.id)
        );

        // Renumber remaining images
        const renumberedImages = updatedImages.map((image, index) => ({
          ...image,
          pageNumber: index + 1
        }));

        setImages(renumberedImages);
        setSelectedImages([]);

        // Dismiss loading toast and show success
        toast.dismiss(toastId);
        toast.success(`${selectedImages.length} images deleted successfully`);
      }
      // Handle single image deletion if needed
      else if (imageToDeleteId) {
        const imageToDelete = images.find((img) => img.id === imageToDeleteId);
        if (!imageToDelete) return;

        // Extract CID from URL
        const url = imageToDelete.url;
        let cid = url;
        if (url.includes('ipfs.io/ipfs/')) {
          cid = url.split('ipfs.io/ipfs/')[1];
        }

        // Call the API
        await deleteImageInChapter({
          chapterId,
          contentCids: [cid]
        }).unwrap();

        // Update local state
        const updatedImages = images.filter(
          (img) => img.id !== imageToDeleteId
        );
        const renumberedImages = updatedImages.map((image, index) => ({
          ...image,
          pageNumber: index + 1
        }));

        setImages(renumberedImages);
        setImageToDeleteId(null);

        // Dismiss loading toast and show success
        toast.dismiss(toastId);
        toast.success('Image deleted successfully');
      }
    } catch (error) {
      // Dismiss any existing loading toast and show error
      toast.dismiss();
      toast.error('Failed to delete images. Please try again.');
      console.error('Failed to delete images:', error);
    }
  }, [
    selectedImages,
    imageToDeleteId,
    chapterId,
    deleteImageInChapter,
    images
  ]);

  const saveImageOrder = useCallback(async () => {
    // Check if already saving
    if (isUpdatingChapter) return;

    try {
      const formData = new FormData();
      images.forEach((img) => {
        formData.append('chap_img_pages', img.pageNumber.toString());
      });

      const response = await fetch(
        `http://localhost:8080/chapter/${chapterId}/reorder`,
        {
          method: 'PATCH',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `Failed to save order: ${response.status} ${errorData}`
        );
      }

      toast.success('Image order saved successfully!');
      setHasChanges(false);
    } catch (error) {
      console.log('Failed to save image order:', error);
      toast.error(
        `Save failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }, [images, chapterId, isUpdatingChapter]);

  const toggleImageSelection = useCallback((image: ChapterImage) => {
    console.log('Image', image);
    setSelectedImages((prev) => {
      const isSelected = prev.some((img) => img.id === image.id);
      if (isSelected) {
        return prev.filter((img) => img.id !== image.id);
      } else {
        return [...prev, { ...image }];
      }
    });
  }, []);

  const startImageUpdate = useCallback(() => {
    if (selectedImages.length === 0) {
      toast.warning('Please select at least one image to update.');
      return;
    }
    setIsUpdateDialogOpen(true);
  }, [selectedImages]);

  const handleUploadDialogClose = (open: boolean) => {
    setIsUploadDialogOpen(open);
    if (!open) {
      setSelectedImages([]); // Clear selection after upload/update actions
    }
  };
  const handleUpdateDialogClose = (open: boolean) => {
    setIsUpdateDialogOpen(open);
    if (!open) {
      setSelectedImages([]); // Clear selection after upload/update actions
    }
  };

  const handleViewChapter = () => {
    router.push(`/dashboard/manga/${mangaId}/chapters/${chapterId}`);
  };

  // --- Render Logic ---
  if (isChapterLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="ml-auto h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (chapterError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-destructive text-2xl font-semibold">
            Error Loading Chapter
          </h1>
        </div>
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6">
            <p className="text-destructive-foreground">
              Failed to load chapter details. Please check the console for more
              information or try again later.
            </p>
            <Button
              variant="outline"
              onClick={() => refetchChapterData()}
              className="mt-4"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <ChapterHeader
        mangaId={mangaId}
        chapterId={chapterId}
        chapterNumber={chapterDetails.number ?? 0}
        title={chapterDetails.title}
        hasChanges={hasChanges}
        selectedImagesCount={selectedImages.length}
        onSaveOrder={saveImageOrder}
        onUploadClick={() => setIsUploadDialogOpen(true)}
        onUpdateClick={startImageUpdate}
        onCancelSelection={() => setSelectedImages([])}
        onDeleteSelected={handleDeleteSelected}
      />

      {isLoadingIPFS ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: images.length || 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] w-full rounded-md" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <ImageGrid
          images={images}
          selectedImages={selectedImages}
          onToggleSelection={toggleImageSelection}
          onConfirmDelete={confirmDeleteImage}
          mangaId={mangaId}
          chapterId={chapterId}
          onViewChapterClick={handleViewChapter}
        />
      )}

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteImage}
        isLoading={isDeletingImages}
        itemName={
          selectedImages.length > 0
            ? `${selectedImages.length} selected images`
            : 'image'
        }
      />

      {/* <UploadImagesDialog
        open={isUploadDialogOpen}
        onOpenChange={handleUploadDialogClose}
        chapterId={chapterId}
        currentImages={images}
      /> */}
      <UploadImagesDialog
        open={isUpdateDialogOpen}
        onOpenChange={handleUpdateDialogClose}
        chapterId={chapterId}
        currentImages={images}
        selectedImages={selectedImages}
        updateMode={true}
      />
    </div>
  );
}
