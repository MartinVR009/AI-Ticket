export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export class Logger {
  private static formatMessage(level: LogLevel, message: string, meta?: unknown): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  }

  static info(message: string, meta?: unknown): void {
    console.log(this.formatMessage(LogLevel.INFO, message, meta));
  }

  static warn(message: string, meta?: unknown): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, meta));
  }

  static error(message: string, error?: unknown): void {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack } : error;
    console.error(this.formatMessage(LogLevel.ERROR, message, errorDetails));
  }

  static debug(message: string, meta?: unknown): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, meta));
    }
  }
}
