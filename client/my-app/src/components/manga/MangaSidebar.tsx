'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import {
  setCategory,
  setStatus,
  clearFilters
} from '@/lib/redux/slices/uiSlice';
import { useGetCategoriesQuery } from '@/services/apiCategory';
import { Filter, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Define available statuses
const MANGA_STATUSES = ['ongoing', 'completed'];

const MangaSidebar = () => {
  const dispatch = useAppDispatch();
  const { selectedCategory, selectedStatus } = useAppSelector(
    (state) => state.ui
  );
  const { data: allCategories } = useGetCategoriesQuery();

  // Get the first item from arrays for single selection (if arrays are not empty)
  const selectedCategoryValue =
    selectedCategory.length > 0 ? selectedCategory[0] : 0;
  const selectedStatusValue =
    selectedStatus.length > 0 ? selectedStatus[0] : '';

  // Convert category to string for RadioGroup (which expects string values)
  const selectedCategoryString = selectedCategoryValue
    ? String(selectedCategoryValue)
    : '';

  // Determine if any filters are active
  const hasActiveFilters =
    selectedCategory.length > 0 || selectedStatus.length > 0;

  // Find the selected category name for display in the badge
  const getSelectedCategoryName = () => {
    if (!selectedCategoryValue || !allCategories) return '';
    const category = allCategories.find(
      (cat) => cat.category_id === selectedCategoryValue
    );
    return category ? category.category_name : '';
  };

  // Helper function to render filter badges
  const renderFilterBadge = (type: 'category' | 'status') => {
    if (type === 'category') {
      const categoryName = getSelectedCategoryName();
      if (!categoryName) return null;

      return (
        <Badge
          key={`category-${selectedCategoryValue}`}
          variant="secondary"
          className="flex items-center gap-1 whitespace-nowrap"
        >
          {categoryName}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-4 w-4 p-0"
            onClick={() => dispatch(setCategory(0))}
            aria-label={`Remove ${categoryName} category filter`}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    } else {
      if (!selectedStatusValue) return null;

      return (
        <Badge
          key={`status-${selectedStatusValue}`}
          variant="secondary"
          className="flex items-center gap-1 whitespace-nowrap"
        >
          {selectedStatusValue}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-4 w-4 p-0"
            onClick={() => dispatch(setStatus(''))}
            aria-label={`Remove ${selectedStatusValue} status filter`}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      );
    }
  };

  // Handle category selection - convert string to number
  const handleCategoryChange = (value: string) => {
    dispatch(setCategory(Number(value)));
  };

  // Handle status selection
  const handleStatusChange = (value: string) => {
    dispatch(setStatus(value));
  };

  return (
    <aside className="hidden w-64 shrink-0 space-y-6 lg:block">
      <div className="sticky top-24 space-y-3">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Filter className="h-5 w-5" />
          Filters
        </h3>

        {/* --- Selected Filters Display --- */}
        {hasActiveFilters && (
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Active Filters
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch(clearFilters())}
                className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs"
              >
                Clear all
              </Button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedCategoryValue > 0 && renderFilterBadge('category')}
              {selectedStatusValue && renderFilterBadge('status')}
            </div>
            <Separator className="my-4" />
          </div>
        )}

        {/* --- Category Filter --- */}
        <div className="space-y-2">
          <h4 className="mb-2 pb-2 text-sm font-medium">Categories</h4>
          <ScrollArea className="h-[150px] pr-4">
            <RadioGroup
              value={selectedCategoryString}
              onValueChange={handleCategoryChange}
              className="space-y-2 pb-1"
            >
              {allCategories &&
                allCategories.map((category) => (
                  <div
                    key={`desktop-cat-${category.category_id}`}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      id={`desktop-category-${category.category_id}`}
                      value={String(category.category_id)}
                      aria-label={category.category_name}
                    />
                    <label
                      htmlFor={`desktop-category-${category.category_id}`}
                      className="cursor-pointer text-sm"
                    >
                      {category.category_name}
                    </label>
                  </div>
                ))}
            </RadioGroup>
          </ScrollArea>
        </div>

        <Separator />

        {/* --- Status Filter --- */}
        <div className="space-y-2">
          <h4 className="mb-2 pb-2 text-sm font-medium">Status</h4>
          <RadioGroup
            value={selectedStatusValue}
            onValueChange={handleStatusChange}
            className="space-y-2 pr-4 pb-1"
          >
            {MANGA_STATUSES.map((status) => (
              <div
                key={`desktop-status-${status}`}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem
                  id={`desktop-status-${status}`}
                  value={status}
                  aria-label={status}
                />
                <label
                  htmlFor={`desktop-status-${status}`}
                  className="cursor-pointer text-sm capitalize"
                >
                  {status}
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </aside>
  );
};

export default MangaSidebar;
