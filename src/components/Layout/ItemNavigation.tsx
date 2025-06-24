'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { routeMappings, type Locale } from '@/utils/routeMappings'
import { getPayloadClient } from '@/lib/payload'
import * as motion from 'motion/react-client'

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

  // Get current slug and collection from pathname
  const segments = pathname.split('/').filter(Boolean)
  const currentSlug = locale === 'en' ? segments[2] : segments[1] // Get slug from current URL
  const collectionSegment = locale === 'en' ? segments[1] : segments[0] // Get collection from current URL

  // Determine collection from pathname
  React.useEffect(() => {
    const determineCollection = () => {
      // Find the collection from route mappings
      const foundCollection = Object.entries(routeMappings).find(
        ([, mapping]) => mapping[locale] === collectionSegment,
      )?.[1]?.collection

      return foundCollection
    }

    const collectionName = determineCollection()
    if (!collectionName) {
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
        const payload = getPayloadClient()

        // Fetch all items from the collection
        const result = await payload.find({
          collection,
          depth: 0,
          limit: 1000, // Fetch all items for navigation
          sort: 'title', // Sort by title for consistent ordering
          locale,
        })

        // Get the route segment for this collection
        const routeEntry = Object.entries(routeMappings).find(
          ([, mapping]) => mapping.collection === collection,
        )
        const routeSegment = routeEntry ? routeEntry[1][locale] : null

        if (!routeSegment) {
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

        if (currentItem) {
          setCurrentTitle(currentItem.title)
        }

        setNavigationItems(items)
        setCurrentIndex(currentItemIndex)

        // Small delay to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false)
        }, 100)
      } catch (_error) {
        setIsLoading(false)
      }
    }

    fetchNavigationItems()
  }, [collection, currentSlug, locale])

  // Always render something to confirm the component is working
  return (
    <>
      {/* Only show navigation when fully ready */}
      {!isLoading && navigationItems.length > 0 && currentIndex !== -1 ? (
        <motion.div
          className="w-full border-t border-border/50 bg-background/50 backdrop-blur-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Previous Item */}
              <div className="flex-1 min-w-0">
                {currentIndex > 0 ? (
                  <motion.a
                    href={navigationItems[currentIndex - 1].href}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/10 hover:text-background transition-all duration-200 ease-in-out transform"
                    whileHover={{ scale: 1.06, backgroundColor: 'rgba(0,0,0,0.04)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 24 }}
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
                  </motion.a>
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
                  <motion.a
                    href={navigationItems[currentIndex + 1].href}
                    className="group flex items-center gap-3 p-3 rounded-lg hover:bg-foreground/10 hover:text-background transition-all duration-200 ease-in-out transform text-right"
                    whileHover={{ scale: 1.06, backgroundColor: 'rgba(0,0,0,0.04)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 24 }}
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
                  </motion.a>
                ) : (
                  <div className="p-3 text-foreground/30 text-right">
                    <div className="text-sm">{t('common.next')}</div>
                    <div className="text-sm font-medium">—</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </>
  )
}
