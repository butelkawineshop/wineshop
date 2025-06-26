'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { WineDetail } from './WineDetail'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'
import type { RelatedWineVariant } from '@/lib/wineData'

interface WineDetailClientProps {
  variant: FlatWineVariant
  variants: FlatWineVariant[]
  relatedVariants: RelatedWineVariant[]
  locale: Locale
}

export function WineDetailClient({
  variant,
  variants,
  relatedVariants,
  locale,
}: WineDetailClientProps): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const [selectedVariant, setSelectedVariant] = useState<FlatWineVariant>(variant)

  // Update selected variant when the main variant changes (URL change)
  useEffect(() => {
    setSelectedVariant(variant)
  }, [variant.id])

  const handleVariantSelect = (newVariant: FlatWineVariant) => {
    if (newVariant.id !== selectedVariant.id) {
      // Replace the last segment (slug) in the current path with the new variant's slug
      const segments = pathname.split('/')
      segments[segments.length - 1] = newVariant.slug || ''
      const newPath = segments.join('/')
      router.push(newPath)
    }
  }

  return (
    <WineDetail
      variant={variant}
      variants={variants}
      relatedVariants={relatedVariants}
      selectedVariant={selectedVariant}
      onVariantSelect={handleVariantSelect}
      locale={locale}
    />
  )
}
