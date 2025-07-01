'use client'

import React, { useCallback, useMemo, useState, useRef } from 'react'
import { TastingCard } from './TastingCard'
import type { Tasting } from '@/hooks/useTastings'
import type { Locale } from '@/constants/routes'

interface TastingGridProps {
  tastings: Tasting[]
  locale: Locale
  className?: string
}

export function TastingGrid({ tastings, locale, className = '' }: TastingGridProps) {
  const [loadedRows, setLoadedRows] = useState(3) // Start with 3 rows
  const containerRef = useRef<HTMLDivElement>(null)

  // Responsive grid configuration
  const { cardsPerRow, gridClasses, containerHeight } = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        cardsPerRow: 3,
        gridClasses: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        containerHeight: 800,
      }
    }

    const width = window.innerWidth
    const height = window.innerHeight

    if (width < 768) {
      return {
        cardsPerRow: 1,
        gridClasses: 'grid-cols-1',
        containerHeight: Math.min(height * 0.8, 1000),
      }
    } else if (width < 1024) {
      return {
        cardsPerRow: 2,
        gridClasses: 'grid-cols-2',
        containerHeight: 800,
      }
    } else {
      return {
        cardsPerRow: 3,
        gridClasses: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        containerHeight: 800,
      }
    }
  }, [])

  // Group tastings into rows
  const tastingRows = useMemo(() => {
    const rows: Tasting[][] = []
    for (let i = 0; i < tastings.length; i += cardsPerRow) {
      rows.push(tastings.slice(i, i + cardsPerRow))
    }
    return rows
  }, [tastings, cardsPerRow])

  // Infinite scroll - load more rows when reaching bottom
  React.useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const { scrollTop, scrollHeight, clientHeight } = containerRef.current
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100 // 100px from bottom

      if (isNearBottom && loadedRows < tastingRows.length) {
        setLoadedRows((prev) => Math.min(prev + 2, tastingRows.length)) // Load 2 more rows
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [loadedRows, tastingRows.length])

  // Memoized tasting row renderer
  const renderTastingRow = useCallback(
    (tastings: Tasting[], rowIndex: number) => (
      <div key={rowIndex} className="snap-start w-full py-4">
        <div
          className={`grid ${gridClasses} gap-8 justify-center`}
          role="grid"
          aria-label={`Tasting row ${rowIndex + 1}`}
        >
          {tastings.map((tasting) => (
            <div key={tasting.id} className="w-full" role="gridcell">
              <TastingCard tasting={tasting} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    ),
    [gridClasses, locale],
  )

  // Empty state
  if (tastings.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="container-narrow text-center section-padding">
          <p className="text-base text-foreground/60">No tastings found</p>
        </div>
      </div>
    )
  }

  // Don't render if there are no tasting rows
  if (tastingRows.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="container-narrow text-center section-padding">
          <p className="text-base text-foreground/60">No tastings found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`} role="region" aria-label="Tasting grid">
      <div
        ref={containerRef}
        className="tasting-scroll-container"
        style={{
          height: `${containerHeight}px`,
          maxHeight: `${containerHeight}px`,
        }}
      >
        {/* Render only loaded rows */}
        {tastingRows.slice(0, loadedRows).map((row, index) => renderTastingRow(row, index))}

        {/* Loading indicator */}
        {loadedRows < tastingRows.length && (
          <div className="w-full py-4 text-center text-muted-foreground">
            <div className="text-sm">Loading more tastings...</div>
          </div>
        )}
      </div>
    </div>
  )
}
