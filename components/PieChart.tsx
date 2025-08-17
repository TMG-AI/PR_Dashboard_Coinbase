import React from 'react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Sentiment } from '../types';

interface PieChartProps {
  data: Sentiment;
  loading?: boolean;
}

const COLORS = ['#22c55e', '#64748b', '#ef4444'];
const LABELS = ['Positive', 'Neutral', 'Negative'];

export const PieChart: React.FC<PieChartProps> = ({ data, loading }) => {
  if (loading) {
    return <div className="w-full h-64 bg-[#10182b] rounded-xl animate-pulse" style={{ fontFamily: 'Inter, sans-serif' }} />;
  }
  const chartData = [
    { name: 'Positive', value: data.positive },
    { name: 'Neutral', value: data.neutral },
    { name: 'Negative', value: data.negative },
  ];
  return (
    <div className="w-full h-64 bg-[#10182b] rounded-xl p-4 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={60}
            innerRadius={35}
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {chartData.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ background: '#10182b', border: 'none', color: '#fff' }} />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
};
