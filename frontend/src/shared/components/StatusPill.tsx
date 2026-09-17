import React from 'react';
import { TicketStatus } from '../types';

interface StatusPillProps {
  status: TicketStatus;
  className?: string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, className = '' }) => {
  const getStatusConfig = (st: TicketStatus) => {
    switch (st) {
      case 'open':
        return {
          label: 'Abierto',
          bg: 'bg-emerald-100 text-emerald-800'
        };
      case 'in_progress':
        return {
          label: 'En Progreso',
          bg: 'bg-blue-100 text-blue-800'
        };
      case 'resolved':
        return {
          label: 'Resuelto',
          bg: 'bg-purple-100 text-purple-800'
        };
      case 'closed':
        return {
          label: 'Cerrado',
          bg: 'bg-slate-200 text-slate-700'
        };
      default:
        return {
          label: st,
          bg: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${config.bg} ${className}`}>
      {config.label}
    </span>
  );
};
