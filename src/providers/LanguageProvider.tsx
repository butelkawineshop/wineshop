'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useRouter, usePathname } from 'next/navigation'
import { locales, defaultLocale, Locale } from '@/i18n/locales'

interface LanguageState {
  language: Locale
  setLanguage: (lang: Locale) => void
  toggleLanguage: () => void
}

const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: defaultLocale,
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () => {
        const current = get().language
        const next = locales[(locales.indexOf(current) + 1) % locales.length]
        set({ language: next })
      },
    }),
    { name: 'language' },
  ),
)

const LanguageContext = createContext<LanguageState | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const languageState = useLanguageStore()
  const router = useRouter()
  const pathname = usePathname()
  const hasInitialized = useRef(false)

  // Sync language state with current URL locale (only on mount)
  useEffect(() => {
    if (!hasInitialized.current) {
      const currentLocale = pathname.startsWith('/en') ? 'en' : 'sl'
      if (currentLocale !== languageState.language) {
        languageState.setLanguage(currentLocale)
      }
      hasInitialized.current = true
    }
  }, [pathname, languageState])

  const handleLanguageChange = (newLanguage: Locale) => {
    // Update the store
    languageState.setLanguage(newLanguage)

    // Navigate to the new locale
    if (newLanguage === 'en') {
      // Add /en prefix for English
      router.push(`/en${pathname}`)
    } else {
      // Remove /en prefix for Slovenian (default)
      const pathWithoutEn = pathname.replace(/^\/en/, '')
      router.push(pathWithoutEn || '/')
    }

    // Force a full page refresh to reload translations
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const enhancedLanguageState = {
    ...languageState,
    setLanguage: handleLanguageChange,
    toggleLanguage: () => {
      const current = languageState.language
      const next = locales[(locales.indexOf(current) + 1) % locales.length]
      handleLanguageChange(next)
    },
  }

  return (
    <LanguageContext.Provider value={enhancedLanguageState}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
