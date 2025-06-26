'use client'

import React, { useEffect, useState } from 'react'
import type { FlatWineVariant } from '@/payload-types'
import { WINE_CONSTANTS } from '@/constants/wine'
import type { Locale } from '@/i18n/locales'
import { CollectionLink } from '@/components/ui/CollectionLink'
import { getCollectionItemsForVariant } from '@/lib/graphql'

interface WineCollectionTagsProps {
  variant: FlatWineVariant
  locale: Locale
  maxTags?: number
  collectionItemsLoaded?: boolean
}

interface CollectionItem {
  id: string
  title?: string | null
  slug?: string | null
}

export function WineCollectionTags({
  variant,
  locale,
  maxTags = WINE_CONSTANTS.DEFAULT_MAX_TAGS,
  collectionItemsLoaded = false,
}: WineCollectionTagsProps): React.JSX.Element | null {
  const [collectionItems, setCollectionItems] = useState<{
    aromas: CollectionItem[]
    tags: CollectionItem[]
    moods: CollectionItem[]
    grapeVarieties: CollectionItem[]
  }>({
    aromas: [],
    tags: [],
    moods: [],
    grapeVarieties: [],
  })

  // Use cached collection items when available
  useEffect(() => {
    if (collectionItemsLoaded) {
      const items = getCollectionItemsForVariant(variant)

      setCollectionItems(items)
    }
  }, [variant, collectionItemsLoaded])

  const tags: Array<{ text: string; type: string; slug?: string; collection?: string }> = []

  // Add region tag (no slug available, so just text)
  if (variant.regionTitle) {
    tags.push({
      text: variant.regionTitle,
      type: 'region',
    })
  }

  // Add country tag (no slug available, so just text)
  if (variant.countryTitle) {
    // Use localized country title based on current locale
    const displayCountryTitle =
      locale === 'en' && variant.countryTitleEn ? variant.countryTitleEn : variant.countryTitle
    tags.push({
      text: displayCountryTitle,
      type: 'country',
    })
  }

  // Add grape varieties with proper links
  if (variant.grapeVarieties) {
    variant.grapeVarieties.slice(0, WINE_CONSTANTS.MAX_GRAPE_VARIETIES).forEach((grape) => {
      if (grape?.title) {
        const collectionItem = collectionItems.grapeVarieties.find(
          (item) => item.id === String(grape.id),
        )
        // Use localized title based on current locale
        const displayTitle = locale === 'en' && grape.titleEn ? grape.titleEn : grape.title
        tags.push({
          text: displayTitle,
          type: 'grape',
          slug: collectionItem?.slug || undefined,
          collection: 'grape-varieties',
        })
      }
    })
  }

  // Add tags with proper links
  if (variant.tags) {
    variant.tags.slice(0, WINE_CONSTANTS.MAX_TAGS).forEach((tag) => {
      if (tag?.title) {
        const collectionItem = collectionItems.tags.find((item) => item.id === String(tag.id))
        // Use localized title based on current locale
        const displayTitle = locale === 'en' && tag.titleEn ? tag.titleEn : tag.title
        tags.push({
          text: displayTitle,
          type: 'tag',
          slug: collectionItem?.slug || undefined,
          collection: 'tags',
        })
      }
    })
  }

  // Add moods with proper links
  if (variant.moods) {
    variant.moods.slice(0, WINE_CONSTANTS.MAX_MOODS).forEach((mood) => {
      if (mood?.title) {
        const collectionItem = collectionItems.moods.find((item) => item.id === String(mood.id))
        // Use localized title based on current locale
        const displayTitle = locale === 'en' && mood.titleEn ? mood.titleEn : mood.title
        tags.push({
          text: displayTitle,
          type: 'mood',
          slug: collectionItem?.slug || undefined,
          collection: 'moods',
        })
      }
    })
  }

  // Add aromas with proper links
  if (variant.aromas) {
    variant.aromas.slice(0, WINE_CONSTANTS.MAX_AROMAS).forEach((aroma) => {
      if (aroma?.title) {
        const collectionItem = collectionItems.aromas.find((item) => item.id === String(aroma.id))
        // Use localized title based on current locale
        const displayTitle = locale === 'en' && aroma.titleEn ? aroma.titleEn : aroma.title
        tags.push({
          text: displayTitle,
          type: 'aroma',
          slug: collectionItem?.slug || undefined,
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
        if (tag.slug && tag.collection) {
          return (
            <CollectionLink
              key={`${tag.type}-${index}`}
              collection={tag.collection}
              slug={tag.slug}
              locale={locale}
              className="hashtag interactive-text"
            >
              #{tag.text.toLowerCase()}
            </CollectionLink>
          )
        } else {
          return (
            <span key={`${tag.type}-${index}`} className="hashtag">
              #{tag.text.toLowerCase()}
            </span>
          )
        }
      })}
    </div>
  )
}
