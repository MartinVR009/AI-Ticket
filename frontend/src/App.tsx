import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TICKETS, GET_HEALTH } from './core/graphql/queries';
import { Ticket, TicketFilterState } from './shared/types';
import { Header } from './features/dashboard/Header';
import { MetricsBar } from './features/dashboard/MetricsBar';
import { FilterBar } from './features/dashboard/FilterBar';
import { TicketTable } from './features/dashboard/TicketTable';
import { CreateTicketModal } from './features/tickets/CreateTicketModal';
import { TicketDetailModal } from './features/ticket-detail/TicketDetailModal';

export const App: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const [filters, setFilters] = useState<TicketFilterState>({
    category: 'ALL',
    priority: 'ALL',
    status: 'ALL',
    search: ''
  });

  // Consulta de tickets
  const queryVariables = useMemo(() => {
    return {
      category: filters.category !== 'ALL' ? filters.category : undefined,
      priority: filters.priority !== 'ALL' ? filters.priority : undefined,
      status: filters.status !== 'ALL' ? filters.status : undefined,
      search: filters.search.trim().length > 0 ? filters.search.trim() : undefined,
      limit: 100,
      offset: 0
    };
  }, [filters]);

  const { data, loading, refetch, networkStatus } = useQuery(GET_TICKETS, {
    variables: queryVariables,
    notifyOnNetworkStatusChange: true
  });

  // Consulta de estado de salud del sistema
  const { data: healthData } = useQuery(GET_HEALTH, {
    pollInterval: 30000 // Actualiza cada 30 segundos
  });

  const tickets: Ticket[] = data?.tickets?.tickets || [];
  const totalCount: number = data?.tickets?.totalCount || 0;

  const handleResetFilters = () => {
    setFilters({
      category: 'ALL',
      priority: 'ALL',
      status: 'ALL',
      search: ''
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Barra de Navegación Superior */}
      <Header
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onRefresh={() => refetch()}
        isRefreshing={networkStatus === 4 || loading}
        dbStatus={healthData?.health?.database}
        aiModel={healthData?.health?.aiService}
      />

      {/* Contenedor Principal */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Banner de Contexto de Evaluación */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-xl mb-6 shadow-sm border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-sm font-bold tracking-tight">Sistema de Gestión de Tickets con IA en Tiempo Real</h2>
            </div>
          </div>
        </div>

        {/* Tarjetas de Métricas KPI */}
        <MetricsBar tickets={tickets} totalCount={totalCount} />

        {/* Barra de Búsqueda y Filtros */}
        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Indicador de Carga */}
        {loading && !data ? (
          <div className="py-20 text-center">
            <div className="w-9 h-9 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Cargando tickets desde PostgreSQL...</p>
          </div>
        ) : (
          /* Tabla Principal de Tickets */
          <TicketTable
            tickets={tickets}
            onSelectTicket={(ticket) => setSelectedTicketId(ticket.id)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        AI Ticket Workspace &copy; 2026 Sysdatec Technical Assessment | Clean Architecture & Multi-Agent Standard
      </footer>

      {/* Modal Crear Ticket */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTicketCreated={() => refetch()}
      />

      {/* Modal Detalle Ticket */}
      <TicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
      />
    </div>
  );
};
