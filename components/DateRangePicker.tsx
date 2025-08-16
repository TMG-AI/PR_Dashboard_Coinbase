import React from 'react';

interface DateRangePickerProps {
  value: '24h' | '7d' | '30d' | 'custom';
  onChange: (val: '24h' | '7d' | '30d' | 'custom') => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange, className }) => {
  return (
    <div className={`flex items-center gap-2 ${className || ''}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      <button
        className={`px-3 py-1 rounded-lg text-xs font-medium transition border border-transparent ${value === '24h' ? 'bg-[#0052FF] text-white' : 'bg-[#10182b] text-gray-300 hover:bg-[#18213a]'}`}
        onClick={() => onChange('24h')}
      >
        Last 24h
      </button>
      <button
        className={`px-3 py-1 rounded-lg text-xs font-medium transition border border-transparent ${value === '7d' ? 'bg-[#0052FF] text-white' : 'bg-[#10182b] text-gray-300 hover:bg-[#18213a]'}`}
        onClick={() => onChange('7d')}
      >
        7 days
      </button>
      <button
        className={`px-3 py-1 rounded-lg text-xs font-medium transition border border-transparent ${value === '30d' ? 'bg-[#0052FF] text-white' : 'bg-[#10182b] text-gray-300 hover:bg-[#18213a]'}`}
        onClick={() => onChange('30d')}
      >
        30 days
      </button>
      <button
        className={`px-3 py-1 rounded-lg text-xs font-medium transition border border-transparent ${value === 'custom' ? 'bg-[#0052FF] text-white' : 'bg-[#10182b] text-gray-300 hover:bg-[#18213a]'}`}
        onClick={() => onChange('custom')}
      >
        Custom
      </button>
    </div>
  );
};
