export type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked';
export type TaskCategory = 'A' | 'B' | 'C' | 'D';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  date: string; // ISO date string
  amount: number;
}

export interface FilterState {
  selectedStatuses: TaskStatus[];
  selectedCategories: TaskCategory[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
  searchQuery: string;
}

export interface TasksState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

export type DateRangePreset = '7days' | '30days' | 'all';

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface TimelineDataPoint {
  date: string;
  count: number;
}
