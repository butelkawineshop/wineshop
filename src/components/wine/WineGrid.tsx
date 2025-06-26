'use client'

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Virtual, Keyboard, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/virtual'
import 'swiper/css/keyboard'
import 'swiper/css/a11y'
import { WineCard } from './WineCard'
import type { FlatWineVariant } from '@/payload-types'
import { useTranslation } from '@/hooks/useTranslation'
import { WINE_CONSTANTS } from '@/constants/wine'
import { logger } from '@/lib/logger'
import type { Locale } from '@/i18n/locales'
import type { Swiper as SwiperType } from 'swiper'
import { fetchAllCollectionItems } from '@/lib/graphql'

interface WineGridProps {
  variants: FlatWineVariant[]
  locale: Locale
  className?: string
  totalCount?: number
}

// Responsive configuration for cards per row
const RESPONSIVE_CONFIG = {
  desktop: { cardsPerRow: 4 },
  tablet: { cardsPerRow: 2 },
  mobile: { cardsPerRow: 1 },
} as const

export function WineGrid({
  variants,
  locale,
  className = '',
  totalCount,
}: WineGridProps): React.JSX.Element {
  const { t } = useTranslation()
  const swiperRef = useRef<SwiperType | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  )
  const [swiperHeight, setSwiperHeight] = useState<number>(600)
  const [collectionItemsLoaded, setCollectionItemsLoaded] = useState(false)

  // Fetch all collection items once for all variants
  useEffect(() => {
    const loadCollectionItems = async () => {
      try {
        console.log('WineGrid: Starting to load collection items for', variants.length, 'variants')
        const result = await fetchAllCollectionItems(variants, locale)
        console.log('WineGrid: Collection items loaded successfully', {
          aromas: result.aromas.length,
          tags: result.tags.length,
          moods: result.moods.length,
          grapeVarieties: result.grapeVarieties.length,
        })
        setCollectionItemsLoaded(true)
      } catch (error) {
        console.error('WineGrid: Failed to load collection items', error)
        logger.error('Failed to load collection items', { error })
        // Still set as loaded to prevent infinite retries
        setCollectionItemsLoaded(true)
      }
    }

    if (variants.length > 0) {
      loadCollectionItems()
    }
  }, [variants, locale])

  // Responsive config
  const cardsPerRow = useMemo(() => {
    if (windowWidth < 768) return RESPONSIVE_CONFIG.mobile.cardsPerRow
    if (windowWidth < 1024) return RESPONSIVE_CONFIG.tablet.cardsPerRow
    return RESPONSIVE_CONFIG.desktop.cardsPerRow
  }, [windowWidth])

  // Create rows of wines
  const wineRows = useMemo(() => {
    const rows = []
    for (let i = 0; i < variants.length; i += cardsPerRow) {
      rows.push(variants.slice(i, i + cardsPerRow))
    }
    return rows
  }, [variants, cardsPerRow])

  // Grid classes
  const gridClasses = useMemo(() => {
    if (cardsPerRow === 1) return 'grid-cols-1'
    if (cardsPerRow === 2) return 'grid-cols-1 sm:grid-cols-2'
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }, [cardsPerRow])

  // Calculate height when content changes
  const calculateHeight = useCallback(() => {
    if (!swiperRef.current) return

    // Get the active slide element
    const activeSlide = swiperRef.current.slides[swiperRef.current.activeIndex]
    if (activeSlide) {
      // Get the actual content height including padding and margins
      const contentHeight = activeSlide.scrollHeight
      // Add some buffer to ensure nothing gets cut off, especially on mobile
      const buffer = windowWidth < 768 ? 40 : 20
      setSwiperHeight(contentHeight + buffer)
    }
  }, [windowWidth])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      // Recalculate height after resize
      setTimeout(calculateHeight, 100)
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateHeight])

  // Reset when variants change
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0)
      setCurrentSlide(0)
      // Recalculate height after slide change
      setTimeout(calculateHeight, 100)
    }
  }, [variants, calculateHeight])

  // Event handlers
  const handleShare = useCallback(
    async (variant: FlatWineVariant) => {
      try {
        const url = `${window.location.origin}/${locale}/wine/${variant.slug || variant.id}`
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(url)
        } else {
          const textArea = document.createElement('textarea')
          textArea.value = url
          document.body.appendChild(textArea)
          textArea.select()
          document.execCommand('copy')
          document.body.removeChild(textArea)
        }
      } catch (error) {
        logger.error('Failed to share wine URL', { error, variantId: variant.id })
      }
    },
    [locale],
  )

  const handleLike = useCallback(() => {
    // TODO: Implement like functionality
  }, [])

  // Memoized wine row renderer
  const renderWineRow = useCallback(
    (wines: FlatWineVariant[], rowIndex: number) => (
      <div
        className={`grid ${gridClasses} ${WINE_CONSTANTS.GRID_GAP} justify-center`}
        role="grid"
        aria-label={t('wine.rowGridLabel', { row: rowIndex + 1 })}
      >
        {wines.map((variant) => (
          <div key={variant.id} className="w-full" role="gridcell">
            <WineCard
              variant={variant}
              locale={locale}
              onShare={handleShare}
              onLike={handleLike}
              collectionItemsLoaded={collectionItemsLoaded}
            />
          </div>
        ))}
      </div>
    ),
    [gridClasses, t, locale, handleShare, handleLike, collectionItemsLoaded],
  )

  // Memoized row indicator
  const renderRowIndicator = useCallback(
    (index: number, total: number, winesInRow: number) => (
      <div className="text-center mt-4 text-sm text-muted-foreground">
        {t('wine.rowIndicator', {
          current: index + 1,
          total,
          winesInRow,
        })}
      </div>
    ),
    [t],
  )

  // Empty state
  if (variants.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="container-narrow text-center section-padding">
          <p className="text-base text-foreground/60">{t('wine.noWinesFound')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`} role="region" aria-label={t('wine.wineGridLabel')}>
      <Swiper
        key={`wine-swiper-${cardsPerRow}`}
        direction="vertical"
        modules={[Virtual, Keyboard, A11y]}
        virtual={{
          enabled: true,
          addSlidesBefore: 1,
          addSlidesAfter: 1,
          cache: true,
          slides: wineRows,
        }}
        keyboard={{
          enabled: true,
          onlyInViewport: true,
        }}
        a11y={{
          enabled: true,
          prevSlideMessage: t('wine.previousRow'),
          nextSlideMessage: t('wine.nextRow'),
          firstSlideMessage: t('wine.firstRow'),
          lastSlideMessage: t('wine.lastRow'),
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper
          // Calculate initial height
          setTimeout(calculateHeight, 100)
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.activeIndex)
          // Recalculate height after slide change
          setTimeout(calculateHeight, 100)
        }}
        className="wine-swiper"
        slidesPerView={1}
        speed={400}
        grabCursor={true}
        watchSlidesProgress={false}
        updateOnWindowResize={false}
        observer={false}
        observeParents={false}
        style={{ height: `${swiperHeight}px` }}
        aria-label={t('wine.sliderLabel')}
      >
        {wineRows.map((row, index) => (
          <SwiperSlide key={index} virtualIndex={index}>
            <div
              className="w-full flex flex-col"
              role="group"
              aria-label={t('wine.rowLabel', {
                current: index + 1,
                total: wineRows.length,
              })}
            >
              {renderWineRow(row, index)}
              {renderRowIndicator(index, wineRows.length, row.length)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Accessibility status */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t('wine.accessibilityStatus', {
          current: currentSlide + 1,
          total: wineRows.length,
          winesInRow: wineRows[currentSlide]?.length || 0,
        })}
      </div>
    </div>
  )
}
