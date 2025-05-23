import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SortableImagePreviewProps {
  preview: string;
  index: number;
  onRemove: (index: number) => void;
  isDragging?: boolean;
}

const SortableImagePreview = React.memo(
  ({
    preview,
    index,
    onRemove,
    isDragging = false
  }: SortableImagePreviewProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging: isSortableDragging
    } = useSortable({ id: preview });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition: !isSortableDragging ? transition : undefined
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: { type: 'spring', stiffness: 300, damping: 25 }
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          'relative aspect-square select-none',
          isDragging && 'z-10'
        )}
      >
        <Card className="group relative h-full">
          <div className="absolute inset-0">
            <img
              src={preview}
              alt={`Page ${index + 1}`}
              className="h-full w-full rounded-lg object-cover"
              draggable={false}
            />
          </div>

          {/* Page number overlay */}
          <div className="absolute top-2 left-2 rounded bg-black/50 px-2 py-1 text-sm font-medium text-white">
            #{index + 1}
          </div>

          {/* Remove button */}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(index);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Card>
      </motion.div>
    );
  }
);

SortableImagePreview.displayName = 'SortableImagePreview';

export default SortableImagePreview;
