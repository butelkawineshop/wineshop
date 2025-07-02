'use client'

import { Media } from '../Media'
import { CollectionLink } from '../ui/CollectionLink'
import type { KGBProduct } from '@/hooks/useKGBProducts'
import type { Locale } from '@/constants/routes'
import { useTranslation } from '@/hooks/useTranslation'

const FREQUENCY_LABELS: Record<string, string> = {
  monthly: 'kgb.frequency.monthly',
  'bi-weekly': 'kgb.frequency.biWeekly',
  'bi-monthly': 'kgb.frequency.biMonthly',
  bi_monthly: 'kgb.frequency.biMonthly',
  quarterly: 'kgb.frequency.quarterly',
  weekly: 'kgb.frequency.weekly',
}

interface KGBProductCardProps {
  product: KGBProduct
  locale: Locale
}

export function KGBProductCard({ product, locale }: KGBProductCardProps) {
  const { t } = useTranslation()
  const imageUrl = product.media?.[0]?.url
  return (
    <CollectionLink
      collection="kgb-products"
      slug={product.slug}
      locale={locale}
      className="block group"
    >
      <div className="group relative bg-background border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
        {/* Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          {imageUrl ? (
            <Media
              src={imageUrl}
              alt={product.title}
              fill
              size="square"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-4xl text-primary/40">🍾</div>
            </div>
          )}

          {/* Overlay with price */}
          <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <div className="text-sm font-accent">€{product.price}</div>
            <div className="text-xs text-muted-foreground">{t('kgb.perPack')}</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="heading-3 mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
          )}
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('kgb.fields.quantity')}</span>
              <span className="font-medium">
                {product.bottleQuantity} {t('kgb.fields.bottles')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('kgb.fields.frequencies')}</span>
              <span className="font-medium text-right">
                {product.frequencyOptions
                  .map((f) => t(FREQUENCY_LABELS[f.frequency] || f.frequency))
                  .join(', ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </CollectionLink>
  )
}
