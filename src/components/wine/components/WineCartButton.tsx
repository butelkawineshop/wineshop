'use client'

import React, { useState } from 'react'
import type { FlatWineVariant } from '@/payload-types'
import { Icon } from '@/components/Icon'
import { useTranslation } from '@/hooks/useTranslation'
import { WINE_CONSTANTS } from '@/constants/wine'

interface WineCartButtonProps {
  variant: FlatWineVariant
  quantity?: number
  onAddToCart?: (variant: FlatWineVariant, quantity: number) => void
}

export function WineCartButton({
  variant,
  quantity = 1,
  onAddToCart,
}: WineCartButtonProps): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { t } = useTranslation()

  const handleAddToCart = async (): Promise<void> => {
    if (isLoading || !variant.stockOnHand) return

    setIsLoading(true)
    try {
      // Call parent handler or default cart logic
      if (onAddToCart) {
        await onAddToCart(variant, quantity)
      } else {
        // Default cart logic will be implemented in ticket #CART-001
        // For now, simulate a successful add to cart
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
      }

      setIsAdded(true)
      setTimeout(() => setIsAdded(false), WINE_CONSTANTS.CART_SUCCESS_DISPLAY_DURATION_MS)
    } catch (error) {
      // In production, this should use proper logging
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to add to cart:', error)
      }
      // Could add user-facing error handling here in the future
    } finally {
      setIsLoading(false)
    }
  }

  const isOutOfStock = !variant.stockOnHand && !variant.canBackorder

  const getButtonText = (): string => {
    if (isLoading) return t('wine.cart.loading')
    if (isAdded) return t('wine.cart.success')
    if (isOutOfStock) return t('wine.cart.outOfStock')
    return t('wine.cart.addButton')
  }

  const getAriaLabel = (): string => {
    if (isOutOfStock) return t('wine.cart.outOfStockAria')
    return t('wine.cart.addToCartAria', { wineTitle: variant.wineTitle || t('wine.unknownWine') })
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || isOutOfStock}
      className={`
        interactive focus-ring transition-all duration-500
        ${
          isAdded
            ? 'bg-green-500 text-white'
            : isOutOfStock
              ? 'bg-foreground/20 text-foreground/40 cursor-not-allowed'
              : 'text-primary-foreground icon-container'
        }
      `}
      aria-label={getAriaLabel()}
    >
      {getButtonText() === t('wine.cart.addButton') ? (
        <Icon
          name="cart"
          variant="color"
          width={WINE_CONSTANTS.ICON_SIZE}
          height={WINE_CONSTANTS.ICON_SIZE}
        />
      ) : (
        <span className="w-4 h-4 flex items-center justify-center text-sm font-bold">
          {getButtonText()}
        </span>
      )}
    </button>
  )
}
