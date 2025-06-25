import { Session } from 'next-auth'
import { redis } from '@/lib/integrations/redis'
import { STORE_CONSTANTS } from '@/constants/store'
import { logger } from '@/lib/logger'

export class SessionService {
  private static readonly PREFIX = STORE_CONSTANTS.SESSION_PREFIX
  private static readonly EXPIRY = STORE_CONSTANTS.SESSION_EXPIRY_SECONDS

  static async get(sessionToken: string): Promise<Session | null> {
    try {
      const data = await redis.get(`${this.PREFIX}${sessionToken}`)
      if (!data) {
        logger.debug({ sessionToken }, 'Session not found in Redis')
        return null
      }

      const session = JSON.parse(data) as Session
      logger.debug({ sessionToken, userId: session.user?.id }, 'Session retrieved from Redis')
      return session
    } catch (error) {
      logger.error({ error, sessionToken }, 'Session get failed')
      return null
    }
  }

  static async set(sessionToken: string, session: Session): Promise<void> {
    try {
      await redis.set(`${this.PREFIX}${sessionToken}`, JSON.stringify(session), 'EX', this.EXPIRY)
      logger.debug({ sessionToken, userId: session.user?.id }, 'Session stored in Redis')
    } catch (error) {
      logger.error({ error, sessionToken, userId: session.user?.id }, 'Session set failed')
      throw new Error('Failed to store session')
    }
  }

  static async delete(sessionToken: string): Promise<void> {
    try {
      await redis.del(`${this.PREFIX}${sessionToken}`)
      logger.debug({ sessionToken }, 'Session deleted from Redis')
    } catch (error) {
      logger.error({ error, sessionToken }, 'Session delete failed')
      throw new Error('Failed to delete session')
    }
  }

  /**
   * Check if Redis is available and working
   */
  static async isHealthy(): Promise<boolean> {
    try {
      await redis.ping()
      return true
    } catch (error) {
      logger.error({ error }, 'Redis health check failed')
      return false
    }
  }
}
