import React from 'react';
import type { TaskStatus, TaskCategory } from '../../types';

interface BadgeProps {
  type: 'status' | 'category';
  value: TaskStatus | TaskCategory;
}

export const Badge = React.memo<BadgeProps>(({ type, value }) => {
  const statusColors: Record<TaskStatus, string> = {
    todo: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    done: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800',
  };

  const categoryColors: Record<TaskCategory, string> = {
    A: 'bg-purple-100 text-purple-800',
    B: 'bg-cyan-100 text-cyan-800',
    C: 'bg-pink-100 text-pink-800',
    D: 'bg-lime-100 text-lime-800',
  };

  const colorClass =
    type === 'status' ? statusColors[value as TaskStatus] : categoryColors[value as TaskCategory];

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>{value}</span>
  );
});

Badge.displayName = 'Badge';
