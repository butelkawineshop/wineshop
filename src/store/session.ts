import { Session } from 'next-auth'
import { redis } from '@/lib/integrations/redis'

const PREFIX = 'session:'
const EXPIRY = 60 * 60 * 24 * 7 // 7 days in seconds

interface SessionStore {
  state: {
    session: Session | null
  }
  actions: {
    get: (sessionToken: string) => Promise<Session | null>
    set: (sessionToken: string, session: Session) => Promise<void>
    delete: (sessionToken: string) => Promise<void>
  }
}

export const sessionStore: SessionStore = {
  state: {
    session: null,
  },
  actions: {
    async get(sessionToken: string): Promise<Session | null> {
      const data = await redis.get(`${PREFIX}${sessionToken}`)
      if (!data) return null
      return JSON.parse(data)
    },

    async set(sessionToken: string, session: Session): Promise<void> {
      await redis.set(`${PREFIX}${sessionToken}`, JSON.stringify(session), 'EX', EXPIRY)
    },

    async delete(sessionToken: string): Promise<void> {
      await redis.del(`${PREFIX}${sessionToken}`)
    },
  },
}
