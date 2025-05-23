import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import SortableImagePreview from './SortableImagePreview';

interface SortableImageGridProps {
  previews: string[];
  onReorder: (newPreviews: string[]) => void;
  onRemove: (index: number) => void;
}

export const SortableImageGrid: React.FC<SortableImageGridProps> = ({
  previews,
  onReorder,
  onRemove
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveIndex(previews.indexOf(active.id as string));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = previews.findIndex((id) => id === active.id);
      const newIndex = previews.findIndex((id) => id === over.id);

      onReorder(arrayMove(previews, oldIndex, newIndex));
    }

    setActiveId(null);
    setActiveIndex(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveIndex(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={previews} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {previews.map((preview, index) => (
            <SortableImagePreview
              key={preview}
              preview={preview}
              index={index}
              onRemove={onRemove}
            />
          ))}
        </div>
      </SortableContext>

      {createPortal(
        <DragOverlay adjustScale={true}>
          {activeId && activeIndex !== null ? (
            <SortableImagePreview
              preview={activeId}
              index={activeIndex}
              onRemove={onRemove}
              isDragging
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default SortableImageGrid;
