'use client'

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import type { FlatWineVariant } from '@/payload-types'
import { WineCard } from './WineCard'
import { WINE_CONSTANTS } from '@/constants/wine'
import { fetchAllCollectionItems } from '@/lib/graphql'
import { logger } from '@/lib/logger'
import type { Locale } from '@/i18n/locales'

interface WineGridProps {
  variants: FlatWineVariant[]
  locale: Locale
  className?: string
}

export function WineGrid({ variants, locale, className = '' }: WineGridProps): React.JSX.Element {
  const t = useTranslations('wine')
  const [collectionItemsLoaded, setCollectionItemsLoaded] = useState(false)
  const [loadedRows, setLoadedRows] = useState(5) // Start with 5 rows
  const containerRef = useRef<HTMLDivElement>(null)

  // Fetch all collection items once for all variants
  useEffect(() => {
    const loadCollectionItems = async () => {
      try {
        const result = await fetchAllCollectionItems(variants, locale)
        logger.info('Collection items loaded for WineGrid', {
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

  // Responsive grid configuration
  const { cardsPerRow, gridClasses, containerHeight } = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        cardsPerRow: 4,
        gridClasses: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        containerHeight: 600,
      }
    }

    const width = window.innerWidth
    const height = window.innerHeight

    if (width < 768) {
      return {
        cardsPerRow: 1,
        gridClasses: 'grid-cols-1',
        containerHeight: Math.min(height * 0.8, 800), // 80% of viewport height, max 800px
      }
    } else if (width < 1024) {
      return {
        cardsPerRow: 2,
        gridClasses: 'grid-cols-2',
        containerHeight: 600,
      }
    } else {
      return {
        cardsPerRow: 4,
        gridClasses: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        containerHeight: 600,
      }
    }
  }, [])

  // Group variants into rows
  const wineRows = useMemo(() => {
    const rows: FlatWineVariant[][] = []
    for (let i = 0; i < variants.length; i += cardsPerRow) {
      rows.push(variants.slice(i, i + cardsPerRow))
    }
    return rows
  }, [variants, cardsPerRow])

  // Infinite scroll - load more rows when reaching bottom
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100 // 100px from bottom

      if (isNearBottom && loadedRows < wineRows.length) {
        setLoadedRows((prev) => Math.min(prev + 3, wineRows.length)) // Load 3 more rows
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [loadedRows, wineRows.length])

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
      <div key={rowIndex} className="snap-start w-full py-4">
        <div
          className={`grid ${gridClasses} ${WINE_CONSTANTS.GRID_GAP} justify-center`}
          role="grid"
          aria-label={t('rowGridLabel', { row: rowIndex + 1 })}
        >
          {wines.map((variant) => (
            <div key={variant.id} className="w-full" role="gridcell">
              <WineCard
                variant={variant}
                locale={locale}
                onShare={handleShare}
                onLike={handleLike}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    [gridClasses, t, locale, handleShare, handleLike],
  )

  // Empty state
  if (variants.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="container-narrow text-center section-padding">
          <p className="text-base text-foreground/60">{t('noWinesFound')}</p>
        </div>
      </div>
    )
  }

  // Don't render if there are no wine rows
  if (wineRows.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="container-narrow text-center section-padding">
          <p className="text-base text-foreground/60">{t('noWinesFound')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`} role="region" aria-label={t('wineGridLabel')}>
      <div
        ref={containerRef}
        className="wine-scroll-container"
        style={{
          height: `${containerHeight}px`,
          maxHeight: `${containerHeight}px`,
        }}
      >
        {/* Render only loaded rows */}
        {wineRows.slice(0, loadedRows).map((row, index) => renderWineRow(row, index))}

        {/* Loading indicator */}
        {loadedRows < wineRows.length && (
          <div className="w-full py-4 text-center text-muted-foreground">
            <div className="text-sm">Loading more wines...</div>
          </div>
        )}
      </div>
    </div>
  )
}
