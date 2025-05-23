import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface MangaFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
  isVisible: boolean;
}

export default function MangaFilters({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  onResetFilters,
  isVisible
}: MangaFiltersProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 px-6 pb-2 sm:flex-row sm:items-center">
      <div className="relative flex-grow">
        <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
        <Input
          placeholder="Search manga..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-muted/40 border-manga-600/20 pl-9"
          aria-label="Search manga"
        />
      </div>

      <div className="flex flex-nowrap gap-2">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="bg-muted/40 border-manga-600/20 w-full sm:w-[120px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
            {/* Add more sort options if needed */}
            <SelectItem value="published">Publish</SelectItem>
            <SelectItem value="unpublished">UnPublish</SelectItem>
            {/* <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem> */}
          </SelectContent>
        </Select>

        {searchTerm ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={onResetFilters}
            className="h-9 w-9"
            aria-label="Reset filters"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
}
