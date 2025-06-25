'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { logger } from '@/lib/logger'
import { PROVIDER_CONSTANTS } from '@/constants/providers'

// Theme store using Zustand
interface ThemeState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: PROVIDER_CONSTANTS.THEME.DEFAULT_THEME,
      setTheme: (theme) => {
        try {
          set({ theme })
          logger.info({ theme }, 'Theme changed')
        } catch (error) {
          logger.error({ error, theme }, 'Failed to set theme')
        }
      },
      toggleTheme: () => {
        try {
          const currentTheme = get().theme
          const newTheme = currentTheme === 'light' ? 'dark' : 'light'
          set({ theme: newTheme })
          logger.info({ from: currentTheme, to: newTheme }, 'Theme toggled')
        } catch (error) {
          logger.error({ error }, 'Failed to toggle theme')
        }
      },
    }),
    { name: PROVIDER_CONSTANTS.THEME.STORAGE_KEY },
  ),
)

// Context for Theme
const ThemeContext = createContext<ThemeState | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}): React.JSX.Element => {
  const themeState = useThemeStore()
  const [isLoaded, setIsLoaded] = React.useState(false)

  useEffect(() => {
    try {
      document.documentElement.setAttribute(
        PROVIDER_CONSTANTS.THEME.HTML_ATTRIBUTE,
        themeState.theme,
      )
      logger.debug({ theme: themeState.theme }, 'Theme applied to document')
      setIsLoaded(true)
    } catch (error) {
      logger.error({ error, theme: themeState.theme }, 'Failed to apply theme to document')
      setIsLoaded(true) // Still set loaded to prevent infinite loading
    }
  }, [themeState.theme])

  // Show loading state until theme is applied
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return <ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    const error = new Error('useTheme must be used within ThemeProvider')
    logger.error({ error: error.message }, 'Theme context not found')
    throw error
  }
  return ctx
}
