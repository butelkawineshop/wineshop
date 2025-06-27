'use client'

import { useTranslations } from 'next-intl'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCards } from 'swiper/modules'
import type { FlatWineVariant } from '@/payload-types'
import { WineCard } from '@/components/wine/WineCard'
import 'swiper/css'
import 'swiper/css/effect-cards'

interface RelatedWineVariantsProps {
  relatedVariants: Array<{
    type: string
    title: string
    variants: FlatWineVariant[]
  }>
  locale: 'sl' | 'en'
}

interface RelatedGroup {
  type: 'brothers' | 'neighbours' | 'cousins' | 'budget'
  title: string
  variants: FlatWineVariant[]
}

export function RelatedWineVariants({
  relatedVariants,
  locale,
}: RelatedWineVariantsProps): React.JSX.Element {
  const t = useTranslations('wine.detail')

  // Transform the relatedVariants data into the expected format
  const transformRelatedVariants = (): RelatedGroup[] => {
    const groups: RelatedGroup[] = []
    const seenIds = new Set<number>()

    // Define the priority order for sorting
    const priorityOrder = ['brothers', 'neighbours', 'cousins', 'budget']
    const typePriority = new Map(priorityOrder.map((type, index) => [type, index]))

    // Map the relatedVariants to our expected format
    for (const group of relatedVariants) {
      if (group.variants.length === 0) continue

      // Filter out already seen variants
      const uniqueVariants = group.variants.filter((v) => !seenIds.has(v.id))
      if (uniqueVariants.length === 0) continue

      // Map the type to our expected types
      let mappedType: RelatedGroup['type']
      let mappedTitle: string

      switch (group.type) {
        case 'winery':
        case 'relatedWinery':
          mappedType = 'brothers'
          mappedTitle = t('brothersAndSisters')
          break
        case 'region':
        case 'relatedRegion':
          mappedType = 'neighbours'
          mappedTitle = t('neighbours')
          break
        case 'grapeVariety':
          mappedType = 'cousins'
          mappedTitle = t('cousins')
          break
        case 'price':
          mappedType = 'budget'
          mappedTitle = t('budgetBuds')
          break
        default:
          continue // Skip unknown types
      }

      // Check if we already have this type
      const existingGroup = groups.find((g) => g.type === mappedType)
      if (existingGroup) {
        // Add unique variants to existing group
        uniqueVariants.forEach((v) => {
          if (!existingGroup.variants.some((existing) => existing.id === v.id)) {
            existingGroup.variants.push(v)
          }
        })
      } else {
        // Create new group
        groups.push({
          type: mappedType,
          title: mappedTitle,
          variants: uniqueVariants.slice(0, 5), // Limit to 5 per group
        })
      }

      // Mark variants as seen
      uniqueVariants.forEach((v) => seenIds.add(v.id))
    }

    // Sort groups by priority order
    return groups.sort((a, b) => {
      const aPriority = typePriority.get(a.type) ?? 999
      const bPriority = typePriority.get(b.type) ?? 999
      return aPriority - bPriority
    })
  }

  const relatedGroups = transformRelatedVariants()

  if (relatedGroups.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-accent mb-8">{t('relatedWines')}</h2>
        <p className="text-muted">{t('noRelatedByWinery')}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-accent mb-8">{t('relatedWines')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {relatedGroups.map((group) => (
          <div key={`${group.type}-${group.title}`} className="">
            <h3 className="text-lg font-accent mb-4">{group.title}</h3>
            <div className="relative h-auto">
              <Swiper
                effect="cards"
                grabCursor={true}
                modules={[EffectCards]}
                cardsEffect={{
                  perSlideOffset: 7,
                  perSlideRotate: 0,
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
