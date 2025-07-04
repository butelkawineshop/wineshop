'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { logger } from '@/lib/logger'
import { UI_CONSTANTS } from '@/constants/ui'

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
  size?: string
}

// Ensure we have a valid base URL
const CLOUDFLARE_IMAGES_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL

const getImageUrl = (src: string | null | undefined, size?: string): string => {
  if (!src) return ''

  // If the URL already ends with a known size, replace it with the new size
  const sizeMatch = src.match(/\/(winecards|feature|hero|thumbnail|square)$/)
  if (sizeMatch && size) {
    // Replace the existing size with the new requested size
    return src.replace(/\/(winecards|feature|hero|thumbnail|square)$/, `/${size}`)
  }

  // If the URL already ends with a known size but no new size requested, return as is
  if (sizeMatch && !size) {
    return src
  }

  // If the URL is a full URL and a size is provided, append the size
  if (src.startsWith('http')) {
    // If it's a baseUrl (doesn't end with a variant), append the size
    if (size && !sizeMatch) {
      return `${src}/${size}`
    }
    // If no size requested, default to winecards
    if (!size && !sizeMatch) {
      return `${src}/winecards`
    }
    return src
  }

  // If we don't have a Cloudflare URL, return the placeholder
  if (!CLOUDFLARE_IMAGES_URL) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn('NEXT_PUBLIC_CLOUDFLARE_IMAGES_URL is not set')
    }
    return ''
  }

  // If a size is provided, append it
  if (size) {
    return `${CLOUDFLARE_IMAGES_URL}/${src}/${size}`
  }

  // Otherwise, construct the Cloudflare Images URL with default winecards variant
  return `${CLOUDFLARE_IMAGES_URL}/${src}/winecards`
}

export const Media: React.FC<MediaProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = UI_CONSTANTS.DEFAULT_IMAGE_QUALITY,
  placeholder = '/images/placeholder.jpg',
  fill = false,
  size,
}): React.JSX.Element | null => {
  const [error, setError] = useState(false)

  // If no src or error occurred, use placeholder
  const imageSrc = !src || error ? placeholder : getImageUrl(src, size)

  // If we have no valid image source, don't render the Image component
  if (!imageSrc) {
    return null
  }

  return (
    <div className={cn('relative overflow-hidden h-full', className)}>
      <Image
        src={imageSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={cn('object-cover', fill && 'fill')}
        priority={priority}
        quality={quality}
        onError={() => {
          if (process.env.NODE_ENV === 'development') {
            logger.warn(`Failed to load image: ${imageSrc}`)
          }
          setError(true)
        }}
        fill={fill}
        sizes={fill ? '100vw' : undefined}
      />
    </div>
  )
}
