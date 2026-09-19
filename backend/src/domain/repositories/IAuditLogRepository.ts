import { AuditLog } from '../models/AuditLog';

export interface IAuditLogRepository {
  record(log: AuditLog): Promise<void>;
  findByResourceId(resource: string, resourceId: number): Promise<AuditLog[]>;
  findRecent(limit?: number): Promise<AuditLog[]>;
}
