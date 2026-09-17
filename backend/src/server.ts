import { createApp } from './app';
import { config } from './config';
import { Logger } from './shared/logger';
import { DatabasePool } from './infrastructure/database/postgres/client';
import { PostgresTicketRepository } from './infrastructure/database/postgres/repositories/PostgresTicketRepository';
import { PostgresAuditLogRepository } from './infrastructure/database/postgres/repositories/PostgresAuditLogRepository';
import { GeminiAIService } from './infrastructure/external-services/GeminiAIService';
import { CreateTicketUseCase } from './application/use-cases/CreateTicketUseCase';
import { GetTicketsUseCase } from './application/use-cases/GetTicketsUseCase';
import { GetTicketByIdUseCase } from './application/use-cases/GetTicketByIdUseCase';
import { UpdateTicketUseCase } from './application/use-cases/UpdateTicketUseCase';
import { ClassifyTicketUseCase } from './application/use-cases/ClassifyTicketUseCase';
import { AddCommentUseCase } from './application/use-cases/AddCommentUseCase';
import { GetAuditLogsUseCase } from './application/use-cases/GetAuditLogsUseCase';

async function bootstrap() {
  Logger.info('====================================================');
  Logger.info('🚀 Iniciando AI Ticket Workspace Backend (Clean Arch)');
  Logger.info('====================================================');

  // 1. Verificar conexión a Base de Datos
  const dbOk = await DatabasePool.testConnection();
  if (!dbOk) {
    Logger.error('❌ No se pudo conectar a PostgreSQL. Verifique credenciales y servicio.');
  }

  // 2. Composición de Dependencias (Composition Root / Inversión de Dependencias)
  const ticketRepository = new PostgresTicketRepository();
  const auditLogRepository = new PostgresAuditLogRepository();
  const aiService = new GeminiAIService();

  const createTicketUseCase = new CreateTicketUseCase(ticketRepository, auditLogRepository, aiService);
  const getTicketsUseCase = new GetTicketsUseCase(ticketRepository);
  const getTicketByIdUseCase = new GetTicketByIdUseCase(ticketRepository);
  const updateTicketUseCase = new UpdateTicketUseCase(ticketRepository, auditLogRepository);
  const classifyTicketUseCase = new ClassifyTicketUseCase(ticketRepository, aiService, auditLogRepository);
  const addCommentUseCase = new AddCommentUseCase(ticketRepository, auditLogRepository);
  const getAuditLogsUseCase = new GetAuditLogsUseCase(auditLogRepository);

  // 3. Crear aplicación Express y Servidor Apollo
  const app = await createApp({
    createTicketUseCase,
    getTicketsUseCase,
    getTicketByIdUseCase,
    updateTicketUseCase,
    classifyTicketUseCase,
    addCommentUseCase,
    getAuditLogsUseCase,
    ticketRepository,
    auditLogRepository
  });

  // 4. Iniciar Servidor HTTP
  const server = app.listen(config.PORT, () => {
    Logger.info(`🎯 Servidor backend escuchando en: http://localhost:${config.PORT}`);
    Logger.info(`🔮 GraphQL Playground / Endpoint: http://localhost:${config.PORT}/graphql`);
    Logger.info(`🩺 Health check disponible en:   http://localhost:${config.PORT}/health`);
    Logger.info(`🤖 Modelo IA activo:             ${config.GEMINI_MODEL}`);
  });

  // 5. Manejo de terminación elegante (Graceful Shutdown)
  const gracefulShutdown = async (signal: string) => {
    Logger.info(`Señal ${signal} recibida. Cerrando conexiones limpiamente...`);
    server.close(async () => {
      await DatabasePool.close();
      Logger.info('Servidor finalizado con éxito.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  Logger.error('Error fatal al iniciar la aplicación:', error);
  process.exit(1);
});
