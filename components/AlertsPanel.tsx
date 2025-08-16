import React, { useState } from 'react';
import { CrisisAlert } from '../types';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface AlertsPanelProps {
  alerts: CrisisAlert[];
  loading?: boolean;
}

const levelColor = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
};

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, loading }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return <div className="w-full h-48 bg-[#10182b] rounded-xl animate-pulse" style={{ fontFamily: 'Inter, sans-serif' }} />;
  }

  return (
    <div className="w-full bg-[#10182b] rounded-xl p-4 shadow-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
      <h3 className="text-lg font-semibold mb-2 text-white">Crisis Alerts</h3>
      <ul className="space-y-2">
        {alerts.map((alert) => (
          <li key={alert.id} className="border border-[#1a233a] rounded-lg">
            <button
              className="w-full flex items-center justify-between p-3 focus:outline-none hover:bg-[#18213a] transition-colors rounded-lg"
              onClick={() => setExpanded(expanded === alert.id ? null : alert.id)}
            >
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-3 ${levelColor[alert.level]}`} />
                <span className="font-medium text-white">{alert.title}</span>
                <span className="ml-3 text-xs text-gray-400">{alert.time}</span>
              </div>
              {expanded === alert.id ? (
                <ChevronUpIcon className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expanded === alert.id && (
              <div className="p-3 pt-0 text-gray-300 text-sm animate-fade-in">
                {alert.description}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
