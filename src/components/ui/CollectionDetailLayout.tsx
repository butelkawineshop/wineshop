'use client'

import { HeroCarousel, HeroCarouselSlide } from './HeroCarousel'
import { LoadingSpinner } from '@/components/ui/loading'

interface CollectionDetailLayoutProps {
  heroSlides?: HeroCarouselSlide[]
  detailContent: React.ReactNode
  loading?: boolean
  error?: string | null
  className?: string
}

export function CollectionDetailLayout({
  heroSlides,
  detailContent,
  loading = false,
  error = null,
  className = '',
}: CollectionDetailLayoutProps) {
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
    <div className={`container-narrow mx-auto py-8 ${className}`}>
      {heroSlides && heroSlides.length > 0 && <HeroCarousel slides={heroSlides} />}
      {detailContent}
    </div>
  )
}
