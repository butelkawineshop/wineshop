'use client'

import React, { useState, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'

import { Icon } from '@/components/Icon'
import { Media } from '@/components/Media'
import { WineTitleBar } from './components/WineTitleBar'
import { WineTastingNotes } from './components/WineTastingNotes'
import { WineCartButton } from './components/WineCartButton'
import { WineDescription } from './components/WineDescription'
import { WineCollectionTags } from './components/WineCollectionTags'
import type { FlatWineVariant } from '@/payload-types'
import { useTranslation } from '@/hooks/useTranslation'
import { WINE_CONSTANTS } from '@/constants/wine'
import { formatPrice } from '@/utils/formatters'
import type { Locale } from '@/i18n/locales'

interface WineCardProps {
  variant: FlatWineVariant
  discountedPrice?: number
  locale: Locale
  onShare?: (variant: FlatWineVariant) => void
  onLike?: (variant: FlatWineVariant) => void
}

export function WineCard({
  variant,
  discountedPrice,
  locale,
  onShare,
  onLike,
}: WineCardProps): React.JSX.Element {
  const { t } = useTranslation()
  const swiperRef = useRef<{ swiper: SwiperType }>(null)
  const [activeIndex, setActiveIndex] = useState<number>(WINE_CONSTANTS.INITIAL_SLIDE_INDEX)

  const formattedPrice = formatPrice(variant.price)
  const formattedDiscountedPrice = formatPrice(discountedPrice)
  const hasDiscount = discountedPrice !== undefined && discountedPrice < (variant.price || 0)

  const handleShareWine = (): void => {
    onShare?.(variant)
  }

  const handleLikeWine = (): void => {
    onLike?.(variant)
  }

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
    <div className="flex flex-col w-full h-full max-h-[600px]">
      <WineTitleBar variant={variant} locale={locale} />

      <Swiper
        ref={swiperRef}
        nested={true}
        onSlideChange={handleSlideChange}
        className="w-full bg-background flex-shrink-0 aspect-square"
        role="region"
        aria-label="Wine details slideshow"
      >
        {/* Main wine image slide */}
        <SwiperSlide>
          <div className="w-full flex items-start relative aspect-square">
            {variant.primaryImageUrl && (
              <div className="w-full overflow-hidden aspect-square">
                <Media
                  src={variant.primaryImageUrl}
                  alt={variant.wineTitle || t('wine.fallbackAlt')}
                  className="object-cover w-full h-full"
                  priority={false}
                  size="square"
                  fill={true}
                />
                {/* Price overlay */}
                {hasDiscount ? (
                  <div
                    className={`absolute ${WINE_CONSTANTS.PRICE_OVERLAY_WIDTH} ${WINE_CONSTANTS.PRICE_OVERLAY_POSITION} ${WINE_CONSTANTS.PRICE_OVERLAY_ROTATION} z-50 items-center justify-center text-center transform border rounded px-4 py-1`}
                  >
                    <div className="flex flex-row items-center justify-center gap-1">
                      <span className="text-3xl md:text-xl font-accent text-white z-50">
                        {formattedDiscountedPrice} €
                      </span>
                      <span className="text-3xl md:text-xl font-accent text-red-300 z-50 line-through">
                        {formattedPrice} €
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`absolute ${WINE_CONSTANTS.PRICE_OVERLAY_POSITION} ${WINE_CONSTANTS.PRICE_OVERLAY_WIDTH} items-center justify-center text-center transform ${WINE_CONSTANTS.PRICE_OVERLAY_ROTATION} bg-background border border-foreground px-4 py-1`}
                  >
                    <span className="text-3xl md:text-xl font-accent">{formattedPrice} €</span>
                  </div>
                )}
              </div>
            )}
            {/* Fallback for missing images */}
            {!variant.primaryImageUrl && (
              <div className="aspect-square w-full bg-foreground/10 flex items-center justify-center">
                <span className="text-foreground/40">{t('wine.fallbackAlt')}</span>
              </div>
            )}
          </div>
        </SwiperSlide>

        {/* First tasting notes page */}
        <SwiperSlide>
          <div className="w-full h-full flex flex-col">
            <div className="text-center px-4 font-accent text-sm">
              {t('wine.tastingNotes.tasteProfile')}
            </div>
            <WineTastingNotes variant={variant} page={1} />
          </div>
        </SwiperSlide>

        {/* Second tasting notes page */}
        <SwiperSlide>
          <div className="w-full h-full flex  flex-col">
            <div className="text-center px-4 font-accent text-sm">
              {t('wine.tastingNotes.characterNotes')}
            </div>
            <WineTastingNotes variant={variant} page={2} />
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="bg-background flex flex-col w-full">
        {/* Action buttons */}
        <div className="grid grid-cols-3 w-full py-2 px-2">
          <div className="flex items-center">
            <div className="flex gap-2">
              <button
                onClick={handleLikeWine}
                className="interactive rounded-full p-1 focus-ring"
                aria-label={t('wine.actions.like')}
              >
                <Icon
                  name="like"
                  variant="active"
                  width={WINE_CONSTANTS.ICON_SIZE}
                  height={WINE_CONSTANTS.ICON_SIZE}
                />
              </button>
              <button
                onClick={handleShareWine}
                className="interactive rounded-full p-1 focus-ring"
                aria-label={t('wine.actions.share')}
              >
                <Icon
                  name="share"
                  variant="color"
                  width={WINE_CONSTANTS.ICON_SIZE}
                  height={WINE_CONSTANTS.ICON_SIZE}
                />
              </button>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="flex justify-center items-center">
            <div className="flex gap-2">
              {WINE_CONSTANTS.SLIDE_INDICATORS.map((index) => (
                <button
                  key={index}
                  onClick={() => handleSlideIndicatorClick(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={`${WINE_CONSTANTS.INDICATOR_SIZE} rounded-full transition-colors duration-300 focus-ring ${
                    activeIndex === index ? 'bg-primary' : 'bg-foreground/20'
                  }`}
                  aria-label={t('wine.actions.goToSlide', { slideNumber: index + 1 })}
                  aria-pressed={activeIndex === index}
                  tabIndex={0}
                />
              ))}
            </div>
          </div>

          {/* Cart button */}
          <div className="flex justify-end items-center">
            <WineCartButton variant={variant} />
          </div>
        </div>

        {/* Wine description and tags */}
        <div className="px-2 pb-2 w-full space-y-content">
          <WineDescription variant={variant} />
          <WineCollectionTags variant={variant} locale={locale} />
        </div>
      </div>
    </div>
  )
}
