'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@/components/Icon'
// import { useTranslations } from 'next-intl' // Uncomment if using next-intl
import { MobileMenu } from '@/components/Header/MobileMenu'
import { Logo } from '../Logo'
import { TopBar } from '../TopBar'
import { useTheme } from '@/providers/ThemeProvider'

interface NavItem {
  id: string
  title: string
  icon: string
  url: string
  order: number
}

export const Header = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [showLogo, setShowLogo] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // const t = useTranslations() // Uncomment if using next-intl
  const { theme } = useTheme()

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

  // Navigation items (replace t('...') with strings or your translation function)
  const navItems: NavItem[] = [
    {
      id: 'wineshop',
      title: 'Wineshop',
      icon: 'wine',
      url: '/wineshop',
      order: 0,
    },
    {
      id: 'tastings',
      title: 'Tastings',
      icon: 'tastings',
      url: '/tastings',
      order: 1,
    },
    {
      id: 'kgb',
      title: 'KGB',
      icon: 'kgb',
      url: '/kgb',
      order: 2,
    },
    {
      id: 'butelka',
      title: 'Butelka',
      icon: 'butelka',
      url: '/butelka',
      order: 3,
    },
    {
      id: 'blog',
      title: 'Blog',
      icon: 'blog',
      url: '/encyclopedia',
      order: 4,
    },
  ]

  const leftMenuItems = navItems.filter((item) => item.order < 3)
  const rightMenuItems = navItems.filter((item) => item.order >= 3)

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
                <Link
                  key={item.id}
                  href={item.url}
                  className="text-foreground hover:text-primary flex flex-col items-center icon-container group"
                >
                  <div className="h-12 w-12 p-1 rounded-full flex items-center justify-center">
                    <Icon name={item.icon} width={32} height={32} />
                  </div>
                  {showLogo && <span className="text-[10px] text-foreground/60">{item.title}</span>}
                </Link>
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
              {rightMenuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.url}
                  className="text-foreground hover:text-primary flex flex-col items-center icon-container group"
                >
                  <div className="h-12 w-12 p-1 rounded-full flex items-center justify-center">
                    <Icon name={item.icon} width={32} height={32} />
                  </div>
                  {showLogo && <span className="text-[10px] text-foreground/60">{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        {/* Mobile Header */}
        <div className="md:hidden h-32 flex items-center justify-between flex-row relative">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-4" aria-label="menu">
            <Icon name="menu" width={24} height={24} />
          </button>
          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center h-full">
            <Link href="/" className="block">
              <Logo theme={theme} className="w-32 h-32" />
            </Link>
          </div>
          <div className="w-12"></div>
        </div>
      </header>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuItems={navItems}
      />
    </>
  )
}
