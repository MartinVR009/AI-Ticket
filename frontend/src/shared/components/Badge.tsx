import React from 'react';
import { TicketCategory } from '../types';

interface BadgeProps {
  category?: TicketCategory | null;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ category, className = '' }) => {
  const getCategoryStyles = (cat?: TicketCategory | null) => {
    switch (cat) {
      case 'Finance':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Legal':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Procurement':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Operations':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getCategoryIcon = (cat?: TicketCategory | null) => {
    switch (cat) {
      case 'Finance': return '💳';
      case 'Legal': return '⚖️';
      case 'Procurement': return '📦';
      case 'Operations': return '⚙️';
      default: return '📁';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${getCategoryStyles(
        category
      )} ${className}`}
    >
      <span>{getCategoryIcon(category)}</span>
      <span>{category || 'Sin Clasificar'}</span>
    </span>
  );
};
