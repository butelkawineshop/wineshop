'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Media } from '../Media'

export interface HeroCarouselSlide {
  id: string
  title: string
  content?: string | React.ReactNode
  mediaUrl?: string
  alt?: string
}

interface HeroCarouselProps {
  slides: HeroCarouselSlide[]
  className?: string
}

export function HeroCarousel({ slides, className = '' }: HeroCarouselProps) {
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      className={`w-full h-[400px] md:rounded-lg overflow-hidden ${className}`}
    >
      {slides.map((slide, idx) => (
        <SwiperSlide key={slide.id} className="h-full">
          <div className="relative w-full h-full flex items-center justify-center">
            {slide.mediaUrl ? (
              <Media
                src={slide.mediaUrl}
                alt={slide.alt || slide.title}
                fill
                size="hero"
                className="absolute inset-0 w-full h-full object-cover"
                priority={idx === 0}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
            )}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                zIndex: 1,
              }}
            />
            <div className="relative z-10 text-center text-white p-8">
              <h3 className="heading-3 mb-4">{slide.title}</h3>
              <div className="text-lg font-sans">
                {typeof slide.content === 'string' ? slide.content : slide.content}
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
