'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { UI_CONSTANTS } from '@/constants/ui'

interface SliderProps {
  value: [number, number]
  onValueChange: (value: [number, number]) => void
  min: number
  max: number
  step?: number
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

export function Slider({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: SliderProps): React.JSX.Element {
  const [isDragging, setIsDragging] = useState(false)
  const [dragType, setDragType] = useState<'min' | 'max' | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Validate input values
  const validatedMin = Math.min(min, max)
  const validatedMax = Math.max(min, max)
  const validatedValue: [number, number] = [
    Math.max(validatedMin, Math.min(value[0], validatedMax)),
    Math.max(validatedMin, Math.min(value[1], validatedMax)),
  ]

  const handleMouseDown = useCallback((e: React.MouseEvent, type: 'min' | 'max'): void => {
    setIsDragging(true)
    setDragType(type)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      if (!isDragging || !sliderRef.current || !dragType) return

      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = Math.max(
        UI_CONSTANTS.SLIDER_MIN_PERCENTAGE,
        Math.min(UI_CONSTANTS.SLIDER_MAX_PERCENTAGE, (e.clientX - rect.left) / rect.width),
      )
      const newValue =
        Math.round((validatedMin + (validatedMax - validatedMin) * percentage) / step) * step

      if (dragType === 'min') {
        const newMin = Math.min(newValue, validatedValue[1] - step)
        onValueChange([newMin, validatedValue[1]])
      } else {
        const newMax = Math.max(newValue, validatedValue[0] + step)
        onValueChange([validatedValue[0], newMax])
      }
    },
    [isDragging, dragType, validatedMin, validatedMax, validatedValue, step, onValueChange],
  )

  const handleMouseUp = useCallback((): void => {
    setIsDragging(false)
    setDragType(null)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, type: 'min' | 'max'): void => {
      const currentValue = type === 'min' ? validatedValue[0] : validatedValue[1]
      let newValue = currentValue

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = Math.max(validatedMin, currentValue - step)
          break
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = Math.min(validatedMax, currentValue + step)
          break
        case 'Home':
          newValue = validatedMin
          break
        case 'End':
          newValue = validatedMax
          break
        default:
          return
      }

      e.preventDefault()

      if (type === 'min') {
        const newMin = Math.min(newValue, validatedValue[1] - step)
        onValueChange([newMin, validatedValue[1]])
      } else {
        const newMax = Math.max(newValue, validatedValue[0] + step)
        onValueChange([validatedValue[0], newMax])
      }
    },
    [validatedMin, validatedMax, validatedValue, step, onValueChange],
  )

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const minPercentage = ((validatedValue[0] - validatedMin) / (validatedMax - validatedMin)) * 100
  const maxPercentage = ((validatedValue[1] - validatedMin) / (validatedMax - validatedMin)) * 100

  const sliderId = React.useId()
  const minHandleId = `${sliderId}-min`
  const maxHandleId = `${sliderId}-max`

  return (
    <div
      ref={sliderRef}
      className={cn('relative h-2 bg-gray-200 rounded-full cursor-pointer', className)}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={-1}
    >
      <div
        className="absolute h-full bg-primary rounded-full"
        style={{
          left: `${minPercentage}%`,
          width: `${maxPercentage - minPercentage}%`,
        }}
      />
      <div
        id={minHandleId}
        className="absolute top-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white transform -translate-y-1/2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        style={{ left: `${minPercentage}%` }}
        role="slider"
        aria-label="Minimum value"
        aria-valuemin={validatedMin}
        aria-valuemax={validatedValue[1] - step}
        aria-valuenow={validatedValue[0]}
        tabIndex={0}
        onMouseDown={(e) => handleMouseDown(e, 'min')}
        onKeyDown={(e) => handleKeyDown(e, 'min')}
      />
      <div
        id={maxHandleId}
        className="absolute top-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white transform -translate-y-1/2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        style={{ left: `${maxPercentage}%` }}
        role="slider"
        aria-label="Maximum value"
        aria-valuemin={validatedValue[0] + step}
        aria-valuemax={validatedMax}
        aria-valuenow={validatedValue[1]}
        tabIndex={0}
        onMouseDown={(e) => handleMouseDown(e, 'max')}
        onKeyDown={(e) => handleKeyDown(e, 'max')}
      />
    </div>
  )
}
