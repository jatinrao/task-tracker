import filterReducer, {
  toggleStatus,
  toggleCategory,
  setDateRange,
  setSearchQuery,
  clearFilters,
  resetFilters,
} from '../../store/slices/filterSlice';
import { type FilterState } from '../../types';

describe('filterSlice', () => {
  const initialState: FilterState = {
    selectedStatuses: [],
    selectedCategories: [],
    dateRange: { start: null, end: null },
    searchQuery: '',
  };

  it('should return initial state', () => {
    expect(filterReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('toggleStatus', () => {
    it('should add status when not present', () => {
      const state = filterReducer(initialState, toggleStatus('todo'));
      expect(state.selectedStatuses).toEqual(['todo']);
    });

    it('should remove status when already present', () => {
      const state: FilterState = { ...initialState, selectedStatuses: ['todo', 'done'] };
      const newState = filterReducer(state, toggleStatus('todo'));
      expect(newState.selectedStatuses).toEqual(['done']);
    });

    it('should handle multiple toggles', () => {
      let state = filterReducer(initialState, toggleStatus('todo'));
      state = filterReducer(state, toggleStatus('in-progress'));
      state = filterReducer(state, toggleStatus('done'));
      expect(state.selectedStatuses).toEqual(['todo', 'in-progress', 'done']);
    });
  });

  describe('toggleCategory', () => {
    it('should add category when not present', () => {
      const state = filterReducer(initialState, toggleCategory('A'));
      expect(state.selectedCategories).toEqual(['A']);
    });

    it('should remove category when already present', () => {
      const state: FilterState = { ...initialState, selectedCategories: ['A', 'B'] };
      const newState = filterReducer(state, toggleCategory('A'));
      expect(newState.selectedCategories).toEqual(['B']);
    });
  });

  describe('setDateRange', () => {
    it('should set date range', () => {
      const dateRange = { start: '2025-09-01', end: '2025-09-30' };
      const state = filterReducer(initialState, setDateRange(dateRange));
      expect(state.dateRange).toEqual(dateRange);
    });

    it('should handle null values', () => {
      const state = filterReducer(initialState, setDateRange({ start: null, end: null }));
      expect(state.dateRange).toEqual({ start: null, end: null });
    });
  });

  describe('setSearchQuery', () => {
    it('should set search query', () => {
      const state = filterReducer(initialState, setSearchQuery('test query'));
      expect(state.searchQuery).toBe('test query');
    });

    it('should update existing search query', () => {
      const state: FilterState = { ...initialState, searchQuery: 'old query' };
      const newState = filterReducer(state, setSearchQuery('new query'));
      expect(newState.searchQuery).toBe('new query');
    });
  });

  describe('clearFilters', () => {
    it('should clear all filters', () => {
      const state: FilterState = {
        selectedStatuses: ['todo', 'done'],
        selectedCategories: ['A'],
        dateRange: { start: '2025-09-01', end: '2025-09-30' },
        searchQuery: 'test',
      };
      const newState = filterReducer(state, clearFilters());
      expect(newState).toEqual(initialState);
    });
  });

  describe('resetFilters', () => {
    it('should reset to initial state', () => {
      const state: FilterState = {
        selectedStatuses: ['todo'],
        selectedCategories: ['A'],
        dateRange: { start: '2025-09-01', end: '2025-09-30' },
        searchQuery: 'test',
      };
      const newState = filterReducer(state, resetFilters());
      expect(newState).toEqual(initialState);
    });
  });
});
