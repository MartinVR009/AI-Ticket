export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class TicketNotFoundError extends DomainError {
  constructor(id: number) {
    super(`Ticket con ID ${id} no encontrado`);
    this.name = 'TicketNotFoundError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AIServiceError extends DomainError {
  constructor(message: string) {
    super(`Error en servicio de IA: ${message}`);
    this.name = 'AIServiceError';
  }
}
