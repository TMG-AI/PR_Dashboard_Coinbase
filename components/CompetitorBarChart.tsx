import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { CompetitorData } from '../types';

interface CompetitorBarChartProps {
  data: CompetitorData[];
  loading?: boolean;
}

const COLORS = ['#0052FF', '#64748b', '#a855f7'];

export const CompetitorBarChart: React.FC<CompetitorBarChartProps> = ({ data, loading }) => {
  if (loading) {
    return <div className="w-full h-40 bg-[#10182b] rounded-xl animate-pulse" style={{ fontFamily: 'Inter, sans-serif' }} />;
  }
  return (
    <div className="w-full h-40 bg-[#10182b] rounded-xl p-4 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1a233a" strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fill: '#b3b8c5', fontSize: 12 }} />
          <YAxis tick={{ fill: '#b3b8c5', fontSize: 12 }} allowDecimals={false} />
          <Tooltip contentStyle={{ background: '#10182b', border: 'none', color: '#fff' }} />
          <Bar dataKey="mentions" radius={[6, 6, 0, 0]}>
            {data.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
