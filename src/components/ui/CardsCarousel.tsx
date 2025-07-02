'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

interface CardsCarouselProps<T> {
  items: T[]
  renderCard: (item: T) => React.ReactNode
  emptyMessage?: React.ReactNode
  className?: string
}

export function CardsCarousel<T>({
  items,
  renderCard,
  emptyMessage = null,
  className = '',
}: CardsCarouselProps<T>) {
  if (items.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <div className="container-narrow text-center section-padding">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`} role="region" aria-label="Cards carousel">
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
        className="cards-carousel"
      >
        {items.map((item, idx) => (
          <SwiperSlide key={idx} className="h-auto">
            <div className="h-full">{renderCard(item)}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
