import Redis from 'ioredis'
import { logger } from '@/lib/logger'
import { REDIS_CONSTANTS } from '@/constants/api'

// Validate required environment variable
if (!process.env.REDIS_URL) {
  throw new Error(REDIS_CONSTANTS.ERROR_MESSAGES.URL_NOT_SET)
}

/**
 * Redis client instance for caching and session storage
 *
 * This client is configured with:
 * - Connection retry strategy with exponential backoff
 * - Maximum 3 retries per request
 * - Error and connection event logging
 * - Environment-based configuration
 *
 * @example
 * ```ts
 * import { redis } from '@/lib/integrations/redis'
 *
 * // Cache data
 * await redis.set('key', 'value', 'EX', 3600)
 *
 * // Retrieve data
 * const value = await redis.get('key')
 *
 * // Session storage
 * await redis.setex(`session:${userId}`, 7200, sessionData)
 * ```
 */
export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: REDIS_CONSTANTS.MAX_RETRIES_PER_REQUEST,
  retryStrategy: (times) => {
    const delay = Math.min(
      times * REDIS_CONSTANTS.RETRY_DELAY_BASE_MS,
      REDIS_CONSTANTS.RETRY_DELAY_MAX_MS,
    )
    return delay
  },
})

// Event listeners for monitoring and debugging
redis.on('error', (error) => {
  logger.error({ error, host: process.env.REDIS_URL?.split('@')[1] }, 'Redis connection error')
})

redis.on('connect', () => {
  logger.info({ host: process.env.REDIS_URL?.split('@')[1] }, 'Connected to Redis')
})
