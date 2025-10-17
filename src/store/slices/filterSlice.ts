import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FilterState, TaskStatus, TaskCategory } from '../../types';

const FILTER_STORAGE_KEY = 'task-tracker-filters';

const loadFiltersFromStorage = (): FilterState => {
  try {
    const stored = localStorage.getItem(FILTER_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load filters from localStorage:', error);
  }
  return getInitialState();
};

const getInitialState = (): FilterState => ({
  selectedStatuses: [],
  selectedCategories: [],
  dateRange: {
    start: null,
    end: null,
  },
  searchQuery: '',
});

const initialState: FilterState = loadFiltersFromStorage();

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleStatus: (state, action: PayloadAction<TaskStatus>) => {
      const status = action.payload;
      const index = state.selectedStatuses.indexOf(status);
      if (index > -1) {
        state.selectedStatuses.splice(index, 1);
      } else {
        state.selectedStatuses.push(status);
      }
    },
    toggleCategory: (state, action: PayloadAction<TaskCategory>) => {
      const category = action.payload;
      const index = state.selectedCategories.indexOf(category);
      if (index > -1) {
        state.selectedCategories.splice(index, 1);
      } else {
        state.selectedCategories.push(category);
      }
    },
    setDateRange: (
      state,
      action: PayloadAction<{ start: string | null; end: string | null }>
    ) => {
      state.dateRange = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearFilters: state => {
      state.selectedStatuses = [];
      state.selectedCategories = [];
      state.dateRange = { start: null, end: null };
      state.searchQuery = '';
    },
    resetFilters: () => getInitialState(),
  },
});

export const {
  toggleStatus,
  toggleCategory,
  setDateRange,
  setSearchQuery,
  clearFilters,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;

// Middleware to persist filters to localStorage
export const filterPersistenceMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  if (action.type?.startsWith('filters/')) {
    const state = store.getState();
    try {
      localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(state.filters));
    } catch (error) {
      console.error('Failed to persist filters to localStorage:', error);
    }
  }
  
  return result;
};
