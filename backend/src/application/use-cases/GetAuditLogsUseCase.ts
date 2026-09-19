import { AuditLog } from '../../domain/models/AuditLog';
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository';

export class GetAuditLogsUseCase {
  constructor(private readonly auditLogRepository: IAuditLogRepository) {}

  async execute(resource?: string, resourceId?: number, limit = 50): Promise<AuditLog[]> {
    if (resource && resourceId) {
      return this.auditLogRepository.findByResourceId(resource, resourceId);
    }
    return this.auditLogRepository.findRecent(limit);
  }
}
