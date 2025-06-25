import { useTranslations } from 'next-intl'
import { logger } from '@/lib/logger'

export function useTranslation() {
  const t = useTranslations()

  return {
    t: (key: string, values?: Record<string, string | number>) => {
      try {
        return t(key, values)
      } catch (_error) {
        if (process.env.NODE_ENV === 'development') {
          logger.warn({ key, values }, 'Missing translation key')
        }
        return key
      }
    },
  }
}
