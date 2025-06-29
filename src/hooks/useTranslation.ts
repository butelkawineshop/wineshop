import { useTranslations } from 'next-intl'
import { logger } from '@/lib/logger'
import { HOOK_CONSTANTS } from '@/constants/hooks'

interface UseTranslationReturn {
  t: (key: string, values?: Record<string, string | number>) => string
}

export function useTranslation(): UseTranslationReturn {
  const t = useTranslations()

  return {
    t: (key: string, values?: Record<string, string | number>): string => {
      try {
        return t(key, values)
      } catch (_error) {
        if (process.env.NODE_ENV === 'development') {
          logger.warn({ key, values }, HOOK_CONSTANTS.ERROR_MESSAGES.MISSING_TRANSLATION_KEY)
        }
        return key
      }
    },
  }
}
