import { useTranslations } from 'next-intl'
import { logger } from '@/lib/logger'

type TranslationKey = string
type TranslationValues = Record<string, string | number>

export function useTranslation() {
  const t = useTranslations()

  return {
    t: (key: TranslationKey, values?: TranslationValues) => {
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
