'use client'

import React, { createContext, useContext, useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Theme store using Zustand
interface ThemeState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
    }),
    { name: 'theme' },
  ),
)

// Context for Theme
const ThemeContext = createContext<ThemeState | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const themeState = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeState.theme)
  }, [themeState.theme])

  return <ThemeContext.Provider value={themeState}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
