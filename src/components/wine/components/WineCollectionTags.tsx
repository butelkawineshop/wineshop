'use client'

import React from 'react'
import Link from 'next/link'
import type { FlatWineVariant } from '@/payload-types'
import { WINE_CONSTANTS } from '@/constants/wine'

interface WineCollectionTagsProps {
  variant: FlatWineVariant
  locale: string
  maxTags?: number
}

export function WineCollectionTags({
  variant,
  locale,
  maxTags = WINE_CONSTANTS.DEFAULT_MAX_TAGS,
}: WineCollectionTagsProps): React.JSX.Element | null {
  const tags: Array<{ text: string; href: string; type: string }> = []

  // Add region tag
  if (variant.regionTitle) {
    tags.push({
      text: variant.regionTitle,
      href: `/${locale}/wines?region=${encodeURIComponent(variant.regionTitle)}`,
      type: 'region',
    })
  }

  // Add country tag
  if (variant.countryTitle) {
    tags.push({
      text: variant.countryTitle,
      href: `/${locale}/wines?country=${encodeURIComponent(variant.countryTitle)}`,
      type: 'country',
    })
  }

  // Add grape varieties
  if (variant.grapeVarieties) {
    variant.grapeVarieties.slice(0, WINE_CONSTANTS.MAX_GRAPE_VARIETIES).forEach((grape) => {
      if (grape?.title) {
        tags.push({
          text: grape.title,
          href: `/${locale}/wines?grape=${encodeURIComponent(grape.title)}`,
          type: 'grape',
        })
      }
    })
  }

  // Add tags
  if (variant.tags) {
    variant.tags.slice(0, WINE_CONSTANTS.MAX_TAGS).forEach((tag) => {
      if (tag?.title) {
        tags.push({
          text: tag.title,
          href: `/${locale}/wines?tag=${encodeURIComponent(tag.title)}`,
          type: 'tag',
        })
      }
    })
  }

  // Add moods
  if (variant.moods) {
    variant.moods.slice(0, WINE_CONSTANTS.MAX_MOODS).forEach((mood) => {
      if (mood?.title) {
        tags.push({
          text: mood.title,
          href: `/${locale}/wines?mood=${encodeURIComponent(mood.title)}`,
          type: 'mood',
        })
      }
    })
  }

  const displayTags = tags.slice(0, maxTags)

  if (displayTags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1">
      {displayTags.map((tag, index) => (
        <Link key={`${tag.type}-${index}`} href={tag.href} className="hashtag interactive-text">
          #{tag.text.toLowerCase()}
        </Link>
      ))}
    </div>
  )
}
