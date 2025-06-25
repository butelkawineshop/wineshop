'use client'

import React from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { logger } from '@/lib/logger'
import { useLanguageSwitch } from '@/hooks/useLanguageSwitch'
import { PROVIDER_CONSTANTS } from '@/constants/providers'
import type { Locale } from '@/i18n/locales'

// Language store using Zustand
interface LanguageState {
  language: Locale
  setLanguage: (lang: Locale) => void
  toggleLanguage: () => void
}

const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: PROVIDER_CONSTANTS.LANGUAGE.DEFAULT_LOCALE,
      setLanguage: (language) => {
        try {
          set({ language })
          logger.info({ language }, 'Language changed in store')
        } catch (error) {
          logger.error({ error, language }, 'Failed to set language in store')
        }
      },
      toggleLanguage: () => {
        try {
          const currentLanguage = get().language
          const newLanguage = currentLanguage === 'en' ? 'sl' : 'en'
          set({ language: newLanguage })
          logger.info({ from: currentLanguage, to: newLanguage }, 'Language toggled in store')
        } catch (error) {
          logger.error({ error }, 'Failed to toggle language in store')
        }
      },
    }),
    { name: PROVIDER_CONSTANTS.LANGUAGE.STORAGE_KEY },
  ),
)

interface LanguageProviderProps {
  children: React.ReactNode
  locale: Locale
}

/**
 * LanguageProvider component that manages language state using Zustand
 * Follows separation of concerns by delegating navigation logic to custom hook
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  locale,
}): React.JSX.Element => {
  const languageState = useLanguageStore()

  // Initialize language state with provided locale
  React.useEffect(() => {
    try {
      if (locale !== languageState.language) {
        languageState.setLanguage(locale)
        logger.info({ locale }, 'Language initialized from props')
      }
    } catch (error) {
      logger.error({ error, locale }, 'Failed to initialize language from props')
    }
  }, [locale, languageState])

  return <>{children}</>
}

/**
 * Hook to access language state and actions
 * Uses Zustand store instead of React Context as per conventions
 */
export function useLanguage(): LanguageState & {
  switchLanguage: (newLanguage: Locale) => Promise<void>
} {
  const languageState = useLanguageStore()
  const { switchLanguage } = useLanguageSwitch()

  return {
    ...languageState,
    setLanguage: async (newLanguage: Locale) => {
      try {
        languageState.setLanguage(newLanguage)
        await switchLanguage(newLanguage)
      } catch (error) {
        logger.error({ error, newLanguage }, 'Failed to set and switch language')
      }
    },
    toggleLanguage: async () => {
      try {
        const currentLanguage = languageState.language
        const newLanguage = currentLanguage === 'en' ? 'sl' : 'en'
        languageState.setLanguage(newLanguage)
        await switchLanguage(newLanguage)
      } catch (error) {
        logger.error({ error }, 'Failed to toggle language')
      }
    },
    switchLanguage,
  }
}
