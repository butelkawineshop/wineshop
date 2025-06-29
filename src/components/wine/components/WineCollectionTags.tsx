'use client'

import React from 'react'
import type { FlatWineVariant } from '@/payload-types'
import { WINE_CONSTANTS } from '@/constants/wine'
import type { Locale } from '@/i18n/locales'
import { CollectionLink } from '@/components/ui/CollectionLink'

function hashtagifyTag(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-')
}

interface WineCollectionTagsProps {
  variant: FlatWineVariant
  locale: Locale
  maxTags?: number
}

export function WineCollectionTags({
  variant,
  locale,
  maxTags = WINE_CONSTANTS.DEFAULT_MAX_TAGS,
}: WineCollectionTagsProps): React.JSX.Element | null {
  const tags: Array<{ text: string; type: string; slug?: string; collection?: string }> = []

  // Add region tag with proper link
  if (variant.regionTitle) {
    const displaySlug =
      locale === 'en' ? variant.regionSlugEn || variant.regionSlug : variant.regionSlug
    tags.push({
      text: variant.regionTitle,
      type: 'region',
      slug: displaySlug || undefined,
      collection: 'regions',
    })
  }

  // Add country tag with proper link
  if (variant.countryTitle) {
    // Use localized country title based on current locale
    const displayCountryTitle =
      locale === 'en' && variant.countryTitleEn ? variant.countryTitleEn : variant.countryTitle
    const displaySlug =
      locale === 'en' ? variant.countrySlugEn || variant.countrySlug : variant.countrySlug
    tags.push({
      text: displayCountryTitle,
      type: 'country',
      slug: displaySlug || undefined,
      collection: 'wineCountries',
    })
  }

  // Add grape varieties with proper links
  if (variant.grapeVarieties) {
    variant.grapeVarieties.slice(0, WINE_CONSTANTS.MAX_GRAPE_VARIETIES).forEach((grape) => {
      if (grape?.title) {
        // Use localized title and slug based on current locale
        const displayTitle = locale === 'en' && grape.titleEn ? grape.titleEn : grape.title
        const displaySlug = locale === 'en' && grape.slugEn ? grape.slugEn : grape.slug
        tags.push({
          text: displayTitle,
          type: 'grape',
          slug: displaySlug || undefined,
          collection: 'grape-varieties',
        })
      }
    })
  }

  // Add tags with proper links
  if (variant.tags) {
    variant.tags.slice(0, WINE_CONSTANTS.MAX_TAGS).forEach((tag) => {
      if (tag?.title) {
        // Use localized title and slug based on current locale
        const displayTitle = locale === 'en' && tag.titleEn ? tag.titleEn : tag.title
        const displaySlug = locale === 'en' && tag.slugEn ? tag.slugEn : tag.slug
        tags.push({
          text: displayTitle,
          type: 'tag',
          slug: displaySlug || undefined,
          collection: 'tags',
        })
      }
    })
  }

  // Add winery tags with proper links
  if (variant.wineryTags) {
    variant.wineryTags.slice(0, WINE_CONSTANTS.MAX_WINERY_TAGS).forEach((tag) => {
      if (tag?.title) {
        // Use localized title and slug based on current locale
        const displayTitle = locale === 'en' && tag.titleEn ? tag.titleEn : tag.title
        const displaySlug = locale === 'en' && tag.slugEn ? tag.slugEn : tag.slug
        tags.push({
          text: displayTitle,
          type: 'winery-tag',
          slug: displaySlug || undefined,
          collection: 'tags',
        })
      }
    })
  }

  // Add moods with proper links
  if (variant.moods) {
    variant.moods.slice(0, WINE_CONSTANTS.MAX_MOODS).forEach((mood) => {
      if (mood?.title) {
        // Use localized title and slug based on current locale
        const displayTitle = locale === 'en' && mood.titleEn ? mood.titleEn : mood.title
        const displaySlug = locale === 'en' && mood.slugEn ? mood.slugEn : mood.slug
        tags.push({
          text: displayTitle,
          type: 'mood',
          slug: displaySlug || undefined,
          collection: 'moods',
        })
      }
    })
  }

  // Add aromas with proper links
  if (variant.aromas) {
    variant.aromas.slice(0, WINE_CONSTANTS.MAX_AROMAS).forEach((aroma) => {
      if (aroma?.title) {
        // Use localized title and slug based on current locale
        const displayTitle = locale === 'en' && aroma.titleEn ? aroma.titleEn : aroma.title
        const displaySlug = locale === 'en' && aroma.slugEn ? aroma.slugEn : aroma.slug
        tags.push({
          text: displayTitle,
          type: 'aroma',
          slug: displaySlug || undefined,
          collection: 'aromas',
        })
      }
    })
  }

  const displayTags = tags.slice(0, maxTags)

  if (displayTags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1">
      {displayTags.map((tag, index) => {
        const hashtagText = hashtagifyTag(tag.text)

        // Create a more unique key by combining multiple identifiers
        const uniqueKey = [tag.type, tag.text, tag.slug, index].filter(Boolean).join('-')

        if (tag.slug && tag.collection) {
          return (
            <CollectionLink
              key={uniqueKey}
              collection={tag.collection}
              slug={tag.slug}
              locale={locale}
              className="hashtag interactive-text"
            >
              #{hashtagText}
            </CollectionLink>
          )
        } else {
          return (
            <span key={uniqueKey} className="hashtag">
              #{hashtagText}
            </span>
          )
        }
      })}
    </div>
  )
}
