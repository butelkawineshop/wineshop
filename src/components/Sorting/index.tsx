'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { Icon } from '@/components/Icon'
import { SORT_CONSTANTS, SORT_OPTIONS } from '@/constants/sorting'
import { useWineStore } from '@/store/wineStore'
import { Button } from '@/components/ui/button'

export default function Sorting(): React.JSX.Element {
  const { t } = useTranslation()
  const { sort, setSort } = useWineStore()

  const handleSort = (value: string): void => {
    setSort(value as 'createdAt' | 'price' | 'name')
  }

  const handleKeyDown = (e: React.KeyboardEvent, value: string): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSort(value)
    }
  }

  return (
    <div
      className={`flex items-center ${SORT_CONSTANTS.BUTTON_GAP} w-full justify-center`}
      role="toolbar"
      aria-label="Sorting options"
    >
      {SORT_OPTIONS.map((option) => (
        <Button
          key={option.value}
          onClick={() => handleSort(option.value)}
          onKeyDown={(e) => handleKeyDown(e, option.value)}
          variant="ghost"
          size="sm"
          className={cn(
            'grid items-center justify-items-center p-2 w-24 h-16',
            sort.field === option.value && 'text-foreground',
          )}
          title={t(`sorting.${option.value}.label`)}
          aria-pressed={sort.field === option.value}
          aria-label={t(`sorting.${option.value}.label`)}
          tabIndex={0}
        >
          <Icon name={option.icon} className={SORT_CONSTANTS.ICON_SIZE} variant="color" />
          <span className="text-xs text-center leading-tight max-w-full truncate">
            {sort.field === option.value
              ? t(`sorting.${option.value}.${sort.direction}`)
              : t(`sorting.${option.value}.label`)}
          </span>
        </Button>
      ))}
    </div>
  )
}
