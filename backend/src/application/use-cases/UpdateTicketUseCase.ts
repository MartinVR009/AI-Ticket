import { Ticket } from '../../domain/models/Ticket';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository';
import { AuditLog } from '../../domain/models/AuditLog';
import { TicketNotFoundError } from '../../domain/exceptions/DomainErrors';
import { UpdateTicketInput } from '../dtos/TicketDTOs';
import { Logger } from '../../shared/logger';

export class UpdateTicketUseCase {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly auditLogRepository: IAuditLogRepository
  ) {}

  async execute(input: UpdateTicketInput, clientIp = '127.0.0.1'): Promise<Ticket> {
    const existingTicket = await this.ticketRepository.findById(input.id);
    if (!existingTicket) {
      throw new TicketNotFoundError(input.id);
    }

    const previousState = {
      status: existingTicket.status,
      owner: existingTicket.owner
    };

    if (input.status !== undefined) {
      existingTicket.updateStatus(input.status);
    }

    if (input.owner !== undefined) {
      existingTicket.assignOwner(input.owner);
    }

    const updatedTicket = await this.ticketRepository.update(existingTicket);

    // Auditoría
    try {
      await this.auditLogRepository.record(
        new AuditLog({
          userId: input.owner || 'agent',
          action: 'UPDATE',
          resource: 'TICKET',
          resourceId: updatedTicket.id,
          details: {
            previousState,
            newState: {
              status: updatedTicket.status,
              owner: updatedTicket.owner
            }
          },
          ipAddress: clientIp
        })
      );
    } catch (auditErr) {
      Logger.error('Error al registrar auditoría de actualización de ticket', auditErr);
    }

    return updatedTicket;
  }
}
