'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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

const HORIZONTAL_PADDING = 16 // px, adjust as needed for breathing room

/**
 * Range slider component with dual handles for minimum and maximum values
 *
 * @param value - Current slider values [min, max]
 * @param onValueChange - Callback when values change
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param step - Step increment (default: 1)
 * @param className - Additional CSS classes
 * @param aria-label - Accessibility label for the slider
 * @param aria-labelledby - ID of element that labels the slider
 *
 * @example
 * ```tsx
 * <Slider
 *   value={[20, 80]}
 *   onValueChange={setValue}
 *   min={0}
 *   max={100}
 *   step={5}
 *   aria-label="Price range"
 * />
 * ```
 */
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
  const [trackWidth, setTrackWidth] = useState<number>(0)

  // Measure track width on mount and resize
  useEffect(() => {
    function updateWidth() {
      if (sliderRef.current) {
        setTrackWidth(sliderRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Validate input values
  const validatedMin = Math.min(min, max)
  const validatedMax = Math.max(min, max)
  const validatedValue: [number, number] = useMemo(
    () => [
      Math.max(validatedMin, Math.min(value[0], validatedMax)),
      Math.max(validatedMin, Math.min(value[1], validatedMax)),
    ],
    [validatedMin, validatedMax, value],
  )

  const calculateValueFromPosition = useCallback(
    (clientX: number): number => {
      if (!sliderRef.current) return validatedValue[0]

      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = Math.max(
        UI_CONSTANTS.SLIDER_MIN_PERCENTAGE,
        Math.min(UI_CONSTANTS.SLIDER_MAX_PERCENTAGE, (clientX - rect.left) / rect.width),
      )
      return Math.round((validatedMin + (validatedMax - validatedMin) * percentage) / step) * step
    },
    [validatedMin, validatedMax, validatedValue, step],
  )

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, type: 'min' | 'max'): void => {
      setIsDragging(true)
      setDragType(type)
      e.preventDefault()
    },
    [],
  )

  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent): void => {
      if (!isDragging || !sliderRef.current || !dragType) return

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const newValue = calculateValueFromPosition(clientX)

      if (dragType === 'min') {
        const newMin = Math.min(newValue, validatedValue[1] - step)
        onValueChange([newMin, validatedValue[1]])
      } else {
        const newMax = Math.max(newValue, validatedValue[0] + step)
        onValueChange([validatedValue[0], newMax])
      }
    },
    [isDragging, dragType, validatedValue, step, onValueChange, calculateValueFromPosition],
  )

  const handleEnd = useCallback((): void => {
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

  // Handle click/tap on slider track
  const handleTrackClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent): void => {
      if (isDragging) return

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const newValue = calculateValueFromPosition(clientX)

      // Determine which handle to move based on which is closer
      const distanceToMin = Math.abs(newValue - validatedValue[0])
      const distanceToMax = Math.abs(newValue - validatedValue[1])

      if (distanceToMin <= distanceToMax) {
        const newMin = Math.min(newValue, validatedValue[1] - step)
        onValueChange([newMin, validatedValue[1]])
      } else {
        const newMax = Math.max(newValue, validatedValue[0] + step)
        onValueChange([validatedValue[0], newMax])
      }
    },
    [isDragging, validatedValue, step, onValueChange, calculateValueFromPosition],
  )

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
      return () => {
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }
    }
  }, [isDragging, handleMove, handleEnd])

  // Calculate pixel positions for handles and fill
  const availableWidth = Math.max(trackWidth - 2 * HORIZONTAL_PADDING, 1)
  const minPos =
    HORIZONTAL_PADDING +
    ((validatedValue[0] - validatedMin) / (validatedMax - validatedMin)) * availableWidth
  const maxPos =
    HORIZONTAL_PADDING +
    ((validatedValue[1] - validatedMin) / (validatedMax - validatedMin)) * availableWidth

  const sliderId = React.useId()
  const minHandleId = `${sliderId}-min`
  const maxHandleId = `${sliderId}-max`

  return (
    <div
      ref={sliderRef}
      className={cn(
        `relative ${UI_CONSTANTS.SLIDER_TRACK_HEIGHT} bg-gray-200 rounded-full cursor-pointer`,
        className,
      )}
      style={{ paddingLeft: HORIZONTAL_PADDING, paddingRight: HORIZONTAL_PADDING }}
      role="group"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      tabIndex={-1}
      onClick={handleTrackClick}
      onTouchStart={handleTrackClick}
    >
      <div
        className="absolute h-full bg-primary rounded-full"
        style={{
          left: minPos,
          width: maxPos - minPos,
        }}
      />
      <div
        id={minHandleId}
        className="absolute top-1/2 w-7 h-7 sm:w-6 sm:h-6 lg:w-5 lg:h-5 bg-primary rounded-full border-2 border-white transform -translate-y-1/2 -translate-x-1/2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation"
        style={{ left: minPos }}
        role="slider"
        aria-label="Minimum value"
        aria-valuemin={validatedMin}
        aria-valuemax={validatedValue[1] - step}
        aria-valuenow={validatedValue[0]}
        tabIndex={0}
        onMouseDown={(e) => handleStart(e, 'min')}
        onTouchStart={(e) => handleStart(e, 'min')}
        onKeyDown={(e) => handleKeyDown(e, 'min')}
      >
        {/* Invisible touch area for better mobile interaction */}
        <div className="absolute inset-0 w-10 h-10 sm:w-8 sm:h-8 lg:w-7 lg:h-7 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div
        id={maxHandleId}
        className="absolute top-1/2 w-7 h-7 sm:w-6 sm:h-6 lg:w-5 lg:h-5 bg-primary rounded-full border-2 border-white transform -translate-y-1/2 -translate-x-1/2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 touch-manipulation"
        style={{ left: maxPos }}
        role="slider"
        aria-label="Maximum value"
        aria-valuemin={validatedValue[0] + step}
        aria-valuemax={validatedMax}
        aria-valuenow={validatedValue[1]}
        tabIndex={0}
        onMouseDown={(e) => handleStart(e, 'max')}
        onTouchStart={(e) => handleStart(e, 'max')}
        onKeyDown={(e) => handleKeyDown(e, 'max')}
      >
        {/* Invisible touch area for better mobile interaction */}
        <div className="absolute inset-0 w-10 h-10 sm:w-8 sm:h-8 lg:w-7 lg:h-7 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  )
}

Slider.displayName = 'Slider'
