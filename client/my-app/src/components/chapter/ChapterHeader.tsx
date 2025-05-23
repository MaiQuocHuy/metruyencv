import type React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageDialogAdd } from '../manga/ImageDialogAdd';

interface ChapterHeaderProps {
  mangaId: number;
  chapterId: number;
  chapterNumber: number;
  title: string | null;
  hasChanges: boolean;
  selectedImagesCount: number;
  onSaveOrder: () => void;
  onUploadClick: () => void;
  onUpdateClick: () => void;
  onCancelSelection: () => void;
  onDeleteSelected: () => void;
}

export function ChapterHeader({
  mangaId,
  chapterId,
  chapterNumber,
  title,
  hasChanges,
  selectedImagesCount,
  onSaveOrder,
  onUploadClick,
  onUpdateClick,
  onCancelSelection,
  onDeleteSelected
}: ChapterHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          {/* Link back to the chapter detail page, not the image management page itself */}
          <Link href={`/dashboard/manga/${mangaId}/chapters/${chapterId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Chapter Images
          </h1>
          <p className="text-muted-foreground">
            Chapter {chapterNumber || 'N/A'}: {title || 'Untitled'}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {selectedImagesCount > 0 ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              className="gap-1"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedImagesCount})
            </Button>
            <Button size="sm" variant="outline" onClick={onUpdateClick}>
              Update
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancelSelection}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <ImageDialogAdd />

            {hasChanges && (
              <Button size="sm" onClick={onSaveOrder}>
                Save Order
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
