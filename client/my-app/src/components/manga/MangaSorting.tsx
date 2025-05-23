'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import { setSortBy } from '@/lib/redux/slices/uiSlice';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const MangaSorting = () => {
  const dispatch = useAppDispatch();
  const { sortBy } = useAppSelector((state) => state.ui);

  // Get the current sort key for the Select value
  const currentSortKey = sortBy?.key || '';

  const handleSortChange = (value: string) => {
    // Map the selected value to the appropriate key and value for the API
    let sortConfig;

    switch (value) {
      case 'manga_views':
        sortConfig = { key: 'manga_views', value: true };
        break;
      case 'updatedAt':
        sortConfig = { key: 'updatedAt', value: true };
        break;
      case 'createdAt':
        sortConfig = { key: 'createdAt', value: true };
        break;
      case 'manga_number_of_followers':
        sortConfig = { key: 'manga_number_of_followers', value: true };
        break;
      default:
        sortConfig = { key: 'none', value: false };
    }

    dispatch(setSortBy(sortConfig));
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-sm">Sort by:</span>
      <Select value={currentSortKey} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Select</SelectItem>
          <SelectItem value="manga_views">Popularity</SelectItem>
          <SelectItem value="updatedAt">Newest</SelectItem>
          <SelectItem value="createdAt">Oldest</SelectItem>
          {/* <SelectItem value="manga_number_of_followers">
            Highest Favorite
          </SelectItem> */}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MangaSorting;
