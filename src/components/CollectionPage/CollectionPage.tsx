import React from 'react'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { routeMappings, type Locale, getCollectionForRouteSegment } from '@/utils/routeMappings'
import { CollectionConfig, type CollectionDisplayConfig } from './CollectionConfig'
import slMessages from '../../../messages/sl.json'
import enMessages from '../../../messages/en.json'
import { InfoCarousel } from '../InfoCarousel'
import { Media } from '../Media'
import { Pagination } from '../Layout/Pagination'

// Helper function to get nested object values
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key]
    }
    return undefined
  }, obj) as string | undefined
}

// TypeScript interfaces for better type safety
interface CollectionItem {
  id: string
  title: string
  slug: string
  [key: string]: unknown
}

interface PaginationInfo {
  page: number
  totalPages: number
  totalDocs: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface CollectionPageProps {
  params: {
    slug?: string | string[]
  }
  searchParams: Record<string, string | string[] | undefined>
  locale: Locale
  baseSegment?: string
}

export async function CollectionPage({
  params,
  searchParams,
  locale,
  baseSegment: propBaseSegment,
}: CollectionPageProps) {
  // Await params and searchParams to handle Next.js 15 async behavior
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  // Determine the base segment from props or URL
  // For list pages: use propBaseSegment (e.g., "drzave")
  // For item pages: use propBaseSegment since we pass it explicitly
  let baseSegment: string
  if (propBaseSegment) {
    // Both list and item pages use the provided base segment
    baseSegment = propBaseSegment
  } else {
    notFound()
  }

  // Get collection from route mapping
  const collection = getCollectionForRouteSegment(baseSegment)
  if (!collection) {
    notFound()
  }

  // Get collection configuration
  const config = CollectionConfig[collection]
  if (!config) {
    notFound()
  }

  // Load translations
  const t = (key: string): string => {
    try {
      const messages = locale === 'sl' ? slMessages : enMessages
      return getNestedValue(messages, key) || key
    } catch (_error) {
      return key
    }
  }

  const payload = getPayloadClient()

  let data: CollectionItem | null = null
  let items: CollectionItem[] = []
  let pagination: PaginationInfo | null = null
  const isSingleItem = resolvedParams.slug && resolvedParams.slug !== ''

  try {
    if (isSingleItem) {
      // Fetch single item - the slug is a string
      const itemSlug = resolvedParams.slug as string

      // Fetch the current item (fetch all fields for detail view)
      const result = await payload.find({
        collection,
        depth: config.depth || 1,
        locale,
        limit: 100, // Fetch more items to ensure we get the one we need
      })
      const foundItem = result.docs.find(
        (doc: Record<string, unknown>) => doc.slug === itemSlug,
      ) as CollectionItem | undefined
      data = foundItem || null
      if (!data) {
        notFound()
      }
    } else {
      // Fetch list of items with pagination (fetch only minimal fields for list view)
      const page =
        typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1
      const limit = config.listLimit || 24 // Default to 24 items per page (6x4 grid)

      const result = await payload.find({
        collection,
        depth: 1,
        locale,
        limit,
        page,
        sort: config.sort || '-createdAt',
        fields: ['title', 'slug', 'media'], // Only fetch needed fields
      })

      items = result.docs as CollectionItem[]
      pagination = {
        page: result.page,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      }
    }
  } catch (error) {
    notFound()
  }

  return (
    <div className="container-wide">
      {isSingleItem ? (
        <SingleItemView data={data} config={config} locale={locale} />
      ) : (
        <ListView
          items={items}
          config={config}
          locale={locale}
          baseSegment={baseSegment}
          pagination={pagination}
          searchParams={resolvedSearchParams}
          t={t}
        />
      )}
    </div>
  )
}

function SingleItemView({
  data,
  config,
  locale,
}: {
  data: CollectionItem | null
  config: CollectionDisplayConfig
  locale: Locale
}) {
  if (!data) return null

  return (
    <article className="container-narrow">
      <header className="space-y-content"></header>
      {/* InfoCarousel for field-by-field display */}
      <div className="my-8">
        <InfoCarousel
          item={data}
          fields={config.fields}
          mediaField={config.mediaField || 'media'}
          locale={locale}
          messages={locale === 'sl' ? slMessages : enMessages}
        />
      </div>
    </article>
  )
}

function ListView({
  items,
  config,
  locale,
  baseSegment,
  pagination,
  searchParams,
  t,
}: {
  items: CollectionItem[]
  config: CollectionDisplayConfig
  locale: Locale
  baseSegment: string
  pagination: PaginationInfo | null
  searchParams: Record<string, string | string[] | undefined>
  t: (key: string) => string
}) {
  // TEMP: Log media field for debugging
  // (Debug log removed)

  const currentPage = pagination?.page || 1

  // Build pagination URLs
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())

    // Preserve other search params (for future filtering)
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v))
        } else {
          params.set(key, value)
        }
      }
    })

    const queryString = params.toString()
    // Add locale prefix for English routes
    const localePrefix = locale === 'en' ? '/en' : ''
    return `${localePrefix}/${baseSegment}${queryString ? `?${queryString}` : ''}`
  }

  const prevUrl = pagination?.hasPrevPage ? buildPageUrl(currentPage - 1) : null
  const nextUrl = pagination?.hasNextPage ? buildPageUrl(currentPage + 1) : null

  return (
    <div className="container-narrow">
      <header>
        {/* Pagination Top */}
        {pagination && (
          <Pagination pagination={pagination} prevUrl={prevUrl} nextUrl={nextUrl} position="top" />
        )}
      </header>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full min-h-0 min-w-0">
            {items.map((item) => {
              const title = config.titleField ? (item[config.titleField] as string) : ''
              type MediaObj = { url?: string; baseUrl?: string }
              const mediaArr = Array.isArray(item[config.mediaField || 'media'])
                ? (item[config.mediaField || 'media'] as MediaObj[])
                : []
              const mediaObj = mediaArr[0]
              const imageBase = mediaObj?.baseUrl || mediaObj?.url

              return (
                <a
                  key={item.id}
                  href={`${locale === 'en' ? '/en' : ''}/${baseSegment}/${item.slug}`}
                  className="relative w-full aspect-square min-h-[200px] h-full flex items-center justify-center group overflow-hidden"
                >
                  {imageBase && (
                    <Media
                      src={imageBase}
                      alt={title}
                      fill
                      size="square"
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                    />
                  )}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${!imageBase ? 'bg-black' : ''}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <h2 className="relative text-white text-center font-medium px-2 text-sm md:text-base z-10">
                      {title}
                    </h2>
                  </div>
                </a>
              )
            })}
          </div>

          {/* Pagination */}
          {pagination && (
            <Pagination
              pagination={pagination}
              prevUrl={prevUrl}
              nextUrl={nextUrl}
              position="bottom"
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">{t('common.noResults')}</p>
        </div>
      )}
    </div>
  )
}
