'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface MediaProps {
  src?: string | null
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  placeholder?: string
  fill?: boolean
}

// Ensure we have a valid base URL
const CLOUDFLARE_IMAGES_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL

const getImageUrl = (src: string | null | undefined): string => {
  if (!src) return ''

  // If the URL is already a full URL, return it as is
  if (src.startsWith('http')) return src

  // If we don't have a Cloudflare URL, return the placeholder
  if (!CLOUDFLARE_IMAGES_URL) {
    console.warn('NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL is not set')
    return ''
  }

  // Otherwise, construct the Cloudflare Images URL
  return `${CLOUDFLARE_IMAGES_URL}/${src}`
}

export const Media: React.FC<MediaProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = '/images/placeholder.jpg',
  fill = false,
}) => {
  const [error, setError] = useState(false)

  // If no src or error occurred, use placeholder
  const imageSrc = !src || error ? placeholder : getImageUrl(src)

  // If we have no valid image source, don't render the Image component
  if (!imageSrc) {
    return null
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={cn('object-cover', fill && 'fill')}
        priority={priority}
        quality={quality}
        onError={() => {
          console.warn(`Failed to load image: ${imageSrc}`)
          setError(true)
        }}
        fill={fill}
        sizes={fill ? '100vw' : undefined}
      />
    </div>
  )
}
