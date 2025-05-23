'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import {
  setSearchQuery,
  clearFilters,
  setCategory,
  setStatus
} from '@/lib/redux/slices/uiSlice';
import { useGetCategoriesQuery } from '@/services/apiCategory';
import { SearchInput } from '@/components/custom-component/search-input';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';

// Define available statuses
const MANGA_STATUSES = ['ongoing', 'completed', 'hiatus'];

interface MobileFiltersProps {
  showMobileSearch: boolean;
  setShowMobileSearch: (show: boolean) => void;
}

const MobileFilters = ({
  showMobileSearch,
  setShowMobileSearch
}: MobileFiltersProps) => {
  const dispatch = useAppDispatch();
  const { searchQuery, selectedCategory, selectedStatus } = useAppSelector(
    (state) => state.ui
  );
  const { data: allCategories } = useGetCategoriesQuery();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  // Handle search clear
  const handleSearchClear = () => {
    dispatch(setSearchQuery(''));
  };

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    dispatch(setCategory(Number(value)));
  };

  // Handle status selection
  const handleStatusChange = (value: string) => {
    dispatch(setStatus(value));
  };

  return (
    <>
      {/* Mobile Search & Filter Bar */}
      <div className="mb-6 flex items-center justify-between gap-2 sm:hidden">
        {showMobileSearch ? (
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            placeholder="Search manga..."
            className="flex-1"
            autoFocus
          />
        ) : (
          <div className="flex flex-1 items-center justify-between">
            <h2 className="text-xl font-semibold">Manga</h2>
            {hasActiveFilters && (
              <Badge variant="outline" className="ml-2">
                {selectedCategory.length + selectedStatus.length} active filters
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            aria-label={showMobileSearch ? 'Close search' : 'Open search'}
          >
            {showMobileSearch ? (
              <X className="h-4 w-4" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                aria-label="Filter manga"
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="bg-primary absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white">
                    {selectedCategory.length + selectedStatus.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filter Manga
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Active Filters */}
                {hasActiveFilters && (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">
                        Active Filters
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          dispatch(clearFilters());
                          setIsFilterOpen(false);
                        }}
                        className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs"
                      >
                        Clear all
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategoryValue > 0 && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {getSelectedCategoryName()}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => dispatch(setCategory(0))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                      {selectedStatusValue && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {selectedStatusValue}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => dispatch(setStatus(''))}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )}
                    </div>
                    <Separator className="my-4" />
                  </div>
                )}

                {/* Category Filter */}
                <div>
                  <h4 className="mb-3 text-sm font-medium">Categories</h4>
                  <ScrollArea className="h-[200px] pr-4">
                    <RadioGroup
                      value={selectedCategoryString}
                      onValueChange={handleCategoryChange}
                      className="space-y-3"
                    >
                      {allCategories?.map((category) => (
                        <div
                          key={`mobile-cat-${category.category_id}`}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            id={`mobile-category-${category.category_id}`}
                            value={String(category.category_id)}
                            aria-label={category.category_name}
                          />
                          <label
                            htmlFor={`mobile-category-${category.category_id}`}
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

                {/* Status Filter */}
                <div>
                  <h4 className="mb-3 text-sm font-medium">Status</h4>
                  <RadioGroup
                    value={selectedStatusValue}
                    onValueChange={handleStatusChange}
                    className="space-y-3"
                  >
                    {MANGA_STATUSES.map((status) => (
                      <div
                        key={`mobile-status-${status}`}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          id={`mobile-status-${status}`}
                          value={status}
                        />
                        <label
                          htmlFor={`mobile-status-${status}`}
                          className="cursor-pointer text-sm capitalize"
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
};

export default MobileFilters;
