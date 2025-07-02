'use client'

import { useState } from 'react'
import { QuantitySelector } from './QuantitySelector'
import { WineCartButton } from '@/components/wine/components/WineCartButton'
import { useTranslation } from '@/hooks/useTranslation'
import type { FlatWineVariant } from '@/payload-types'

interface BuyButtonProps {
  price: number
  minQuantity?: number
  maxQuantity?: number
  defaultQuantity?: number
  onAddToCart?: (quantity: number) => void
  showQuantity?: boolean
  className?: string
}

export function BuyButton({
  price,
  minQuantity = 1,
  maxQuantity = 100,
  defaultQuantity,
  onAddToCart,
  showQuantity = true,
  className = '',
}: BuyButtonProps) {
  const { t } = useTranslation()

  // Ensure safe defaults
  const safeMin = typeof minQuantity === 'number' && !isNaN(minQuantity) ? minQuantity : 1
  const safeMax = typeof maxQuantity === 'number' && !isNaN(maxQuantity) ? maxQuantity : 100
  const safePrice = typeof price === 'number' && !isNaN(price) ? price : 0
  const [quantity, setQuantity] = useState(defaultQuantity || safeMin)

  const handleQuantityChange = (val: number) => {
    setQuantity(val)
  }

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(quantity)
  }

  // Create a mock variant for the cart button
  const mockVariant: FlatWineVariant = {
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
  }

  if (showQuantity) {
    return (
      <div className={`grid grid-cols-3 items-center py-2 gap-4 ${className}`}>
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
          <WineCartButton variant={mockVariant} quantity={quantity} onAddToCart={handleAddToCart} />
          <span className="text-xs text-foreground/60 mt-1">{t('common.actions.addToCart')}</span>
        </div>
        {/* Right: Price */}
        <div className="flex flex-col items-center">
          <span className="text-2xl font-accent font-semibold">
            {(quantity * safePrice).toFixed(2).replace('.', ',')} €
          </span>
          <span className="text-xs text-foreground/60">
            {t('common.price.perUnit', { price: safePrice.toFixed(2).replace('.', ',') })}
          </span>
        </div>
      </div>
    )
  }

  // Simple buy button without quantity
  return (
    <div className={`grid grid-cols-2 items-center py-2 gap-4 ${className}`}>
      {/* Center: Cart Button */}
      <div className="flex flex-col items-center">
        <WineCartButton variant={mockVariant} quantity={1} onAddToCart={handleAddToCart} />
        <span className="text-xs text-foreground/60 mt-1">{t('common.actions.addToCart')}</span>
      </div>
      {/* Right: Price */}
      <div className="flex flex-col items-center">
        <span className="text-2xl font-accent font-semibold">
          {safePrice.toFixed(2).replace('.', ',')} €
        </span>
        <span className="text-xs text-foreground/60">
          {t('common.price.perUnit', { price: safePrice.toFixed(2).replace('.', ',') })}
        </span>
      </div>
    </div>
  )
}
