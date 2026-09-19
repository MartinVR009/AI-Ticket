import { Comment } from '../../domain/models/Comment';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository';
import { AuditLog } from '../../domain/models/AuditLog';
import { TicketNotFoundError } from '../../domain/exceptions/DomainErrors';
import { AddCommentInput } from '../dtos/TicketDTOs';
import { Logger } from '../../shared/logger';

export class AddCommentUseCase {
  constructor(
    private readonly ticketRepository: ITicketRepository,
    private readonly auditLogRepository: IAuditLogRepository
  ) {}

  async execute(input: AddCommentInput, clientIp = '127.0.0.1'): Promise<Comment> {
    const ticket = await this.ticketRepository.findById(input.ticketId);
    if (!ticket) {
      throw new TicketNotFoundError(input.ticketId);
    }

    const comment = new Comment({
      ticketId: input.ticketId,
      author: input.author,
      content: input.content
    });

    const createdComment = await this.ticketRepository.addComment(comment);

    // Auditoría
    try {
      await this.auditLogRepository.record(
        new AuditLog({
          userId: createdComment.author,
          action: 'CREATE',
          resource: 'COMMENT',
          resourceId: ticket.id,
          details: {
            commentId: createdComment.id,
            author: createdComment.author
          },
          ipAddress: clientIp
        })
      );
    } catch (auditErr) {
      Logger.error('Error al registrar auditoría de comentario', auditErr);
    }

    return createdComment;
  }
}
