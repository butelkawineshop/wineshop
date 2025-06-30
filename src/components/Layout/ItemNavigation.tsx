'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { ROUTE_MAPPINGS, type Locale } from '@/constants/routes'
import { NAVIGATION_CONSTANTS } from '@/constants/navigation'
import { useNavigationItems } from '@/hooks/useGraphQL'
import { Icon } from '@/components/Icon'
import * as motion from 'motion/react-client'
import { createPortal } from 'react-dom'

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
  const [currentIndex, setCurrentIndex] = React.useState<number>(-1)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [currentTitle, setCurrentTitle] = React.useState<string>(initialTitle)
  const [collection, setCollection] = React.useState<string>('')
  const [isItemSelectorOpen, setIsItemSelectorOpen] = React.useState<boolean>(false)
  const [dropdownPosition, setDropdownPosition] = React.useState<{
    top: number
    left: number
  } | null>(null)
  const [searchQuery, setSearchQuery] = React.useState<string>('')
  const buttonRef = React.useRef<HTMLButtonElement>(null)

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

  // Use GraphQL hook to fetch navigation items
  const { data: navigationData, isLoading: isGraphQLLoading } = useNavigationItems(
    collection,
    locale,
  )

  React.useEffect(() => {
    if (!collection || !currentSlug || !navigationData) return

    try {
      // Get the route segment for this collection
      const routeEntry = Object.entries(ROUTE_MAPPINGS).find(
        ([, mapping]) => mapping.collection === collection,
      )
      const routeSegment = routeEntry ? routeEntry[1][locale] : null

      if (!routeSegment) {
        return
      }

      // Create navigation items from GraphQL data
      const items: NavigationItem[] = navigationData.docs.map((doc) => ({
        id: doc.id.toString(),
        title: doc.title || '',
        slug: doc.slug || '',
        href: locale === 'sl' ? `/${routeSegment}/${doc.slug}` : `/en/${routeSegment}/${doc.slug}`,
      }))

      // Find current item index and title
      const currentItemIndex = items.findIndex((item) => item.slug === currentSlug)
      const currentItem = items[currentItemIndex]

      if (currentItem) {
        setCurrentTitle(currentItem.title)
      }

      setCurrentIndex(currentItemIndex)

      // Small delay to ensure smooth transition
      setTimeout(() => {
        setIsLoading(false)
      }, NAVIGATION_CONSTANTS.LOADING_DELAY)
    } catch (_error) {
      setIsLoading(false)
    }
  }, [collection, currentSlug, locale, navigationData])

  // Update loading state based on GraphQL loading
  React.useEffect(() => {
    if (isGraphQLLoading) {
      setIsLoading(true)
    }
  }, [isGraphQLLoading])

  // Calculate dropdown position when opening
  const handleToggleDropdown = () => {
    if (!isItemSelectorOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8, // 8px margin
        left: rect.left + rect.width / 2 - 160, // Center the dropdown (320px width / 2)
      })
    }
    setIsItemSelectorOpen(!isItemSelectorOpen)
    // Clear search when opening/closing
    setSearchQuery('')
  }

  // Filter navigation items based on search query
  const filteredItems = React.useMemo(() => {
    if (!navigationData?.docs || !searchQuery.trim()) {
      return navigationData?.docs || []
    }

    const query = searchQuery.toLowerCase().trim()
    return navigationData.docs.filter(
      (doc) => doc.title?.toLowerCase().includes(query) || doc.slug?.toLowerCase().includes(query),
    )
  }, [navigationData?.docs, searchQuery])

  // Get collection display name
  const getCollectionDisplayName = () => {
    if (!collection) return t('common.item')

    const collectionMap: Record<string, string> = {
      regions: locale === 'sl' ? 'Regija' : 'Region',
      wineCountries: locale === 'sl' ? 'Država' : 'Country',
      wineries: locale === 'sl' ? 'Vinarna' : 'Winery',
      grapeVarieties: locale === 'sl' ? 'Sorta' : 'Variety',
      climates: locale === 'sl' ? 'Podnebje' : 'Climate',
      foods: locale === 'sl' ? 'Hrana' : 'Food',
      moods: locale === 'sl' ? 'Razpoloženje' : 'Mood',
      aromas: locale === 'sl' ? 'Aroma' : 'Aroma',
      tags: locale === 'sl' ? 'Oznaka' : 'Tag',
      styles: locale === 'sl' ? 'Slog' : 'Style',
    }

    return collectionMap[collection] || t('common.item')
  }

  // Close item selector when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (
        !target.closest('.item-selector-container') &&
        !target.closest('.item-selector-dropdown')
      ) {
        setIsItemSelectorOpen(false)
      }
    }

    if (isItemSelectorOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isItemSelectorOpen])

  // Always render something to confirm the component is working
  return (
    <>
      {/* Only show navigation when fully ready */}
      {!isLoading &&
      navigationData?.docs &&
      navigationData.docs.length > 0 &&
      currentIndex !== -1 ? (
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
                      href={
                        navigationData.docs[currentIndex - 1]
                          ? locale === 'sl'
                            ? `/${collectionSegment}/${navigationData.docs[currentIndex - 1].slug}`
                            : `/en/${collectionSegment}/${navigationData.docs[currentIndex - 1].slug}`
                          : '#'
                      }
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
                          {navigationData.docs[currentIndex - 1]?.title || ''}
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

              {/* Current Item with Selector */}
              <div
                className={`${NAVIGATION_CONSTANTS.FLEX_SHRINK} ${NAVIGATION_CONSTANTS.CENTER_PADDING} item-selector-container`}
              >
                <div className="text-center">
                  <div
                    className={`text-xs ${NAVIGATION_CONSTANTS.TEXT_OPACITY} mb-1 transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                  >
                    {t('common.showing')} {currentIndex + 1} {t('common.of')}{' '}
                    {navigationData.docs.length}
                  </div>

                  {/* Item Selector Button */}
                  <button
                    ref={buttonRef}
                    onClick={handleToggleDropdown}
                    className="group flex items-center cursor-pointer hover:scale-105 transition-all duration-300 gap-2 justify-center w-full font-accent hover:text-foreground/80 active:scale-95"
                  >
                    <h3
                      className={`heading-3 font-medium  text-foreground max-w-xs truncate transition-colors duration-${NAVIGATION_CONSTANTS.TRANSITION_DURATION}`}
                    >
                      {currentTitle}
                    </h3>
                    {navigationData.docs.length > 1 && (
                      <Icon name="select" className="w-4 h-4" variant="color" />
                    )}
                  </button>
                </div>
              </div>

              {/* Next Item */}
              <div className={`${NAVIGATION_CONSTANTS.FLEX_1} ${NAVIGATION_CONSTANTS.MIN_WIDTH}`}>
                {currentIndex < navigationData.docs.length - 1 ? (
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
                      href={
                        navigationData.docs[currentIndex + 1]
                          ? locale === 'sl'
                            ? `/${collectionSegment}/${navigationData.docs[currentIndex + 1].slug}`
                            : `/en/${collectionSegment}/${navigationData.docs[currentIndex + 1].slug}`
                          : '#'
                      }
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
                          {navigationData.docs[currentIndex + 1]?.title || ''}
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

      {/* Item Selector Dropdown Portal */}
      {isItemSelectorOpen &&
        navigationData?.docs &&
        navigationData.docs.length > 1 &&
        dropdownPosition &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            className="fixed w-80 max-h-96 bg-background border border-border rounded-lg shadow-lg z-[999999] overflow-hidden max-w-[90vw] item-selector-dropdown"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div className="p-2 border-b border-border">
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="max-h-80 overflow-y-auto overscroll-contain">
              {filteredItems.length > 0 ? (
                filteredItems.map((doc) => {
                  // Find the original index for highlighting current item
                  const originalIndex = navigationData.docs.findIndex((item) => item.id === doc.id)
                  const isCurrentItem = originalIndex === currentIndex

                  return (
                    <Link
                      key={doc.id}
                      href={
                        locale === 'sl'
                          ? `/${collectionSegment}/${doc.slug}`
                          : `/en/${collectionSegment}/${doc.slug}`
                      }
                      onClick={() => setIsItemSelectorOpen(false)}
                      className={`block px-4 py-3 text-left hover:bg-foreground/5 transition-colors ${
                        isCurrentItem ? 'bg-primary/10 text-primary' : 'text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{doc.title}</span>
                        {isCurrentItem && <Icon name="check" className="w-4 h-4" />}
                      </div>
                      <div className="text-xs text-foreground/60 mt-1">
                        {getCollectionDisplayName()} {originalIndex + 1} {t('common.of')}{' '}
                        {navigationData.docs.length}
                      </div>
                    </Link>
                  )
                })
              ) : (
                <div className="px-4 py-8 text-center text-foreground/60">
                  <div className="text-sm">{t('common.noResults')}</div>
                  {searchQuery.trim() && (
                    <div className="text-xs mt-1">
                      {t('common.noResults')} for {searchQuery}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
