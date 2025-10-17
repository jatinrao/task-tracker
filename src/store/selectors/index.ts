import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { ChartDataPoint, TimelineDataPoint } from '../../types';
import { isWithinInterval, parseISO, startOfDay, format } from 'date-fns';
export const selectTasks = (state: RootState) => state.tasks.items;
export const selectFilters = (state: RootState) => state.filters;
export const selectLoading = (state: RootState) => state.tasks.loading;
export const selectError = (state: RootState) => state.tasks.error;

export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) => {
    let filtered = tasks;

    // status filter
    if (filters.selectedStatuses.length > 0) {
      filtered = filtered.filter(task => filters.selectedStatuses.includes(task.status));
    }

    // category filter
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(task => filters.selectedCategories.includes(task.category));
    }

    // date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(task => {
        const taskDate = parseISO(task.date);
        const start = filters.dateRange.start ? parseISO(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? parseISO(filters.dateRange.end) : null;

        if (start && end) {
          return isWithinInterval(taskDate, { start, end });
        } else if (start) {
          return taskDate >= start;
        } else if (end) {
          return taskDate <= end;
        }
        return true;
      });
    }

    // search query filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task => task.title.toLowerCase().includes(query));
    }

    return filtered;
  }
);

//filtered by everything EXCEPT status
export const selectTasksExcludingStatusFilter = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) => {
    let filtered = tasks;

    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(task => filters.selectedCategories.includes(task.category));
    }

    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(task => {
        const taskDate = parseISO(task.date);
        const start = filters.dateRange.start ? parseISO(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? parseISO(filters.dateRange.end) : null;

        if (start && end) {
          return isWithinInterval(taskDate, { start, end });
        } else if (start) {
          return taskDate >= start;
        } else if (end) {
          return taskDate <= end;
        }
        return true;
      });
    }

    // search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task => task.title.toLowerCase().includes(query));
    }

    return filtered;
  }
);

export const selectStatusDistribution = createSelector([selectTasksExcludingStatusFilter], tasks => {
  const statusCounts = new Map<string, number>();
  
  tasks.forEach(task => {
    statusCounts.set(task.status, (statusCounts.get(task.status) || 0) + 1);
  });

  const colors: Record<string, string> = {
    todo: '#3b82f6',
    'in-progress': '#f59e0b',
    done: '#10b981',
    blocked: '#ef4444',
  };

  return Array.from(statusCounts.entries()).map(
    ([name, value]): ChartDataPoint => ({
      name,
      value,
      fill: colors[name] || '#6b7280',
    })
  );
});


export const selectTasksExcludingCategoryFilter = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) => {
    let filtered = tasks;

    if (filters.selectedStatuses.length > 0) {
      filtered = filtered.filter(task => filters.selectedStatuses.includes(task.status));
    }

    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(task => {
        const taskDate = parseISO(task.date);
        const start = filters.dateRange.start ? parseISO(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? parseISO(filters.dateRange.end) : null;

        if (start && end) {
          return isWithinInterval(taskDate, { start, end });
        } else if (start) {
          return taskDate >= start;
        } else if (end) {
          return taskDate <= end;
        }
        return true;
      });
    }

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task => task.title.toLowerCase().includes(query));
    }

    return filtered;
  }
);


export const selectCategoryDistribution = createSelector([selectTasksExcludingCategoryFilter], tasks => {
  const categoryCounts = new Map<string, number>();
  
  tasks.forEach(task => {
    categoryCounts.set(task.category, (categoryCounts.get(task.category) || 0) + 1);
  });

  const colors: Record<string, string> = {
    A: '#8b5cf6',
    B: '#06b6d4',
    C: '#ec4899',
    D: '#84cc16',
  };

  return Array.from(categoryCounts.entries()).map(
    ([name, value]): ChartDataPoint => ({
      name,
      value,
      fill: colors[name] || '#6b7280',
    })
  );
});


export const selectTasksForTimelineUnfiltered = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) => {
    let filtered = tasks;

    
    if (filters.selectedStatuses.length > 0) {
      filtered = filtered.filter(task => filters.selectedStatuses.includes(task.status));
    }

    
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(task => filters.selectedCategories.includes(task.category));
    }

    // TO_DO choose better state Bar selection 


    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task => task.title.toLowerCase().includes(query));
    }

    return filtered;
  }
);

export const selectTasksForTimeline = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) => {
    let filtered = tasks;

    
    if (filters.selectedStatuses.length > 0) {
      filtered = filtered.filter(task => filters.selectedStatuses.includes(task.status));
    }

    
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(task => filters.selectedCategories.includes(task.category));
    }

    
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(task => {
        const taskDate = parseISO(task.date);
        const start = filters.dateRange.start ? parseISO(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? parseISO(filters.dateRange.end) : null;

        if (start && end) {
          return isWithinInterval(taskDate, { start, end });
        } else if (start) {
          return taskDate >= start;
        } else if (end) {
          return taskDate <= end;
        }
        return true;
      });
    }

    
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(task => task.title.toLowerCase().includes(query));
    }

    return filtered;
  }
);


export const selectTimelineDataUnfiltered = createSelector([selectTasksForTimelineUnfiltered], tasks => {
  const dateCounts = new Map<string, number>();
  
  tasks.forEach(task => {
    const dateKey = format(startOfDay(parseISO(task.date)), 'yyyy-MM-dd');
    dateCounts.set(dateKey, (dateCounts.get(dateKey) || 0) + 1);
  });

  return Array.from(dateCounts.entries())
    .map(([date, count]): TimelineDataPoint => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
});


export const selectTimelineData = createSelector([selectTasksForTimeline], tasks => {
  const dateCounts = new Map<string, number>();
  
  tasks.forEach(task => {
    const dateKey = format(startOfDay(parseISO(task.date)), 'yyyy-MM-dd');
    dateCounts.set(dateKey, (dateCounts.get(dateKey) || 0) + 1);
  });

  return Array.from(dateCounts.entries())
    .map(([date, count]): TimelineDataPoint => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
});


export const selectTaskStats = createSelector([selectFilteredTasks], tasks => ({
  total: tasks.length,
  totalAmount: tasks.reduce((sum, task) => sum + task.amount, 0),
  byStatus: {
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  },
}));
