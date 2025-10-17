import React, { useEffect } from 'react';
import { StatusChart } from '../organisms/StatusChart';
import { CategoryChart } from '../organisms/CategoryChart';
import { TimelineChart } from '../organisms/TimelineChart';
import { TaskTable } from '../organisms/TaskTable';
import { StatsCard } from '../molecules/StatsCard';
import { ActiveFilters } from '../molecules/ActiveFilters';
import { Button } from '../atoms/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTasks, setLoading, setError } from '../../store/slices/tasksSlice';
import { clearFilters } from '../../store/slices/filterSlice';
import { selectTaskStats } from '../../store/selectors';
import { api } from '../../services/api';

export const Dashboard = React.memo(() => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectTaskStats);
  const totalTasks = useAppSelector(state => state.tasks.items.length);
  const loading = useAppSelector(state => state.tasks.loading);
  const error = useAppSelector(state => state.tasks.error);
  const hasFilters = useAppSelector(
    state =>
      state.filters.selectedStatuses.length > 0 ||
      state.filters.selectedCategories.length > 0 ||
      state.filters.dateRange.start ||
      state.filters.dateRange.end
  );

  useEffect(() => {
    const fetchTasks = async () => {
      dispatch(setLoading(true));
      try {
        const tasks = await api.getTasks();
        dispatch(setTasks(tasks));
      } catch (err) {
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch tasks'));
      }
    };

    fetchTasks();
  }, [dispatch]);

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-0">
          <h1 className="text-xl font-bold text-red mb-2">Interactive Dashboard</h1>
          <p className="text-gray-600">Click chart Segments or bar to filter data table. Multiple Selection within the same chart use OR logic, selections across component use AND logic. </p>
        </div>
        {/* TO-DO remove debugger  */}
        {/* Stats - debugger (Dev Only ) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title={hasFilters ? 'Filtered Tasks' : 'Total Tasks'}
            value={stats.total}
            subtitle={hasFilters ? `of ${totalTasks} total` : undefined}
          />
          <StatsCard title="To Do" value={stats.byStatus.todo} />
          <StatsCard title="In Progress" value={stats.byStatus.inProgress} />
          <StatsCard title="Done" value={stats.byStatus.done} />
        </div>

    
        <div className="mb-6">
          <ActiveFilters />
          <div className="flex justify-end mb-6">
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear All Filters
          </Button>
        </div>
        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <StatusChart />
          <CategoryChart />
          <TimelineChart />
        </div>

        <TaskTable />
      </div>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';
