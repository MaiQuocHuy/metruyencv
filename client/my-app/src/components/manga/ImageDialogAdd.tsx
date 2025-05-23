import React, { useState } from 'react';
import { OuterDialog } from '@/components/ImageDialog';
import { useParams } from 'next/navigation';

/**
 * Example usage of the nested image dialog component
 */
export const ImageDialogAdd: React.FC = () => {
  const params = useParams();
  const [images, setImages] = useState<File[]>([]);
  const chapterId = Number(params.chapterid);
  const handleImagesChange = (updatedImages: File[]) => {
    setImages(updatedImages);
    console.log('Images updated:', updatedImages);
  };

  return (
    // <div className="flex min-h-screen flex-col items-center justify-center p-6">
    //   <div className="w-full max-w-lg space-y-6">
    //     <div className="space-y-2 text-center">
    //       <h1 className="text-3xl font-bold">Image Dialog Example</h1>
    //       <p className="text-muted-foreground">
    //         Click the button below to manage your images
    //       </p>
    //     </div>

    <div className="text-center">
      <OuterDialog
        images={images}
        onChange={handleImagesChange}
        triggerText="Manage Images"
        chapterId={chapterId}
      />
    </div>

    // <div className="bg-muted rounded-md p-4">
    //     <h2 className="mb-2 font-semibold">Selected Images:</h2>
    //     {images.length > 0 ? (
    //       <ul className="list-inside list-disc space-y-1">
    //         {images.map((file, index) => (
    //           <li key={index}>
    //             {file.name} ({(file.size / 1024).toFixed(1)} KB)
    //           </li>
    //         ))}
    //       </ul>
    //     ) : (
    //       <p className="text-muted-foreground">No images selected</p>
    //     )}
    //   </div>
    // </div>
    // </div>
  );
};
