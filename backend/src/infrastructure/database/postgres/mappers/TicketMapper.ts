import { Ticket, TicketCategory, TicketPriority, TicketStatus } from '../../../../domain/models/Ticket';
import { Comment } from '../../../../domain/models/Comment';
import { AuditLog, AuditAction, AuditResource } from '../../../../domain/models/AuditLog';

export interface RawTicketRow {
  id: number;
  customer_name: string;
  request_text: string;
  attachment_url: string | null;
  category: string | null;
  priority: string | null;
  summary: string | null;
  status: string;
  owner: string | null;
  ai_raw_response: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
}

export interface RawCommentRow {
  id: number;
  ticket_id: number;
  author: string;
  content: string;
  created_at: Date;
}

export interface RawAuditRow {
  id: number;
  user_id: string;
  action: string;
  resource: string;
  resource_id: number | null;
  details: Record<string, unknown> | null;
  ip_address: string;
  created_at: Date;
}

export class TicketMapper {
  static toDomain(row: RawTicketRow): Ticket {
    return new Ticket({
      id: row.id,
      customerName: row.customer_name,
      requestText: row.request_text,
      attachmentUrl: row.attachment_url,
      category: row.category as TicketCategory,
      priority: (row.priority as TicketPriority) || 'Medium',
      summary: row.summary,
      status: (row.status as TicketStatus) || 'open',
      owner: row.owner,
      aiRawResponse: row.ai_raw_response,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    });
  }

  static toCommentDomain(row: RawCommentRow): Comment {
    return new Comment({
      id: row.id,
      ticketId: row.ticket_id,
      author: row.author,
      content: row.content,
      createdAt: row.created_at
    });
  }

  static toAuditDomain(row: RawAuditRow): AuditLog {
    return new AuditLog({
      id: row.id,
      userId: row.user_id,
      action: row.action as AuditAction,
      resource: row.resource as AuditResource,
      resourceId: row.resource_id,
      details: row.details,
      ipAddress: row.ip_address,
      createdAt: row.created_at
    });
  }
}
