import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_TICKET } from '../../core/graphql/mutations';
import { GET_TICKETS } from '../../core/graphql/queries';
import { X, Sparkles, Send, Paperclip, CheckCircle2, Zap } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: () => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated
}) => {
  const [customerName, setCustomerName] = useState('');
  const [requestText, setRequestText] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [autoClassify, setAutoClassify] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [createTicket, { loading }] = useMutation(CREATE_TICKET, {
    refetchQueries: [{ query: GET_TICKETS }]
  });

  if (!isOpen) return null;

  // Casos preconfigurados para la demostración en vivo de 5 minutos
  const demoPresets = [
    {
      label: '💳 Finanzas (ACH)',
      customer: 'Banco Sudamericano S.A.',
      text: 'Error crítico en conciliación contable de pagos ACH. La suma de débitos no coincide con el balance general de tesorería por $82,000 USD.',
      url: 'https://drive.google.com/file/d/demo_conciliacion_ach/view'
    },
    {
      label: '⚖️ Legal (NDA)',
      customer: 'Venture Capital Partners',
      text: 'Urgente: Revisión y aprobación de adenda al acuerdo de confidencialidad (NDA) antes del cierre de la ronda de inversión serie B el viernes.',
      url: 'https://drive.google.com/file/d/demo_nda_adenda/view'
    },
    {
      label: '📦 Compras (Hardware)',
      customer: 'Centro Médico Especializado',
      text: 'Requerimos generar orden de compra para adquisición de 10 tablets de uso hospitalario y lectores biométricos para el nuevo pabellón.',
      url: ''
    },
    {
      label: '🚨 Operaciones (Incidente)',
      customer: 'E-Commerce Colombia',
      text: 'Caída total en pasarela de pagos web con error 504 Gateway Timeout tras actualización de microservicios. Ventas paralizadas en checkout.',
      url: 'https://drive.google.com/file/d/demo_logs_error_504/view'
    }
  ];

  const handleApplyPreset = (preset: typeof demoPresets[0]) => {
    setCustomerName(preset.customer);
    setRequestText(preset.text);
    setAttachmentUrl(preset.url);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim() || !requestText.trim()) {
      setErrorMessage('Por favor complete el nombre del cliente y la solicitud.');
      return;
    }

    try {
      const response = await createTicket({
        variables: {
          input: {
            customerName: customerName.trim(),
            requestText: requestText.trim(),
            attachmentUrl: attachmentUrl.trim() || null,
            autoClassify
          }
        }
      });

      const userErrors = response.data?.createTicket?.userErrors;
      if (userErrors && userErrors.length > 0) {
        setErrorMessage(userErrors.join(', '));
        return;
      }

      // Limpiar formulario y cerrar
      setCustomerName('');
      setRequestText('');
      setAttachmentUrl('');
      onTicketCreated?.();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al comunicarse con el servidor');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header del Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-brand-50 text-brand-600 border border-brand-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Crear Nuevo Ticket</h2>
              <p className="text-xs text-slate-500">Registra una solicitud y clasifícala automáticamente con IA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Casos rápidos para Demo */}
        <div className="px-6 pt-4 pb-2 bg-brand-50/30 border-b border-brand-100/50">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-800 mb-2">
            <Zap className="w-3.5 h-3.5 text-brand-600" />
            <span>Plantillas rápidas para la Demo (1 clic):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {demoPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-xs font-medium px-2.5 py-1 rounded-md bg-white text-slate-700 border border-slate-200 hover:border-brand-500 hover:text-brand-700 shadow-2xs transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMessage}
            </div>
          )}

          {/* Nombre Cliente */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nombre del Cliente / Empresa <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Bancolombia, TechCorp, Logística..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Texto de Solicitud */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Texto de la Solicitud <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe detalladamente el requerimiento operativo..."
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all resize-none"
            />
          </div>

          {/* URL Adjunto (Google Drive opcional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-slate-400" />
              <span>URL de Archivo Adjunto (Google Drive / Enlace Opcional)</span>
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/... o enlace público"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-mono text-xs"
            />
          </div>

          {/* Checkbox Auto-clasificación IA */}
          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="auto-classify-toggle"
              checked={autoClassify}
              onChange={(e) => setAutoClassify(e.target.checked)}
              className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="auto-classify-toggle" className="text-xs font-medium text-slate-700 flex items-center gap-1.5 cursor-pointer">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Clasificar automáticamente con IA (Categoría, Prioridad y Resumen)</span>
            </label>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 shadow-sm shadow-brand-600/30 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Procesando con IA...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Crear Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
