'use client'

import React from 'react'
import { useTheme } from '@/providers/ThemeProvider'
import { IconColor } from '@/components/IconColor'
import { useLanguage } from '@/providers/LanguageProvider'
import slMessages from '../../../messages/sl.json'
import enMessages from '../../../messages/en.json'

export const TopBar: React.FC = (): React.ReactElement => {
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage } = useLanguage()

  // Use the same translation approach as HomePage
  const messages = language === 'en' ? enMessages : slMessages
  const t = (key: string): string => {
    const keys = key.split('.')
    let value: unknown = messages
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k]
    }
    return typeof value === 'string' ? value : key
  }

  const handleLanguageClick = (): void => {
    toggleLanguage()
  }

  return (
    <div className="hidden md:flex w-full h-10 bg-background text-foreground font-accent items-center px-8 text-sm border-b border-gray-200">
      {/* Left: Email and Phone - Fixed width */}
      <div className="w-1/3 flex items-center gap-4">
        <a href="mailto:info@example.com" className="hover:underline flex items-center gap-2">
          <IconColor name="email" width={16} height={16} theme={theme} />
          info@example.com
        </a>
        <span>|</span>
        <a href="tel:+123456789" className="hover:underline flex items-center gap-2">
          <IconColor name="phone" width={16} height={16} theme={theme} />
          +1 234 567 89
        </a>
      </div>

      {/* Center: Rotating Notification Bar - Fixed width, centered */}
      <div className="w-1/3 flex justify-center">
        <div className="animate-pulse">This is a notification! (Rotating messages coming soon)</div>
      </div>

      {/* Right: Language and Theme Switcher - Fixed width, right-aligned */}
      <div className="w-1/3 flex items-center justify-end gap-4">
        <button
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-foreground/10"
          onClick={handleLanguageClick}
        >
          <IconColor name="language" width={20} height={20} theme={theme} />
          {t('header.language.switch')}
        </button>
        <span>|</span>
        <button
          className="flex items-center gap-2 px-2 py-1 rounded hover:bg-foreground/10"
          onClick={toggleTheme}
        >
          <IconColor
            name={theme === 'light' ? 'dark' : 'light'}
            width={20}
            height={20}
            theme={theme}
          />
          {t(theme === 'light' ? 'header.theme.dark' : 'header.theme.light')}
        </button>
      </div>
    </div>
  )
}
