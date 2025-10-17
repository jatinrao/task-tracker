import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card = React.memo<CardProps>(({ children, className = '', title }) => {
  return (
    <div className={`rounded-2xl bg-white shadow-md hover:shadow-lg hover:scale-105 transition-shadow duration-200  p-4 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>}
      {children}
    </div>
  );
});

Card.displayName = 'Card';
