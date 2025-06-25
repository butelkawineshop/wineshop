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
  const isActive = variant === 'active'
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
          className="absolute inset-0 w-full h-full"
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

  // For switch and active variants, show transition behavior
  const baseIconPath = isActive ? '/icons/Color/' : '/icons/White/'
  const hoverIconPath = '/icons/Color/'

  const baseOpacity = isActive ? 'opacity-100' : 'opacity-100'
  const hoverOpacity = isActive ? 'opacity-0' : 'opacity-0'

  return (
    <div
      className={cn('relative inline-block group', className, active && 'active')}
      style={{ width, height }}
    >
      {/* Base version */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${baseIconPath}${name}.svg`}
        width={width}
        height={height}
        alt={name}
        className={cn(
          'absolute inset-0 w-full h-full transition-opacity',
          ICON_CONSTANTS.TRANSITION_DURATION,
          baseOpacity,
          'group-hover:opacity-0 group-[.active]:opacity-0',
        )}
        draggable={false}
      />
      {/* Hover/Active version */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${hoverIconPath}${name}.svg`}
        width={width}
        height={height}
        alt={name}
        className={cn(
          'absolute inset-0 w-full h-full transition-opacity',
          ICON_CONSTANTS.TRANSITION_DURATION,
          hoverOpacity,
          'group-hover:opacity-100 group-[.active]:opacity-100',
        )}
        draggable={false}
      />
    </div>
  )
}
