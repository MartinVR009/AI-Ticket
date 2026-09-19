import { TicketCategory, TicketPriority, TicketStatus } from '../../domain/models/Ticket';

export interface CreateTicketInput {
  customerName: string;
  requestText: string;
  attachmentUrl?: string | null;
  autoClassify?: boolean;
}

export interface UpdateTicketInput {
  id: number;
  status?: TicketStatus;
  owner?: string | null;
}

export interface AddCommentInput {
  ticketId: number;
  author?: string;
  content: string;
}

export interface ClassifyTicketInput {
  ticketId: number;
}

export interface TicketFilterInput {
  category?: TicketCategory;
  priority?: TicketPriority;
  status?: TicketStatus;
  search?: string;
  limit?: number;
  offset?: number;
}
