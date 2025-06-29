import { createLogger } from './logger'
import type { PayloadRequest } from 'payload'

export interface ErrorDetails {
  [key: string]: string | number | boolean | null | undefined | ErrorDetails | Array<ErrorDetails>
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: ErrorDetails,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'VALIDATION_ERROR', 400, details)
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'NOT_FOUND', 404, details)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, details?: ErrorDetails) {
    super(message, 'UNAUTHORIZED', 401, details)
    this.name = 'UnauthorizedError'
  }
}

export const handleError = async (
  req: PayloadRequest,
  error: unknown,
  context: {
    task?: string
    operation?: string
    collection?: string
    id?: string | number
  } = {},
): Promise<{ output: { success: false; message: string; code?: string } }> => {
  const logger = createLogger(req, context)

  if (error instanceof AppError) {
    logger.error('Application error occurred', error, {
      code: error.code,
      statusCode: error.statusCode,
      details: error.details,
    })
    return {
      output: {
        success: false,
        message: error.message,
        code: error.code,
      },
    }
  }

  if (error instanceof Error) {
    logger.error('Unexpected error occurred', error)
    return {
      output: {
        success: false,
        message: 'An unexpected error occurred',
      },
    }
  }

  logger.error('Unknown error occurred', new Error('Unknown error type'))
  return {
    output: {
      success: false,
      message: 'An unknown error occurred',
    },
  }
}

// NOTE: Always include as much context as possible in error logs (route, user, etc.) for traceability.
// Consider using a union type for error codes in the future for better type safety.
