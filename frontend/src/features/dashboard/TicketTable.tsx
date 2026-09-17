import React from 'react';
import { Ticket } from '../../shared/types';
import { Badge } from '../../shared/components/Badge';
import { PriorityBadge } from '../../shared/components/PriorityBadge';
import { StatusPill } from '../../shared/components/StatusPill';
import { User, Paperclip, ChevronRight, Sparkles, Inbox } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  onSelectTicket: (ticket: Ticket) => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({ tickets, onSelectTicket }) => {
  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No se encontraron tickets</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          No hay tickets que coincidan con los filtros aplicados o la base de datos está vacía.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('es-CO', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Ticket</th>
              <th className="py-3.5 px-4">Categoría & IA</th>
              <th className="py-3.5 px-4">Prioridad</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4">Responsable</th>
              <th className="py-3.5 px-4">Fecha</th>
              <th className="py-3.5 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => onSelectTicket(ticket)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                {/* Info Cliente & Resumen */}
                <td className="py-4 px-4">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-mono text-slate-400 mt-0.5">#{ticket.id}</span>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors flex items-center gap-1.5">
                        <span>{ticket.customerName}</span>
                        {ticket.attachmentUrl && (
                          <span title="Archivo adjunto disponible">
                            <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 max-w-md">
                        {ticket.summary || ticket.requestText}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Categoría IA */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <Badge category={ticket.category} />
                </td>

                {/* Prioridad */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <PriorityBadge priority={ticket.priority} />
                </td>

                {/* Estado */}
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusPill status={ticket.status} />
                </td>

                {/* Responsable */}
                <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                  {ticket.owner ? (
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ticket.owner}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Sin asignar</span>
                  )}
                </td>

                {/* Fecha */}
                <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                  {formatDate(ticket.createdAt)}
                </td>

                {/* Acción */}
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTicket(ticket);
                    }}
                    className="p-1 text-slate-400 group-hover:text-brand-600 rounded hover:bg-slate-100 transition-colors"
                    title="Ver detalle"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
