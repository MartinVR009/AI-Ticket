export type TicketCategory = 'Finance' | 'Legal' | 'Procurement' | 'Operations' | 'Other';
export type TicketPriority = 'High' | 'Medium' | 'Low';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface TicketProps {
  id?: number;
  customerName: string;
  requestText: string;
  attachmentUrl?: string | null;
  category?: TicketCategory | null;
  priority?: TicketPriority | null;
  summary?: string | null;
  status?: TicketStatus;
  owner?: string | null;
  aiRawResponse?: Record<string, unknown> | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Ticket {
  readonly id?: number;
  readonly customerName: string;
  readonly requestText: string;
  readonly attachmentUrl?: string | null;
  category: TicketCategory | null;
  priority: TicketPriority;
  summary: string | null;
  status: TicketStatus;
  owner: string | null;
  aiRawResponse?: Record<string, unknown> | null;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: TicketProps) {
    if (!props.customerName || props.customerName.trim().length === 0) {
      throw new Error('El nombre del cliente es obligatorio');
    }
    if (!props.requestText || props.requestText.trim().length === 0) {
      throw new Error('El texto de la solicitud es obligatorio');
    }

    this.id = props.id;
    this.customerName = props.customerName.trim();
    this.requestText = props.requestText.trim();
    this.attachmentUrl = props.attachmentUrl ? props.attachmentUrl.trim() : null;
    this.category = props.category || null;
    this.priority = props.priority || 'Medium';
    this.summary = props.summary || null;
    this.status = props.status || 'open';
    this.owner = props.owner ? props.owner.trim() : null;
    this.aiRawResponse = props.aiRawResponse || null;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  applyAIClassification(category: TicketCategory, priority: TicketPriority, summary: string, raw?: Record<string, unknown>): void {
    this.category = category;
    this.priority = priority;
    this.summary = summary;
    this.aiRawResponse = raw || null;
    this.updatedAt = new Date();
  }

  updateStatus(status: TicketStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  assignOwner(owner: string | null): void {
    this.owner = owner ? owner.trim() : null;
    this.updatedAt = new Date();
  }
}
