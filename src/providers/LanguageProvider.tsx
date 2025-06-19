'use client'

import React, { createContext, useContext, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { type Locale } from '@/i18n/locales'
import { routeMappings, getCollectionForRouteSegment } from '@/utils/routeMappings'

interface LanguageState {
  language: Locale
  setLanguage: (lang: Locale) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageState | undefined>(undefined)

interface LanguageProviderProps {
  children: React.ReactNode
  locale: Locale
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
  locale,
}): React.ReactElement => {
  const pathname = usePathname()

  const handleLanguageChange = useCallback(
    async (newLanguage: Locale): Promise<void> => {
      try {
        // Handle root path
        if (pathname === '/' || pathname === '/en') {
          const newPath = newLanguage === 'en' ? '/en' : '/'
          window.location.href = newPath
          return
        }

        const segments = pathname.split('/').filter(Boolean)
        const validSegments = segments.filter(
          (segment) => !segment.startsWith('(') && !segment.endsWith(')'),
        )

        if (validSegments.length === 0) {
          return
        }

        const currentLocale = pathname.startsWith('/en') ? 'en' : 'sl'
        const base = currentLocale === 'en' ? validSegments[1] : validSegments[0]
        const slug = currentLocale === 'en' ? validSegments[2] : validSegments[1]
        const route = base

        if (!route) {
          return
        }

        const collection =
          route === 'wine' || route === 'vino' ? 'wines' : getCollectionForRouteSegment(route)
        if (!collection) {
          return
        }

        let translatedSlug: string | null = null

        if (slug) {
          try {
            const where = {
              [`slug.${currentLocale}`]: { equals: slug },
            }

            const params = new URLSearchParams()
            params.set('where', JSON.stringify(where))
            params.set('depth', '1')
            params.set('locale', 'all')
            params.set('sort', '-createdAt')
            const url = `/api/${collection}?${params.toString()}`

            const res = await fetch(url)
            if (!res.ok) {
              throw new Error(`API request failed with status ${res.status}`)
            }

            const data = await res.json()

            if (!data.docs || data.docs.length === 0) {
              return
            }

            const doc = data.docs.find((doc: unknown) => {
              const docSlug =
                typeof doc === 'object' && doc !== null && 'slug' in doc
                  ? typeof doc.slug === 'string'
                    ? doc.slug
                    : (doc.slug as Record<string, string>)?.[currentLocale]
                  : null
              return docSlug?.toLowerCase?.() === slug.toLowerCase()
            })

            if (!doc) {
              return
            }

            const slugs = (doc as { slug: Record<string, string> }).slug
            if (!slugs) {
              return
            }

            translatedSlug = slugs[newLanguage] || slug
          } catch {
            translatedSlug = slug
          }
        }

        const newBase = Object.entries(routeMappings).find(
          ([, val]) => val[currentLocale] === base && val.collection === collection,
        )?.[1]?.[newLanguage]

        if (!newBase) {
          return
        }

        const newPath = `/${newLanguage === 'en' ? 'en/' : ''}${newBase}${translatedSlug ? '/' + translatedSlug : ''}`

        window.location.href = newPath
      } catch {
        // Silent fail - fallback to current page
      }
    },
    [pathname],
  )

  const toggleLanguage = useCallback((): void => {
    const currentLocale = pathname.startsWith('/en') ? 'en' : 'sl'
    const next = currentLocale === 'en' ? 'sl' : 'en'
    handleLanguageChange(next)
  }, [pathname, handleLanguageChange])

  const languageState: LanguageState = {
    language: locale,
    setLanguage: handleLanguageChange,
    toggleLanguage,
  }

  return <LanguageContext.Provider value={languageState}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageState {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
