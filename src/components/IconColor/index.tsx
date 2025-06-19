'use client'

import { cn } from '@/lib/utils'

interface IconProps {
  name: string
  className?: string
  width?: number
  height?: number
  active?: boolean
  theme: string
}

export function IconColor({ name, className, width = 24, height = 24, active = false }: IconProps) {
  return (
    <div
      className={cn('relative inline-block group', className, active && 'active')}
      style={{ width, height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/icons/Color/${name}.svg`}
        width={width}
        height={height}
        alt={name}
        className="absolute icon-container inset-0 w-full h-full group-[.active]:opacity-100 transition-opacity duration-200"
        draggable={false}
      />
    </div>
  )
}
