'use client'

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { WineCard } from './WineCard'
import type { FlatWineVariant } from '@/payload-types'
import { useTranslation } from '@/hooks/useTranslation'
import { WINE_CONSTANTS } from '@/constants/wine'
import { logger } from '@/lib/logger'
import type { Locale } from '@/i18n/locales'
import type { Swiper as SwiperType } from 'swiper'

interface WineGridProps {
  variants: FlatWineVariant[]
  locale: Locale
  className?: string
  totalCount?: number
}

// Simplified responsive configuration
const RESPONSIVE_CONFIG = {
  desktop: { columns: 4, rows: 1 },
  tablet: { columns: 3, rows: 1 },
  mobile: { columns: 1, rows: 1 },
} as const

// Debounce utility
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function WineGrid({
  variants,
  locale,
  className = '',
  totalCount,
}: WineGridProps): React.JSX.Element {
  const { t } = useTranslation()
  const swiperRef = useRef<SwiperType | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [swiperHeight, setSwiperHeight] = useState<number>(600)

  // Memoized responsive config to prevent unnecessary recalculations
  const responsiveConfig = useMemo(() => {
    if (typeof window === 'undefined') return RESPONSIVE_CONFIG.desktop

    const width = window.innerWidth
    if (width < 768) return RESPONSIVE_CONFIG.mobile
    if (width < 1024) return RESPONSIVE_CONFIG.tablet
    return RESPONSIVE_CONFIG.desktop
  }, [])

  // Memoized wine slots creation
  const wineSlots = useMemo(() => {
    const { columns, rows } = responsiveConfig
    const winesPerSlot = columns * rows
    const slots = []

    for (let i = 0; i < variants.length; i += winesPerSlot) {
      slots.push(variants.slice(i, i + winesPerSlot))
    }

    return slots
  }, [variants, responsiveConfig])

  // Memoized grid classes
  const gridClasses = useMemo(() => {
    const { columns } = responsiveConfig
    if (columns === 1) return 'grid-cols-1'
    if (columns === 3) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }, [responsiveConfig])

  // Optimized height calculation with debouncing
  const calculateSwiperHeight = useCallback(
    debounce(() => {
      if (!containerRef.current) return

      // Use ResizeObserver for more efficient height detection
      const container = containerRef.current
      const gridElement = container.querySelector('.grid') as HTMLElement

      if (gridElement) {
        const rowHeight = gridElement.offsetHeight
        const slotIndicatorHeight = 30
        const calculatedHeight = rowHeight + slotIndicatorHeight

        // Only update if height changed significantly (prevents micro-adjustments)
        setSwiperHeight((currentHeight) => {
          const heightDiff = Math.abs(currentHeight - calculatedHeight)
          return heightDiff > 5 ? calculatedHeight : currentHeight
        })
      }
    }, 200), // Increased debounce time for more stability
    [],
  )

  // Single resize handler with debouncing
  useEffect(() => {
    const handleResize = debounce(() => {
      calculateSwiperHeight()
    }, 150)

    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateSwiperHeight])

  // Calculate height when variants change
  useEffect(() => {
    calculateSwiperHeight()
  }, [variants, calculateSwiperHeight])

  // Reset slide when variants change
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0)
      setCurrentSlide(0)
    }
  }, [variants])

  // Optimized keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      if (!swiperRef.current || wineSlots.length === 0) return

      const { key } = event
      const currentIndex = currentSlide
      const totalSlots = wineSlots.length

      let newIndex = currentIndex

      switch (key) {
        case 'ArrowUp':
          event.preventDefault()
          newIndex = Math.max(0, currentIndex - 1)
          break
        case 'ArrowDown':
          event.preventDefault()
          newIndex = Math.min(totalSlots - 1, currentIndex + 1)
          break
        case 'Home':
          event.preventDefault()
          newIndex = 0
          break
        case 'End':
          event.preventDefault()
          newIndex = totalSlots - 1
          break
        case 'PageUp':
          event.preventDefault()
          newIndex = Math.max(0, currentIndex - 3)
          break
        case 'PageDown':
          event.preventDefault()
          newIndex = Math.min(totalSlots - 1, currentIndex + 3)
          break
        default:
          return
      }

      if (newIndex !== currentIndex) {
        swiperRef.current.slideTo(newIndex)
        setCurrentSlide(newIndex)
      }
    },
    [currentSlide, wineSlots.length],
  )

  // Single keyboard event listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Memoized event handlers
  const handleShare = useCallback(
    async (variant: FlatWineVariant): Promise<void> => {
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

  const handleLike = useCallback((): void => {
    // TODO: BUTELKA-124 - Implement like functionality with backend integration
  }, [])

  // Memoized wine slot renderer
  const renderWineSlot = useCallback(
    (wines: FlatWineVariant[], slotIndex: number): React.JSX.Element => (
      <div
        className={`grid ${gridClasses} ${WINE_CONSTANTS.GRID_GAP} justify-center`}
        role="grid"
        aria-label={t('wine.slotGridLabel', { slot: slotIndex + 1 })}
      >
        {wines.map((variant) => (
          <div key={variant.id} className="w-full h-full" role="gridcell">
            <WineCard
              variant={variant}
              locale={locale}
              onShare={handleShare}
              onLike={handleLike}
              data-wine-card="true"
            />
          </div>
        ))}
      </div>
    ),
    [gridClasses, t, locale, handleShare, handleLike],
  )

  // Memoized slot indicator
  const renderSlotIndicator = useCallback(
    (index: number, total: number, winesInSlot: number): React.JSX.Element => (
      <div
        className="text-center mt-4 text-sm text-muted-foreground"
        aria-live="polite"
        aria-atomic="true"
      >
        {t('wine.slotIndicator', {
          current: index + 1,
          total,
          winesInSlot,
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
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      role="region"
      aria-label={t('wine.wineGridLabel')}
      tabIndex={0}
      aria-live="polite"
      aria-atomic="false"
    >
      {/* Hidden content for height calculation - simplified */}
      <div className="sr-only absolute top-0 left-0 w-full">
        <div className="w-full">
          {renderWineSlot(variants.slice(0, responsiveConfig.columns * responsiveConfig.rows), 0)}
          {renderSlotIndicator(
            0,
            Math.ceil(variants.length / (responsiveConfig.columns * responsiveConfig.rows)),
            Math.min(responsiveConfig.columns * responsiveConfig.rows, variants.length),
          )}
        </div>
      </div>

      <Swiper
        direction="vertical"
        onSwiper={(swiper) => {
          swiperRef.current = swiper
        }}
        onSlideChange={(swiper) => {
          setCurrentSlide(swiper.activeIndex)
        }}
        className="wine-swiper focus-within:outline-2 focus-within:outline-primary focus-within:outline-offset-2"
        style={{ '--wine-swiper-height': `${swiperHeight}px` } as React.CSSProperties}
        slidesPerView={1}
        speed={400}
        allowTouchMove={true}
        aria-label={t('wine.sliderLabel')}
      >
        {wineSlots.map((slot, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full flex flex-col"
              role="group"
              aria-label={t('wine.slotLabel', {
                current: index + 1,
                total: wineSlots.length,
              })}
            >
              {renderWineSlot(slot, index)}
              {renderSlotIndicator(index, wineSlots.length, slot.length)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Accessibility status */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t('wine.accessibilityStatus', {
          current: currentSlide + 1,
          total: wineSlots.length,
          winesInSlot: wineSlots[currentSlide]?.length || 0,
        })}
      </div>
    </div>
  )
}
