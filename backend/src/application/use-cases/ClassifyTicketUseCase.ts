import { Ticket } from '../../domain/models/Ticket';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository';
import { IAIService } from '../../domain/services/IAIService';
import { AuditLog } from '../../domain/models/AuditLog';
import { TicketNotFoundError } from '../../domain/exceptions/DomainErrors';
import { Logger } from '../../shared/logger';

export class ClassifyTicketUseCase {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly aiService: IAIService,
    private readonly auditLogRepository: IAuditLogRepository
  ) {}

  async execute(ticketId: number, clientIp = '127.0.0.1'): Promise<Ticket> {
    Logger.info(`Iniciando clasificación por IA para Ticket ID: ${ticketId}`);

    const ticket = await this.ticketRepository.findById(ticketId);
    if (!ticket) {
      throw new TicketNotFoundError(ticketId);
    }

    // Llamada al servicio de IA
    const aiResult = await this.aiService.classifyTicket(ticket.customerName, ticket.requestText);

    // Aplicar clasificación al modelo de dominio
    ticket.applyAIClassification(aiResult.category, aiResult.priority, aiResult.summary, aiResult.raw);

    // Persistir en base de datos
    const updatedTicket = await this.ticketRepository.update(ticket);

    // Registrar en auditoría
    try {
      await this.auditLogRepository.record(
        new AuditLog({
          userId: 'ai-system',
          action: 'AI_CLASSIFY',
          resource: 'TICKET',
          resourceId: ticket.id,
          details: {
            category: aiResult.category,
            priority: aiResult.priority,
            summary: aiResult.summary
          },
          ipAddress: clientIp
        })
      );
    } catch (auditErr) {
      Logger.error('Error al registrar auditoría de clasificación IA', auditErr);
    }

    Logger.info(`Ticket ${ticketId} clasificado exitosamente: Categoría=${ticket.category}, Prioridad=${ticket.priority}`);
    return updatedTicket;
  }
}
