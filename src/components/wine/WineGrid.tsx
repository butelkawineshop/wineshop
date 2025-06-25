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

// Responsive configuration
const RESPONSIVE_CONFIG = {
  desktop: { columns: 4, rows: 1 },
  tablet: { columns: 3, rows: 1 },
  mobile: { columns: 1, rows: 1 },
} as const

export function WineGrid({
  variants,
  locale,
  className = '',
  totalCount,
}: WineGridProps): React.JSX.Element {
  const { t } = useTranslation()
  const swiperRef = useRef<SwiperType | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [swiperHeight, setSwiperHeight] = useState<number>(600)

  // Determine responsive config based on screen size
  const getResponsiveConfig = (): (typeof RESPONSIVE_CONFIG)[keyof typeof RESPONSIVE_CONFIG] => {
    if (typeof window === 'undefined') return RESPONSIVE_CONFIG.desktop

    const width = window.innerWidth
    if (width < 768) return RESPONSIVE_CONFIG.mobile
    if (width < 1024) return RESPONSIVE_CONFIG.tablet
    return RESPONSIVE_CONFIG.desktop
  }

  const [responsiveConfig, setResponsiveConfig] = useState(getResponsiveConfig())

  // Calculate dynamic height based on wine card heights
  const calculateSwiperHeight = useCallback((): void => {
    if (!contentRef.current) return

    const content = contentRef.current
    const rowContainer = content.querySelector('.grid') as HTMLElement

    if (!rowContainer) return

    // Get the actual rendered height of the entire row
    const rowHeight = rowContainer.offsetHeight

    // Calculate total height: just the row height + minimal spacing
    const slotIndicatorHeight = 30 // Reduced height for slot indicator

    // Use the actual row height with minimal extra space
    const calculatedHeight = rowHeight + slotIndicatorHeight

    setSwiperHeight(calculatedHeight)
  }, [])

  // Update responsive config on window resize
  useEffect(() => {
    const handleResize = (): void => {
      setResponsiveConfig(getResponsiveConfig())
      // Recalculate height after config change
      setTimeout(calculateSwiperHeight, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateSwiperHeight])

  // Calculate height when content changes
  useEffect(() => {
    const timer = setTimeout(calculateSwiperHeight, 100)
    return () => clearTimeout(timer)
  }, [variants, responsiveConfig, calculateSwiperHeight])

  // Create wine slots based on current config
  const wineSlots = useMemo(() => {
    const { columns, rows } = responsiveConfig
    const winesPerRow = columns
    const winesPerSlot = winesPerRow * rows // Exactly 3 rows worth of wines

    const slots = []

    for (let i = 0; i < variants.length; i += winesPerSlot) {
      slots.push(variants.slice(i, i + winesPerSlot))
    }

    return slots
  }, [variants, responsiveConfig])

  // Reset to first slide when variants change (e.g., after filtering)
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(0)
      setCurrentSlide(0)
    }
  }, [variants])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      if (!swiperRef.current || wineSlots.length === 0) return

      const { key } = event
      const currentIndex = currentSlide
      const totalSlots = wineSlots.length

      switch (key) {
        case 'ArrowUp':
          event.preventDefault()
          if (currentIndex > 0) {
            swiperRef.current.slideTo(currentIndex - 1)
            setCurrentSlide(currentIndex - 1)
          }
          break
        case 'ArrowDown':
          event.preventDefault()
          if (currentIndex < totalSlots - 1) {
            swiperRef.current.slideTo(currentIndex + 1)
            setCurrentSlide(currentIndex + 1)
          }
          break
        case 'Home':
          event.preventDefault()
          swiperRef.current.slideTo(0)
          setCurrentSlide(0)
          break
        case 'End':
          event.preventDefault()
          swiperRef.current.slideTo(totalSlots - 1)
          setCurrentSlide(totalSlots - 1)
          break
        case 'PageUp':
          event.preventDefault()
          const prevPage = Math.max(0, currentIndex - 3)
          swiperRef.current.slideTo(prevPage)
          setCurrentSlide(prevPage)
          break
        case 'PageDown':
          event.preventDefault()
          const nextPage = Math.min(totalSlots - 1, currentIndex + 3)
          swiperRef.current.slideTo(nextPage)
          setCurrentSlide(nextPage)
          break
      }
    },
    [currentSlide, wineSlots.length],
  )

  // Add keyboard event listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Focus management - focus container when it becomes visible
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !container.contains(document.activeElement)) {
            container.focus()
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const handleShare = async (variant: FlatWineVariant): Promise<void> => {
    try {
      const url = `${window.location.origin}/${locale}/wine/${variant.slug || variant.id}`

      // Check if clipboard API is available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }

      // TODO: BUTELKA-123 - Add toast notification for share success
    } catch (error) {
      logger.error('Failed to share wine URL', { error, variantId: variant.id })
      // TODO: BUTELKA-125 - Add user-facing error notification
    }
  }

  const handleLike = (): void => {
    // TODO: BUTELKA-124 - Implement like functionality with backend integration
  }

  // Render wine slot with responsive grid
  const renderWineSlot = (wines: FlatWineVariant[], slotIndex: number): React.JSX.Element => {
    const { columns } = responsiveConfig
    const gridCols =
      columns === 1
        ? 'grid-cols-1'
        : columns === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

    return (
      <div
        className={`grid ${gridCols} ${WINE_CONSTANTS.GRID_GAP} justify-center`}
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
    )
  }

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
      {/* Hidden content for height calculation */}
      <div ref={contentRef} className="sr-only absolute top-0 left-0 w-full">
        <div className="w-full">
          {(() => {
            const winesPerSlot = responsiveConfig.columns * responsiveConfig.rows
            return renderWineSlot(variants.slice(0, winesPerSlot), 0)
          })()}
          {/* Add slot indicator for accurate height */}
          <div className="text-center mt-4 text-sm text-muted-foreground">
            {(() => {
              const winesPerSlot = responsiveConfig.columns * responsiveConfig.rows
              return t('wine.slotIndicator', {
                current: 1,
                total: Math.ceil(variants.length / winesPerSlot),
                winesInSlot: Math.min(winesPerSlot, variants.length),
              })
            })()}
          </div>
        </div>
      </div>

      {/* Skip link for keyboard users */}
      <div className="sr-only">
        <p>{t('wine.keyboardInstructions')}</p>
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
        spaceBetween={0}
        slidesPerView={1}
        watchSlidesProgress={true}
        observer={true}
        observeParents={true}
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

              {/* Slot indicator */}
              <div
                className="text-center mt-4 text-sm text-muted-foreground"
                aria-live="polite"
                aria-atomic="true"
              >
                <div className="flex justify-between items-center">
                  <span>
                    {t('wine.slotIndicator', {
                      current: index + 1,
                      total: wineSlots.length,
                      winesInSlot: slot.length,
                    })}
                  </span>
                  {totalCount !== undefined && (
                    <span>{t('wine.showingWinesCount', { count: totalCount })}</span>
                  )}
                </div>
              </div>
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
