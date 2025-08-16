import React from 'react';
import { CrisisAlert } from '../types';

interface AlertModalProps {
  alert: CrisisAlert | null;
  open: boolean;
  onClose: () => void;
  onResolve: (id: string) => void;
}

const severityColor = {
  critical: 'bg-red-700',
  high: 'bg-red-500',
  medium: 'bg-yellow-400',
  low: 'bg-green-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
};

export const AlertModal: React.FC<AlertModalProps> = ({ alert, open, onClose, onResolve }) => {
  if (!open || !alert) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 animate-fade-in">
      <div className="bg-[#10182b] rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-slide-up" style={{ fontFamily: 'Inter, sans-serif' }}>
        <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={onClose}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="flex items-center gap-3 mb-4">
          <span className={`w-4 h-4 rounded-full ${severityColor[alert.level]}`} />
          <span className="text-lg font-bold text-white">{alert.title}</span>
        </div>
        <div className="mb-2 text-gray-300 text-sm">{alert.description}</div>
        <div className="mb-2 text-xs text-gray-400">Severity: <span className="font-semibold text-white">{alert.level}</span></div>
        <div className="mb-2 text-xs text-gray-400">Source: <span className="font-semibold text-white">{alert.source || 'System'}</span></div>
        <div className="mb-4 text-xs text-gray-400">Timestamp: <span className="font-semibold text-white">{alert.time}</span></div>
        <button
          className="w-full py-2 rounded-lg bg-[#0052FF] text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          onClick={() => onResolve(alert.id)}
          disabled={alert.resolved}
        >
          {alert.resolved ? 'Resolved' : 'Mark as Resolved'}
        </button>
      </div>
    </div>
  );
};
