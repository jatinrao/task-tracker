import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleStatus, toggleCategory, setDateRange } from '../../store/slices/filterSlice';
import type { TaskStatus, TaskCategory } from '../../types';
import { format, parseISO } from 'date-fns';

export const ActiveFilters = React.memo(() => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.filters);

  const handleRemoveStatus = useCallback(
    (status: TaskStatus) => {
      dispatch(toggleStatus(status));
    },
    [dispatch]
  );

  const handleRemoveCategory = useCallback(
    (category: TaskCategory) => {
      dispatch(toggleCategory(category));
    },
    [dispatch]
  );

  const handleRemoveDateRange = useCallback(() => {
    dispatch(setDateRange({ start: null, end: null }));
  }, [dispatch]);

  const hasFilters =
    filters.selectedStatuses.length > 0 ||
    filters.selectedCategories.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end;

  if (!hasFilters) {
    return null;
  }

  return (
    <div className="p-4">
      {/* <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-blue-900">Active Filters</h3>
      </div> */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Status Filters Group */}
        {filters.selectedStatuses.length > 0 && (
          <>
            <span className="text-[#9333ea] font-semibold">(</span>
            {filters.selectedStatuses.map((status, index) => (
              <React.Fragment key={status}>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  Status: {status}
                  <button
                    onClick={() => handleRemoveStatus(status)}
                    className="ml-1 hover:text-blue-900 focus:outline-none"
                    aria-label={`Remove ${status} filter`}
                  >
                    ×
                  </button>
                </span>
                {index < filters.selectedStatuses.length - 1 && (
                  <span className="text-gray-600  font-semibold text-sm">OR</span>
                )}
              </React.Fragment>
            ))}
            <span className="text-[#9333ea] font-semibold">)</span>
          </>
        )}

        {/* AND between Status and Category */}
        {filters.selectedStatuses.length > 0 && filters.selectedCategories.length > 0 && (
          <span className="text-[#9333ea] font-bold text-sm px-2">AND</span>
        )}

        {/* Category Filters Group */}
        {filters.selectedCategories.length > 0 && (
          <>
            <span className="text-[#9333ea] font-semibold">(</span>
            {filters.selectedCategories.map((category, index) => (
              <React.Fragment key={category}>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                  Category: {category}
                  <button
                    onClick={() => handleRemoveCategory(category)}
                    className="ml-1 hover:text-purple-900 focus:outline-none"
                    aria-label={`Remove ${category} filter`}
                  >
                    ×
                  </button>
                </span>
                {index < filters.selectedCategories.length - 1 && (
                  <span className="text-purple-600 font-semibold text-sm">OR</span>
                )}
              </React.Fragment>
            ))}
            <span className="text-[#9333ea] font-semibold">)</span>
          </>
        )}

        {/* AND between Category/Status and Date */}
        {(filters.selectedStatuses.length > 0 || filters.selectedCategories.length > 0) &&
          (filters.dateRange.start || filters.dateRange.end) && (
            <span className="text-[#9333ea] font-bold text-sm px-2">AND</span>
          )}

        {/* Date Range Filters Group */}
        {(filters.dateRange.start || filters.dateRange.end) && (
          <>
            <span className="text-[#9333ea] font-semibold">(</span>
            {filters.dateRange.start && (
              <>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Start: {format(parseISO(filters.dateRange.start), 'MMM dd, yyyy')}
                  <button
                    onClick={handleRemoveDateRange}
                    className="ml-1 hover:text-green-900 focus:outline-none"
                    aria-label="Remove date range filter"
                  >
                    ×
                  </button>
                </span>
                {filters.dateRange.end && (
                  <span className="text-green-600 font-semibold text-sm">AND</span>
                )}
              </>
            )}
            {filters.dateRange.end && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                End: {format(parseISO(filters.dateRange.end), 'MMM dd, yyyy')}
                <button
                  onClick={handleRemoveDateRange}
                  className="ml-1  hover:text-green-900 focus:outline-none"
                  aria-label="Remove date range filter"
                >
                  ×
                </button>
              </span>
            )}
            <span className="text-[#9333ea] font-semibold">)</span>
          </>
        )}
      </div>
    </div>
  );
});

ActiveFilters.displayName = 'ActiveFilters';
