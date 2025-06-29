import { useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { LanguageService } from '@/services/LanguageService'
import { logger } from '@/lib/logger'
import { HOOK_CONSTANTS } from '@/constants/hooks'
import type { Locale } from '@/i18n/locales'

interface UseLanguageSwitchReturn {
  switchLanguage: (newLanguage: Locale) => Promise<void>
  toggleLanguage: () => Promise<void>
}

/**
 * Custom hook for language switching functionality
 * Focuses on React concerns and delegates business logic to services
 */
export function useLanguageSwitch(): UseLanguageSwitchReturn {
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
        logger.error(
          { error, pathname, newLanguage },
          HOOK_CONSTANTS.ERROR_MESSAGES.LANGUAGE_SWITCH_FAILED,
        )
        // Silent fail - fallback to current page
      }
    },
    [pathname],
  )

  const toggleLanguage = useCallback(async (): Promise<void> => {
    const currentLocale = pathname.startsWith(`/${HOOK_CONSTANTS.LOCALES.EN}`)
      ? HOOK_CONSTANTS.LOCALES.EN
      : HOOK_CONSTANTS.LOCALES.SL
    const nextLanguage =
      currentLocale === HOOK_CONSTANTS.LOCALES.EN
        ? HOOK_CONSTANTS.LOCALES.SL
        : HOOK_CONSTANTS.LOCALES.EN
    await switchLanguage(nextLanguage)
  }, [pathname, switchLanguage])

  return {
    switchLanguage,
    toggleLanguage,
  }
}
