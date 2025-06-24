'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { routeMappings, type Locale } from '@/utils/routeMappings'
import { getPayloadClient } from '@/lib/payload'

interface NavigationItem {
  id: string
  title: string
  slug: string
  href: string
}

interface ItemNavigationProps {
  locale: Locale
  currentTitle: string
}

export const ItemNavigation: React.FC<ItemNavigationProps> = ({
  locale,
  currentTitle: initialTitle,
}) => {
  const { t } = useTranslation()
  const pathname = usePathname()
  const [navigationItems, setNavigationItems] = React.useState<NavigationItem[]>([])
  const [currentIndex, setCurrentIndex] = React.useState<number>(-1)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [currentTitle, setCurrentTitle] = React.useState<string>(initialTitle)
  const [collection, setCollection] = React.useState<string>('')
  const [isVisible, setIsVisible] = React.useState<boolean>(false)

  // Get current slug and collection from pathname
  const segments = pathname.split('/').filter(Boolean)
  const currentSlug = locale === 'en' ? segments[2] : segments[1] // Get slug from current URL
  const collectionSegment = locale === 'en' ? segments[1] : segments[0] // Get collection from current URL

  // Debug: Always show something to confirm the component is rendering
  console.log('ItemNavigation rendering:', {
    pathname,
    locale,
    collectionSegment,
    currentSlug,
    initialTitle,
    isLoading,
    navigationItemsLength: navigationItems.length,
    currentIndex,
  })

  // Determine collection from pathname
  React.useEffect(() => {
    const determineCollection = () => {
      // Find the collection from route mappings
      const foundCollection = Object.entries(routeMappings).find(
        ([, mapping]) => mapping[locale] === collectionSegment,
      )?.[1]?.collection

      console.log('Determined collection:', foundCollection, 'from segment:', collectionSegment)
      return foundCollection
    }

    const collectionName = determineCollection()
    if (!collectionName) {
      console.error('Could not determine collection from pathname:', pathname)
      setIsLoading(false)
      return
    }

    setCollection(collectionName)
  }, [pathname, locale, collectionSegment])

  React.useEffect(() => {
    const fetchNavigationItems = async () => {
      if (!collection || !currentSlug) return

      try {
        setIsLoading(true)
        setIsVisible(false) // Fade out current content
        const payload = getPayloadClient()

        console.log('Fetching navigation items for collection:', collection)

        // Fetch all items from the collection
        const result = await payload.find({
          collection,
          depth: 0,
          limit: 1000, // Fetch all items for navigation
          sort: 'title', // Sort by title for consistent ordering
          locale,
        })

        console.log('Fetched items:', result.docs.length)

        // Get the route segment for this collection
        const routeEntry = Object.entries(routeMappings).find(
          ([, mapping]) => mapping.collection === collection,
        )
        const routeSegment = routeEntry ? routeEntry[1][locale] : null

        if (!routeSegment) {
          console.error(`No route segment found for collection: ${collection}`)
          return
        }

        // Create navigation items
        const items: NavigationItem[] = result.docs.map((doc: Record<string, unknown>) => ({
          id: doc.id as string,
          title: (doc.title as string) || '',
          slug: (doc.slug as string) || '',
          href:
            locale === 'sl' ? `/${routeSegment}/${doc.slug}` : `/en/${routeSegment}/${doc.slug}`,
        }))

        // Find current item index and title
        const currentItemIndex = items.findIndex((item) => item.slug === currentSlug)
        const currentItem = items[currentItemIndex]

        console.log('Current item found:', currentItem, 'at index:', currentItemIndex)

        if (currentItem) {
          setCurrentTitle(currentItem.title)
        }

        setNavigationItems(items)
        setCurrentIndex(currentItemIndex)

        // Small delay to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false)
          // Fade in new content after a brief delay
          setTimeout(() => setIsVisible(true), 50)
        }, 100)
      } catch (error) {
        console.error('Error fetching navigation items:', error)
        setIsLoading(false)
      }
    }

    fetchNavigationItems()
  }, [collection, currentSlug, locale])

  // Always render something to confirm the component is working
  return (
    <div className="w-full border-t border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div
          className={`transition-all duration-300 ease-in-out ${
            isLoading ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isLoading && (
            <div className="flex justify-center items-center h-12">
              <div className="animate-pulse w-1/2 h-4 bg-foreground/10 rounded" />
            </div>
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            !isLoading && (navigationItems.length === 0 || currentIndex === -1)
              ? 'opacity-100'
              : 'opacity-0'
          }`}
        >
          {!isLoading && (navigationItems.length === 0 || currentIndex === -1) && (
            <div className="text-center">
              <div className="text-foreground/60">No navigation available</div>
            </div>
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            !isLoading && navigationItems.length > 0 && currentIndex !== -1 && isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
        >
          {!isLoading && navigationItems.length > 0 && currentIndex !== -1 && (
            <div className="flex items-center justify-between gap-4">
              {/* Previous Item */}
              <div className="flex-1 min-w-0">
                {currentIndex > 0 ? (
                  <Link
                    href={navigationItems[currentIndex - 1].href}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/10 hover:text-background transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-foreground/60 group-hover:text-foreground transition-colors duration-200">
                        {t('common.previous')}
                      </div>
                      <div className="text-sm font-medium truncate group-hover:text-foreground transition-colors duration-200">
                        {navigationItems[currentIndex - 1].title}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-3 text-foreground/30">
                    <div className="text-sm">{t('common.previous')}</div>
                    <div className="text-sm font-medium">—</div>
                  </div>
                )}
              </div>

              {/* Current Item */}
              <div className="flex-shrink-0 px-4">
                <div className="text-center">
                  <div className="text-xs text-foreground/60 mb-1 transition-colors duration-200">
                    {t('common.showing')} {currentIndex + 1} {t('common.of')}{' '}
                    {navigationItems.length}
                  </div>
                  <h3 className="heading-3 font-medium text-foreground max-w-xs truncate transition-colors duration-200">
                    {currentTitle}
                  </h3>
                </div>
              </div>

              {/* Next Item */}
              <div className="flex-1 min-w-0">
                {currentIndex < navigationItems.length - 1 ? (
                  <Link
                    href={navigationItems[currentIndex + 1].href}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/10 hover:text-background transition-all duration-200 ease-in-out transform hover:scale-[1.02] text-right"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-foreground/60 group-hover:text-foreground transition-colors duration-200">
                        {t('common.next')}
                      </div>
                      <div className="text-sm font-medium truncate group-hover:text-foreground transition-colors duration-200">
                        {navigationItems[currentIndex + 1].title}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-foreground/60 group-hover:text-foreground transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Link>
                ) : (
                  <div className="p-3 text-foreground/30 text-right">
                    <div className="text-sm">{t('common.next')}</div>
                    <div className="text-sm font-medium">—</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
