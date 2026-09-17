import { CreateTicketUseCase } from './CreateTicketUseCase';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';
import { IAuditLogRepository } from '../../domain/repositories/IAuditLogRepository';
import { IAIService } from '../../domain/services/IAIService';
import { Ticket } from '../../domain/models/Ticket';

describe('CreateTicketUseCase', () => {
  let mockTicketRepo: jest.Mocked<ITicketRepository>;
  let mockAuditRepo: jest.Mocked<IAuditLogRepository>;
  let mockAIService: jest.Mocked<IAIService>;
  let useCase: CreateTicketUseCase;

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

    useCase = new CreateTicketUseCase(mockTicketRepo, mockAuditRepo, mockAIService);
  });

  it('debe crear un ticket satisfactoriamente sin auto-clasificación', async () => {
    const input = {
      customerName: 'Cliente Test',
      requestText: 'Problema con la factura 1234',
      attachmentUrl: 'https://drive.google.com/test'
    };

    const savedTicket = new Ticket({
      id: 1,
      customerName: input.customerName,
      requestText: input.requestText,
      attachmentUrl: input.attachmentUrl
    });

    mockTicketRepo.create.mockResolvedValue(savedTicket);

    const result = await useCase.execute(input, '192.168.1.10');

    expect(mockTicketRepo.create).toHaveBeenCalledTimes(1);
    expect(mockAuditRepo.record).toHaveBeenCalledTimes(1);
    expect(result.customerName).toBe('Cliente Test');
    expect(result.status).toBe('open');
    expect(mockAIService.classifyTicket).not.toHaveBeenCalled();
  });

  it('debe invocar al servicio de IA cuando autoClassify es true', async () => {
    const input = {
      customerName: 'Empresa Legal',
      requestText: 'Revisión urgente de contrato',
      autoClassify: true
    };

    mockAIService.classifyTicket.mockResolvedValue({
      category: 'Legal',
      priority: 'High',
      summary: 'Revisión urgente de contrato comercial'
    });

    mockTicketRepo.create.mockImplementation(async (ticket) => {
      return new Ticket({ ...ticket, id: 2 });
    });

    const result = await useCase.execute(input);

    expect(mockAIService.classifyTicket).toHaveBeenCalledWith('Empresa Legal', 'Revisión urgente de contrato');
    expect(mockTicketRepo.create).toHaveBeenCalledTimes(1);
    expect(result.category).toBe('Legal');
    expect(result.priority).toBe('High');
  });

  it('debe lanzar error si el nombre del cliente o la solicitud están vacíos', async () => {
    await expect(
      useCase.execute({ customerName: '', requestText: 'Texto' })
    ).rejects.toThrow('El nombre del cliente es obligatorio');

    await expect(
      useCase.execute({ customerName: 'Cliente', requestText: '' })
    ).rejects.toThrow('El texto de la solicitud es obligatorio');
  });
});
