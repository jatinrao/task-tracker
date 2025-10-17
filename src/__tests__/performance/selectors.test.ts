import {
  selectFilteredTasks,
  selectStatusDistribution,
  selectCategoryDistribution,
  selectTimelineData,
} from '../../store/selectors';
import { type RootState } from '../../store/store';
import { generateMockTasks } from '../../utils/mockData';

describe('Selector Performance', () => {
  const createLargeState = (taskCount: number): RootState => ({
    tasks: {
      items: generateMockTasks(taskCount),
      loading: false,
      error: null,
    },
    filters: {
      selectedStatuses: [],
      selectedCategories: [],
      dateRange: { start: null, end: null },
      searchQuery: '',
    },
  });

  describe('selectFilteredTasks performance', () => {
    it('should handle 1000 tasks efficiently', () => {
      const state = createLargeState(1000);
      const start = performance.now();
      const result = selectFilteredTasks(state);
      const end = performance.now();

      expect(result).toHaveLength(1000);
      expect(end - start).toBeLessThan(50); //under 50ms
    });

    it('should handle 5000 tasks', () => {
      const state = createLargeState(5000);
      const start = performance.now();
      const result = selectFilteredTasks(state);
      const end = performance.now();

      expect(result).toHaveLength(5000);
      expect(end - start).toBeLessThan(200); // under 200ms
    });

    it('should filter 1000 tasks efficiently', () => {
      const state = createLargeState(1000);
      state.filters.selectedStatuses = ['todo', 'done'];
      state.filters.searchQuery = 'frontend';

      const start = performance.now();
      const result = selectFilteredTasks(state);
      const end = performance.now();

      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(end - start).toBeLessThan(100);
    });
  });

  describe('selectStatusDistribution performance', () => {
    it('should calculate distribution for 1000 tasks efficiently', () => {
      const state = createLargeState(1000);
      const start = performance.now();
      const result = selectStatusDistribution(state);
      const end = performance.now();

      expect(result.length).toBeGreaterThan(0);
      expect(end - start).toBeLessThan(50);
    });
  });

  describe('selectCategoryDistribution performance', () => {
    it('should calculate distribution for 1000 tasks efficiently', () => {
      const state = createLargeState(1000);
      const start = performance.now();
      const result = selectCategoryDistribution(state);
      const end = performance.now();

      expect(result.length).toBeGreaterThan(0);
      expect(end - start).toBeLessThan(50);
    });
  });

  describe('selectTimelineData performance', () => {
    it('should group 1000 tasks by date efficiently', () => {
      const state = createLargeState(1000);
      const start = performance.now();
      const result = selectTimelineData(state);
      const end = performance.now();

      expect(result.length).toBeGreaterThan(0);
      expect(end - start).toBeLessThan(100);
    });
  });

  describe('memoization effectiveness', () => {
    it('should return same reference for unchanged state', () => {
      const state = createLargeState(1000);
      const result1 = selectFilteredTasks(state);
      const result2 = selectFilteredTasks(state);

      expect(result1).toBe(result2); // checks reference 
    });

    it('should recompute when filters change', () => {
      const state = createLargeState(1000);
      const result1 = selectFilteredTasks(state);

      const updatedState: RootState = {
        ...state,
        filters: {
          ...state.filters,
          selectedStatuses: ['todo'],
        },
      };
      const result2 = selectFilteredTasks(updatedState);

      expect(result1).not.toBe(result2); // checks reference after filter change
    });
  });

  describe('multiple selector calls', () => {
    it('should handle multiple concurrent selector calls efficiently', () => {
      const state = createLargeState(1000);
      const start = performance.now();

      selectFilteredTasks(state);
      selectStatusDistribution(state);
      selectCategoryDistribution(state);
      selectTimelineData(state);

      const end = performance.now();
      expect(end - start).toBeLessThan(200); // under 200ms
    });
  });
});
