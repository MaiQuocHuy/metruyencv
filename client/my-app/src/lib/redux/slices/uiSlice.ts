// uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  selectedCategory: number[];
  selectedStatus: string[];
  sortBy: {
    key: string;
    value: boolean;
  };
  searchQuery: string;
  currentPage: number;
  isNavbar: boolean;
}

const initialState: UiState = {
  selectedCategory: [],
  selectedStatus: [],
  sortBy: {
    key: 'none',
    value: false
  },
  searchQuery: '',
  currentPage: 1,
  isNavbar: false
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleCategory: (state, action: PayloadAction<number>) => {
      const category = action.payload;
      if (state.selectedCategory.includes(category)) {
        state.selectedCategory = state.selectedCategory.filter(
          (g) => g !== category
        );
      } else {
        state.selectedCategory.push(category);
      }
      // Reset page when filters change
      state.currentPage = 1;
    },
    // Add a new reducer for setting a single category (replacing the array)
    setCategory: (state, action: PayloadAction<number>) => {
      state.selectedCategory = action.payload ? [action.payload] : [];
      // Reset page when filters change
      state.currentPage = 1;
    },
    // Add reducer for toggling status
    toggleStatus: (state, action: PayloadAction<string>) => {
      const status = action.payload;
      if (state.selectedStatus.includes(status)) {
        state.selectedStatus = state.selectedStatus.filter((s) => s !== status);
      } else {
        state.selectedStatus.push(status);
      }
      // Reset page when filters change
      state.currentPage = 1;
    },
    // Add a new reducer for setting a single status (replacing the array)
    setStatus: (state, action: PayloadAction<string>) => {
      state.selectedStatus = action.payload ? [action.payload] : [];
      // Reset page when filters change
      state.currentPage = 1;
    },
    setSortBy: (
      state,
      action: PayloadAction<{
        key: string;
        value: boolean;
      }>
    ) => {
      state.sortBy = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      // Reset page when search changes
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.selectedCategory = [];
      state.selectedStatus = [];
      state.sortBy = {
        key: 'none',
        value: false
      };
      state.searchQuery = '';
      state.currentPage = 1;
    },
    toggleNavbar: (state, action: PayloadAction<boolean>) => {
      state.isNavbar = action.payload;
    }
  }
});

export const {
  toggleCategory,
  setCategory,
  toggleStatus,
  setStatus,
  setSortBy,
  setSearchQuery,
  setCurrentPage,
  clearFilters,
  toggleNavbar
} = uiSlice.actions;
export default uiSlice.reducer;
