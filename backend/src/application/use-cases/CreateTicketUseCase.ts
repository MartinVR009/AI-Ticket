import { Ticket } from '../../domain/models/Ticket';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository';
import { IAIService } from '../../domain/services/IAIService';
import { AuditLog } from '../../domain/models/AuditLog';
import { CreateTicketInput } from '../dtos/TicketDTOs';
import { Logger } from '../../shared/logger';

export class CreateTicketUseCase {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly auditLogRepository: IAuditLogRepository,
    private readonly aiService?: IAIService
  ) {}

  async execute(input: CreateTicketInput, clientIp = '127.0.0.1'): Promise<Ticket> {
    Logger.info(`Creando ticket para cliente: ${input.customerName}`);

    const ticket = new Ticket({
      customerName: input.customerName,
      requestText: input.requestText,
      attachmentUrl: input.attachmentUrl,
      status: 'open',
      priority: 'Medium'
    });

    // Clasificación automática opcional si se solicita y el servicio de IA está disponible
    if (input.autoClassify && this.aiService) {
      try {
        Logger.info(`Ejecutando auto-clasificación IA para ticket de: ${input.customerName}`);
        const aiResult = await this.aiService.classifyTicket(input.customerName, input.requestText);
        ticket.applyAIClassification(aiResult.category, aiResult.priority, aiResult.summary, aiResult.raw);
      } catch (err) {
        Logger.warn(`Auto-clasificación IA no disponible al crear, se continuará sin ella`, err);
      }
    }

    const createdTicket = await this.ticketRepository.create(ticket);

    // Auditoría
    try {
      await this.auditLogRepository.record(
        new AuditLog({
          userId: 'web-user',
          action: 'CREATE',
          resource: 'TICKET',
          resourceId: createdTicket.id,
          details: {
            customerName: createdTicket.customerName,
            category: createdTicket.category,
            priority: createdTicket.priority,
            status: createdTicket.status
          },
          ipAddress: clientIp
        })
      );
    } catch (auditErr) {
      Logger.error('Error al registrar auditoría de creación de ticket', auditErr);
    }

    return createdTicket;
  }
}
