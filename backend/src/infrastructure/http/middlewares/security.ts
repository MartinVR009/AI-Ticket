import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from '../../../config';
import { Logger } from '../../../shared/logger';

export const configureSecurityMiddlewares = () => {
  // CORS estricto con soporte para cookies HttpOnly y credenciales
  const corsMiddleware = cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (como Postman o curl) o desde frontend autorizado
      if (!origin || origin === config.FRONTEND_URL || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(new Error(`Origen no permitido por política CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie']
  });

  // Helmet para cabeceras HTTP de seguridad (OWASP)
  const helmetMiddleware = helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginEmbedderPolicy: false
  });

  // Cookie parser con soporte para firma
  const cookieMiddleware = cookieParser(config.SESSION_SECRET);

  // Middleware para inyectar y verificar Cookie HttpOnly de sesión segura
  const sessionCookieMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const existingCookie = req.cookies?.['ai_ticket_session'];
    if (!existingCookie) {
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      res.cookie('ai_ticket_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 día
      });
    }
    next();
  };

  return {
    corsMiddleware,
    helmetMiddleware,
    cookieMiddleware,
    sessionCookieMiddleware
  };
};
