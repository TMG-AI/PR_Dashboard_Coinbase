import React from 'react';
import { FilterState } from '../types';

interface FilterPanelProps {
  filter: FilterState;
  onChange: (filter: FilterState) => void;
  className?: string;
}

const platforms = ['All', 'Twitter', 'Reddit', 'News', 'Blog'];
const sentiments = [
  { label: 'Show All', value: 'all' },
  { label: 'Positive Only', value: 'positive' },
  { label: 'Negative Only', value: 'negative' },
];

export const FilterPanel: React.FC<FilterPanelProps> = ({ filter, onChange, className }) => {
  return (
    <div className={`flex flex-wrap gap-4 items-center ${className || ''}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Platform Filter */}
      <div className="flex gap-1">
        {platforms.map((p) => (
          <button
            key={p}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition border border-transparent ${filter.platform === p ? 'bg-[#0052FF] text-white' : 'bg-[#10182b] text-gray-300 hover:bg-[#18213a]'}`}
            onClick={() => onChange({ ...filter, platform: p as any })}
          >
            {p}
          </button>
        ))}
      </div>
      {/* Sentiment Filter */}
      <div className="flex gap-1">
        {sentiments.map((s) => (
          <button
            key={s.value}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition border border-transparent ${filter.sentiment === s.value ? 'bg-[#0052FF] text-white' : 'bg-[#10182b] text-gray-300 hover:bg-[#18213a]'}`}
            onClick={() => onChange({ ...filter, sentiment: s.value as any })}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};
