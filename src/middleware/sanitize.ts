import { Request, Response, NextFunction } from 'express'

const sanitizeString = (str: string): string => {
  return str
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove on* attributes
    .trim()
}

type SanitizableValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | SanitizableObject
  | SanitizableArray
interface SanitizableObject {
  [key: string]: SanitizableValue
}
type SanitizableArray = SanitizableValue[]

const sanitizeObject = (obj: SanitizableValue): SanitizableValue => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject)
  }

  const sanitized: SanitizableObject = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value)
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value)
    } else {
      sanitized[key] = value
    }
  }
  return sanitized
}

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    req.body = sanitizeObject(req.body) as typeof req.body
  }
  if (req.query) {
    req.query = sanitizeObject(req.query) as typeof req.query
  }
  if (req.params) {
    req.params = sanitizeObject(req.params) as typeof req.params
  }
  next()
}
