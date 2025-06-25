import Redis from 'ioredis'

// Validate required environment variable
if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not set')
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
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

// Event listeners for monitoring and debugging
redis.on('error', (error) => {
  console.error('Redis connection error:', error)
})

redis.on('connect', () => {
  console.log('Connected to Redis')
})
