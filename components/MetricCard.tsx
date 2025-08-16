import React from 'react';
import clsx from 'clsx';
import { ArrowUpRightIcon, ArrowDownRightIcon, MinusIcon } from '@heroicons/react/24/solid';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

const trendIcon = {
  up: ArrowUpRightIcon,
  down: ArrowDownRightIcon,
  neutral: MinusIcon,
};

const trendColor = {
  up: 'text-green-400',
  down: 'text-red-400',
  neutral: 'text-gray-400',
};

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, trend = 'neutral', color }) => {
  const Icon = trendIcon[trend];
  return (
    <div
      className={clsx(
        'flex flex-col justify-between p-6 rounded-xl shadow-lg bg-[#10182b] transition-transform duration-200 hover:scale-[1.03] hover:shadow-2xl',
        color ? color : ''
      )}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <span className="text-sm font-medium text-gray-400 mb-2">{title}</span>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-white">{value}</span>
        {typeof change === 'number' && (
          <span className={clsx('flex items-center ml-2 text-sm font-semibold', trendColor[trend])}>
            <Icon className="w-4 h-4 mr-1" />
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
};
