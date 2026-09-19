import { ClassifyTicketUseCase } from './ClassifyTicketUseCase';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository';
import { IAIService } from '../../domain/services/IAIService';
import { Ticket } from '../../domain/models/Ticket';
import { TicketNotFoundError } from '../../domain/exceptions/DomainErrors';

describe('ClassifyTicketUseCase', () => {
  let mockTicketRepo: jest.Mocked<ITicketRepository>;
  let mockAuditRepo: jest.Mocked<IAuditLogRepository>;
  let mockAIService: jest.Mocked<IAIService>;
  let useCase: ClassifyTicketUseCase;

  beforeEach(() => {
    mockTicketRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addComment: jest.fn(),
      findCommentsByTicketId: jest.fn()
    };

    mockAuditRepo = {
      record: jest.fn(),
      findByResourceId: jest.fn(),
      findRecent: jest.fn()
    };

    mockAIService = {
      classifyTicket: jest.fn()
    };

    useCase = new ClassifyTicketUseCase(mockTicketRepo, mockAIService, mockAuditRepo);
  });

  it('debe clasificar un ticket existente y registrar la acción en auditoría', async () => {
    const existingTicket = new Ticket({
      id: 10,
      customerName: 'Fintech Bank',
      requestText: 'Error 500 al procesar pago ACH de $10,000'
    });

    mockTicketRepo.findById.mockResolvedValue(existingTicket);
    mockAIService.classifyTicket.mockResolvedValue({
      category: 'Finance',
      priority: 'High',
      summary: 'Fallo crítico de pasarela en pagos ACH de alto valor'
    });
    mockTicketRepo.update.mockImplementation(async (t) => t);

    const result = await useCase.execute(10, '10.0.0.1');

    expect(mockTicketRepo.findById).toHaveBeenCalledWith(10);
    expect(mockAIService.classifyTicket).toHaveBeenCalledWith('Fintech Bank', 'Error 500 al procesar pago ACH de $10,000');
    expect(mockTicketRepo.update).toHaveBeenCalledTimes(1);
    expect(mockAuditRepo.record).toHaveBeenCalledTimes(1);

    expect(result.category).toBe('Finance');
    expect(result.priority).toBe('High');
    expect(result.summary).toBe('Fallo crítico de pasarela en pagos ACH de alto valor');
  });

  it('debe lanzar TicketNotFoundError si el ID no existe', async () => {
    mockTicketRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(999)).rejects.toThrow(TicketNotFoundError);
    expect(mockAIService.classifyTicket).not.toHaveBeenCalled();
  });
});
