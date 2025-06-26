'use client'

import React from 'react'
import { Icon } from '@/components/Icon'
import type { FlatWineVariant } from '@/payload-types'
import { useTranslation } from '@/hooks/useTranslation'
import { WINE_CONSTANTS } from '@/constants/wine'

interface WineTastingNotesProps {
  variant: FlatWineVariant
  page?: 1 | 2
}

type TastingNotePair = {
  key: string
  left: {
    key: string
    icon: string
    translationKey: string
  }
  right: {
    key: string
    icon: string
    translationKey: string
  }
}

const TASTING_NOTE_PAIRS: TastingNotePair[] = [
  {
    key: 'dry',
    left: { key: 'dry', icon: 'dry', translationKey: 'tasting.notes.dry' },
    right: { key: 'sweet', icon: 'sweetness', translationKey: 'tasting.notes.sweet' },
  },
  {
    key: 'light',
    left: { key: 'light', icon: 'skinny', translationKey: 'tasting.notes.light' },
    right: { key: 'rich', icon: 'fat', translationKey: 'tasting.notes.rich' },
  },
  {
    key: 'smooth',
    left: { key: 'smooth', icon: 'soft', translationKey: 'tasting.notes.smooth' },
    right: { key: 'austere', icon: 'sharp', translationKey: 'tasting.notes.austere' },
  },
  {
    key: 'creamy',
    left: { key: 'crisp', icon: 'crisp', translationKey: 'tasting.notes.crisp' },
    right: { key: 'creamy', icon: 'cream', translationKey: 'tasting.notes.creamy' },
  },
  {
    key: 'alcohol',
    left: { key: 'lowAlcohol', icon: 'water', translationKey: 'tasting.notes.noAlcohol' },
    right: { key: 'highAlcohol', icon: 'alcohol', translationKey: 'tasting.notes.highAlcohol' },
  },
  {
    key: 'ripe',
    left: { key: 'freshFruit', icon: 'fruit', translationKey: 'tasting.notes.freshFruit' },
    right: { key: 'ripeFruit', icon: 'jam', translationKey: 'tasting.notes.ripeFruit' },
  },
  {
    key: 'oaky',
    left: { key: 'noOak', icon: 'steel', translationKey: 'tasting.notes.noOak' },
    right: { key: 'oaky', icon: 'oak', translationKey: 'tasting.notes.oaky' },
  },
  {
    key: 'complex',
    left: { key: 'simple', icon: 'simple', translationKey: 'tasting.notes.simple' },
    right: { key: 'complex', icon: 'complex', translationKey: 'tasting.notes.complex' },
  },
  {
    key: 'youthful',
    left: { key: 'youthful', icon: 'baby', translationKey: 'tasting.notes.youthful' },
    right: { key: 'mature', icon: 'old', translationKey: 'tasting.notes.mature' },
  },
  {
    key: 'energetic',
    left: { key: 'restrained', icon: 'calm', translationKey: 'tasting.notes.restrained' },
    right: { key: 'energetic', icon: 'energy', translationKey: 'tasting.notes.energetic' },
  },
]

export function WineTastingNotes({ variant, page = 1 }: WineTastingNotesProps): React.JSX.Element {
  const { t } = useTranslation()

  // Get the appropriate slice of pairs based on the page
  const startIndex = (page - 1) * WINE_CONSTANTS.TASTING_NOTES_PER_PAGE
  const endIndex = startIndex + WINE_CONSTANTS.TASTING_NOTES_PER_PAGE
  const currentPagePairs = TASTING_NOTE_PAIRS.slice(startIndex, endIndex)

  // Get tasting values from variant data
  const getTastingValue = (key: string): number => {
    try {
      // Check if variant has tastingProfile data
      if (variant.tastingProfile && typeof variant.tastingProfile === 'object') {
        const profile = variant.tastingProfile as Record<string, unknown>
        const value = profile[key]

        // Return the value if it's a number, otherwise return default
        if (typeof value === 'number' && value >= 0) {
          return value
        }
      }

      // Fallback to default value if no data is available
      return 5
    } catch (_error) {
      // Return default value if there's an error
      return 5
    }
  }

  return (
    <div className="bg-background flex flex-col w-full h-full px-2 aspect-square">
      <div className="text-center px-4 font-accent font-bold">
        {page === 1 ? t('wine.tastingNotes.tasteProfile') : t('wine.tastingNotes.characterNotes')}
      </div>

      <div className="grid grid-cols-1 gap-4 px-2 sm:px-0">
        {currentPagePairs.map(({ key, left, right }) => {
          const value = getTastingValue(key)
          const maxValue =
            key === 'alcohol'
              ? WINE_CONSTANTS.ALCOHOL_MAX_VALUE
              : WINE_CONSTANTS.TASTING_NOTE_MAX_VALUE
          const percentage = (value / maxValue) * 100

          return (
            <div key={key} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-foreground/60">
                <div className="flex items-center gap-2">
                  <Icon
                    name={left.icon}
                    variant="color"
                    width={WINE_CONSTANTS.ICON_SIZE}
                    height={WINE_CONSTANTS.ICON_SIZE}
                    className="flex-shrink-0"
                  />
                  <span>{t(left.translationKey)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{t(right.translationKey)}</span>
                  <Icon
                    name={right.icon}
                    variant="color"
                    width={WINE_CONSTANTS.ICON_SIZE}
                    height={WINE_CONSTANTS.ICON_SIZE}
                    className="flex-shrink-0"
                  />
                </div>
              </div>

              <div className="h-2 w-full bg-foreground/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
