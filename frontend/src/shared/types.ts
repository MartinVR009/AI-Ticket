export type TicketCategory = 'Finance' | 'Legal' | 'Procurement' | 'Operations' | 'Other';
export type TicketPriority = 'High' | 'Medium' | 'Low';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Comment {
  id: string;
  ticketId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'AI_CLASSIFY';
  resource: string;
  resourceId?: number | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface Ticket {
  id: string;
  customerName: string;
  requestText: string;
  attachmentUrl?: string | null;
  category?: TicketCategory | null;
  priority: TicketPriority;
  summary?: string | null;
  status: TicketStatus;
  owner?: string | null;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  auditLogs?: AuditLog[];
}

export interface TicketFilterState {
  category?: TicketCategory | 'ALL';
  priority?: TicketPriority | 'ALL';
  status?: TicketStatus | 'ALL';
  search: string;
}
