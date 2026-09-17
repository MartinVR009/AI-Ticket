import React from 'react';
import { Sparkles, Plus, Database, Bot, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  dbStatus?: string;
  aiModel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onRefresh,
  isRefreshing = false,
  dbStatus = 'connected',
  aiModel = 'Gemini AI'
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Titulo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">AI Ticket Workspace</h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200 uppercase tracking-wider">
                  Sysdatec Corp
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Flujos de operaciones empresariales potenciados por Inteligencia Artificial
              </p>
            </div>
          </div>

          {/* Status Badges & CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Status Indicador de BD */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <Database className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-medium">PostgreSQL:</span>
              <span className="text-emerald-700 font-semibold capitalize">{dbStatus}</span>
            </div>

            {/* Status Indicador de IA */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <Bot className="w-3.5 h-3.5 text-blue-500" />
              <span className="font-medium">IA:</span>
              <span className="text-blue-700 font-semibold">{aiModel}</span>
            </div>

            {/* Botón Refrescar */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Actualizar listado"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
            </button>

            {/* Botón Nuevo Ticket */}
            <button
              id="btn-create-ticket"
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-sm shadow-brand-600/30 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nuevo Ticket</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
