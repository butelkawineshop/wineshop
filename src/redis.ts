import Redis from 'ioredis'
import { Command } from 'ioredis'
import { logger } from '@/lib/logger'

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
})

redisClient.on('error', (error: Error) => {
  logger.error({ err: error }, 'Redis Client Error')
})

redisClient.on('connect', () => {
  logger.info('Redis Client Connected')
})

// Helper functions for cache operations
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redisClient.get(key)
      return data ? (JSON.parse(data) as T) : null
    } catch (error) {
      logger.error({ err: error, key }, 'Redis Get Error')
      return null
    }
  },

  async set(
    key: string,
    value: string | number | Buffer,
    mode?: 'EX' | 'PX',
    duration?: number,
    condition?: 'NX' | 'XX' | 'KEEPTTL',
  ): Promise<'OK' | null> {
    try {
      const args = [key, value]
      if (mode && duration) {
        args.push(mode, duration.toString())
      }
      if (condition) {
        args.push(condition)
      }
      const result = await redisClient.sendCommand(new Command('SET', args))
      return result === 'OK' ? 'OK' : null
    } catch (error) {
      logger.error({ err: error, key }, 'Redis Set Error')
      return null
    }
  },

  async setJSON<T>(key: string, value: T, ttl?: number): Promise<'OK' | null> {
    try {
      const serialized = JSON.stringify(value)
      if (ttl) {
        return await redisClient.set(key, serialized, 'EX', ttl)
      }
      return await redisClient.set(key, serialized)
    } catch (error) {
      logger.error({ err: error, key }, 'Redis SetJSON Error')
      return null
    }
  },

  async del(key: string): Promise<number> {
    try {
      return await redisClient.del(key)
    } catch (error) {
      logger.error({ err: error, key }, 'Redis Delete Error')
      return 0
    }
  },

  async exists(key: string): Promise<boolean> {
    try {
      const result = await redisClient.exists(key)
      return result === 1
    } catch (error) {
      logger.error({ err: error, key }, 'Redis Exists Error')
      return false
    }
  },
}

export default redisClient
