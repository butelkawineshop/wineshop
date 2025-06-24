'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import type { FieldConfig } from '../CollectionPage/CollectionConfig'
import { Media } from '../Media'
import type { Locale } from '@/utils/routeMappings'

interface InfoCarouselProps {
  item: Record<string, unknown>
  fields: FieldConfig[]
  mediaField: string
  locale: Locale
  messages: Record<string, unknown>
}

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj) as string | undefined
}

export function InfoCarousel({ item, fields, mediaField, messages }: InfoCarouselProps) {
  const t = (key: string): string => {
    try {
      return getNestedValue(messages, key) || key
    } catch {
      return key
    }
  }
  const media = (item[mediaField] as Array<{ url: string }>) || []
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      className="w-full h-[400px] md:rounded-lg overflow-hidden"
    >
      {fields.map((field, idx) => {
        const value = item[field.name]
        if (!value) return null
        const mediaObj = media[idx % media.length] || media[0]
        const imageBase =
          (mediaObj as { baseUrl?: string } | undefined)?.baseUrl ||
          (mediaObj as { url?: string } | undefined)?.url
        return (
          <SwiperSlide key={field.name} className="h-full">
            <div className="relative w-full h-full flex items-center justify-center">
              {imageBase && (
                <Media
                  src={imageBase}
                  alt={field.label || field.name}
                  fill
                  size="square"
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={false}
                />
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
                <h3 className="heading-3 mb-2">
                  {field.labelKey ? t(field.labelKey) : field.label || field.name}
                </h3>
                <div className="text-lg font-sans">
                  {typeof value === 'string' ? value : JSON.stringify(value)}
                </div>
              </div>
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
