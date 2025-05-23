import React from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Eye,
  History,
  BookOpen,
  Trash2,
  EyeOff
} from 'lucide-react';
import { MangaAdmin } from '@/services/apiManga';

interface MangaActionsProps {
  item: MangaAdmin;
  onTogglePublish: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
}

export default function MangaActions({
  item,
  onTogglePublish,
  onDelete
}: MangaActionsProps) {
  const isPublished = item.is_published === 1 || item.is_published === true; // Handle both number and boolean

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Manga Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-card/90 border-manga-600/40 backdrop-blur-xl"
      >
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isPublished && (
          <DropdownMenuItem
            onClick={() => onTogglePublish(item.manga_id, 'published')}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4 text-green-500" />
            Publish
          </DropdownMenuItem>
        )}
        {/* Add Unpublish action if needed */}
        {isPublished && (
          <DropdownMenuItem
            onClick={() => onTogglePublish(item.manga_id, 'unpublished')}
            className="cursor-pointer"
          >
            <EyeOff className="mr-2 h-4 w-4 text-yellow-500" />
            Unpublish
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={`/dashboard/history?manga_id=${item.manga_id}`}
            className="flex w-full"
          >
            <History className="mr-2 h-4 w-4" />
            History
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link
            href={`/dashboard/manga/${item.manga_id}?status=${isPublished ? 'publish' : 'unpublish'}`}
            className="flex w-full"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>
        {!isPublished && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => onDelete(item.manga_id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
