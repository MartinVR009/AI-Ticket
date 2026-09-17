import { CreateTicketUseCase } from '../../../application/use-cases/CreateTicketUseCase';
import { GetTicketsUseCase } from '../../../application/use-cases/GetTicketsUseCase';
import { GetTicketByIdUseCase } from '../../../application/use-cases/GetTicketByIdUseCase';
import { UpdateTicketUseCase } from '../../../application/use-cases/UpdateTicketUseCase';
import { ClassifyTicketUseCase } from '../../../application/use-cases/ClassifyTicketUseCase';
import { AddCommentUseCase } from '../../../application/use-cases/AddCommentUseCase';
import { GetAuditLogsUseCase } from '../../../application/use-cases/GetAuditLogsUseCase';
import { ITicketRepository } from '../../../domain/repositories/ITicketRepository';
import { IAuditLogRepository } from '../../../domain/repositories/IAuditLogRepository';
import { DatabasePool } from '../../database/postgres/client';
import { config } from '../../../config';
import { Logger } from '../../../shared/logger';

export interface ResolverContext {
  clientIp: string;
  sessionId?: string;
}

export interface ResolverDependencies {
  createTicketUseCase: CreateTicketUseCase;
  getTicketsUseCase: GetTicketsUseCase;
  getTicketByIdUseCase: GetTicketByIdUseCase;
  updateTicketUseCase: UpdateTicketUseCase;
  classifyTicketUseCase: ClassifyTicketUseCase;
  addCommentUseCase: AddCommentUseCase;
  getAuditLogsUseCase: GetAuditLogsUseCase;
  ticketRepository: ITicketRepository;
  auditLogRepository: IAuditLogRepository;
}

export const createResolvers = (deps: ResolverDependencies) => {
  return {
    Query: {
      tickets: async (
        _: unknown,
        args: {
          category?: string;
          priority?: string;
          status?: string;
          search?: string;
          limit?: number;
          offset?: number;
        }
      ) => {
        try {
          const result = await deps.getTicketsUseCase.execute({
            category: args.category as any,
            priority: args.priority as any,
            status: args.status as any,
            search: args.search,
            limit: args.limit,
            offset: args.offset
          });

          return {
            tickets: result.tickets,
            totalCount: result.totalCount
          };
        } catch (error) {
          Logger.error('Error en resolver tickets', error);
          throw error;
        }
      },

      ticket: async (_: unknown, args: { id: string }) => {
        try {
          const details = await deps.getTicketByIdUseCase.execute(parseInt(args.id, 10));
          return details.ticket;
        } catch (error) {
          Logger.warn(`Ticket ${args.id} no encontrado en resolver ticket`);
          return null;
        }
      },

      auditLogs: async (
        _: unknown,
        args: { resource?: string; resourceId?: number; limit?: number }
      ) => {
        return deps.getAuditLogsUseCase.execute(args.resource, args.resourceId, args.limit);
      },

      health: async () => {
        const dbOk = await DatabasePool.testConnection();
        return {
          status: 'ok',
          database: dbOk ? 'connected' : 'disconnected',
          aiService: config.GEMINI_API_KEY ? `Gemini (${config.GEMINI_MODEL})` : 'offline-heuristic',
          timestamp: new Date().toISOString()
        };
      }
    },

    Mutation: {
      createTicket: async (
        _: unknown,
        args: {
          input: {
            customerName: string;
            requestText: string;
            attachmentUrl?: string | null;
            autoClassify?: boolean;
          };
        },
        context: ResolverContext
      ) => {
        try {
          const ticket = await deps.createTicketUseCase.execute(args.input, context?.clientIp);
          return {
            ticket,
            userErrors: []
          };
        } catch (error: any) {
          Logger.error('Error al crear ticket', error);
          return {
            ticket: null,
            userErrors: [error.message || 'Error inesperado al crear el ticket']
          };
        }
      },

      updateTicket: async (
        _: unknown,
        args: {
          input: {
            id: string;
            status?: any;
            owner?: string | null;
          };
        },
        context: ResolverContext
      ) => {
        try {
          const ticket = await deps.updateTicketUseCase.execute(
            {
              id: parseInt(args.input.id, 10),
              status: args.input.status,
              owner: args.input.owner
            },
            context?.clientIp
          );
          return {
            ticket,
            userErrors: []
          };
        } catch (error: any) {
          Logger.error('Error al actualizar ticket', error);
          return {
            ticket: null,
            userErrors: [error.message || 'Error al actualizar el ticket']
          };
        }
      },

      classifyTicket: async (
        _: unknown,
        args: { input: { ticketId: string } },
        context: ResolverContext
      ) => {
        try {
          const ticket = await deps.classifyTicketUseCase.execute(
            parseInt(args.input.ticketId, 10),
            context?.clientIp
          );
          return {
            ticket,
            userErrors: []
          };
        } catch (error: any) {
          Logger.error('Error al clasificar ticket con IA', error);
          return {
            ticket: null,
            userErrors: [error.message || 'Error durante la clasificación con IA']
          };
        }
      },

      addComment: async (
        _: unknown,
        args: {
          input: {
            ticketId: string;
            author?: string;
            content: string;
          };
        },
        context: ResolverContext
      ) => {
        try {
          const ticketId = parseInt(args.input.ticketId, 10);
          const comment = await deps.addCommentUseCase.execute(
            {
              ticketId,
              author: args.input.author,
              content: args.input.content
            },
            context?.clientIp
          );

          const ticket = await deps.ticketRepository.findById(ticketId);

          return {
            comment,
            ticket,
            userErrors: []
          };
        } catch (error: any) {
          Logger.error('Error al agregar comentario', error);
          return {
            comment: null,
            ticket: null,
            userErrors: [error.message || 'Error al agregar el comentario']
          };
        }
      },

      deleteTicket: async (_: unknown, args: { id: string }) => {
        try {
          const success = await deps.ticketRepository.delete(parseInt(args.id, 10));
          return { success, userErrors: [] };
        } catch (error: any) {
          return { success: false, userErrors: [error.message] };
        }
      }
    },

    Ticket: {
      comments: async (parent: { id: number }) => {
        return deps.ticketRepository.findCommentsByTicketId(parent.id);
      },

      auditLogs: async (parent: { id: number }) => {
        return deps.auditLogRepository.findByResourceId('TICKET', parent.id);
      },

      createdAt: (parent: { createdAt: Date | string }) => {
        return parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt;
      },

      updatedAt: (parent: { updatedAt: Date | string }) => {
        return parent.updatedAt instanceof Date ? parent.updatedAt.toISOString() : parent.updatedAt;
      }
    },

    Comment: {
      createdAt: (parent: { createdAt: Date | string }) => {
        return parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt;
      }
    },

    AuditLog: {
      details: (parent: { details: Record<string, unknown> | null }) => {
        return parent.details ? JSON.stringify(parent.details) : null;
      },
      createdAt: (parent: { createdAt: Date | string }) => {
        return parent.createdAt instanceof Date ? parent.createdAt.toISOString() : parent.createdAt;
      }
    }
  };
};
