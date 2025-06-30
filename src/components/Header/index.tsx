'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@/components/Icon'
import { useTranslations } from 'next-intl'
import { MobileMenu } from '@/components/Header/MobileMenu'
import { SearchPopup } from '@/components/Header/SearchPopup'
import { Logo } from '../Logo'
import { TopBar } from '../TopBar'
import { useTheme } from '@/providers/ThemeProvider'
import { getLocalizedRouteSegment, detectLocaleFromPath } from '@/utils/routeUtils'

interface NavItem {
  id: string
  titleKey: string
  icon: string
  routeKey?: string // Only for items that are links
  isPopup?: boolean
  order: number
}

export const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [showLogo, setShowLogo] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const t = useTranslations('header.navigation')
  const tCommon = useTranslations('common')
  const { theme } = useTheme()
  const pathname = usePathname()
  const locale = detectLocaleFromPath(pathname)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < lastScrollY) {
        setIsVisible(true)
        setShowLogo(currentScrollY < 10)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      }
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Navigation items with translation keys
  const navItems: NavItem[] = [
    {
      id: 'search',
      titleKey: 'search',
      icon: 'search',
      isPopup: true,
      order: 0,
    },
    {
      id: 'wineshop',
      titleKey: 'wineshop',
      icon: 'wine',
      routeKey: 'wineshop',
      order: 1,
    },
    {
      id: 'tastings',
      titleKey: 'tastings',
      icon: 'tastings',
      routeKey: 'tastings',
      order: 2,
    },
    {
      id: 'kgb',
      titleKey: 'kgb',
      icon: 'kgb',
      routeKey: 'kgb',
      order: 3,
    },
    {
      id: 'butelka',
      titleKey: 'butelka',
      icon: 'butelka',
      routeKey: 'storija',
      order: 4,
    },
    {
      id: 'blog',
      titleKey: 'blog',
      icon: 'blog',
      routeKey: 'blog',
      order: 5,
    },
    {
      id: 'account',
      titleKey: 'account',
      icon: 'account',
      routeKey: 'profile',
      order: 6,
    },
    {
      id: 'cart',
      titleKey: 'cart',
      icon: 'cart',
      routeKey: 'cekar',
      order: 7,
    },
  ]

  const leftMenuItems = navItems.filter((item) => item.order < 4)
  const rightMenuItems = navItems.filter((item) => item.order >= 4)

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSearchOpen(true)
  }

  // Helper to get URL for a nav item
  const getNavUrl = (item: NavItem) => {
    if (!item.routeKey) return '#'
    const segment = getLocalizedRouteSegment(item.routeKey, locale)
    return locale === 'en' ? `/en/${segment}` : `/${segment}`
  }

  return (
    <>
      <TopBar />
      <header
        className={`w-full transition-all duration-300 ${
          isVisible && !showLogo ? 'bg-background h-16' : 'h-32'
        } ${isVisible ? 'translate-y-0' : '-translate-y-full'} md:sticky md:top-0 md:z-50`}
      >
        {/* Desktop Header */}
        <div className="hidden px-8 md:flex h-full w-full items-center justify-center flex-col">
          <div
            className={`flex items-center transition-all duration-300 ${
              showLogo ? 'gap-8' : 'gap-4'
            }`}
          >
            {/* Left Icons */}
            <nav className="flex items-center gap-4">
              {leftMenuItems.map((item) => (
                <div key={item.id}>
                  {item.isPopup ? (
                    <button
                      onClick={handleSearchClick}
                      className="text-foreground hover:text-primary flex flex-col items-center icon-container group"
                    >
                      <div className="h-12 w-12 p-1 rounded-full flex items-center justify-center">
                        <Icon name={item.icon} width={32} height={32} variant="switch" />
                      </div>
                      {showLogo && (
                        <span className="text-[10px] text-foreground/60 subtitle">
                          {t(item.titleKey)}
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      href={getNavUrl(item)}
                      className="text-foreground hover:text-primary flex flex-col items-center icon-container group"
                    >
                      <div className="h-12 w-12 p-1 rounded-full flex items-center justify-center">
                        <Icon name={item.icon} width={32} height={32} variant="switch" />
                      </div>
                      {showLogo && (
                        <span className="text-[10px] text-foreground/60 subtitle">
                          {t(item.titleKey)}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            {/* Center Logo */}
            <div
              className={`flex items-center justify-center transition-all duration-300 ease-out ${
                showLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-0 w-0'
              }`}
            >
              <Link href="/">
                <Logo theme={theme} className="w-32 h-32" />
              </Link>
            </div>
            {/* Right Icons */}
            <nav className="flex items-center gap-4">
              {rightMenuItems.map((item) =>
                item.isPopup ? (
                  <button
                    key={item.id}
                    onClick={handleSearchClick}
                    className="text-foreground hover:text-primary flex flex-col items-center icon-container group"
                  >
                    <div className="h-12 w-12 p-1 rounded-full flex items-center justify-center">
                      <Icon name={item.icon} width={32} height={32} variant="switch" />
                    </div>
                    {showLogo && (
                      <span className="text-[10px] text-foreground/60 subtitle">
                        {t(item.titleKey)}
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    key={item.id}
                    href={getNavUrl(item)}
                    className="text-foreground hover:text-primary flex flex-col items-center icon-container group"
                  >
                    <div className="h-12 w-12 p-1 rounded-full flex items-center justify-center">
                      <Icon name={item.icon} width={32} height={32} variant="switch" />
                    </div>
                    {showLogo && (
                      <span className="text-[10px] text-foreground/60 subtitle">
                        {t(item.titleKey)}
                      </span>
                    )}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>
        {/* Mobile Header */}
        <div className="md:hidden h-32 flex items-center justify-between flex-row relative">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-4 button-secondary"
            aria-label={tCommon('menu')}
          >
            <Icon name="menu" width={24} height={24} />
          </button>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center h-full">
            <Link href="/" className="block">
              <Logo theme={theme} className="w-32 h-32" />
            </Link>
          </div>
          <button onClick={handleSearchClick} className="p-4 button-secondary" aria-label="search">
            <Icon name="search" width={24} height={24} />
          </button>
        </div>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={navItems.map((item) => ({
          ...item,
          title: t(item.titleKey),
          url: item.routeKey ? getNavUrl(item) : '#',
        }))}
      />
      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
