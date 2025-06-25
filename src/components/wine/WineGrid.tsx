'use client'

import React from 'react'
import { WineCard } from './WineCard'
import type { FlatWineVariant } from '@/payload-types'
import { useTranslation } from '@/hooks/useTranslation'
import { WINE_CONSTANTS } from '@/constants/wine'
import { logger } from '@/lib/logger'

interface WineGridProps {
  variants: FlatWineVariant[]
  locale: string
  className?: string
}

export function WineGrid({ variants, locale, className = '' }: WineGridProps): React.JSX.Element {
  const { t } = useTranslation()

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

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${WINE_CONSTANTS.GRID_GAP} justify-center`}
      >
        {variants.map((variant) => (
          <div key={variant.id} className="w-full h-full">
            <WineCard variant={variant} locale={locale} onShare={handleShare} onLike={handleLike} />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {variants.length === 0 && (
        <div className="container-narrow text-center section-padding">
          <p className="text-base text-foreground/60">{t('wine.noWinesFound')}</p>
        </div>
      )}
    </div>
  )
}
