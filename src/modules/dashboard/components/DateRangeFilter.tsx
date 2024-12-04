import React from 'react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data Inicial
          </label>
          <input
            type="date"
            value={startDate.split('T')[0]}
            onChange={(e) => onStartDateChange(new Date(e.target.value).toISOString())}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Data Final
          </label>
          <input
            type="date"
            value={endDate.split('T')[0]}
            onChange={(e) => onEndDateChange(new Date(e.target.value).toISOString())}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}