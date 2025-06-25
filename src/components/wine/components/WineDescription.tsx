'use client'

import React, { useState } from 'react'
import type { FlatWineVariant } from '@/payload-types'
import { useTranslation } from '@/hooks/useTranslation'
import { WINE_CONSTANTS } from '@/constants/wine'

interface WineDescriptionProps {
  variant: FlatWineVariant
  maxLength?: number
}

export function WineDescription({
  variant,
  maxLength = WINE_CONSTANTS.DEFAULT_DESCRIPTION_MAX_LENGTH,
}: WineDescriptionProps): React.JSX.Element | null {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useTranslation()

  // For flat variants, we might get description from tastingProfile or other field
  const description = variant.tastingProfile || ''

  if (!description) return null

  const shouldTruncate = description.length > maxLength
  const displayText =
    shouldTruncate && !isExpanded ? `${description.slice(0, maxLength)}...` : description

  return (
    <div className="text-base text-foreground/80">
      <p className="leading-relaxed">{displayText}</p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="interactive-text text-primary mt-1 focus-ring"
        >
          {isExpanded ? t('wine.description.showLess') : t('wine.description.showMore')}
        </button>
      )}
    </div>
  )
}
