import React, { useCallback, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card } from '../atoms/Card';
import { DateRangeSelector } from '../molecules/DateRangeSelector';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectTimelineData, selectTimelineDataUnfiltered } from '../../store/selectors';
import { setDateRange } from '../../store/slices/filterSlice';
import { format, parseISO } from 'date-fns';

export const TimelineChart = React.memo(() => {
  const dispatch = useAppDispatch();
  const filteredData = useAppSelector(selectTimelineData);
  const unfilteredData = useAppSelector(selectTimelineDataUnfiltered);
  const currentDateRange = useAppSelector(state => state.filters.dateRange);
  const [clickStart, setClickStart] = useState<string | null>(null);
  const [lastDateRange, setLastDateRange] = useState(currentDateRange);

  // Use unfiltered data during selection, filtered data otherwise
  const data = clickStart ? unfilteredData : filteredData;

  // Reset clickStart when date range changes externally (preset buttons)
  useEffect(() => {
    if (
      currentDateRange.start !== lastDateRange.start ||
      currentDateRange.end !== lastDateRange.end
    ) {
      setClickStart(null);
      setLastDateRange(currentDateRange);
    }
  }, [currentDateRange, lastDateRange]);

  const handleBarClick = useCallback(
    (entry: any) => {
      const clickedDate = entry.date;
      
      if (!clickStart) {
        // First click - set start date only (no end date yet)
        setClickStart(clickedDate);
        // Don't dispatch yet, just store the start date locally
      } else {
        // Second click - only allow dates >= start date
        if (clickedDate >= clickStart) {
          // Now set both start and end dates
          dispatch(setDateRange({ start: clickStart, end: clickedDate }));
          setClickStart(null);
        }
        // If clicked date is before start, ignore the click
      }
    },
    [dispatch, clickStart]
  );

  const handleResetSelection = useCallback(() => {
    setClickStart(null);
  }, []);

  const formatXAxis = useCallback((dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  }, []);

  // Determine bar colors based on selection state
  const getBarColor = useCallback(
    (date: string) => {
      if (clickStart) {
        // Selection in progress - show temporary state
        if (date === clickStart) {
          return '#1d4ed8'; // Dark blue for start date
        } else if (date > clickStart) {
          return '#60a5fa'; // Medium blue for valid selection (after start)
        } else {
          return '#d1d5db'; // Gray for invalid (before start)
        }
      } else {
        // No selection in progress - show applied filter state
        if (currentDateRange.start && currentDateRange.end) {
          // Show selected range
          if (date >= currentDateRange.start && date <= currentDateRange.end) {
            return '#9333ea'; // Blue for selected range
          }
        }
        return '#9333ea'; // Light blue for unselected
      }
    },
    [clickStart, currentDateRange]
  );

  if (data.length === 0) {
    return (
      <Card title="Timeline">
        <div className="mb-4">
          <DateRangeSelector />
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card title="Timeline" className='relative'>

      <div className="mb-4 flex items-center justify-between absolute right-4 top-4">
        <DateRangeSelector />
        {clickStart && (
          <button
            onClick={handleResetSelection}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Cancel
          </button>
        )}
      </div>
      <ResponsiveContainer width="100%" className={"-ml-6"} height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatXAxis} />
          <YAxis />
          <Tooltip
            labelFormatter={dateStr => format(parseISO(dateStr as string), 'MMM dd, yyyy')}
          />
          <Bar dataKey="count" onClick={handleBarClick} style={{ cursor: 'pointer' }}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.date)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 text-center mt-2">
        {clickStart
          ? `Start: ${format(parseISO(clickStart), 'MMM dd, yyyy')} - Click a bar AFTER this date to set end date (or click same date for single day)`
          : currentDateRange.start && currentDateRange.end
          ? `Showing: ${format(parseISO(currentDateRange.start), 'MMM dd')} - ${format(parseISO(currentDateRange.end), 'MMM dd, yyyy')} | Click a bar to change range`
          : 'Click a bar to start selecting date range'}
      </p>
    </Card>
  );
});

TimelineChart.displayName = 'TimelineChart';
