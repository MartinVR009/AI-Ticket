import React from 'react';
import { TicketPriority } from '../types';

interface PriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const getPriorityConfig = (pri: TicketPriority) => {
    switch (pri) {
      case 'High':
        return {
          label: 'Alta',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500'
        };
      case 'Medium':
        return {
          label: 'Media',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'Low':
        return {
          label: 'Baja',
          color: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-400'
        };
      default:
        return {
          label: pri,
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          dot: 'bg-gray-400'
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-md border ${config.color} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <span>{config.label}</span>
    </span>
  );
};
