'use client'

import { useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import type { FlatWineVariant } from '@/payload-types'
import { WineCard } from '@/components/wine/WineCard'
import 'swiper/css'
import 'swiper/css/effect-cards'

interface RelatedWineVariantsProps {
  currentVariant: FlatWineVariant
  relatedVariants: Array<{
    type: 'winery' | 'region' | 'grapeVariety' | 'price'
    title: string
    variants: FlatWineVariant[]
  }>
  locale: 'sl' | 'en'
}

export function RelatedWineVariants({
  currentVariant,
  relatedVariants,
  locale,
}: RelatedWineVariantsProps): React.JSX.Element {
  const t = useTranslations('wine.detail')

  if (relatedVariants.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-accent mb-8">{t('relatedWines')}</h2>
        <p className="text-muted">
          {t(
            currentVariant.wineryTitle
              ? 'noRelatedByWinery'
              : currentVariant.regionTitle
                ? 'noRelatedByRegion'
                : currentVariant.grapeVarieties?.length
                  ? 'noRelatedByGrapeVariety'
                  : 'noRelatedByPrice',
          )}
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-accent mb-8">{t('relatedWines')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedVariants.map((group) => (
          <div key={`${group.type}-${group.title}`} className="">
            <h3 className="text-lg font-accent mb-4">{group.title}</h3>
            <div className="relative h-auto">
              <Swiper
                effect="cards"
                grabCursor={true}
                modules={[EffectCards]}
                cardsEffect={{
                  perSlideOffset: 7,
                  perSlideRotate: 1,
                  rotate: true,
                  slideShadows: true,
                }}
                className="h-full"
              >
                {group.variants.map((variant, variantIndex) => (
                  <SwiperSlide
                    key={`${group.type}-${variant.id}-${variantIndex}`}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <WineCard variant={variant} locale={locale} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
