import React from 'react';
import { MediaCoverage } from '../types';

interface MediaTableProps {
  data: MediaCoverage[];
  loading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

const sentimentColor = {
  positive: 'text-green-400',
  neutral: 'text-gray-400',
  negative: 'text-red-400',
};

function formatReach(num: number) {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}

export const MediaTable: React.FC<MediaTableProps> = ({ data, loading, page, pageSize, total, onPageChange }) => {
  if (loading) {
    return <div className="w-full h-64 bg-[#10182b] rounded-xl animate-pulse" style={{ fontFamily: 'Inter, sans-serif' }} />;
  }
  return (
    <div className="w-full bg-[#10182b] rounded-xl p-4 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">Recent Media Coverage</h3>
        <div className="flex gap-2">
          <button className="px-2 py-1 text-xs bg-[#0052FF] rounded text-white font-medium hover:bg-blue-700 transition">PDF</button>
          <button className="px-2 py-1 text-xs bg-[#0052FF] rounded text-white font-medium hover:bg-blue-700 transition">CSV</button>
          <button className="px-2 py-1 text-xs bg-[#0052FF] rounded text-white font-medium hover:bg-blue-700 transition">Excel</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2 px-3 text-left">Time</th>
              <th className="py-2 px-3 text-left">Publication</th>
              <th className="py-2 px-3 text-left">Headline</th>
              <th className="py-2 px-3 text-left">Sentiment</th>
              <th className="py-2 px-3 text-left">Reach</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b border-[#1a233a] hover:bg-[#18213a] transition">
                <td className="py-2 px-3 text-gray-300 whitespace-nowrap">{row.time}</td>
                <td className="py-2 px-3 text-white font-medium whitespace-nowrap">{row.publication}</td>
                <td className="py-2 px-3 text-blue-400 underline whitespace-nowrap"><a href={row.url} target="_blank" rel="noopener noreferrer">{row.headline}</a></td>
                <td className={"py-2 px-3 font-semibold " + sentimentColor[row.sentiment]}>{row.sentiment.charAt(0).toUpperCase() + row.sentiment.slice(1)}</td>
                <td className="py-2 px-3 text-gray-300">{formatReach(row.reach)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-gray-400">Page {page} of {Math.ceil(total / pageSize)}</span>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 text-xs bg-[#18213a] rounded text-gray-300 hover:bg-[#232b45] transition"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="px-2 py-1 text-xs bg-[#18213a] rounded text-gray-300 hover:bg-[#232b45] transition"
            onClick={() => onPageChange(page + 1)}
            disabled={page === Math.ceil(total / pageSize)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
