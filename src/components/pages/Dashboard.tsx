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
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
  {/* Header Section */}
  <div className="bg-white shadow-sm">
    <div className="max-w-[1400px] mx-auto px-8 py-2">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-bold text-gray-900 mb-0.5">Interactive Dashboard</h1>
          <p className="text-[9px] text-gray-600 leading-tight max-w-4xl">
            Click chart segments or bars to filter the data table. Multiple selections within the same chart use OR logic; selections across different charts use AND logic.
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="max-w-[1400px] mx-auto px-8 py-2">

    {/* Filters Section */}
    <div className="bg-gradient-to-r from-gray-50/80 to-purple-50/60 backdrop-blur-md rounded-2xl px-4 py-1.5 mb-2 border border-gray-200/40">
      <div className="flex items-center justify-between gap-2 min-h-[26px]">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <ActiveFilters />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[7px] text-gray-500 font-medium whitespace-nowrap">13 of 250 items</span>
          <button
            onClick={handleClearFilters}
            className="text-[7px] font-semibold text-gray-700 transition-colors underline decoration-1 underline-offset-2 whitespace-nowrap"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>

    {/* Charts Grid */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-2">
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
