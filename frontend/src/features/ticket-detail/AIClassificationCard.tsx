import React from 'react';
import { useMutation } from '@apollo/client';
import { CLASSIFY_TICKET } from '../../core/graphql/mutations';
import { GET_TICKET_DETAIL, GET_TICKETS } from '../../core/graphql/queries';
import { Ticket } from '../../shared/types';
import { Badge } from '../../shared/components/Badge';
import { PriorityBadge } from '../../shared/components/PriorityBadge';
import { Sparkles, RefreshCw, CheckCircle } from 'lucide-react';

interface AIClassificationCardProps {
  ticket: Ticket;
  onClassified?: () => void;
}

export const AIClassificationCard: React.FC<AIClassificationCardProps> = ({ ticket, onClassified }) => {
  const [classifyTicket, { loading }] = useMutation(CLASSIFY_TICKET, {
    refetchQueries: [
      { query: GET_TICKET_DETAIL, variables: { id: ticket.id } },
      { query: GET_TICKETS }
    ]
  });

  const handleRunAI = async () => {
    try {
      await classifyTicket({
        variables: { input: { ticketId: ticket.id } }
      });
      onClassified?.();
    } catch (err) {
      console.error('Error al clasificar ticket:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-brand-50/60 to-slate-50 rounded-xl border border-brand-200/80 p-4 relative overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-500 text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Análisis Inteligente por IA (Gemini)
          </h4>
        </div>

        <button
          id="btn-trigger-ai"
          onClick={handleRunAI}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-brand-300 text-brand-700 hover:bg-brand-50 shadow-2xs transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          <span>{loading ? 'Analizando...' : 'Re-clasificar con IA'}</span>
        </button>
      </div>

      {/* Badges de Categoría y Prioridad */}
      <div className="flex flex-wrap items-center gap-2.5 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Categoría:</span>
          <Badge category={ticket.category} />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-500 font-medium">Prioridad:</span>
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* Resumen generado por IA */}
      <div>
        <p className="text-xs font-semibold text-slate-600 mb-1">Resumen Ejecutivo:</p>
        <p className="text-xs text-slate-800 bg-white/80 p-2.5 rounded-lg border border-brand-100 font-medium leading-relaxed">
          {ticket.summary ? ticket.summary : 'Pendiente de clasificación por IA.'}
        </p>
      </div>
    </div>
  );
};
