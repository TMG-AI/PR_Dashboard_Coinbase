import React from 'react';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface LineChartProps {
  data: { time: string; value: number }[];
  color?: string;
  loading?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({ data, color = '#0052FF', loading }) => {
  if (loading) {
    return (
      <div className="w-full h-64 bg-[#10182b] rounded-xl animate-pulse" style={{ fontFamily: 'Inter, sans-serif' }} />
    );
  }
  return (
    <div className="w-full h-64 bg-[#10182b] rounded-xl p-4 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReLineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1a233a" strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fill: '#b3b8c5', fontSize: 12 }} />
          <YAxis tick={{ fill: '#b3b8c5', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: '#10182b', border: 'none', color: '#fff' }} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={false} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
};
