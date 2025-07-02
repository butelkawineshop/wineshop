'use client'

import { WineCard } from '../wine/WineCard'
import { useTranslation } from '@/hooks/useTranslation'
import type { Locale } from '@/constants/routes'
import type { FlatWineVariant } from '@/payload-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

interface ExampleWinesProps {
  items: Array<{
    id: string
    exampleWines?: Array<number | FlatWineVariant>
  }>
  locale: Locale
  translationKey: string
}

function isFlatWineVariant(wine: unknown): wine is FlatWineVariant {
  return Boolean(
    wine && typeof wine === 'object' && wine !== null && 'id' in wine && 'wineTitle' in wine,
  )
}

export function ExampleWines({ items, locale, translationKey }: ExampleWinesProps) {
  const { t } = useTranslation()

  // Get example wines from the first item (assuming all items have the same example wines)
  const exampleWines = items[0]?.exampleWines || []

  if (exampleWines.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h2 className="heading-3">{t(translationKey)}</h2>
      <div className="">
        <Swiper
          slidesPerView={1}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
          }}
          className="w-full"
          role="region"
          aria-label="Example wines carousel"
        >
          {exampleWines.map((wine, index) => {
            if (isFlatWineVariant(wine)) {
              return (
                <SwiperSlide key={`example-wine-${wine.id}-${index}`}>
                  <div className="flex-shrink-0">
                    <WineCard variant={wine} locale={locale} />
                  </div>
                </SwiperSlide>
              )
            }
            return null
          })}
        </Swiper>
      </div>
    </div>
  )
}
