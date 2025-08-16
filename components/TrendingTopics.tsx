import React from 'react';
import { Topic } from '../types';

interface TrendingTopicsProps {
  topics: Topic[];
  loading?: boolean;
}

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics, loading }) => {
  if (loading) {
    return <div className="w-full h-32 bg-[#10182b] rounded-xl animate-pulse" style={{ fontFamily: 'Inter, sans-serif' }} />;
  }
  return (
    <div className="w-full bg-[#10182b] rounded-xl p-4 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 className="text-lg font-semibold mb-2 text-white">Trending Topics</h3>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <span
            key={topic.name}
            className="px-3 py-1 rounded-full bg-[#18213a] text-blue-300 font-medium text-xs shadow hover:bg-[#0052FF] hover:text-white transition-all cursor-pointer animate-fade-in"
            style={{ fontSize: `${Math.min(1.2 + topic.count / 20, 2)}rem` }}
          >
            #{topic.name}
          </span>
        ))}
      </div>
    </div>
  );
};
