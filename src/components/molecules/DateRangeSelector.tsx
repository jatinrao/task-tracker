import React, { useCallback } from 'react';
import { Button } from '../atoms/Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDateRange } from '../../store/slices/filterSlice';
import { subDays, format } from 'date-fns';
import type { DateRangePreset } from '../../types';

export const DateRangeSelector = React.memo(() => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector(state => state.filters.dateRange);

  const handlePreset = useCallback(
    (preset: DateRangePreset) => {
      const today = new Date();
      let start: string | null = null;
      let end: string | null = format(today, 'yyyy-MM-dd');

      switch (preset) {
        case '7days':
          start = format(subDays(today, 7), 'yyyy-MM-dd');
          break;
        case '30days':
          start = format(subDays(today, 30), 'yyyy-MM-dd');
          break;
        case 'all':
          start = null;
          end = null;
          break;
      }

      dispatch(setDateRange({ start, end }));
    },
    [dispatch]
  );

  const isActive = useCallback(
    (preset: DateRangePreset) => {
      const today = format(new Date(), 'yyyy-MM-dd');
      switch (preset) {
        case '7days':
          return (
            dateRange.start === format(subDays(new Date(), 7), 'yyyy-MM-dd') &&
            dateRange.end === today
          );
        case '30days':
          return (
            dateRange.start === format(subDays(new Date(), 30), 'yyyy-MM-dd') &&
            dateRange.end === today
          );
        case 'all':
          return !dateRange.start && !dateRange.end;
        default:
          return false;
      }
    },
    [dateRange]
  );

  return (
    <div className="flex gap-2">
      <Button
        variant={isActive('7days') ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => handlePreset('7days')}
      >
        Last 7 Days
      </Button>
      <Button
        variant={isActive('30days') ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => handlePreset('30days')}
      >
        Last 30 Days
      </Button>
      <Button
        variant={isActive('all') ? 'primary' : 'secondary'}
        size="sm"
        onClick={() => handlePreset('all')}
      >
        All Time
      </Button>
    </div>
  );
});

DateRangeSelector.displayName = 'DateRangeSelector';
