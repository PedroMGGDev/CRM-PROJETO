import React from 'react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartContainer({ 
  title, 
  children, 
  className = 'h-64' 
}: ChartContainerProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className={className}>
        {children}
      </div>
    </div>
  );
}