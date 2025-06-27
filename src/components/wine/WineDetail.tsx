'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import type { FlatWineVariant } from '@/payload-types'
import { WineDescription } from './components/WineDescription'
import { WineTastingNotes } from './components/WineTastingNotes'
import { WineCollectionTags } from './components/WineCollectionTags'
import { WineCartButton } from './components/WineCartButton'
import { Accordion } from '@/components/Accordion'
import { Icon } from '@/components/Icon'
import { Media } from '@/components/Media'
import { RelatedWineVariants } from './components/RelatedWineVariants'
import { WINE_CONSTANTS } from '@/constants/wine'
import type { RelatedWineVariant } from '@/services/WineService'

interface WineDetailProps {
  variant: FlatWineVariant
  variants: FlatWineVariant[]
  relatedVariants: RelatedWineVariant[]
  selectedVariant: FlatWineVariant | null
  onVariantSelect: (variant: FlatWineVariant) => void
  locale: 'sl' | 'en'
}

type AccordionSection = 'description' | 'tasting' | 'food' | null

export function WineDetail({
  variant,
  variants,
  relatedVariants,
  selectedVariant,
  onVariantSelect,
  locale,
}: WineDetailProps): React.JSX.Element {
  const t = useTranslations('wine.detail')
  const [isVariantOpen, setIsVariantOpen] = useState(false)
  const [openSection, setOpenSection] = useState<AccordionSection>('description')
  const [isEndOfContent, setIsEndOfContent] = useState(false)
  const endOfContentRef = useRef<HTMLDivElement>(null)

  // Debug logging for relatedVariants
  console.log('WineDetail: relatedVariants prop:', relatedVariants)
  console.log('WineDetail: relatedVariants length:', relatedVariants?.length)
  console.log('WineDetail: relatedVariants type:', typeof relatedVariants)
  console.log('WineDetail: relatedVariants isArray:', Array.isArray(relatedVariants))

  // Intersection observer for end of content detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          setIsEndOfContent(entry.isIntersecting)
        }
      },
      {
        threshold: 0,
        rootMargin: '100px',
      },
    )

    const currentRef = endOfContentRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const currentVariant = selectedVariant || variant

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 w-full items-center justify-center text-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Media */}
            <div className="lg:sticky lg:top-8 lg:self-start">
              <div className="aspect-square bg-gradient-cream dark:bg-gradient-black rounded-lg overflow-hidden">
                {currentVariant.primaryImageUrl && (
                  <Media
                    src={currentVariant.primaryImageUrl}
                    alt={currentVariant.wineTitle || ''}
                    width={WINE_CONSTANTS.IMAGE_WIDTH}
                    height={WINE_CONSTANTS.IMAGE_HEIGHT}
                    size="square"
                    priority
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className={`flex flex-col gap-4 ${isEndOfContent ? 'end-of-content' : ''}`}>
                <div className="flex flex-col border-b border-other-bg/20 pb-2 w-full sticky top-0 bg-background left-0 right-0 z-10 pt-4">
                  {/* Winery Title */}
                  {currentVariant.wineryTitle && (
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-sm text-foreground/60 font-medium">
                        {currentVariant.wineryTitle}
                      </span>
                    </div>
                  )}

                  {/* Wine Title and Variant Selector */}
                  <div className="relative justify-between w-full font-accent">
                    <button
                      onClick={() => setIsVariantOpen(!isVariantOpen)}
                      className="flex items-center gap-2 text-2xl w-full justify-center group font-bold lowercase hover:text-foreground/80 transition-colors"
                    >
                      {currentVariant && (
                        <>
                          <span className="icon-container">
                            {currentVariant.wineTitle}, {currentVariant.vintage},{' '}
                            {currentVariant.size}ml
                          </span>
                          {variants.filter(
                            (v) => v.originalVariant === currentVariant.originalVariant,
                          ).length > 1 && (
                            <Icon name="select" className="w-5 h-5" variant="color" />
                          )}
                        </>
                      )}
                    </button>

                    {/* Variant Dropdown */}
                    {isVariantOpen &&
                      variants.filter((v) => v.originalVariant === currentVariant.originalVariant)
                        .length > 1 && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-background border border-other-bg/20 rounded-lg shadow-lg z-10">
                          {variants
                            .filter(
                              (variant) =>
                                variant.originalVariant === currentVariant.originalVariant,
                            )
                            .map((variant) => (
                              <button
                                key={variant.id}
                                onClick={() => {
                                  onVariantSelect(variant)
                                  setIsVariantOpen(false)
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-other-bg/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                              >
                                {variant.wineTitle}, {variant.vintage}, {variant.size}ml
                              </button>
                            ))}
                        </div>
                      )}
                  </div>

                  {/* Tags and Collections */}
                  <div className="flex flex-col text-foreground/60 justify-center items-center">
                    <WineCollectionTags
                      variant={currentVariant}
                      locale={locale}
                      maxTags={WINE_CONSTANTS.DEFAULT_MAX_TAGS}
                    />
                  </div>
                </div>

                {/* Information Table */}
                <div className="grid grid-cols-2 gap-4 border-b border-other-bg/20 pb-4 text-xs">
                  {/* Left Column */}
                  <div className="flex flex-col gap-2">
                    {currentVariant.regionTitle && (
                      <div className="flex items-center gap-2">
                        <Icon name="region" className="w-4 h-4" variant="color" />
                        <span>{currentVariant.regionTitle}</span>
                      </div>
                    )}
                    {currentVariant.countryTitle && (
                      <div className="flex items-center gap-2">
                        <Icon name="country" className="w-4 h-4" variant="color" />
                        <span>{currentVariant.countryTitle}</span>
                      </div>
                    )}
                    {currentVariant.styleTitle && (
                      <div className="flex items-center gap-2">
                        <Icon name="style" className="w-4 h-4" variant="color" />
                        <span>{currentVariant.styleTitle}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col gap-2">
                    {currentVariant.servingTemp && (
                      <div className="flex items-center gap-2">
                        <Icon name="temperature" className="w-4 h-4" variant="color" />
                        <span>{currentVariant.servingTemp}°C</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Icon name="decanter" className="w-4 h-4" variant="color" />
                      <span>
                        {currentVariant.decanting ? t('recommended') : t('notRecommended')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accordion Sections */}
                <div className="flex flex-col gap-2">
                  {/* Description */}
                  {currentVariant.description && (
                    <Accordion
                      title={t('description')}
                      isOpen={openSection === 'description'}
                      onToggle={() =>
                        setOpenSection(openSection === 'description' ? null : 'description')
                      }
                      icon="description"
                    >
                      <WineDescription variant={currentVariant} />
                    </Accordion>
                  )}

                  {/* Tasting Profile */}
                  {currentVariant.tastingProfile && (
                    <Accordion
                      title={t('tastingProfile')}
                      isOpen={openSection === 'tasting'}
                      onToggle={() => setOpenSection(openSection === 'tasting' ? null : 'tasting')}
                      icon="tasting-profile"
                    >
                      <div className="prose prose-lg max-w-none text-sm">
                        <p>{currentVariant.tastingProfile}</p>
                      </div>
                    </Accordion>
                  )}

                  {/* Food Pairing */}
                  {currentVariant.dishes && currentVariant.dishes.length > 0 && (
                    <Accordion
                      title={t('foodPairing')}
                      isOpen={openSection === 'food'}
                      onToggle={() => setOpenSection(openSection === 'food' ? null : 'food')}
                      icon="pairing"
                    >
                      <div className="flex flex-wrap gap-2">
                        {currentVariant.dishes.map((dish) => (
                          <span
                            key={dish.id}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                          >
                            {locale === 'en' ? dish.titleEn : dish.title}
                          </span>
                        ))}
                      </div>
                    </Accordion>
                  )}
                </div>

                {/* Tasting Notes */}
                {currentVariant.tastingNotes && (
                  <div>
                    <div className="flex flex-col gap-2 text-sm">
                      <WineTastingNotes variant={currentVariant} />
                    </div>
                  </div>
                )}

                {/* Sticky Action Bar */}
                <div className="sticky bottom-0 left-0 right-0 bg-background z-20 border-t border-other-bg/20 lg:group-[.end-of-content]:w-screen lg:group-[.end-of-content]:-mx-4">
                  <div className="grid grid-cols-3 items-center py-2">
                    {/* Left Section - Icons */}
                    <div className="flex items-center gap-8">
                      <div className="flex flex-col items-center gap-1 group">
                        <Icon name="like" className="w-5 h-5" />
                        <span className="text-xs text-foreground/60 text-center">{t('save')}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 group">
                        <Icon name="share" className="w-5 h-5" />
                        <span className="text-xs text-foreground/60 text-center">{t('share')}</span>
                      </div>
                      <div className="hidden md:flex flex-col items-center gap-1">
                        <span className="font-accent text-2xl">
                          {currentVariant.stockOnHand || 0}
                        </span>
                        <span className="text-xs text-foreground/60 text-center">
                          {t('inStock')}
                        </span>
                      </div>
                    </div>

                    {/* Center Section - Add to Cart */}
                    <div className="flex flex-col items-center justify-center group">
                      {currentVariant && <WineCartButton variant={currentVariant} />}
                    </div>

                    {/* Right Section - Price */}
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-accent text-center font-semibold">
                        {currentVariant.price?.toFixed(2).replace('.', ',') || '0,00'} €
                      </span>
                      <span className="text-xs text-foreground/60">{t('priceWithVAT')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* End of content marker */}
              <div ref={endOfContentRef} className="h-1" />
            </div>
          </div>

          {/* Related Wines */}
          {relatedVariants && relatedVariants.length > 0 && (
            <RelatedWineVariants relatedVariants={relatedVariants} locale={locale} />
          )}
        </div>
      </div>
    </div>
  )
}
