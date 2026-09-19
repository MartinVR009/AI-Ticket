import { TicketCategory, TicketPriority } from '../models/Ticket';

export interface AIClassificationResult {
  category: TicketCategory;
  priority: TicketPriority;
  summary: string;
  raw?: Record<string, unknown>;
}

export interface IAIService {
  classifyTicket(customerName: string, requestText: string): Promise<AIClassificationResult>;
}
