import React from 'react'
import Image from 'next/image'
import type { FieldConfig } from './CollectionConfig'
import type { Locale } from '@/utils/routeMappings'
import { getTranslatedSegment } from '@/utils/routeMappings'
import { COLLECTION_CONSTANTS } from '@/constants/collections'

interface FieldRendererProps {
  field: FieldConfig
  data: Record<string, unknown>
  locale: Locale
  t: (key: string) => string
}

export function FieldRenderer({ field, data, locale, t }: FieldRendererProps) {
  const value = getNestedValue(data, field.name)

  if (!value) return null

  switch (field.type) {
    case COLLECTION_CONSTANTS.FIELD_TYPES.TEXT:
      return <TextField value={value as string} field={field} t={t} />
    case COLLECTION_CONSTANTS.FIELD_TYPES.TEXTAREA:
      return <TextareaField value={value as string} field={field} t={t} />
    case COLLECTION_CONSTANTS.FIELD_TYPES.RELATIONSHIP:
      return (
        <RelationshipField
          value={getNestedValue(data, field.name, 'object') as Record<string, unknown> | null}
          field={field}
          locale={locale}
          t={t}
        />
      )
    case COLLECTION_CONSTANTS.FIELD_TYPES.ARRAY:
      return (
        <ArrayField
          value={getNestedValue(data, field.name, 'array') as unknown[] | null}
          field={field}
          _locale={locale}
          t={t}
        />
      )
    case COLLECTION_CONSTANTS.FIELD_TYPES.SELECT:
      return <SelectField value={value as string} field={field} t={t} />
    case COLLECTION_CONSTANTS.FIELD_TYPES.GROUP:
      return (
        <GroupField
          value={getNestedValue(data, field.name, 'object') as Record<string, unknown> | null}
          field={field}
          _locale={locale}
          t={t}
        />
      )
    case COLLECTION_CONSTANTS.FIELD_TYPES.MEDIA:
      return (
        <MediaField
          value={getNestedValue(data, field.name, 'object') as Record<string, unknown> | null}
          field={field}
          t={t}
        />
      )
    default:
      return null
  }
}

function TextField({
  value,
  field,
  t,
}: {
  value: string
  field: FieldConfig
  t: (key: string) => string
}) {
  return (
    <div className="space-y-content">
      <h3 className="heading-3">{field.label || t(field.name)}</h3>
      <p className="text-base">{value}</p>
    </div>
  )
}

function TextareaField({
  value,
  field,
  t,
}: {
  value: string
  field: FieldConfig
  t: (key: string) => string
}) {
  return (
    <div className="space-y-content">
      <h3 className="heading-3">{field.label || t(field.name)}</h3>
      <div className="prose max-w-none">
        <p className="text-base whitespace-pre-wrap">{value}</p>
      </div>
    </div>
  )
}

function RelationshipField({
  value,
  field,
  locale,
  t,
}: {
  value: Record<string, unknown> | null
  field: FieldConfig
  locale: Locale
  t: (key: string) => string
}) {
  if (!field.relationshipConfig || !value) return null

  const { displayField, linkTo } = field.relationshipConfig

  // Handle both single and multiple relationships
  const items = Array.isArray(value) ? value : [value]

  if (items.length === 0) return null

  return (
    <div className="space-y-content">
      <h3 className="heading-3">{field.label || t(field.name)}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => {
          const itemObj = item as Record<string, unknown>
          const displayValue =
            (getNestedValue(itemObj, displayField) as string) ||
            (itemObj.title as string) ||
            (itemObj.name as string)
          const slug = itemObj.slug as string

          if (linkTo && slug) {
            const localizedSegment = getLocalizedRouteSegment(linkTo, locale)
            const localePrefix = locale === 'en' ? '/en' : ''
            return (
              <a
                key={String(itemObj.id || index)}
                href={`${localePrefix}/${localizedSegment}/${slug}`}
                className="hashtag interactive"
              >
                {displayValue}
              </a>
            )
          }

          return (
            <span key={String(itemObj.id || index)} className="hashtag">
              {displayValue}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function ArrayField({
  value,
  field,
  _locale,
  t,
}: {
  value: unknown[] | null
  field: FieldConfig
  _locale: Locale
  t: (key: string) => string
}) {
  if (!Array.isArray(value) || value.length === 0) return null

  if (!field.arrayConfig) return null

  const { itemType, displayField } = field.arrayConfig

  return (
    <div className="space-y-content">
      <h3 className="heading-3">{field.label || t(field.name)}</h3>
      <div className="flex flex-wrap gap-2">
        {value.map((item, index) => {
          let displayValue: string

          if (itemType === 'text') {
            const itemObj = item as Record<string, unknown>
            displayValue =
              (getNestedValue(itemObj, displayField || 'title') as string) ||
              (itemObj.title as string) ||
              String(item)
          } else if (itemType === 'relationship') {
            const itemObj = item as Record<string, unknown>
            displayValue =
              (getNestedValue(itemObj, displayField || 'title') as string) ||
              (itemObj.title as string) ||
              (itemObj.name as string)
          } else {
            displayValue = String(item)
          }

          return (
            <span key={index} className="hashtag">
              {displayValue}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function SelectField({
  value,
  field,
  t,
}: {
  value: string
  field: FieldConfig
  t: (key: string) => string
}) {
  return (
    <div className="space-y-content">
      <h3 className="heading-3">{field.label || t(field.name)}</h3>
      <span className="hashtag bg-green-100 text-green-800">{value}</span>
    </div>
  )
}

function GroupField({
  value,
  field,
  _locale,
  t,
}: {
  value: Record<string, unknown> | null
  field: FieldConfig
  _locale: Locale
  t: (key: string) => string
}) {
  if (!value || typeof value !== 'object') return null

  return (
    <div className="space-y-content">
      <h3 className="heading-3">{field.label || t(field.name)}</h3>
      <div className="space-y-2">
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="flex">
            <span className="font-medium text-gray-600 w-24">{key}:</span>
            <span className="text-base">{String(val)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function MediaField({
  value,
  field,
  t,
}: {
  value: Record<string, unknown> | null
  field: FieldConfig
  t: (key: string) => string
}) {
  if (!value) return null

  const items = Array.isArray(value) ? value : [value]

  if (items.length === 0) return null

  return (
    <div className="space-y-content">
      <h3 className="heading-3">{field.label || t(field.name)}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const itemObj = item as Record<string, unknown>
          return (
            <Image
              key={String(itemObj.id || index)}
              src={itemObj.url as string}
              alt={(itemObj.alt || itemObj.filename) as string}
              width={400}
              height={300}
              className="w-full h-48 object-cover rounded-lg"
            />
          )
        })}
      </div>
    </div>
  )
}

// Utility functions
function getNestedValue(
  obj: Record<string, unknown>,
  path: string,
  expectedType?: 'string' | 'object' | 'array',
): string | Record<string, unknown> | unknown[] | null {
  const result = path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return null
  }, obj)

  if (expectedType === 'string') {
    return typeof result === 'string' ? result : null
  } else if (expectedType === 'object') {
    return result && typeof result === 'object' && !Array.isArray(result)
      ? (result as Record<string, unknown>)
      : null
  } else if (expectedType === 'array') {
    return Array.isArray(result) ? result : null
  }

  return typeof result === 'string' ? result : null
}

function getLocalizedRouteSegment(segment: string, locale: Locale): string {
  return getTranslatedSegment(segment, locale) || segment
}
