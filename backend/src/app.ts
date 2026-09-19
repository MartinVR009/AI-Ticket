import express, { Express, Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { configureSecurityMiddlewares } from './infrastructure/http/middlewares/security';
import { typeDefs } from './infrastructure/http/graphql/typeDefs';
import { createResolvers, ResolverDependencies, ResolverContext } from './infrastructure/http/graphql/resolvers';
import { Logger } from './shared/logger';

export async function createApp(deps: ResolverDependencies): Promise<Express> {
  const app = express();

  // Middlewares de seguridad
  const { corsMiddleware, helmetMiddleware, cookieMiddleware, sessionCookieMiddleware } =
    configureSecurityMiddlewares();

  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(cookieMiddleware);
  app.use(sessionCookieMiddleware);
  app.use(express.json());

  // Servidor Apollo GraphQL
  const server = new ApolloServer<ResolverContext>({
    typeDefs,
    resolvers: createResolvers(deps),
    introspection: true // Habilitado para evaluación y demo técnica
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => {
        const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
        const sessionId = req.cookies?.['ai_ticket_session'];
        return {
          clientIp,
          sessionId
        };
      }
    })
  );

  // Endpoint REST de Healthcheck para monitoreo y Docker
  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', service: 'ai-ticket-backend' });
  });

  // Manejo de rutas no encontradas
  app.use('*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada. La API principal está en /graphql' });
  });

  return app;
}
