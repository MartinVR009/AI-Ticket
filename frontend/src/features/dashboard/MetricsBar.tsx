import React from 'react';
import { Ticket } from '../../shared/types';
import { Inbox, AlertCircle, Clock, CheckCircle2, Flame } from 'lucide-react';

interface MetricsBarProps {
  tickets: Ticket[];
  totalCount: number;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ tickets, totalCount }) => {
  const openCount = tickets.filter((t) => t.status === 'open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length;
  const highPriorityCount = tickets.filter((t) => t.priority === 'High').length;

  const cards = [
    {
      label: 'Total Tickets',
      value: totalCount,
      icon: Inbox,
      color: 'text-slate-700 bg-slate-100',
      border: 'border-slate-200'
    },
    {
      label: 'Abiertos',
      value: openCount,
      icon: AlertCircle,
      color: 'text-emerald-700 bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      label: 'En Progreso',
      value: inProgressCount,
      icon: Clock,
      color: 'text-blue-700 bg-blue-50',
      border: 'border-blue-200'
    },
    {
      label: 'Resueltos',
      value: resolvedCount,
      icon: CheckCircle2,
      color: 'text-purple-700 bg-purple-50',
      border: 'border-purple-200'
    },
    {
      label: 'Alta Prioridad',
      value: highPriorityCount,
      icon: Flame,
      color: 'text-rose-700 bg-rose-50',
      border: 'border-rose-200'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 my-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`bg-white p-4 rounded-xl border ${card.border} shadow-sm hover:shadow transition-shadow flex items-center justify-between`}
          >
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
