import cors from 'cors'
import helmet from 'helmet'
import { Express, RequestHandler } from 'express'
import rateLimit from 'express-rate-limit'

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

// Request size limiter
const requestSizeLimiter: RequestHandler = (req, res, next) => {
  const MAX_SIZE = 1024 * 1024 * 10 // 10MB
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > MAX_SIZE) {
    res.status(413).json({ error: 'Request entity too large' })
    return
  }
  next()
}

// Security headers middleware
const securityHeaders: RequestHandler = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY')

  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // Enable XSS filter in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block')

  // Control browser features
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  )

  // Prevent caching of sensitive data
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
  }

  next()
}

export const configureSecurity = (app: Express) => {
  // Apply rate limiting
  app.use(limiter)

  // Apply request size limiting
  app.use(requestSizeLimiter)

  // Apply security headers
  app.use(securityHeaders)

  // CORS configuration
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
      maxAge: 86400, // 24 hours
    }),
  )

  // Helmet configuration
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-site' },
      dnsPrefetchControl: { allow: false },
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      ieNoOpen: true,
      noSniff: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      xssFilter: true,
    }),
  )
}
