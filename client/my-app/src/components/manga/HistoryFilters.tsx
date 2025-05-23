import React from 'react';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface HistoryFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  changeTypes: string[];
}

const HistoryFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  changeTypes
}: HistoryFiltersProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-grow">
        <Filter className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
        <Input
          placeholder="Search history..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-muted/40 border-manga-600/20 pl-9"
        />
      </div>

      <Select value={filterType} onValueChange={setFilterType}>
        <SelectTrigger className="bg-muted/40 border-manga-600/20 w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent className="bg-card/90 border-manga-600/40 backdrop-blur-xl">
          {changeTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type === 'all' ? 'All Types' : type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HistoryFilters;
