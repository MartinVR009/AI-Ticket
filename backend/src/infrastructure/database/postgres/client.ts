import { Pool, QueryResult, QueryResultRow } from 'pg';
import { config } from '../../../config';
import { Logger } from '../../../shared/logger';

export class DatabasePool {
  private static instance: Pool | null = null;

  static getInstance(): Pool {
    if (!this.instance) {
      this.instance = new Pool({
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        database: config.DB_NAME,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000
      });

      this.instance.on('connect', () => {
        Logger.debug('Nueva conexión establecida con PostgreSQL');
      });

      this.instance.on('error', (err) => {
        Logger.error('Error inesperado en el pool de PostgreSQL', err);
      });
    }

    return this.instance;
  }

  static async query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    const pool = this.getInstance();
    const start = Date.now();
    try {
      const result = await pool.query<T>(text, params);
      const duration = Date.now() - start;
      Logger.debug(`Consulta SQL ejecutada en ${duration}ms`, { rowCount: result.rowCount });
      return result;
    } catch (error) {
      Logger.error(`Fallo en consulta SQL: ${text}`, error);
      throw error;
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const res = await this.query('SELECT NOW()');
      Logger.info(`✅ Conexión con PostgreSQL exitosa: ${res.rows[0].now}`);
      return true;
    } catch (err) {
      Logger.error('❌ Error al conectar con PostgreSQL', err);
      return false;
    }
  }

  static async close(): Promise<void> {
    if (this.instance) {
      await this.instance.end();
      this.instance = null;
      Logger.info('Pool de conexiones de PostgreSQL cerrado.');
    }
  }
}
