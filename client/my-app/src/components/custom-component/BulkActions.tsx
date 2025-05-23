import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  isVisible: boolean;
}

export function BulkActions({
  selectedCount,
  onBulkDelete,
  isVisible
}: BulkActionsProps) {
  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={onBulkDelete}
      className="hidden sm:flex" // Only show on larger screens in header
    >
      <Trash2 className="mr-1 h-4 w-4" />
      Delete ({selectedCount})
    </Button>
  );
}

interface MobileBulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  isVisible: boolean;
}

export function MobileBulkActions({
  selectedCount,
  onBulkDelete,
  isVisible
}: MobileBulkActionsProps) {
  if (!isVisible || selectedCount === 0) {
    return null;
  }

  return (
    <div className="bg-muted/40 border-manga-600/20 mb-4 flex items-center justify-between rounded-md p-2 sm:hidden">
      <span className="text-sm">{selectedCount} selected</span>
      <Button variant="destructive" size="sm" onClick={onBulkDelete}>
        <Trash2 className="mr-1 h-4 w-4" />
        Delete
      </Button>
    </div>
  );
}
