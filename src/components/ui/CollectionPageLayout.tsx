'use client'

import { HeroCarousel, HeroCarouselSlide } from './HeroCarousel'
import { CardsCarousel } from './CardsCarousel'
import { LoadingSpinner } from '@/components/ui/loading'

interface CollectionPageLayoutProps<T> {
  heroSlides?: HeroCarouselSlide[]
  items: T[]
  renderCard: (item: T) => React.ReactNode
  emptyMessage?: React.ReactNode
  loading?: boolean
  error?: string | null
  className?: string
}

export function CollectionPageLayout<T>({
  heroSlides,
  items,
  renderCard,
  emptyMessage = null,
  loading = false,
  error = null,
  className = '',
}: CollectionPageLayoutProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }
  return (
    <div className={`container-narrow mx-auto py-8 space-y-8 ${className}`}>
      {heroSlides && heroSlides.length > 0 && <HeroCarousel slides={heroSlides} />}
      <CardsCarousel items={items} renderCard={renderCard} emptyMessage={emptyMessage} />
    </div>
  )
}
