'use client'

import type { KGBProduct } from '@/hooks/useKGBProducts'
import type { Locale } from '@/constants/routes'
import { Media } from '../Media'
import { useTranslation } from '@/hooks/useTranslation'
import { ActionBar } from '../ui/ActionBar'
import { BuyButton } from '../ui/BuyButton'
import { ExampleWines } from '../ui/ExampleWines'
import { DetailsSlider } from '../ui/DetailsSlider'

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: 'kgb.frequency.monthly',
  'bi-weekly': 'kgb.frequency.biWeekly',
  'bi-monthly': 'kgb.frequency.biMonthly',
  bi_monthly: 'kgb.frequency.biMonthly',
  quarterly: 'kgb.frequency.quarterly',
  weekly: 'kgb.frequency.weekly',
}

interface KGBProductDetailProps {
  product: KGBProduct
  locale: Locale
}

export function KGBProductDetail({ product, locale }: KGBProductDetailProps) {
  const { t } = useTranslation()
  const imageUrl = product.media?.[0]?.url
  return (
    <div className="space-y-8 mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Media */}
        <div>
          <div className="aspect-square bg-gradient-cream dark:bg-gradient-black rounded-lg overflow-hidden">
            {imageUrl ? (
              <Media
                src={imageUrl}
                alt={product.title}
                fill
                size="square"
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-6xl text-primary/40">🍾</div>
              </div>
            )}
          </div>
        </div>
        {/* Right Column - Details */}
        <div className="lg:aspect-square flex flex-col">
          <div className="flex-shrink-0 mb-6">
            <h1 className="heading-1 mb-4">{product.title}</h1>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-4 mb-6">
            <DetailsSlider
              slides={[
                {
                  id: 'description',
                  content: product.description && (
                    <p className="max-w-3xl prose mb-4">{product.description}</p>
                  ),
                },
                {
                  id: 'details',
                  custom: (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t('kgb.fields.quantity')}</span>
                        <span className="text-lg">
                          {product.bottleQuantity} {t('kgb.fields.bottles')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t('kgb.fields.price')}</span>
                        <span className="text-2xl font-bold text-primary">{product.price} €</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{t('kgb.fields.frequencies')}</span>
                        <span className="text-lg">
                          {product.frequencyOptions
                            .map((f) => t(FREQUENCY_LABELS[f.frequency] || f.frequency))
                            .join(', ')}
                        </span>
                      </div>
                    </div>
                  ),
                },
              ]}
              ariaLabel="KGB product details slideshow"
            />
          </div>
          <ActionBar email="info@butelka.si" phone="+386 1 234 5678">
            <BuyButton price={product.price} showQuantity={false} />
          </ActionBar>
        </div>
      </div>
      {/* Example Wines */}
      <ExampleWines items={[product]} locale={locale} translationKey="kgb.fields.exampleWines" />
    </div>
  )
}
