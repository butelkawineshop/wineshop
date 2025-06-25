'use client'

import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import { Icon } from '@/components/Icon'
import { SORT_CONSTANTS, SORT_OPTIONS } from '@/constants/sorting'

export default function Sorting(): React.JSX.Element {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const currentSort = searchParams.get('sort') || 'createdAt'
  const currentDirection = searchParams.get('direction') || 'desc'

  const handleSort = (value: string): void => {
    const params = new URLSearchParams(searchParams.toString())

    if (currentSort === value) {
      // Toggle direction if clicking the same sort option
      params.set('direction', currentDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new sort and default to descending
      params.set('sort', value)
      params.set('direction', 'desc')
    }

    router.push(`${pathname}?${params.toString()}`)
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
        <button
          key={option.value}
          onClick={() => handleSort(option.value)}
          onKeyDown={(e) => handleKeyDown(e, option.value)}
          className={cn(
            `flex flex-col items-center ${SORT_CONSTANTS.ICON_GAP} p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`,
            currentSort === option.value && 'text-foreground',
          )}
          title={t(`sorting.${option.value}.label`)}
          aria-pressed={currentSort === option.value}
          aria-label={t(`sorting.${option.value}.label`)}
          tabIndex={0}
        >
          <Icon name={option.icon} className={SORT_CONSTANTS.ICON_SIZE} variant="color" />
          <span className="text-xs">
            {currentSort === option.value
              ? t(`sorting.${option.value}.${currentDirection}`)
              : t(`sorting.${option.value}.label`)}
          </span>
        </button>
      ))}
    </div>
  )
}
