'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/providers/ThemeProvider'
import { IconColor } from '@/components/IconColor'
import { useLanguageStore } from '@/store/slices/languageSlice'
import { useTranslation } from '@/hooks/useTranslation'
import { type Locale } from '@/i18n/locales'

export const TopBar: React.FC = (): React.ReactElement => {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { currentLanguage, isSwitching, toggleLanguage, setLanguage } = useLanguageStore()
  const { t } = useTranslation()

  // Detect current locale from pathname and initialize store
  useEffect(() => {
    const detectedLocale: Locale = pathname.startsWith('/en') ? 'en' : 'sl'
    if (detectedLocale !== currentLanguage) {
      setLanguage(detectedLocale)
    }
  }, [pathname, currentLanguage, setLanguage])

  const handleLanguageClick = async (): Promise<void> => {
    if (isSwitching) return
    await toggleLanguage(pathname)
  }

  return (
    <div className="hidden md:flex w-full h-10 bg-background text-foreground font-accent items-center px-8 text-sm border-b border-gray-200">
      {/* Left: Email and Phone - Fixed width */}
      <div className="w-1/3 flex items-center gap-4">
        <a
          href="mailto:info@example.com"
          className="hover:underline flex items-center gap-2 link-container"
        >
          <IconColor name="email" width={16} height={16} theme={theme} />
          <span className="text-sm">info@example.com</span>
        </a>
        <span className="text-sm">|</span>
        <a href="tel:+123456789" className="hover:underline flex items-center gap-2 link-container">
          <IconColor name="phone" width={16} height={16} theme={theme} />
          <span className="text-sm">+1 234 567 89</span>
        </a>
      </div>

      {/* Center: Rotating Notification Bar - Fixed width, centered */}
      <div className="w-1/3 flex justify-center">
        <div className="animate-pulse text-sm">
          This is a notification! (Rotating messages coming soon)
        </div>
      </div>

      {/* Right: Language and Theme Switcher - Fixed width, right-aligned */}
      <div className="w-1/3 flex items-center justify-end gap-4">
        <button
          className={`flex items-center gap-2 px-2 py-1 rounded button-secondary ${
            isSwitching ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleLanguageClick}
          disabled={isSwitching}
        >
          <IconColor name="language" width={20} height={20} theme={theme} />
          <span className="text-sm">{isSwitching ? '...' : t('header.language.switch')}</span>
        </button>
        <span className="text-sm">|</span>
        <button
          className="flex items-center gap-2 px-2 py-1 rounded button-secondary"
          onClick={toggleTheme}
        >
          <IconColor
            name={theme === 'light' ? 'dark' : 'light'}
            width={20}
            height={20}
            theme={theme}
          />
          <span className="text-sm">
            {t(theme === 'light' ? 'header.theme.dark' : 'header.theme.light')}
          </span>
        </button>
      </div>
    </div>
  )
}
