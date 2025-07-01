import React from 'react'
import { Icon } from '@/components/Icon'
import { useTranslation } from '@/hooks/useTranslation'

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ value, onChange, min = 1, max }: QuantitySelectorProps) {
  const { t } = useTranslation()
  const handleDecrement = () => {
    onChange(Math.max(min, value - 1))
  }
  const handleIncrement = () => {
    onChange(max ? Math.min(max, value + 1) : value + 1)
  }
  const displayValue = Number.isFinite(value) && !Number.isNaN(value) ? value : min
  let label = t('quantity.label')
  if (typeof min === 'number' && typeof max === 'number') {
    label += ` (${min}–${max})`
  } else if (typeof min === 'number') {
    label += ` (${t('quantity.min', { min })})`
  } else if (typeof max === 'number') {
    label += ` (${t('quantity.max', { max })})`
  }
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          className="flex items-center justify-center p-1 rounded focus-ring"
          aria-label={t('quantity.decrease')}
          disabled={value <= min}
        >
          <Icon name="chevron-left" width={20} height={20} variant="color" />
        </button>
        <span className="w-8 text-center font-accent text-xl select-none">
          {String(displayValue)}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          className="flex items-center justify-center p-1 rounded focus-ring"
          aria-label={t('quantity.increase')}
          disabled={!!max && value >= max}
        >
          <Icon name="chevron-right" width={20} height={20} variant="color" />
        </button>
      </div>
      <label className="text-xs text-foreground/60 mt-1">{label}</label>
    </div>
  )
}
