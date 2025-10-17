import React, { useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '../atoms/Card';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCategoryDistribution } from '../../store/selectors';
import { toggleCategory } from '../../store/slices/filterSlice';
import type { TaskCategory } from '../../types';

export const CategoryChart = React.memo(() => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectCategoryDistribution);
  const selectedCategories = useAppSelector(state => state.filters.selectedCategories);

  const handleClick = useCallback(
    (entry: any) => {
      dispatch(toggleCategory(entry.name as TaskCategory));
    },
    [dispatch]
  );

  if (data.length === 0) {
    return (
      <Card title="Category Distribution">
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card title="Category Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={entry => `${entry.name}: ${entry.value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                stroke={selectedCategories.includes(entry.name as TaskCategory) ? '#000' : 'none'}
                strokeWidth={selectedCategories.includes(entry.name as TaskCategory) ? 2 : 0}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 text-center mt-2">
        Click segments to filter table {selectedCategories.length > 0 && `(${selectedCategories.length} selected)`}
      </p>
    </Card>
  );
});

CategoryChart.displayName = 'CategoryChart';
