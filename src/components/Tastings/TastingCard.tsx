'use client'

import { Media } from '../Media'
import { CollectionLink } from '../ui/CollectionLink'
import type { Tasting } from '@/hooks/useTastings'
import { useTranslation } from '@/hooks/useTranslation'
import type { Locale } from '@/constants/routes'

interface TastingCardProps {
  tasting: Tasting
  locale: Locale
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes} min`
  } else if (remainingMinutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${remainingMinutes}min`
  }
}

function formatWineTypes(wineTypes: Array<{ wineType: string; quantity: number }>): string {
  return wineTypes
    .map(({ wineType, quantity }) => `${quantity} ${wineType}${quantity > 1 ? 's' : ''}`)
    .join(', ')
}

export function TastingCard({ tasting, locale }: TastingCardProps) {
  const { t } = useTranslation()
  const primaryImage = tasting.media?.[0]
  const imageUrl = primaryImage?.url

  return (
    <CollectionLink
      collection="tastings"
      slug={tasting.slug}
      locale={locale}
      className="block group"
    >
      <div className="group relative bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {imageUrl ? (
            <Media
              src={imageUrl}
              alt={tasting.title}
              fill
              size="square"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-4xl text-primary/40">🍷</div>
            </div>
          )}

          {/* Overlay with price */}
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <div className="text-sm font-accent">€{tasting.pricePerPerson}</div>
            <div className="text-xs text-muted-foreground">{t('tasting.perPersonShort')}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}

          <h3 className="heading-3 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {tasting.title}
          </h3>

          {/* Description */}
          {tasting.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{tasting.description}</p>
          )}

          {/* Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('tasting.fields.duration')}</span>
              <span className="font-medium">{formatDuration(tasting.duration)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('tasting.fields.people')}</span>
              <span className="font-medium">
                {t('tasting.fields.peopleRange', {
                  min: tasting.minPeople,
                  max: tasting.maxPeople,
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('tasting.fields.wineTypes')}</span>
              <span className="font-medium text-right">{formatWineTypes(tasting.wineTypes)}</span>
            </div>
          </div>
        </div>
      </div>
    </CollectionLink>
  )
}
