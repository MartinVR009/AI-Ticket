import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TICKET_DETAIL, GET_TICKETS } from '../../core/graphql/queries';
import { UPDATE_TICKET } from '../../core/graphql/mutations';
import { Ticket, TicketStatus } from '../../shared/types';
import { AIClassificationCard } from './AIClassificationCard';
import { CommentsList } from './CommentsList';
import { AuditTrailView } from './AuditTrailView';
import {
  X,
  User,
  Paperclip,
  ExternalLink,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Clock
} from 'lucide-react';

interface TicketDetailModalProps {
  ticketId: string | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticketId, onClose }) => {
  const [status, setStatus] = useState<TicketStatus>('open');
  const [owner, setOwner] = useState<string>('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);
  const [ownerNotification, setOwnerNotification] = useState<string | null>(null);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  const { data, loading, refetch } = useQuery(GET_TICKET_DETAIL, {
    variables: { id: ticketId },
    skip: !ticketId,
    onCompleted: (res) => {
      if (res?.ticket) {
        setStatus(res.ticket.status);
        setOwner(res.ticket.owner || '');
      }
    }
  });

  const [updateTicket, { loading: updating }] = useMutation(UPDATE_TICKET, {
    refetchQueries: [
      { query: GET_TICKETS },
      { query: GET_TICKET_DETAIL, variables: { id: ticketId } }
    ]
  });

  const ticket: Ticket | undefined = data?.ticket;

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status);
      setOwner(ticket.owner || '');
    }
  }, [ticket]);

  if (!ticketId) return null;

  // Actualizar estado de forma inmediata
  const handleUpdateStatus = async (newStatus: TicketStatus) => {
    if (!ticket || newStatus === ticket.status) return;
    try {
      setStatus(newStatus);
      await updateTicket({
        variables: {
          input: {
            id: ticket.id,
            status: newStatus,
            owner: ticket.owner
          }
        }
      });
      setStatusNotification(`Estado actualizado a "${getStatusLabel(newStatus)}"`);
      setTimeout(() => setStatusNotification(null), 3000);
      refetch();
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  };

  // Asignar responsable de forma inmediata
  const handleAssignOwner = async (newOwner: string) => {
    if (!ticket) return;
    try {
      setOwner(newOwner);
      await updateTicket({
        variables: {
          input: {
            id: ticket.id,
            status: ticket.status,
            owner: newOwner.trim() || null
          }
        }
      });
      setOwnerNotification(`Responsable asignado: ${newOwner || 'Sin asignar'}`);
      setTimeout(() => setOwnerNotification(null), 3000);
      refetch();
    } catch (err) {
      console.error('Error al asignar responsable:', err);
    }
  };

  const getStatusLabel = (st: TicketStatus) => {
    switch (st) {
      case 'open': return 'Abierto';
      case 'in_progress': return 'En Progreso';
      case 'resolved': return 'Resuelto';
      case 'closed': return 'Cerrado';
      default: return st;
    }
  };

  const statusOptions: { value: TicketStatus; label: string; activeClass: string; inactiveClass: string }[] = [
    {
      value: 'open',
      label: 'Abierto',
      activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold',
      inactiveClass: 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
    },
    {
      value: 'in_progress',
      label: 'En Progreso',
      activeClass: 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold',
      inactiveClass: 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
    },
    {
      value: 'resolved',
      label: 'Resuelto',
      activeClass: 'bg-purple-600 text-white border-purple-600 shadow-xs font-bold',
      inactiveClass: 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-purple-50/50'
    },
    {
      value: 'closed',
      label: 'Cerrado',
      activeClass: 'bg-slate-700 text-white border-slate-700 shadow-xs font-bold',
      inactiveClass: 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
    }
  ];

  const quickAgents = ['Martín Vásquez', 'Carlos Mendoza', 'Dra. Marcela Rivas', 'Esteban Ruiz'];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-200 text-slate-800 font-bold">
              #{ticketId}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {ticket?.customerName || 'Cargando ticket...'}
              </h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Creado: {formatDate(ticket?.createdAt)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido con scroll */}
        {loading && !ticket ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500">Cargando detalles del ticket...</p>
          </div>
        ) : !ticket ? (
          <div className="p-12 text-center text-slate-500 text-sm">Ticket no encontrado</div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* 1. SECCIÓN: ACTUALIZAR ESTADO (● update ticket status) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-600" />
                  <span>1. Estado del Ticket (Clic para actualizar en tiempo real):</span>
                </label>
                {statusNotification && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{statusNotification}</span>
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={updating}
                    onClick={() => handleUpdateStatus(opt.value)}
                    className={`py-2 px-3 text-xs rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                      status === opt.value ? opt.activeClass : opt.inactiveClass
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${status === opt.value ? 'bg-white' : 'bg-slate-300'}`} />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. SECCIÓN: ASIGNAR RESPONSABLE (● assign an owner) */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>2. Asignar Responsable (Owner):</span>
                </label>
                {ownerNotification && (
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-in fade-in">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{ownerNotification}</span>
                  </span>
                )}
              </div>

              {/* Botones rápidos de equipo */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium text-slate-500">Sugerencias:</span>
                {quickAgents.map((agent) => (
                  <button
                    key={agent}
                    type="button"
                    onClick={() => handleAssignOwner(agent)}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                      owner === agent
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-brand-400 hover:bg-brand-50/50'
                    }`}
                  >
                    {agent}
                  </button>
                ))}
              </div>

              {/* Campo personalizado */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Escribe el nombre del responsable o agente..."
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
                  />
                </div>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleAssignOwner(owner)}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-all shadow-xs"
                >
                  {updating ? 'Guardando...' : 'Asignar'}
                </button>
              </div>
            </div>

            {/* Solicitud del Cliente y Adjunto */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Solicitud del Cliente:</h4>
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 leading-relaxed font-normal">
                {ticket.requestText}
              </div>

              {ticket.attachmentUrl && (
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs font-semibold text-slate-500">Adjunto:</span>
                  <a
                    href={ticket.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200 hover:underline"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Abrir archivo en Google Drive / Enlace</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Tarjeta de Clasificación Inteligente por IA (Gemini) */}
            <AIClassificationCard ticket={ticket} onClassified={() => refetch()} />

            {/* 3. SECCIÓN: COMENTARIOS (● add comments) */}
            <CommentsList ticketId={ticket.id} comments={ticket.comments || []} />

            {/* SECCIÓN ADICIONAL: Trazabilidad inmutable (Audit Trail) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setShowAuditTrail(!showAuditTrail)}
                className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors text-left"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Trazabilidad de Auditoría en Base de Datos ({ticket.auditLogs?.length || 0} registros)</span>
                </div>
                {showAuditTrail ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {showAuditTrail && (
                <div className="p-4 border-t border-slate-200">
                  <AuditTrailView logs={ticket.auditLogs || []} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
