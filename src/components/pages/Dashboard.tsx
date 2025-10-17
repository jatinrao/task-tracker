import React, { useEffect } from 'react';
import { StatusChart } from '../organisms/StatusChart';
import { CategoryChart } from '../organisms/CategoryChart';
import { TimelineChart } from '../organisms/TimelineChart';
import { TaskTable } from '../organisms/TaskTable';
import { ActiveFilters } from '../molecules/ActiveFilters';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setTasks, setLoading, setError } from '../../store/slices/tasksSlice';
import { clearFilters } from '../../store/slices/filterSlice';
import { api } from '../../services/api';
import { Header } from '../molecules/Header';

export const Dashboard = React.memo(() => {
  const dispatch = useAppDispatch();
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
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
  
  <Header/>
   {/* Filters Section */}
   {hasFilters && <div className="bg-gradient-to-r from-gray-50/80 to-purple-50/60 backdrop-blur-md  px-4 py-1.5 mb-2 border-b-[1px] border-gray-200">
      <div className="flex items-center justify-between gap-2 min-h-[26px]">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <ActiveFilters />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleClearFilters}
            className="text-md font-semibold text-gray-700 transition-colors underline decoration-1 underline-offset-2 whitespace-nowrap"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>}
  {/* Main Content */}
  <div className="max-w-[1400px] mx-auto px-8 py-2">

   

    {/* Charts Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
      <div className="rounded-2xl">
        <StatusChart />
      </div>
      <div className="rounded-2xl">
        <CategoryChart />
      </div>
      <div className="rounded-2xl">
        <TimelineChart />
      </div>
    </div>

    {/* Data Table */}
    <TaskTable />
  </div>
</div>

  );
});

Dashboard.displayName = 'Dashboard';
