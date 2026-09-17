export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'AI_CLASSIFY';
export type AuditResource = 'TICKET' | 'COMMENT';

export interface AuditLogProps {
  id?: number;
  userId?: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: number | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  createdAt?: Date;
}

export class AuditLog {
  readonly id?: number;
  readonly userId: string;
  readonly action: AuditAction;
  readonly resource: AuditResource;
  readonly resourceId?: number | null;
  readonly details?: Record<string, unknown> | null;
  readonly ipAddress: string;
  readonly createdAt: Date;

  constructor(props: AuditLogProps) {
    this.id = props.id;
    this.userId = props.userId || 'system';
    this.action = props.action;
    this.resource = props.resource;
    this.resourceId = props.resourceId || null;
    this.details = props.details || null;
    this.ipAddress = props.ipAddress || '127.0.0.1';
    this.createdAt = props.createdAt || new Date();
  }
}
