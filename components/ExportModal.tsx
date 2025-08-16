import React, { useState } from 'react';
import { ExportType } from '../types';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (type: ExportType, withSummary: boolean, email?: string) => void;
  loading?: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({ open, onClose, onExport, loading }) => {
  const [type, setType] = useState<ExportType>('pdf');
  const [withSummary, setWithSummary] = useState(false);
  const [email, setEmail] = useState('');

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
      <div className="bg-[#10182b] rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-slide-up" style={{ fontFamily: 'Inter, sans-serif' }}>
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-lg font-bold text-white mb-4">Export Report</h2>
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Export Type</label>
          <select
            className="w-full px-3 py-2 rounded-lg bg-[#18213a] text-white border-none focus:ring-2 focus:ring-[#0052FF]"
            value={type}
            onChange={e => setType(e.target.value as ExportType)}
          >
            <option value="pdf">PDF (with charts as images)</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </select>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="summary"
            checked={withSummary}
            onChange={e => setWithSummary(e.target.checked)}
            className="accent-[#0052FF]"
          />
          <label htmlFor="summary" className="text-xs text-gray-400">Include Executive Summary</label>
        </div>
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">Email Report (optional)</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-lg bg-[#18213a] text-white border-none focus:ring-2 focus:ring-[#0052FF]"
            placeholder="Enter email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button
          className="w-full py-2 rounded-lg bg-[#0052FF] text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          onClick={() => onExport(type, withSummary, email)}
          disabled={loading}
        >
          {loading ? 'Exporting...' : 'Export Report'}
        </button>
      </div>
    </div>
  );
};
