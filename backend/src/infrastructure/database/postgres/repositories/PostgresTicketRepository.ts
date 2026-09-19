import { ITicketRepository, TicketFilters } from '../../../../domain/repositories/ITicketRepository';
import { Ticket } from '../../../../domain/models/Ticket';
import { Comment } from '../../../../domain/models/Comment';
import { DatabasePool } from '../client';
import { TICKET_QUERIES } from '../queries/ticket.queries';
import { COMMENT_QUERIES } from '../queries/comment.queries';
import { TicketMapper, RawTicketRow, RawCommentRow } from '../mappers/TicketMapper';

export class PostgresTicketRepository implements ITicketRepository {
  async create(ticket: Ticket): Promise<Ticket> {
    const params = [
      ticket.customerName,
      ticket.requestText,
      ticket.attachmentUrl,
      ticket.category,
      ticket.priority,
      ticket.summary,
      ticket.status,
      ticket.owner,
      ticket.aiRawResponse ? JSON.stringify(ticket.aiRawResponse) : null,
      ticket.createdAt,
      ticket.updatedAt
    ];

    const result = await DatabasePool.query<RawTicketRow>(TICKET_QUERIES.INSERT, params);
    return TicketMapper.toDomain(result.rows[0]);
  }

  async findById(id: number): Promise<Ticket | null> {
    const result = await DatabasePool.query<RawTicketRow>(TICKET_QUERIES.SELECT_BY_ID, [id]);
    if (result.rows.length === 0) {
      return null;
    }
    return TicketMapper.toDomain(result.rows[0]);
  }

  async findAll(filters?: TicketFilters): Promise<{ tickets: Ticket[]; totalCount: number }> {
    const conditions: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    if (filters?.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(filters.status);
    }

    if (filters?.category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(filters.category);
    }

    if (filters?.priority) {
      conditions.push(`priority = $${paramIndex++}`);
      params.push(filters.priority);
    }

    if (filters?.search && filters.search.trim().length > 0) {
      conditions.push(`(customer_name ILIKE $${paramIndex} OR request_text ILIKE $${paramIndex} OR summary ILIKE $${paramIndex})`);
      params.push(`%${filters.search.trim()}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Conteo total para paginación
    const countQuery = `SELECT COUNT(*) as count FROM tickets ${whereClause};`;
    const countResult = await DatabasePool.query<{ count: string }>(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    // Consulta con orden y límites
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;
    const dataQuery = `
      SELECT id, customer_name, request_text, attachment_url, category, priority, summary, status, owner, ai_raw_response, created_at, updated_at
      FROM tickets
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;
    const queryParams = [...params, limit, offset];

    const result = await DatabasePool.query<RawTicketRow>(dataQuery, queryParams);
    const tickets = result.rows.map(TicketMapper.toDomain);

    return { tickets, totalCount };
  }

  async update(ticket: Ticket): Promise<Ticket> {
    const params = [
      ticket.id,
      ticket.customerName,
      ticket.requestText,
      ticket.attachmentUrl,
      ticket.category,
      ticket.priority,
      ticket.summary,
      ticket.status,
      ticket.owner,
      ticket.aiRawResponse ? JSON.stringify(ticket.aiRawResponse) : null,
      ticket.updatedAt
    ];

    const result = await DatabasePool.query<RawTicketRow>(TICKET_QUERIES.UPDATE, params);
    return TicketMapper.toDomain(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const result = await DatabasePool.query(TICKET_QUERIES.DELETE, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async addComment(comment: Comment): Promise<Comment> {
    const params = [
      comment.ticketId,
      comment.author,
      comment.content,
      comment.createdAt
    ];

    const result = await DatabasePool.query<RawCommentRow>(COMMENT_QUERIES.INSERT, params);
    return TicketMapper.toCommentDomain(result.rows[0]);
  }

  async findCommentsByTicketId(ticketId: number): Promise<Comment[]> {
    const result = await DatabasePool.query<RawCommentRow>(COMMENT_QUERIES.SELECT_BY_TICKET_ID, [ticketId]);
    return result.rows.map(TicketMapper.toCommentDomain);
  }
}
