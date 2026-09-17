import { Ticket } from '../../domain/models/Ticket';
import { Comment } from '../../domain/models/Comment';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { TicketNotFoundError } from '../../domain/exceptions/DomainErrors';

export interface TicketDetails {
  ticket: Ticket;
  comments: Comment[];
}

export class GetTicketByIdUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(id: number): Promise<TicketDetails> {
    const ticket = await this.ticketRepository.findById(id);
    if (!ticket) {
      throw new TicketNotFoundError(id);
    }

    const comments = await this.ticketRepository.findCommentsByTicketId(id);
    return { ticket, comments };
  }
}
