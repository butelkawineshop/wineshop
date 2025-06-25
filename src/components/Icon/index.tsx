'use client'

import { cn } from '@/lib/utils'
import { ICON_CONSTANTS } from '@/constants/ui'

interface IconProps {
  name: string
  className?: string
  width?: number
  height?: number
  active?: boolean
  variant?: 'white' | 'color' | 'switch' | 'active'
}

export function Icon({
  name,
  className,
  width = ICON_CONSTANTS.DEFAULT_SIZE,
  height = ICON_CONSTANTS.DEFAULT_SIZE,
  active = false,
  variant = 'white',
}: IconProps): React.JSX.Element {
  const isSwitch = variant === 'switch'
  const isActiveVariant = variant === 'active'
  const isColor = variant === 'color'
  const isWhite = variant === 'white'

  // For color-only variant, just show the color icon
  if (isColor) {
    return (
      <div
        className={cn('relative inline-block', className, active && 'active')}
        style={{ width, height }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/icons/Color/${name}.svg`}
          width={width}
          height={height}
          alt={name}
          className="absolute inset-0 w-full h-full icon-container"
          draggable={false}
        />
      </div>
    )
  }

  // For white-only variant, just show the white icon
  if (isWhite) {
    return (
      <div
        className={cn('relative inline-block', className, active && 'active')}
        style={{ width, height }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/icons/White/${name}.svg`}
          width={width}
          height={height}
          alt={name}
          className="absolute inset-0 w-full h-full"
          draggable={false}
        />
      </div>
    )
  }

  // --- SWITCH/ACTIVE LOGIC ---
  // If active variant and active is true: always show color
  if (isActiveVariant && active) {
    return (
      <div className={cn('relative inline-block', className, 'active')} style={{ width, height }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/icons/Color/${name}.svg`}
          width={width}
          height={height}
          alt={name}
          className="absolute inset-0 w-full h-full"
          draggable={false}
        />
      </div>
    )
  }

  // If switch, or active variant but not active: white by default, color on hover
  if (isSwitch || (isActiveVariant && !active)) {
    return (
      <div className={cn('relative inline-block group', className)} style={{ width, height }}>
        {/* Base: white icon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/icons/White/${name}.svg`}
          width={width}
          height={height}
          alt={name}
          className={cn(
            'absolute inset-0 w-full h-full transition-opacity',
            ICON_CONSTANTS.TRANSITION_DURATION,
            'opacity-100',
            'group-hover:opacity-0',
          )}
          draggable={false}
        />
        {/* Hover: color icon */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/icons/Color/${name}.svg`}
          width={width}
          height={height}
          alt={name}
          className={cn(
            'absolute inset-0 w-full h-full transition-opacity',
            ICON_CONSTANTS.TRANSITION_DURATION,
            'opacity-0',
            'group-hover:opacity-100',
          )}
          draggable={false}
        />
      </div>
    )
  }

  // fallback (should never hit)
  return <></>
}
