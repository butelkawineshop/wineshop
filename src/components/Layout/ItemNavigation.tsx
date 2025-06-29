'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { ROUTE_MAPPINGS, type Locale } from '@/constants/routes'
import { createPayloadService } from '@/lib/payload'
import { NAVIGATION_CONSTANTS } from '@/constants/navigation'
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
      const foundCollection = Object.entries(ROUTE_MAPPINGS).find(
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
        const payload = createPayloadService()

        // Fetch all items from the collection
        const result = await payload.find(collection, {
          depth: 0,
          limit: NAVIGATION_CONSTANTS.MAX_NAVIGATION_ITEMS,
          sort: 'title', // Sort by title for consistent ordering
          locale,
        })

        // Get the route segment for this collection
        const routeEntry = Object.entries(ROUTE_MAPPINGS).find(
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
        }, NAVIGATION_CONSTANTS.LOADING_DELAY)
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
          className={`w-full ${NAVIGATION_CONSTANTS.BORDER_STYLE} ${NAVIGATION_CONSTANTS.BACKGROUND_STYLE}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: NAVIGATION_CONSTANTS.ANIMATION_DURATION / 1000,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <div className={`container mx-auto ${NAVIGATION_CONSTANTS.CONTAINER_PADDING}`}>
            <div
              className={`flex items-center justify-between ${NAVIGATION_CONSTANTS.CONTAINER_GAP}`}
            >
              {/* Previous Item */}
              <div className={`${NAVIGATION_CONSTANTS.FLEX_1} ${NAVIGATION_CONSTANTS.MIN_WIDTH}`}>
                {currentIndex > 0 ? (
                  <motion.div
                    whileHover={{
                      scale: NAVIGATION_CONSTANTS.HOVER_SCALE,
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    }}
                    whileTap={{ scale: NAVIGATION_CONSTANTS.TAP_SCALE }}
                    transition={{
                      type: 'spring',
                      stiffness: NAVIGATION_CONSTANTS.MOTION_STIFFNESS,
                      damping: NAVIGATION_CONSTANTS.MOTION_DAMPING,
                    }}
                  >
                    <Link
                      href={navigationItems[currentIndex - 1].href}
                      className={`group flex items-center ${NAVIGATION_CONSTANTS.BUTTON_GAP} p-3 rounded-lg ${NAVIGATION_CONSTANTS.HOVER_BACKGROUND} ${NAVIGATION_CONSTANTS.HOVER_TEXT} ${NAVIGATION_CONSTANTS.TRANSITION_CLASSES}`}
                    >
                      <div className={NAVIGATION_CONSTANTS.FLEX_SHRINK}>
                        <svg
                          className={`${NAVIGATION_CONSTANTS.ICON_SIZE} ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
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
                      <div
                        className={`${NAVIGATION_CONSTANTS.MIN_WIDTH} ${NAVIGATION_CONSTANTS.FLEX_1}`}
                      >
                        <div
                          className={`text-sm ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                        >
                          {t('common.previous')}
                        </div>
                        <div
                          className={`text-sm font-medium truncate group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                        >
                          {navigationItems[currentIndex - 1].title}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ) : (
                  <div className={`p-3 ${NAVIGATION_CONSTANTS.DISABLED_OPACITY}`}>
                    <div className="text-sm">{t('common.previous')}</div>
                    <div className="text-sm font-medium">—</div>
                  </div>
                )}
              </div>

              {/* Current Item */}
              <div
                className={`${NAVIGATION_CONSTANTS.FLEX_SHRINK} ${NAVIGATION_CONSTANTS.CENTER_PADDING}`}
              >
                <div className="text-center">
                  <div
                    className={`text-xs ${NAVIGATION_CONSTANTS.TEXT_OPACITY} mb-1 transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                  >
                    {t('common.showing')} {currentIndex + 1} {t('common.of')}{' '}
                    {navigationItems.length}
                  </div>
                  <h3
                    className={`heading-3 font-medium text-foreground max-w-xs truncate transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                  >
                    {currentTitle}
                  </h3>
                </div>
              </div>

              {/* Next Item */}
              <div className={`${NAVIGATION_CONSTANTS.FLEX_1} ${NAVIGATION_CONSTANTS.MIN_WIDTH}`}>
                {currentIndex < navigationItems.length - 1 ? (
                  <motion.div
                    whileHover={{
                      scale: NAVIGATION_CONSTANTS.HOVER_SCALE,
                      backgroundColor: 'rgba(0,0,0,0.04)',
                    }}
                    whileTap={{ scale: NAVIGATION_CONSTANTS.TAP_SCALE }}
                    transition={{
                      type: 'spring',
                      stiffness: NAVIGATION_CONSTANTS.MOTION_STIFFNESS,
                      damping: NAVIGATION_CONSTANTS.MOTION_DAMPING,
                    }}
                  >
                    <Link
                      href={navigationItems[currentIndex + 1].href}
                      className={`group flex items-center ${NAVIGATION_CONSTANTS.BUTTON_GAP} p-3 rounded-lg ${NAVIGATION_CONSTANTS.HOVER_BACKGROUND} ${NAVIGATION_CONSTANTS.HOVER_TEXT} ${NAVIGATION_CONSTANTS.TRANSITION_CLASSES} text-right`}
                    >
                      <div
                        className={`${NAVIGATION_CONSTANTS.MIN_WIDTH} ${NAVIGATION_CONSTANTS.FLEX_1}`}
                      >
                        <div
                          className={`text-sm ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                        >
                          {t('common.next')}
                        </div>
                        <div
                          className={`text-sm font-medium truncate group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                        >
                          {navigationItems[currentIndex + 1].title}
                        </div>
                      </div>
                      <div className={NAVIGATION_CONSTANTS.FLEX_SHRINK}>
                        <svg
                          className={`${NAVIGATION_CONSTANTS.ICON_SIZE} ${NAVIGATION_CONSTANTS.TEXT_OPACITY} group-hover:text-foreground transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
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
                  </motion.div>
                ) : (
                  <div className={`p-3 ${NAVIGATION_CONSTANTS.DISABLED_OPACITY} text-right`}>
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
