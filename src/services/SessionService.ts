import { Session } from 'next-auth'
import { redis } from '@/lib/integrations/redis'
import { STORE_CONSTANTS } from '@/constants/store'

export class SessionService {
  private static readonly PREFIX = STORE_CONSTANTS.SESSION_PREFIX
  private static readonly EXPIRY = STORE_CONSTANTS.SESSION_EXPIRY_SECONDS

  static async get(sessionToken: string): Promise<Session | null> {
    try {
      const data = await redis.get(`${this.PREFIX}${sessionToken}`)
      if (!data) return null
      return JSON.parse(data) as Session
    } catch (error) {
      // In production, this should use proper logging
      if (process.env.NODE_ENV === 'development') {
        console.error('Session get failed:', error)
      }
      return null
    }
  }

  static async set(sessionToken: string, session: Session): Promise<void> {
    try {
      await redis.set(`${this.PREFIX}${sessionToken}`, JSON.stringify(session), 'EX', this.EXPIRY)
    } catch (error) {
      // In production, this should use proper logging
      if (process.env.NODE_ENV === 'development') {
        console.error('Session set failed:', error)
      }
      throw new Error('Failed to store session')
    }
  }

  static async delete(sessionToken: string): Promise<void> {
    try {
      await redis.del(`${this.PREFIX}${sessionToken}`)
    } catch (error) {
      // In production, this should use proper logging
      if (process.env.NODE_ENV === 'development') {
        console.error('Session delete failed:', error)
      }
      throw new Error('Failed to delete session')
    }
  }
}
