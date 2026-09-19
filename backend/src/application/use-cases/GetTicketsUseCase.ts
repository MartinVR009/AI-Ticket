import { Ticket } from '../../domain/models/Ticket';
import { ITicketRepository, TicketFilters } from '../../domain/repositories/ITicketRepository';
import { TicketFilterInput } from '../dtos/TicketDTOs';

export class GetTicketsUseCase {
  constructor(private readonly ticketRepository: ITicketRepository) {}

  async execute(filters?: TicketFilterInput): Promise<{ tickets: Ticket[]; totalCount: number }> {
    const repoFilters: TicketFilters = {
      category: filters?.category,
      priority: filters?.priority,
      status: filters?.status,
      search: filters?.search,
      limit: filters?.limit || 100,
      offset: filters?.offset || 0
    };

    return this.ticketRepository.findAll(repoFilters);
  }
}
