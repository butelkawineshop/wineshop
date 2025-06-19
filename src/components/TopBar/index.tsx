'use client'

import React from 'react'
import { useTheme } from '@/providers/ThemeProvider'
import { IconColor } from '@/components/IconColor'
import { useTranslation } from '@/hooks/useTranslation'
import { useLanguage } from '@/providers/LanguageProvider'

export const TopBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const { language, toggleLanguage } = useLanguage()

  console.log('Current theme:', theme)

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
          onClick={toggleLanguage}
        >
          <IconColor name="language" width={20} height={20} theme={theme} />
          {language === 'sl' ? 'English' : 'Slovenščina'}
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
