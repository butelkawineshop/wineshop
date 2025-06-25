import { useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { LanguageService } from '@/services/LanguageService'
import { logger } from '@/lib/logger'
import type { Locale } from '@/i18n/locales'

/**
 * Custom hook for language switching functionality
 * Focuses on React concerns and delegates business logic to services
 */
export function useLanguageSwitch() {
  const pathname = usePathname()

  const switchLanguage = useCallback(
    async (newLanguage: Locale): Promise<void> => {
      try {
        const { newPath } = await LanguageService.switchLanguage({
          currentPathname: pathname,
          newLanguage,
        })

        if (newPath) {
          window.location.href = newPath
        }
      } catch (error) {
        logger.error({ error, pathname, newLanguage }, 'Language switch failed')
        // Silent fail - fallback to current page
      }
    },
    [pathname],
  )

  const toggleLanguage = useCallback(async (): Promise<void> => {
    const currentLocale = pathname.startsWith('/en') ? 'en' : 'sl'
    const nextLanguage = currentLocale === 'en' ? 'sl' : 'en'
    await switchLanguage(nextLanguage)
  }, [pathname, switchLanguage])

  return {
    switchLanguage,
    toggleLanguage,
  }
}
