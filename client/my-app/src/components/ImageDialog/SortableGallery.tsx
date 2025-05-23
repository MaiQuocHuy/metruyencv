import React from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ImageFile, SortableGalleryProps } from './types';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Sortable item component with live index display
const SortableItem = ({
  image,
  index,
  onRemove
}: {
  image: ImageFile;
  index: number;
  onRemove: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'relative aspect-square w-[150px] select-none',
        isDragging && 'z-10'
      )}
    >
      <Card className="group relative h-full">
        <div className="absolute inset-0">
          <img
            src={image.preview}
            alt={image.file.name}
            className="h-full w-full rounded-lg object-cover"
          />
        </div>

        {/* Index overlay */}
        <div className="absolute top-2 left-2 rounded bg-black/50 px-2 py-1 text-sm font-medium text-white">
          #{index + 1}
        </div>

        {/* File size overlay */}
        <div className="absolute bottom-2 left-2 rounded bg-black/50 px-1.5 py-0.5 text-xs font-medium text-white">
          {formatFileSize(image.file.size)}
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
      </Card>
    </div>
  );
};

/** Format file size to human-readable string */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * A horizontal gallery of images that can be reordered via drag and drop
 */
export const SortableGallery: React.FC<SortableGalleryProps> = ({
  images,
  onRemoveImage,
  onReorder
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);

      const newImages = arrayMove(images, oldIndex, newIndex);
      onReorder(newImages);
    }
  };

  return (
    <div className="mt-4 w-full">
      {images.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((img) => img.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex flex-wrap gap-4 p-2">
              {images.map((image, index) => (
                <SortableItem
                  key={image.id}
                  image={image}
                  index={index}
                  onRemove={onRemoveImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-muted-foreground">
            No images yet. Upload some above.
          </p>
        </div>
      )}
    </div>
  );
};
