import React from 'react';
import { TicketFilterState } from '../../shared/types';
import { Search, Filter, X } from 'lucide-react';

interface FilterBarProps {
  filters: TicketFilterState;
  onFilterChange: (newFilters: TicketFilterState) => void;
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, onReset }) => {
  const isFiltered =
    filters.category !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.search.trim().length > 0;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
      {/* Buscador de texto */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por cliente, descripción o resumen de IA..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
        />
        {filters.search && (
          <button
            onClick={() => onFilterChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Selectores de Filtro */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtrar:</span>
        </div>

        {/* Categoría */}
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value as any })}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        >
          <option value="ALL">Todas las Categorías</option>
          <option value="Finance">Finance (Finanzas)</option>
          <option value="Legal">Legal</option>
          <option value="Procurement">Procurement (Compras)</option>
          <option value="Operations">Operations (Operaciones)</option>
          <option value="Other">Other</option>
        </select>

        {/* Prioridad */}
        <select
          value={filters.priority}
          onChange={(e) => onFilterChange({ ...filters, priority: e.target.value as any })}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        >
          <option value="ALL">Todas las Prioridades</option>
          <option value="High">Alta (High)</option>
          <option value="Medium">Media (Medium)</option>
          <option value="Low">Baja (Low)</option>
        </select>

        {/* Estado */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="open">Abierto (Open)</option>
          <option value="in_progress">En Progreso</option>
          <option value="resolved">Resuelto</option>
          <option value="closed">Cerrado</option>
        </select>

        {/* Botón limpiar */}
        {isFiltered && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1.5 rounded transition-colors font-medium"
          >
            <X className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        )}
      </div>
    </div>
  );
};
