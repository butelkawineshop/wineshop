import type { PayloadRequest } from 'payload'
import pino from 'pino'

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export type LogValue = string | number | boolean | null | undefined | LogObject | LogArray
export type LogObject = { [key: string]: LogValue }
export type LogArray = LogValue[]

export interface LogContext {
  task?: string
  operation?: string
  collection?: string
  id?: string | number
  [key: string]: LogValue
}

// Create a base logger instance
const baseLogger = pino({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
})

export class Logger {
  private context: LogContext

  constructor(req: PayloadRequest, context: LogContext = {}) {
    this.context = context
  }

  private formatContext(context: LogContext = {}): LogObject {
    return {
      ...this.context,
      ...context,
      timestamp: new Date().toISOString(),
    }
  }

  debug(message: string, context: LogContext = {}) {
    baseLogger.debug(this.formatContext(context), message)
  }

  info(message: string, context: LogContext = {}) {
    baseLogger.info(this.formatContext(context), message)
  }

  warn(message: string, context: LogContext = {}) {
    baseLogger.warn(this.formatContext(context), message)
  }

  error(message: string, error?: Error, context: LogContext = {}) {
    baseLogger.error(
      {
        ...this.formatContext(context),
        err: error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : undefined,
      },
      message,
    )
  }
}

// Create a logger instance for use without request context
export const logger = baseLogger

// Create a logger instance with request context
export const createLogger = (req: PayloadRequest, context: LogContext = {}) => {
  return new Logger(req, context)
}

// NOTE: Consider adding request ID or user ID to logger context by default if available for better traceability.
