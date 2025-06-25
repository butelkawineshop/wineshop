'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/providers/ThemeProvider'
import { Icon } from '@/components/Icon'
import { useStore } from '@/store'
import { useTranslation } from '@/hooks/useTranslation'
import { type Locale } from '@/i18n/locales'
import { LanguageService } from '@/services/LanguageService'
import { logger } from '@/lib/logger'

export const TopBar: React.FC = (): React.ReactElement => {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const language = useStore((state) => state.language)
  const { t } = useTranslation()

  // Detect current locale from pathname and initialize store
  useEffect(() => {
    const detectedLocale: Locale = pathname.startsWith('/en') ? 'en' : 'sl'
    if (detectedLocale !== language.state.currentLanguage) {
      // Check if setLanguage exists, if not, skip setting it
      if (typeof language.actions.setLanguage === 'function') {
        language.actions.setLanguage(detectedLocale)
      }
    }
  }, [pathname, language.state.currentLanguage, language.actions])

  const handleLanguageClick = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault()
    event.stopPropagation()

    if (language.state.isSwitching) return

    // Fallback: if store actions are not working, use LanguageService directly
    if (typeof language.actions.toggleLanguage !== 'function') {
      try {
        const currentLanguage = pathname.startsWith('/en') ? 'en' : 'sl'
        const newLanguage = currentLanguage === 'en' ? 'sl' : 'en'

        const { newPath } = await LanguageService.switchLanguage({
          currentPathname: pathname,
          newLanguage,
        })

        if (newPath) {
          // Set the locale cookie
          document.cookie = `NEXT_LOCALE=${newLanguage};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`
          // Navigate to new path
          window.location.href = newPath
        }
      } catch (error) {
        logger.error({ error, pathname }, 'Direct language switch failed')
      }
      return
    }

    await language.actions.toggleLanguage(pathname)
  }

  return (
    <div className="hidden md:flex w-full h-10 bg-background text-foreground font-accent items-center px-8 text-sm border-b border-gray-200">
      {/* Left: Email and Phone - Fixed width */}
      <div className="w-1/3 flex items-center gap-4">
        <a
          href="mailto:info@example.com"
          className="hover:underline flex items-center gap-2 link-container"
        >
          <Icon name="email" width={16} height={16} variant="color" />
          <span className="text-sm">info@example.com</span>
        </a>
        <span className="text-sm">|</span>
        <a href="tel:+123456789" className="hover:underline flex items-center gap-2 link-container">
          <Icon name="phone" width={16} height={16} variant="color" />
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
          type="button"
          className={`flex items-center gap-2 px-2 py-1 rounded button-secondary link-container ${
            language.state.isSwitching ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleLanguageClick}
          disabled={language.state.isSwitching}
        >
          <Icon name="language" width={20} height={20} variant="color" />
          <span className="text-sm">
            {language.state.isSwitching ? '...' : t('header.language.switch')}
          </span>
        </button>
        <span className="text-sm">|</span>
        <button
          className="flex items-center gap-2 px-2 py-1 rounded button-secondary link-container"
          onClick={toggleTheme}
        >
          <Icon
            name={theme === 'light' ? 'dark' : 'light'}
            width={20}
            height={20}
            variant="color"
          />
          <span className="text-sm">
            {t(theme === 'light' ? 'header.theme.dark' : 'header.theme.light')}
          </span>
        </button>
      </div>
    </div>
  )
}
