'use client'

import { Icon } from '../Icon'
import { useTranslation } from '@/hooks/useTranslation'
import { useState } from 'react'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { WineCartButton } from '@/components/wine/components/WineCartButton'
import { TASTING_CONSTANTS } from '@/constants/tasting'
import type { FlatWineVariant } from '@/payload-types'

interface TastingBarProps {
  email?: string
  phone?: string
  pricePerPerson: number
  minPeople: number
  maxPeople: number
  onAddToCart?: (quantity: number) => void
}

export function TastingBar({
  email = TASTING_CONSTANTS.DEFAULT_EMAIL,
  phone = TASTING_CONSTANTS.DEFAULT_PHONE,
  pricePerPerson,
  minPeople,
  maxPeople,
  onAddToCart,
}: TastingBarProps) {
  const { t } = useTranslation()

  // Ensure safe defaults for min, max, and price
  const safeMin = typeof minPeople === 'number' && !isNaN(minPeople) ? minPeople : 1
  const safeMax = typeof maxPeople === 'number' && !isNaN(maxPeople) ? maxPeople : 100
  const safePrice =
    typeof pricePerPerson === 'number' && !isNaN(pricePerPerson) ? pricePerPerson : 0
  const [quantity, setQuantity] = useState(safeMin)

  const handleQuantityChange = (val: number) => {
    setQuantity(val)
  }

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(quantity)
  }

  return (
    <div className="bg-card border-y md:border border-border md:rounded-lg p-6">
      <div className="grid grid-cols-3 items-center py-2 gap-4">
        {/* Left: Quantity Selector */}
        <div className="flex flex-col items-center">
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            min={safeMin}
            max={safeMax}
          />
        </div>
        {/* Center: Cart Button */}
        <div className="flex flex-col items-center">
          <WineCartButton
            variant={
              {
                id: 0,
                originalVariant: 0,
                price: safePrice,
                canBackorder: true,
                stockOnHand: 9999,
                wineTitle: '',
                primaryImageUrl: '',
                slug: '',
                createdAt: '',
                updatedAt: '',
                _status: 'published',
              } as FlatWineVariant
            }
            quantity={quantity}
            onAddToCart={() => handleAddToCart()}
          />
          <span className="text-xs text-foreground/60 mt-1">{t('tasting.actions.addToCart')}</span>
        </div>
        {/* Right: Price */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-accent font-semibold">
            {(quantity * safePrice).toFixed(2).replace('.', ',')} €
          </span>
          <span className="text-xs text-foreground/60">
            {t('tasting.perPersonTB', { price: safePrice.toFixed(2).replace('.', ',') })}
          </span>
        </div>
      </div>
      {/* Contact Links */}
      <div className="grid grid-cols-2 items-center justify-between mt-6">
        {email && (
          <div className="flex flex-col items-center">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t('tasting.contact.emailLabel', { email })}
            >
              <Icon name="email" variant="color" width={20} height={20} />
              <span>{t('tasting.contact.emailDisplay', { email })}</span>
            </a>
            <span className="text-xs text-foreground/60 mt-1">
              {t('tasting.contact.emailLabel')}
            </span>
          </div>
        )}
        {phone && (
          <div className="flex flex-col items-center">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={t('tasting.contact.phoneLabel', { phone })}
            >
              <Icon name="phone" variant="color" width={20} height={20} />
              <span>{t('tasting.contact.phoneDisplay', { phone })}</span>
            </a>
            <span className="text-xs text-foreground/60 mt-1">
              {t('tasting.contact.phoneLabel')}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
