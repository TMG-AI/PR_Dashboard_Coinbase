import React from 'react';
import { ArrowDownTrayIcon, DocumentTextIcon, TableCellsIcon } from '@heroicons/react/24/outline';

interface ExportButtonProps {
  type: 'pdf' | 'csv' | 'excel';
  onClick: () => void;
  loading?: boolean;
}

const icons = {
  pdf: DocumentTextIcon,
  csv: TableCellsIcon,
  excel: ArrowDownTrayIcon,
};

const labels = {
  pdf: 'PDF',
  csv: 'CSV',
  excel: 'Excel',
};

export const ExportButton: React.FC<ExportButtonProps> = ({ type, onClick, loading }) => {
  const Icon = icons[type];
  return (
    <button
      className="flex items-center gap-1 px-3 py-1 text-xs bg-[#0052FF] rounded text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
      onClick={onClick}
      disabled={loading}
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 mr-1 text-white" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : (
        <Icon className="w-4 h-4 mr-1" />
      )}
      {labels[type]}
    </button>
  );
};
