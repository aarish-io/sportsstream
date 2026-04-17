import React from 'react';
import { ConnectionStatus } from '../types.ts';

interface StatusIndicatorProps {
  status: ConnectionStatus;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const getConfig = () => {
    switch (status) {
      case 'connected':
        return { color: 'bg-emerald-500', text: 'Connected' };
      case 'connecting':
        return { color: 'bg-amber-500', text: 'Connecting...' };
      case 'reconnecting':
        return { color: 'bg-orange-500', text: 'Reconnecting...' };
      case 'error':
        return { color: 'bg-red-500', text: 'Updates unavailable' };
      default:
        return { color: 'bg-stone-400', text: 'Offline' };
    }
  };

  const config = getConfig();

  return (
    <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-stone-200">
      <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
      <span className="text-xs font-medium text-stone-700">{config.text}</span>
    </div>
  );
};