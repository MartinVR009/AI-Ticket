export interface CommentProps {
  id?: number;
  ticketId: number;
  author?: string;
  content: string;
  createdAt?: Date;
}

export class Comment {
  readonly id?: number;
  readonly ticketId: number;
  readonly author: string;
  readonly content: string;
  readonly createdAt: Date;

  constructor(props: CommentProps) {
    if (!props.ticketId || props.ticketId <= 0) {
      throw new Error('El ID del ticket es obligatorio');
    }
    if (!props.content || props.content.trim().length === 0) {
      throw new Error('El contenido del comentario no puede estar vacío');
    }

    this.id = props.id;
    this.ticketId = props.ticketId;
    this.author = props.author && props.author.trim() ? props.author.trim() : 'Agente';
    this.content = props.content.trim();
    this.createdAt = props.createdAt || new Date();
  }
}
