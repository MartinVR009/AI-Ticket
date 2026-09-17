import { IAuditLogRepository } from '../../../../domain/repositories/IAuditLogRepository';
import { AuditLog } from '../../../../domain/models/AuditLog';
import { DatabasePool } from '../client';
import { AUDIT_QUERIES } from '../queries/audit.queries';
import { TicketMapper, RawAuditRow } from '../mappers/TicketMapper';

export class PostgresAuditLogRepository implements IAuditLogRepository {
  async record(log: AuditLog): Promise<void> {
    const params = [
      log.userId,
      log.action,
      log.resource,
      log.resourceId,
      log.details ? JSON.stringify(log.details) : null,
      log.ipAddress,
      log.createdAt
    ];

    await DatabasePool.query(AUDIT_QUERIES.INSERT, params);
  }

  async findByResourceId(resource: string, resourceId: number): Promise<AuditLog[]> {
    const result = await DatabasePool.query<RawAuditRow>(AUDIT_QUERIES.SELECT_BY_RESOURCE, [resource, resourceId]);
    return result.rows.map(TicketMapper.toAuditDomain);
  }

  async findRecent(limit = 50): Promise<AuditLog[]> {
    const result = await DatabasePool.query<RawAuditRow>(AUDIT_QUERIES.SELECT_RECENT, [limit]);
    return result.rows.map(TicketMapper.toAuditDomain);
  }
}
