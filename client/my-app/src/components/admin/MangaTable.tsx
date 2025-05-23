import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import MangaTableRow from './MangaTableRow';
import { MangaAdmin } from '@/services/apiManga';

interface MangaTableProps {
  mangaToShow: MangaAdmin[];
  selectedManga: number[];
  onSelectAllChange: (checked: boolean) => void;
  onRowSelectChange: (id: number, checked: boolean) => void;
  onTogglePublish: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
  isCompact: boolean;
  isDesktop: boolean;
  searchTerm: string; // Needed for empty state message
}

export default function MangaTable({
  mangaToShow,
  selectedManga,
  onSelectAllChange,
  onRowSelectChange,
  onTogglePublish,
  onDelete,
  isCompact,
  isDesktop,
  searchTerm
}: MangaTableProps) {
  const allSelected =
    mangaToShow.length > 0 && selectedManga.length === mangaToShow.length;
  const colSpan = isDesktop ? (isCompact ? 5 : 6) : isCompact ? 4 : 5; // Adjusted colspan

  return (
    <div className="border-manga-600/20 overflow-hidden rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="bg-manga-600/20">
            <th className="px-4 py-3 text-left">Title</th>
            {isDesktop && <th className="px-4 py-3 text-left">Author</th>}
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Views</th>
            {(!isCompact || isDesktop) && (
              <th className="w-[80px] px-4 py-3 text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {mangaToShow.length > 0 ? (
            mangaToShow.map((item) => (
              <MangaTableRow
                key={item.manga_id}
                item={item}
                isSelected={selectedManga.includes(item.manga_id)}
                onSelectChange={onRowSelectChange}
                onTogglePublish={onTogglePublish}
                onDelete={onDelete}
                isCompact={isCompact}
                isDesktop={isDesktop}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={colSpan}
                className="text-muted-foreground px-4 py-6 text-center"
              >
                {searchTerm
                  ? 'No manga found matching your search criteria.'
                  : 'No manga available.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
