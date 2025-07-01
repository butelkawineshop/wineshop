'use client'

import { WineCard } from '../wine/WineCard'
import type { Tasting } from '@/hooks/useTastings'
import { useTranslation } from '@/hooks/useTranslation'
import type { Locale } from '@/constants/routes'
import type { FlatWineVariant } from '@/payload-types'

interface ExampleWinesProps {
  tasting: Tasting
  locale: Locale
}

function isFlatWineVariant(wine: unknown): wine is FlatWineVariant {
  return Boolean(
    wine && typeof wine === 'object' && wine !== null && 'id' in wine && 'wineTitle' in wine,
  )
}

export function ExampleWines({ tasting, locale }: ExampleWinesProps) {
  const { t } = useTranslation()
  const exampleWines = tasting.exampleWines || []

  if (exampleWines.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="heading-3">{t('tasting.fields.exampleWines')}</h2>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {exampleWines.map((wine, index) => {
            if (isFlatWineVariant(wine)) {
              return (
                <div key={`example-wine-${wine.id}-${index}`} className="flex-shrink-0">
                  <WineCard variant={wine} locale={locale} />
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    </div>
  )
}
