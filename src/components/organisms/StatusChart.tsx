import React, { useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card } from '../atoms/Card';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectStatusDistribution } from '../../store/selectors';
import { toggleStatus } from '../../store/slices/filterSlice';
import type { TaskStatus } from '../../types';
import { capitalize } from '../../utils/helper-fns';







export const StatusChart = React.memo(() => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(selectStatusDistribution);
  const selectedStatuses = useAppSelector(state => state.filters.selectedStatuses);

  const handleClick = useCallback(
    (entry: any) => {
      dispatch(toggleStatus(entry.name as TaskStatus));
    },
    [dispatch]
  );

  const renderLegend = (props:any) => {
  const { payload } = props;
  console.log("Payload",payload);

  return (
    <div className='flex flex-row justify-center gap-9 flex-wrap'>
      {
        payload.map((entry:any, index:any) => (
          <div key={`item-${index}`} className='flex align-middle'><span className={`h-4 w-4 inline-flex my-auto mx-2 `} style={{backgroundColor:`${entry.color}`,borderRadius:"50%"}}></span> {capitalize(entry.value)}</div>
        ))
      }
    </div>
  );
}


  if (data.length === 0) {
    return (
      <Card title="Status Distribution">
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available
        </div>
      </Card>
    );
  }

  return (
    <Card title="Status Distribution">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={entry => `${capitalize(entry.name)}: ${entry.value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onClick={handleClick}
            style={{ cursor: 'pointer',outline:'none' }}
            innerRadius={60} 
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill}
                stroke={selectedStatuses.includes(entry.name as TaskStatus) ? '#9333ea' : 'none'}
                strokeWidth={selectedStatuses.includes(entry.name as TaskStatus) ? 6 : 0}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 text-center mt-2">
        Click segments to filter table {selectedStatuses.length > 0 && `(${selectedStatuses.length} selected)`}
      </p>
    </Card>
  );
});

StatusChart.displayName = 'StatusChart';
