import React from 'react';
import { AuditLog } from '../../shared/types';
import { ShieldCheck, History } from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLog[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ logs }) => {
  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('es-CO', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'UPDATE':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'AI_CLASSIFY':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'DELETE':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>Trazabilidad de Auditoría Inmutable ({logs.length})</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">OWASP Compliance</span>
      </div>

      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-3 bg-slate-50 rounded-lg">
            No hay registros de auditoría aún para este ticket.
          </p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/80 text-xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getActionColor(log.action)}`}>
                  {log.action}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{formatDateTime(log.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>Usuario: <strong className="text-slate-800">{log.userId}</strong></span>
                <span className="font-mono text-[10px] text-slate-400">IP: {log.ipAddress}</span>
              </div>
              {log.details && (
                <pre className="mt-1 p-1.5 bg-white rounded border border-slate-100 text-[10px] font-mono text-slate-600 overflow-x-auto">
                  {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
