'use client'

import React, { useState, useRef } from 'react'
import { Media } from '../Media'
import { ExampleWines } from '../ui/ExampleWines'
import { ActionBar } from '../ui/ActionBar'
import { BuyButton } from '../ui/BuyButton'
import type { Tasting } from '@/hooks/useTastings'
import { useTranslation } from '@/hooks/useTranslation'
import type { Locale } from '@/constants/routes'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import { TASTING_CONSTANTS } from '@/constants/tasting'
import 'swiper/css'
import { DetailsSlider, DetailsSlide } from '../ui/DetailsSlider'

interface TastingDetailProps {
  tasting: Tasting
  locale: Locale
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes} min`
  } else if (remainingMinutes === 0) {
    return `${hours} h${hours > 1 ? 's' : ''}`
  } else {
    return `${hours} h${hours > 1 ? 's' : ''} ${remainingMinutes} min`
  }
}

function formatWineTypes(wineTypes: Array<{ wineType: string; quantity: number }>): string {
  return wineTypes
    .map(({ wineType, quantity }) => `${quantity} ${wineType}${quantity > 1 ? 's' : ''}`)
    .join(', ')
}

export function TastingDetail({ tasting, locale }: TastingDetailProps): React.JSX.Element {
  const { t } = useTranslation()
  const swiperRef = useRef<{ swiper: SwiperType }>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const primaryImage = tasting.media?.[0]
  const imageUrl = primaryImage?.url

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

  return (
    <div className="space-y-8 mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Media */}
        <div>
          {/* Media */}
          <div
            className={`${TASTING_CONSTANTS.ASPECT_RATIO} bg-gradient-cream dark:bg-gradient-black ${TASTING_CONSTANTS.CARD_BORDER_RADIUS} overflow-hidden`}
          >
            {imageUrl ? (
              <Media
                src={imageUrl}
                alt={tasting.title}
                fill
                size="square"
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-6xl text-primary/40">🍷</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sticky title, scrollable content, sticky contact links */}
        <div className="lg:aspect-square flex flex-col">
          {/* Sticky Title */}
          <div className="flex-shrink-0 mb-6">
            <h1 className="heading-1 mb-4">{tasting.title}</h1>
          </div>

          {/* Scrollable Content */}
          <div
            className={`flex-1 min-h-0 overflow-y-auto ${TASTING_CONSTANTS.CONTENT_SPACING} mb-6`}
          >
            {/* Key Details */}
            <DetailsSlider
              slides={[
                {
                  id: 'description',
                  content: tasting.description && (
                    <p className="max-w-3xl prose">{tasting.description}</p>
                  ),
                },
                {
                  id: 'details',
                  custom: (
                    <div
                      className={`bg-card border border-border ${TASTING_CONSTANTS.CARD_BORDER_RADIUS} ${TASTING_CONSTANTS.CARD_PADDING}`}
                    >
                      <h2 className="heading-3 mb-4">{t('tasting.fields.details')}</h2>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{t('tasting.fields.pricePerPerson')}</span>
                          <span className="text-2xl font-bold text-primary">
                            €{tasting.pricePerPerson}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-medium">{t('tasting.fields.duration')}</span>
                          <span className="text-lg">{formatDuration(tasting.duration)}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-medium">{t('tasting.fields.people')}</span>
                          <span className="text-lg">
                            {t('tasting.fields.peopleRange', {
                              min: tasting.minPeople,
                              max: tasting.maxPeople,
                            })}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="font-medium">{t('tasting.fields.wineTypes')}</span>
                          <span className="text-lg text-right">
                            {formatWineTypes(tasting.wineTypes)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
              ariaLabel="Tasting details slideshow"
            />
          </div>
          {/* Sticky Contact Links */}
          <div className="flex-shrink-0">
            <ActionBar
              email={t('tasting.contact.email', { defaultValue: TASTING_CONSTANTS.DEFAULT_EMAIL })}
              phone={t('tasting.contact.phone', { defaultValue: TASTING_CONSTANTS.DEFAULT_PHONE })}
            >
              <BuyButton
                price={tasting.pricePerPerson}
                minQuantity={tasting.minPeople}
                maxQuantity={tasting.maxPeople}
                defaultQuantity={tasting.minPeople}
                showQuantity={true}
              />
            </ActionBar>
          </div>
        </div>
      </div>
      {/* Example Wines */}
      <ExampleWines
        items={[tasting]}
        locale={locale}
        translationKey="tasting.fields.exampleWines"
      />
    </div>
  )
}
