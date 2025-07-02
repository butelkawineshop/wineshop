'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { useRef, useState } from 'react'
import 'swiper/css'
import Image from 'next/image'

export interface DetailsSlide {
  id: string
  title?: string
  content?: React.ReactNode
  mediaUrl?: string
  alt?: string
  custom?: React.ReactNode
}

interface DetailsSliderProps {
  slides: DetailsSlide[]
  ariaLabel?: string
  indicatorClassName?: string
}

export function DetailsSlider({
  slides,
  ariaLabel = 'Details slider',
  indicatorClassName = '',
}: DetailsSliderProps) {
  const swiperRef = useRef<{ swiper: SwiperType }>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const handleSlideChange = (swiper: SwiperType): void => {
    setActiveIndex(swiper.activeIndex)
  }

  const handleSlideIndicatorClick = (index: number): void => {
    swiperRef.current?.swiper?.slideTo(index)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSlideIndicatorClick(index)
    }
  }

  if (!slides.length) return null

  return (
    <div className="space-y-4">
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        spaceBetween={10}
        onSlideChange={handleSlideChange}
        className="w-full"
        role="region"
        aria-label={ariaLabel}
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {slide.custom ? (
              slide.custom
            ) : (
              <div>
                {slide.title && <h2 className="heading-3 mb-2">{slide.title}</h2>}
                {slide.content && <div>{slide.content}</div>}
                {slide.mediaUrl && (
                  <Image
                    src={slide.mediaUrl}
                    alt={slide.alt || ''}
                    className="w-full rounded-lg mt-2"
                    width={500}
                    height={500}
                  />
                )}
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Slide indicators */}
      <div className="flex justify-center items-center">
        <div className={`flex gap-2 ${indicatorClassName}`}>
          {slides.map((_, index) => (
            <button
              key={`details-slide-${index}`}
              onClick={() => handleSlideIndicatorClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 focus-ring ${
                activeIndex === index ? 'bg-primary' : 'bg-foreground/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={activeIndex === index}
              tabIndex={0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
