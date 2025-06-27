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
  allVariants: FlatWineVariant[]
  locale: 'sl' | 'en'
}

interface RelatedGroup {
  type: 'brothers' | 'neighbours' | 'cousins' | 'budget'
  title: string
  variants: FlatWineVariant[]
}

export function RelatedWineVariants({
  currentVariant,
  allVariants,
  locale,
}: RelatedWineVariantsProps): React.JSX.Element {
  const t = useTranslations('wine.detail')

  // Helper function to get grape variety titles (not IDs)
  const getGrapeVarietyTitles = (variant: FlatWineVariant): string[] => {
    return variant.grapeVarieties?.map((gv) => gv.title || '').filter(Boolean) || []
  }

  // Helper function to get related winery IDs
  const getRelatedWineryIds = (variant: FlatWineVariant): string[] => {
    const relatedIds: string[] = []
    if (variant.relatedWineries) {
      variant.relatedWineries.forEach((rw) => {
        if (rw.id) relatedIds.push(rw.id)
      })
    }
    return relatedIds
  }

  // Helper function to get related region IDs
  const getRelatedRegionIds = (variant: FlatWineVariant): string[] => {
    const relatedIds: string[] = []
    if (variant.relatedRegions) {
      variant.relatedRegions.forEach((rr) => {
        if (rr.id) relatedIds.push(rr.id)
      })
    }
    return relatedIds
  }

  // Helper function to calculate price range percentage
  const getPriceRange = (price: number): { min: number; max: number } => {
    if (price <= 15) {
      return { min: price * 0.7, max: price * 1.3 } // 30% range
    } else if (price <= 30) {
      return { min: price * 0.75, max: price * 1.25 } // 25% range
    } else {
      return { min: price * 0.8, max: price * 1.2 } // 20% range
    }
  }

  // Helper function to calculate grape variety similarity score
  const calculateGrapeSimilarity = (currentGrapes: string[], variantGrapes: string[]): number => {
    if (currentGrapes.length === 0 || variantGrapes.length === 0) return 0

    // Exact matches get highest score (10 points each)
    const exactMatches = currentGrapes.filter((g) => variantGrapes.includes(g)).length
    if (exactMatches > 0) return exactMatches * 10

    // Check for partial matches (same grape variety family)
    // This is a simplified approach - in a real implementation, you'd have a grape variety taxonomy
    const currentGrapeNames = currentGrapes.map((g) => g.toLowerCase())
    const variantGrapeNames = variantGrapes.map((g) => g.toLowerCase())

    // Check for common grape families (simplified)
    const grapeFamilies = {
      pinot: ['pinot noir', 'pinot gris', 'pinot blanc', 'pinot meunier'],
      cabernet: ['cabernet sauvignon', 'cabernet franc'],
      merlot: ['merlot'],
      syrah: ['syrah', 'shiraz'],
      chardonnay: ['chardonnay'],
      sauvignon: ['sauvignon blanc'],
      riesling: ['riesling'],
      nebbiolo: ['nebbiolo'],
      sangiovese: ['sangiovese'],
      tempranillo: ['tempranillo'],
      grenache: ['grenache', 'garnacha'],
      mourvedre: ['mourvedre', 'monastrell'],
      malbec: ['malbec'],
      barbera: ['barbera'],
      dolcetto: ['dolcetto'],
      refosco: ['refosco'],
      schioppettino: ['schioppettino'],
      blaufrankisch: ['blaufrankisch'],
      marsanne: ['marsanne'],
      roussanne: ['roussanne'],
      carricante: ['carricante'],
      vitovska: ['vitovska grganja'],
      furmint: ['furmint'],
      picolit: ['picolit'],
      glera: ['glera'],
      parellada: ['parellada'],
      nerello: ['nerello mascalese'],
      moscato: ['moscato giallo'],
      molinara: ['molinara'],
      marselan: ['marselan'],
    }

    let familyMatches = 0
    for (const [family, varieties] of Object.entries(grapeFamilies)) {
      const currentInFamily = currentGrapeNames.some((g) =>
        varieties.some((v) => g.includes(v) || v.includes(g)),
      )
      const variantInFamily = variantGrapeNames.some((g) =>
        varieties.some((v) => g.includes(v) || v.includes(g)),
      )

      if (currentInFamily && variantInFamily) {
        familyMatches++
      }
    }

    // Family matches get 5 points each
    if (familyMatches > 0) return familyMatches * 5

    // Check for blending partners (simplified common combinations)
    const commonBlends = [
      ['cabernet sauvignon', 'merlot'],
      ['cabernet sauvignon', 'cabernet franc'],
      ['syrah', 'grenache'],
      ['syrah', 'mourvedre'],
      ['grenache', 'mourvedre'],
      ['marsanne', 'roussanne'],
      ['pinot noir', 'pinot meunier'],
      ['sangiovese', 'cabernet sauvignon'],
      ['tempranillo', 'grenache'],
      ['barbera', 'nebbiolo'],
      ['refosco', 'schioppettino'],
    ]

    for (const blend of commonBlends) {
      const currentHasBlend = blend.some((g) =>
        currentGrapeNames.some((cg) => cg.includes(g) || g.includes(cg)),
      )
      const variantHasBlend = blend.some((g) =>
        variantGrapeNames.some((vg) => vg.includes(g) || g.includes(vg)),
      )

      if (currentHasBlend && variantHasBlend) {
        return 3 // Blending partner match
      }
    }

    return 0
  }

  // 1. Brothers and Sisters - same winery and/or related wineries
  const getBrothersAndSisters = (): FlatWineVariant[] => {
    const currentWineryId = currentVariant.wineryID
    const relatedWineryIds = getRelatedWineryIds(currentVariant)

    const candidates = allVariants.filter(
      (variant) =>
        variant.id !== currentVariant.id &&
        variant.isPublished &&
        (variant.stockOnHand || 0) > 0 &&
        (variant.wineryID === currentWineryId ||
          (variant.wineryID && relatedWineryIds.includes(variant.wineryID.toString()))),
    )

    // Sort by same winery first, then by creation date
    return candidates
      .sort((a, b) => {
        const aSameWinery = a.wineryID === currentWineryId ? 1 : 0
        const bSameWinery = b.wineryID === currentWineryId ? 1 : 0
        if (aSameWinery !== bSameWinery) return bSameWinery - aSameWinery
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .slice(0, 5)
  }

  // 2. Neighbours - same region and/or neighbouring regions
  const getNeighbours = (excludedIds: Set<number>): FlatWineVariant[] => {
    const currentRegionId = currentVariant.regionID
    const relatedRegionIds = getRelatedRegionIds(currentVariant)

    const candidates = allVariants.filter(
      (variant) =>
        variant.id !== currentVariant.id &&
        !excludedIds.has(variant.id) &&
        variant.isPublished &&
        (variant.stockOnHand || 0) > 0 &&
        (variant.regionID === currentRegionId ||
          (variant.regionID && relatedRegionIds.includes(variant.regionID.toString()))),
    )

    // Sort by same region first, then by creation date
    return candidates
      .sort((a, b) => {
        const aSameRegion = a.regionID === currentRegionId ? 1 : 0
        const bSameRegion = b.regionID === currentRegionId ? 1 : 0
        if (aSameRegion !== bSameRegion) return bSameRegion - aSameRegion
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      .slice(0, 5)
  }

  // 3. Cousins - same grape variety and/or related grape varieties
  const getCousins = (excludedIds: Set<number>): FlatWineVariant[] => {
    const currentGrapeTitles = getGrapeVarietyTitles(currentVariant)

    const candidates = allVariants.filter(
      (variant) =>
        variant.id !== currentVariant.id &&
        !excludedIds.has(variant.id) &&
        variant.isPublished &&
        (variant.stockOnHand || 0) > 0 &&
        variant.grapeVarieties &&
        variant.grapeVarieties.length > 0,
    )

    // Calculate similarity scores and sort
    const scoredCandidates = candidates.map((variant) => {
      const variantGrapeTitles = getGrapeVarietyTitles(variant)
      const similarity = calculateGrapeSimilarity(currentGrapeTitles, variantGrapeTitles)
      return { variant, similarity }
    })

    return scoredCandidates
      .filter((c) => c.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .map((c) => c.variant)
      .slice(0, 5)
  }

  // 4. Budget Buds - wines in the same price range
  const getBudgetBuds = (excludedIds: Set<number>): FlatWineVariant[] => {
    if (!currentVariant.price) return []

    const { min, max } = getPriceRange(currentVariant.price)

    const candidates = allVariants.filter(
      (variant) =>
        variant.id !== currentVariant.id &&
        !excludedIds.has(variant.id) &&
        variant.isPublished &&
        (variant.stockOnHand || 0) > 0 &&
        variant.price &&
        variant.price >= min &&
        variant.price <= max,
    )

    // Sort by price proximity to current wine
    return candidates
      .sort((a, b) => {
        const aDiff = Math.abs((a.price || 0) - currentVariant.price!)
        const bDiff = Math.abs((b.price || 0) - currentVariant.price!)
        return aDiff - bDiff
      })
      .slice(0, 5)
  }

  // Build the related groups
  const buildRelatedGroups = (): RelatedGroup[] => {
    const groups: RelatedGroup[] = []
    const seenIds = new Set<number>()

    // 1. Brothers and Sisters
    const brothers = getBrothersAndSisters()
    if (brothers.length > 0) {
      groups.push({
        type: 'brothers',
        title: t('brothersAndSisters'),
        variants: brothers,
      })
      brothers.forEach((v) => seenIds.add(v.id))
    }

    // 2. Neighbours
    const neighbours = getNeighbours(seenIds)
    if (neighbours.length > 0) {
      groups.push({
        type: 'neighbours',
        title: t('neighbours'),
        variants: neighbours,
      })
      neighbours.forEach((v) => seenIds.add(v.id))
    }

    // 3. Cousins
    const cousins = getCousins(seenIds)
    if (cousins.length > 0) {
      groups.push({
        type: 'cousins',
        title: t('cousins'),
        variants: cousins,
      })
      cousins.forEach((v) => seenIds.add(v.id))
    }

    // 4. Budget Buds
    const budgetBuds = getBudgetBuds(seenIds)
    if (budgetBuds.length > 0) {
      groups.push({
        type: 'budget',
        title: t('budgetBuds'),
        variants: budgetBuds,
      })
    }

    return groups
  }

  const relatedGroups = buildRelatedGroups()

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
