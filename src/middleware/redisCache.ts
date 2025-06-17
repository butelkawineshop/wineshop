import { Request, Response, NextFunction } from 'express'
import { cache } from '@/redis'
import { logger } from '@/lib/logger'

interface CacheOptions {
  ttl?: number
  key?: string
}

export const redisCache = (options: CacheOptions = {}) => {
  const { ttl = 3600, key } = options

  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next()
    }

    const cacheKey = key || `${req.originalUrl || req.url}`

    try {
      const cachedResponse = await cache.get<unknown>(cacheKey)
      if (cachedResponse) {
        logger.info({ key: cacheKey }, 'Redis Cache HIT')
        return res.json(cachedResponse)
      }

      const originalJson = res.json
      res.json = function (body: unknown) {
        try {
          cache.setJSON(cacheKey, body, ttl)
        } catch (error) {
          logger.error({ err: error, key: cacheKey }, 'Redis Cache SET Error')
        }
        return originalJson.call(this, body)
      }

      next()
    } catch (error) {
      logger.error({ err: error, key: cacheKey }, 'Redis Cache Error')
      next()
    }
  }
}

// Cache invalidation middleware
export const invalidateCache = (pattern: string) => {
  return async (_req: Request, _res: Response, next: NextFunction) => {
    try {
      // Check if the key exists before trying to delete it
      const exists = await cache.exists(pattern)
      if (exists) {
        await cache.del(pattern)
      }
      next()
    } catch (error) {
      logger.error({ err: error, pattern }, 'Cache Invalidation Error')
      next(error)
    }
  }
}
