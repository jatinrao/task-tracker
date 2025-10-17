import React from 'react';
import { Card } from '../atoms/Card';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const StatsCard = React.memo<StatsCardProps>(({ title, value, subtitle, icon }) => {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {icon && <div className="text-gray-400">{icon}</div>}
    </Card>
  );
});

StatsCard.displayName = 'StatsCard';
