'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { TastingCard } from './TastingCard'
import type { Tasting } from '@/hooks/useTastings'
import type { Locale } from '@/constants/routes'

// Import Swiper styles
import 'swiper/css'

interface TastingCardsCarouselProps {
  tastings: Tasting[]
  locale: Locale
  className?: string
}

export function TastingCardsCarousel({
  tastings,
  locale,
  className = '',
}: TastingCardsCarouselProps) {
  // Empty state
  if (tastings.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="container-narrow text-center section-padding">
          <p className="text-base text-foreground/60">No tastings found</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`} role="region" aria-label="Tasting cards carousel">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={24}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 24,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        }}
        className="tasting-cards-carousel"
      >
        {tastings.map((tasting) => (
          <SwiperSlide key={tasting.id} className="h-auto">
            <div className="h-full">
              <TastingCard tasting={tasting} locale={locale} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
