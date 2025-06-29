'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import type { FieldConfig } from '../CollectionPage/CollectionConfig'
import { Media } from '../Media'
import type { Locale } from '@/constants/routes'
import { CollectionLink } from '@/components/ui/CollectionLink'

interface InfoCarouselProps {
  item: Record<string, unknown>
  fields: FieldConfig[]
  mediaField: string
  locale: Locale
  messages: Record<string, unknown>
}

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj) as string | undefined
}

function renderFieldValue(
  field: FieldConfig,
  value: unknown,
  locale: Locale,
  t: (key: string) => string,
  _item?: Record<string, unknown>,
) {
  if (!value) return null

  switch (field.type) {
    case 'text':
    case 'textarea':
      if (typeof value === 'string') return value
      if (typeof value === 'number') return String(value)
      return null

    case 'relationship':
      if (!field.relationshipConfig) return null

      const { displayField, linkTo } = field.relationshipConfig

      // Handle different relationship formats from Payload
      let items: unknown[] = []
      if (Array.isArray(value)) {
        items = value
      } else if (value && typeof value === 'object') {
        // Check if it's a Payload relationship object with docs
        if ('docs' in value && Array.isArray((value as Record<string, unknown>).docs)) {
          items = (value as Record<string, unknown>).docs as unknown[]
        } else {
          // Single relationship object
          items = [value]
        }
      }

      if (items.length === 0) return null

      return (
        <div className="flex flex-wrap gap-2 justify-center">
          {items.map((item, index) => {
            const itemObj = item as Record<string, unknown>
            const displayValue =
              (getNestedValue(itemObj, displayField) as string) ||
              (itemObj.title as string) ||
              (itemObj.name as string) ||
              (typeof itemObj === 'string' ? itemObj : '') ||
              (typeof itemObj === 'number' ? String(itemObj) : '')
            const slug = itemObj.slug as string

            // Create a more unique key by combining multiple identifiers
            const uniqueKey = [itemObj.id, itemObj.title, itemObj.name, slug, index]
              .filter(Boolean)
              .join('-')

            if (linkTo && slug) {
              return (
                <CollectionLink
                  key={uniqueKey}
                  collection={linkTo}
                  slug={slug}
                  locale={locale}
                  className=" interactive font-accent"
                >
                  #{displayValue}
                </CollectionLink>
              )
            }

            return (
              <span key={uniqueKey} className="hashtag">
                {displayValue}
              </span>
            )
          })}
        </div>
      )

    case 'array':
      if (!field.arrayConfig) return null

      const arrayItems = Array.isArray(value) ? value : []
      if (arrayItems.length === 0) return null

      return (
        <div className="flex flex-wrap gap-2 justify-center">
          {arrayItems.map((item, index) => {
            const itemObj = item as Record<string, unknown>
            const displayValue = field.arrayConfig?.displayField
              ? (getNestedValue(itemObj, field.arrayConfig.displayField) as string)
              : (itemObj.title as string) || (itemObj.name as string) || String(itemObj)

            // Create a more unique key by combining multiple identifiers
            const uniqueKey = [itemObj.id, itemObj.title, itemObj.name, index]
              .filter(Boolean)
              .join('-')

            return (
              <span key={uniqueKey} className="hashtag">
                {displayValue}
              </span>
            )
          })}
        </div>
      )

    case 'select':
      if (typeof value === 'string') {
        // Try to translate enum values for climate fields
        if (field.name === 'climate') {
          return t(`climate.values.climate.${value}`)
        }
        if (field.name === 'climateTemperature') {
          return t(`climate.values.climateTemperature.${value}`)
        }
        return value
      }
      return null

    case 'group':
      // Special formatting for statistics group
      if (field.name === 'statistics') {
        const landArea = (value as Record<string, unknown>).landArea
        const wineriesCount = (value as Record<string, unknown>).wineriesCount

        if (!landArea && !wineriesCount) return null

        const parts = []
        if (landArea) {
          parts.push(`${landArea} ${t('wineCountry.units.landArea')}`)
        }
        if (wineriesCount) {
          parts.push(`${wineriesCount} ${t('wineCountry.units.wineries')}`)
        }

        return parts.join(' • ')
      }

      // Special formatting for climateConditions group
      if (field.name === 'climateConditions') {
        const diurnalRange = (value as Record<string, unknown>).diurnalRange
        const humidity = (value as Record<string, unknown>).humidity

        if (!diurnalRange && !humidity) return null

        const parts = []
        if (diurnalRange) {
          const translationKey = `climate.values.diurnalRange.${diurnalRange}`
          const translatedDiurnalRange = t(translationKey)
          parts.push(`${t('climate.fields.diurnalRange')}: ${translatedDiurnalRange}`)
        }
        if (humidity) {
          const translationKey = `climate.values.humidity.${humidity}`
          const translatedHumidity = t(translationKey)
          parts.push(`${t('climate.fields.humidity')}: ${translatedHumidity}`)
        }

        return parts.join(' • ')
      }

      return (
        <div className="text-sm space-y-1">
          {Object.entries(value as Record<string, unknown>).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span>{String(val)}</span>
            </div>
          ))}
        </div>
      )

    default:
      return typeof value === 'string' ? value : JSON.stringify(value)
  }
}

export function InfoCarousel({ item, fields, mediaField, locale, messages }: InfoCarouselProps) {
  const t = (key: string): string => {
    try {
      return getNestedValue(messages, key) || key
    } catch (error) {
      console.error('Translation error:', error)
      return key
    }
  }

  const media = (item[mediaField] as Array<{ url: string }>) || []

  // Filter out fields that have no value or empty relationships
  const validFields = fields.filter((field) => {
    const value = item[field.name]

    // For text and textarea fields, allow empty strings but not null/undefined
    if (field.type === 'text' || field.type === 'textarea') {
      return value !== null && value !== undefined
    }

    if (!value) return false

    // For relationships, check if there are actual items
    if (field.type === 'relationship') {
      let items: unknown[] = []

      // Handle different relationship formats from Payload
      if (Array.isArray(value)) {
        items = value
      } else if (value && typeof value === 'object') {
        // Check if it's a Payload relationship object with docs
        if ('docs' in value && Array.isArray((value as Record<string, unknown>).docs)) {
          items = (value as Record<string, unknown>).docs as unknown[]
        } else {
          // Single relationship object
          items = [value]
        }
      }

      const hasValidItems =
        items.length > 0 &&
        items.some((item) => {
          const itemObj = item as Record<string, unknown>

          // Check for various possible ID formats
          const hasId =
            itemObj &&
            (itemObj.id ||
              itemObj.title ||
              itemObj.name ||
              typeof itemObj === 'number' ||
              typeof itemObj === 'string')

          return hasId
        })

      return hasValidItems
    }

    // For arrays, check if there are actual items
    if (field.type === 'array') {
      const items = Array.isArray(value) ? value : []
      const hasItems = items.length > 0

      return hasItems
    }

    // For group fields, check if any sub-field has a value
    if (field.type === 'group') {
      if (field.name === 'statistics') {
        const landArea = (value as Record<string, unknown>).landArea
        const wineriesCount = (value as Record<string, unknown>).wineriesCount
        return !!(landArea || wineriesCount)
      }
      // For other group fields, check if any sub-field has a value
      return Object.values(value as Record<string, unknown>).some(
        (val) => val !== null && val !== undefined,
      )
    }

    return true
  })

  if (validFields.length === 0) return null

  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      className="w-full h-[400px] md:rounded-lg overflow-hidden"
    >
      {validFields.map((field, idx) => {
        const value = item[field.name]
        const mediaObj = media[idx % media.length] || media[0]
        const imageBase =
          (mediaObj as { baseUrl?: string } | undefined)?.baseUrl ||
          (mediaObj as { url?: string } | undefined)?.url

        const renderedValue = renderFieldValue(field, value, locale, t, item)
        if (!renderedValue) return null

        return (
          <SwiperSlide key={field.name} className="h-full">
            <div className="relative w-full h-full flex items-center justify-center">
              {imageBase ? (
                <Media
                  src={imageBase}
                  alt={field.label || field.name}
                  fill
                  size="hero"
                  className="absolute inset-0 w-full h-full object-cover"
                  priority={false}
                />
              ) : (
                <div className="absolute inset-0 bg-black" />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
                  zIndex: 1,
                }}
              />
              <div className="relative z-10 text-center text-white p-8">
                <h3 className="heading-3 mb-4">
                  {field.labelKey ? t(field.labelKey) : field.label || field.name}
                </h3>
                <div className="text-lg font-sans">{renderedValue}</div>
              </div>
            </div>
          </SwiperSlide>
        )
      })}
    </Swiper>
  )
}
