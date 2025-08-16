import React from 'react';

interface ConnectionStatusProps {
  status: 'connected' | 'connecting' | 'error';
}

const statusColor = {
  connected: 'bg-green-400',
  connecting: 'bg-yellow-400',
  error: 'bg-red-500',
};
const statusText = {
  connected: 'Connected',
  connecting: 'Connecting...',
  error: 'Error',
};

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => (
  <span className="flex items-center gap-1 ml-4">
    <span className={`w-3 h-3 rounded-full ${statusColor[status]}`} />
    <span className="text-xs text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>{statusText[status]}</span>
  </span>
);
