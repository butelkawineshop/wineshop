import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type Locale } from '@/i18n/locales'
import { routeMappings, getCollectionForRouteSegment } from '@/utils/routeMappings'
import { STORE_CONSTANTS } from '@/constants/store'

// State interface
interface LanguageState {
  currentLanguage: Locale
  isSwitching: boolean
  error: string | null
}

// Actions interface
interface LanguageActions {
  setLanguage: (lang: Locale) => void
  setSwitching: (switching: boolean) => void
  setError: (error: string | null) => void
  switchLanguage: (newLanguage: Locale, pathname: string) => Promise<void>
  toggleLanguage: (pathname: string) => Promise<void>
}

// Selectors interface
interface LanguageSelectors {
  getCurrentLanguage: () => Locale
  getIsSwitching: () => boolean
  getError: () => string | null
  getIsEnglish: () => boolean
  getIsSlovenian: () => boolean
}

// Combined store interface
interface LanguageStore extends LanguageState, LanguageActions, LanguageSelectors {}

const initialState: LanguageState = {
  currentLanguage: 'sl' as Locale,
  isSwitching: false,
  error: null,
}

export const useLanguageStore = create<LanguageStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Actions
        setLanguage: (lang: Locale): void => {
          set({ currentLanguage: lang })
        },

        setSwitching: (switching: boolean): void => {
          set({ isSwitching: switching })
        },

        setError: (error: string | null): void => {
          set({ error })
        },

        switchLanguage: async (newLanguage: Locale, pathname: string): Promise<void> => {
          const state = get()
          if (state.isSwitching) return

          set({ isSwitching: true, error: null })

          try {
            // Handle root path
            if (pathname === '/' || pathname === '/en') {
              const newPath = newLanguage === 'en' ? '/en' : '/'
              document.cookie = `NEXT_LOCALE=${newLanguage};path=${STORE_CONSTANTS.COOKIE_PATH};max-age=${STORE_CONSTANTS.COOKIE_MAX_AGE_SECONDS};samesite=${STORE_CONSTANTS.COOKIE_SAME_SITE}`
              window.location.href = newPath
              return
            }

            const segments = pathname.split('/').filter(Boolean)
            const validSegments = segments.filter(
              (segment) => !segment.startsWith('(') && !segment.endsWith(')'),
            )

            if (validSegments.length === 0) {
              set({ error: 'Invalid path segments' })
              return
            }

            const currentLocale = pathname.startsWith('/en') ? 'en' : 'sl'
            const base = currentLocale === 'en' ? validSegments[1] : validSegments[0]
            const slug = currentLocale === 'en' ? validSegments[2] : validSegments[1]
            const route = base

            if (!route) {
              set({ error: 'Could not determine route' })
              return
            }

            const collection =
              route === 'wine' || route === 'vino' ? 'wines' : getCollectionForRouteSegment(route)
            if (!collection) {
              set({ error: 'Could not determine collection' })
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
                  translatedSlug = slug // Fallback to original slug
                } else {
                  const doc = data.docs.find((doc: unknown) => {
                    const docSlug =
                      typeof doc === 'object' && doc !== null && 'slug' in doc
                        ? typeof doc.slug === 'string'
                          ? doc.slug
                          : (doc.slug as Record<string, string>)?.[currentLocale]
                        : null
                    return docSlug?.toLowerCase?.() === slug.toLowerCase()
                  })

                  if (doc) {
                    const slugs = (doc as { slug: Record<string, string> }).slug
                    if (slugs) {
                      translatedSlug = slugs[newLanguage] || slug
                    } else {
                      translatedSlug = slug
                    }
                  } else {
                    translatedSlug = slug
                  }
                }
              } catch (error) {
                // In production, this should use proper logging
                if (process.env.NODE_ENV === 'development') {
                  console.error('Slug translation failed:', error)
                }
                translatedSlug = slug // Fallback to original slug
              }
            }

            const newBase = Object.entries(routeMappings).find(
              ([, val]) => val[currentLocale] === base && val.collection === collection,
            )?.[1]?.[newLanguage]

            if (!newBase) {
              set({ error: 'Could not find translated route' })
              return
            }

            const newPath = `/${newLanguage === 'en' ? 'en/' : ''}${newBase}${translatedSlug ? '/' + translatedSlug : ''}`

            // Set the locale cookie
            document.cookie = `NEXT_LOCALE=${newLanguage};path=${STORE_CONSTANTS.COOKIE_PATH};max-age=${STORE_CONSTANTS.COOKIE_MAX_AGE_SECONDS};samesite=${STORE_CONSTANTS.COOKIE_SAME_SITE}`

            // Navigate to new path
            window.location.href = newPath
          } catch (error) {
            // In production, this should use proper logging
            if (process.env.NODE_ENV === 'development') {
              console.error('Language switch failed:', error)
            }
            set({ error: 'Language switch failed' })
          } finally {
            set({ isSwitching: false })
          }
        },

        toggleLanguage: async (pathname: string): Promise<void> => {
          const state = get()
          const currentLocale = pathname.startsWith('/en') ? 'en' : 'sl'
          const next = currentLocale === 'en' ? 'sl' : 'en'
          await state.switchLanguage(next, pathname)
        },

        // Selectors
        getCurrentLanguage: (): Locale => {
          return get().currentLanguage
        },

        getIsSwitching: (): boolean => {
          return get().isSwitching
        },

        getError: (): string | null => {
          return get().error
        },

        getIsEnglish: (): boolean => {
          return get().currentLanguage === 'en'
        },

        getIsSlovenian: (): boolean => {
          return get().currentLanguage === 'sl'
        },
      }),
      {
        name: STORE_CONSTANTS.LANGUAGE_STORE_NAME,
        partialize: (state) => ({ currentLanguage: state.currentLanguage }),
      },
    ),
    {
      name: STORE_CONSTANTS.LANGUAGE_STORE_NAME,
    },
  ),
)
