import { IAIService, AIClassificationResult } from '../../domain/services/IAIService';
import { TicketCategory, TicketPriority } from '../../domain/models/Ticket';
import { config } from '../../config';
import { Logger } from '../../shared/logger';

export class GeminiAIService implements IAIService {
  private readonly apiKey: string;
  private readonly model: string;

  constructor() {
    this.apiKey = config.GEMINI_API_KEY;
    this.model = config.GEMINI_MODEL || 'gemini-flash-latest';
  }

  async classifyTicket(customerName: string, requestText: string): Promise<AIClassificationResult> {
    Logger.info(`Llamando a Gemini AI (${this.model}) para clasificar ticket de: ${customerName}`);

    if (this.apiKey && this.apiKey.trim().length > 0 && !this.apiKey.startsWith('tu_clave')) {
      try {
        const result = await this.callGeminiAPI(customerName, requestText);
        if (result) {
          return result;
        }
      } catch (error) {
        Logger.warn('Error al invocar API de Gemini, aplicando fallback heurístico inteligente para garantizar la demo:', error);
      }
    } else {
      Logger.warn('No se detectó una API key válida de Gemini en .env, utilizando clasificador heurístico local.');
    }

    // Fallback inteligente para garantizar que la presentación demo NUNCA se detenga
    return this.fallbackHeuristicClassification(customerName, requestText);
  }

  private async callGeminiAPI(customerName: string, requestText: string): Promise<AIClassificationResult | null> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const prompt = `
Eres un analista de clasificación de tickets empresariales para Sysdatec Corp.
Tu tarea es analizar la siguiente solicitud de soporte y generar una clasificación estructurada:

Cliente: "${customerName}"
Solicitud: "${requestText}"

REGLAS ESTRICTAS:
1. Categoría (category): Debe ser exactamente una de: ["Finance", "Legal", "Procurement", "Operations", "Other"].
   - Finance: Asuntos de facturación, pagos, balances, transferencias, contabilidad, costos, ACH.
   - Legal: Contratos, acuerdos NDA, litigios, propiedad intelectual, normativas, cumplimiento.
   - Procurement: Compras, adquisición de equipos, licencias de software, suministros, órdenes de compra.
   - Operations: Servidores caídos, infraestructura, errores en producción, bugs críticos, latencia, soporte operativo.
2. Prioridad (priority): Debe ser exactamente una de: ["High", "Medium", "Low"].
   - High: Bloqueos críticos, pérdidas de dinero, caídas de servicio, plazos legales inmediatos.
   - Medium: Solicitudes importantes pero no de impacto catastrófico inmediato.
   - Low: Tareas rutinarias, compras sin urgencia, consultas menores.
3. Resumen (summary): Un resumen conciso, profesional y ejecutivo en una sola oración en español.

Debes responder ÚNICAMENTE un objeto JSON válido con la siguiente estructura (sin formato Markdown adicional, sin comillas invertidas):
{
  "category": "Finance | Legal | Procurement | Operations | Other",
  "priority": "High | Medium | Low",
  "summary": "Resumen ejecutivo en una oración"
}
`;

    console.log('\n================================================================================');
    console.log(`🤖 [IA - GOOGLE GEMINI] INICIANDO ANÁLISIS DE TICKET CON MODELO: ${this.model}`);
    console.log('--------------------------------------------------------------------------------');
    console.log('📥 PROMPT DE INGRESO ENVIADO AL LLM:');
    console.log(prompt.trim());
    console.log('--------------------------------------------------------------------------------');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ Error en respuesta HTTP de Gemini (${response.status}):`, errorBody);
      console.log('================================================================================\n');
      throw new Error(`Gemini API respondió con código HTTP ${response.status}: ${errorBody}`);
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    };

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      throw new Error('Respuesta vacía de la API de Gemini');
    }

    console.log('📤 RESPUESTA RECIBIDA DE LA IA (RAW):');
    console.log(rawText.trim());
    console.log('--------------------------------------------------------------------------------');

    // Limpiar posibles etiquetas de código markdown ```json si el modelo las incluye
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson) as {
      category?: string;
      priority?: string;
      summary?: string;
    };

    const category = this.normalizeCategory(parsed.category);
    const priority = this.normalizePriority(parsed.priority);
    const summary = parsed.summary || `${customerName}: ${requestText.slice(0, 100)}...`;

    console.log('✨ CLASIFICACIÓN PROCESADA Y VALIDADA:');
    console.log(`  🏷️  Categoría: ${category}`);
    console.log(`  ⚡ Prioridad: ${priority}`);
    console.log(`  📝 Resumen:   "${summary}"`);
    console.log('================================================================================\n');

    return {
      category,
      priority,
      summary,
      raw: { model: this.model, parsed, rawResponse: rawText }
    };
  }

  private fallbackHeuristicClassification(customerName: string, requestText: string): AIClassificationResult {
    const text = (customerName + ' ' + requestText).toLowerCase();

    let category: TicketCategory = 'Operations';
    let priority: TicketPriority = 'Medium';

    // Reglas de categoría
    if (text.includes('pago') || text.includes('factura') || text.includes('banco') || text.includes('dinero') || text.includes('ach') || text.includes('contable') || text.includes('finanza')) {
      category = 'Finance';
    } else if (text.includes('contrato') || text.includes('legal') || text.includes('nda') || text.includes('demanda') || text.includes('clausula') || text.includes('acuerdo')) {
      category = 'Legal';
    } else if (text.includes('compra') || text.includes('adquisicion') || text.includes('laptop') || text.includes('equipo') || text.includes('hardware') || text.includes('proveedor')) {
      category = 'Procurement';
    } else if (text.includes('caida') || text.includes('error') || text.includes('servidor') || text.includes('bug') || text.includes('latencia') || text.includes('cluster') || text.includes('produccion')) {
      category = 'Operations';
    }

    // Reglas de prioridad
    if (text.includes('urgente') || text.includes('inmediat') || text.includes('critico') || text.includes('caido') || text.includes('perdida') || text.includes('bloqueo')) {
      priority = 'High';
    } else if (text.includes('cuando puedan') || text.includes('rutina') || text.includes('baja') || text.includes('consulta') || text.includes('opcional')) {
      priority = 'Low';
    }

    const summary = `[IA Offline] Solicitud clasificada para ${customerName}: ${requestText.slice(0, 80)}...`;

    return {
      category,
      priority,
      summary,
      raw: { source: 'heuristic-fallback', simulated: true }
    };
  }

  private normalizeCategory(cat?: string): TicketCategory {
    const upper = (cat || '').toLowerCase();
    if (upper.includes('finan')) return 'Finance';
    if (upper.includes('leg')) return 'Legal';
    if (upper.includes('proc') || upper.includes('compra')) return 'Procurement';
    if (upper.includes('oper')) return 'Operations';
    return 'Other';
  }

  private normalizePriority(pri?: string): TicketPriority {
    const upper = (pri || '').toLowerCase();
    if (upper.includes('high') || upper.includes('alta')) return 'High';
    if (upper.includes('low') || upper.includes('baja')) return 'Low';
    return 'Medium';
  }
}
