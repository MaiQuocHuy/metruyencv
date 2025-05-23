import type React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string; // Optional: specify what is being deleted
  isLoading?: boolean; // Add loading state prop
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName = 'item', // Default item name
  isLoading = false // Default not loading
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Prevent closing dialog during loading
        if (isLoading && !isOpen) return;
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete {itemName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this {itemName}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              // Don't automatically close dialog when loading state is managed externally
              if (!isLoading) {
                onOpenChange(false);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
