import {
  selectFilteredTasks,
  selectStatusDistribution,
  selectCategoryDistribution,
  selectTimelineData,
  selectTaskStats,
} from '../../store/selectors';
import { type RootState } from '../../store/store';
import { type Task } from '../../types';

describe('selectors', () => {
  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Frontend Task',
      category: 'A',
      status: 'todo',
      date: '2025-09-01',
      amount: 500,
    },
    {
      id: 'task-2',
      title: 'Backend Task',
      category: 'A',
      status: 'in-progress',
      date: '2025-09-02',
      amount: 750,
    },
    {
      id: 'task-3',
      title: 'Design Task',
      category: 'C',
      status: 'done',
      date: '2025-09-01',
      amount: 300,
    },
    {
      id: 'task-4',
      title: 'Testing Task',
      category: 'D',
      status: 'blocked',
      date: '2025-09-03',
      amount: 400,
    },
  ];

  const createMockState = (overrides?: Partial<RootState>): RootState => ({
    tasks: {
      items: mockTasks,
      loading: false,
      error: null,
    },
    filters: {
      selectedStatuses: [],
      selectedCategories: [],
      dateRange: { start: null, end: null },
      searchQuery: '',
    },
    ...overrides,
  });

  describe('selectFilteredTasks', () => {
    it('should return all tasks when no filters applied', () => {
      const state = createMockState();
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(4);
    });

    it('should filter by status', () => {
      const state = createMockState({
        filters: {
          selectedStatuses: ['todo', 'done'],
          selectedCategories: [],
          dateRange: { start: null, end: null },
          searchQuery: '',
        },
      });
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(2);
      expect(result.every(t => ['todo', 'done'].includes(t.status))).toBe(true);
    });

    it('should filter by category', () => {
      const state = createMockState({
        filters: {
          selectedStatuses: [],
          selectedCategories: ['A', 'B'],
          dateRange: { start: null, end: null },
          searchQuery: '',
        },
      });
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(2);
      expect(result.every(t => ['A', 'B'].includes(t.category))).toBe(true);
    });

    it('should filter by date range', () => {
      const state = createMockState({
        filters: {
          selectedStatuses: [],
          selectedCategories: [],
          dateRange: { start: '2025-09-01', end: '2025-09-02' },
          searchQuery: '',
        },
      });
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(3);
    });

    it('should filter by search query', () => {
      const state = createMockState({
        filters: {
          selectedStatuses: [],
          selectedCategories: [],
          dateRange: { start: null, end: null },
          searchQuery: 'frontend',
        },
      });
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Frontend');
    });

    it('should apply multiple filters (AND logic)', () => {
      const state = createMockState({
        filters: {
          selectedStatuses: ['todo', 'done'],
          selectedCategories: ['A', 'B'],
          dateRange: { start: null, end: null },
          searchQuery: '',
        },
      });
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(1);
    });

    it('should handle empty result', () => {
      const state = createMockState({
        filters: {
          selectedStatuses: ['todo'],
          selectedCategories: ['B'],
          dateRange: { start: null, end: null },
          searchQuery: '',
        },
      });
      const result = selectFilteredTasks(state);
      expect(result).toHaveLength(0);
    });
  });

  describe('selectStatusDistribution', () => {
    it('should calculate status distribution', () => {
      const state = createMockState();
      const result = selectStatusDistribution(state);
      expect(result).toHaveLength(4);
      expect(result.find(r => r.name === 'todo')?.value).toBe(1);
      expect(result.find(r => r.name === 'in-progress')?.value).toBe(1);
      expect(result.find(r => r.name === 'done')?.value).toBe(1);
      expect(result.find(r => r.name === 'blocked')?.value).toBe(1);
    });

    it('should include fill colors', () => {
      const state = createMockState();
      const result = selectStatusDistribution(state);
      expect(result.every(r => r.fill)).toBe(true);
    });
  });

  describe('selectCategoryDistribution', () => {
    it('should calculate category distribution', () => {
      const state = createMockState();
      const result = selectCategoryDistribution(state);
      expect(result).toHaveLength(3);
      expect(result.find(r => r.name === 'A')?.value).toBe(2);
    });
  });

  describe('selectTimelineData', () => {
    it('should group tasks by date', () => {
      const state = createMockState();
      const result = selectTimelineData(state);
      expect(result).toHaveLength(3);
      expect(result.find(r => r.date === '2025-09-01')?.count).toBe(2);
    });

    it('should sort by date', () => {
      const state = createMockState();
      const result = selectTimelineData(state);
      expect(result[0].date).toBe('2025-09-01');
      expect(result[result.length - 1].date).toBe('2025-09-03');
    });
  });

  describe('selectTaskStats', () => {
    it('should calculate task statistics', () => {
      const state = createMockState();
      const result = selectTaskStats(state);
      expect(result.total).toBe(4);
      expect(result.totalAmount).toBe(1950);
      expect(result.byStatus.todo).toBe(1);
      expect(result.byStatus.inProgress).toBe(1);
      expect(result.byStatus.done).toBe(1);
      expect(result.byStatus.blocked).toBe(1);
    });

    it('should handle empty tasks', () => {
      const state = createMockState({
        tasks: { items: [], loading: false, error: null },
      });
      const result = selectTaskStats(state);
      expect(result.total).toBe(0);
      expect(result.totalAmount).toBe(0);
    });
  });
});
