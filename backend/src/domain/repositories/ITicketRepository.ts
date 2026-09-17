import { Ticket, TicketCategory, TicketPriority, TicketStatus } from '../models/Ticket';
import { Comment } from '../models/Comment';

export interface TicketFilters {
  category?: TicketCategory;
  priority?: TicketPriority;
  status?: TicketStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ITicketRepository {
  create(ticket: Ticket): Promise<Ticket>;
  findById(id: number): Promise<Ticket | null>;
  findAll(filters?: TicketFilters): Promise<{ tickets: Ticket[]; totalCount: number }>;
  update(ticket: Ticket): Promise<Ticket>;
  delete(id: number): Promise<boolean>;
  
  // Comentarios
  addComment(comment: Comment): Promise<Comment>;
  findCommentsByTicketId(ticketId: number): Promise<Comment[]>;
}
