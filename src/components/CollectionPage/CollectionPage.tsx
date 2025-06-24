import React from 'react'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { routeMappings, type Locale, getCollectionForRouteSegment } from '@/utils/routeMappings'
import { CollectionConfig, type CollectionDisplayConfig } from './CollectionConfig'
import { logger } from '@/lib/logger'
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

  logger.info(
    {
      locale,
      baseSegment: propBaseSegment,
      params: resolvedParams,
      slug: resolvedParams.slug,
    },
    'Rendering collection page',
  )

  // Determine the base segment from props or URL
  // For list pages: use propBaseSegment (e.g., "drzave")
  // For item pages: use propBaseSegment since we pass it explicitly
  let baseSegment: string
  if (propBaseSegment) {
    // Both list and item pages use the provided base segment
    baseSegment = propBaseSegment
  } else {
    logger.error({ params: resolvedParams }, 'No base segment found')
    notFound()
  }

  // Get collection from route mapping
  const collection = getCollectionForRouteSegment(baseSegment)
  if (!collection) {
    logger.error(
      {
        baseSegment,
        slug: resolvedParams.slug,
        availableRoutes: Object.keys(routeMappings),
      },
      'Route mapping not found',
    )
    notFound()
  }

  // Get collection configuration
  const config = CollectionConfig[collection]
  if (!config) {
    logger.error({ collection }, 'No configuration found for collection')
    notFound()
  }

  // Load translations
  const t = (key: string): string => {
    try {
      const messages = locale === 'sl' ? slMessages : enMessages
      return getNestedValue(messages, key) || key
    } catch (_error) {
      logger.warn({ key, locale }, 'Translation key not found')
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
      logger.info(
        {
          collection,
          itemSlug,
          resolvedParams: resolvedParams,
          slug: resolvedParams.slug,
        },
        'Fetching single item',
      )

      // Fetch the current item
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
        logger.warn({ collection, slug: itemSlug }, 'Item not found')
        notFound()
      }
    } else {
      // Fetch list of items with pagination
      const page =
        typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1
      const limit = config.listLimit || 24 // Default to 24 items per page (6x4 grid)

      const result = await payload.find({
        collection,
        depth: config.depth || 1,
        locale,
        limit,
        page,
        sort: config.sort || '-createdAt',
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
    logger.error({ err: error, collection, route: baseSegment }, 'Error fetching collection data')
    notFound()
  }

  return (
    <div className="container-wide">
      {isSingleItem ? (
        <SingleItemView data={data} config={config} locale={locale} t={t} />
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
  t,
}: {
  data: CollectionItem | null
  config: CollectionDisplayConfig
  locale: Locale
  t: (key: string) => string
}) {
  if (!data) return null

  const title = data[config.titleField || 'title'] as string
  const subtitle = config.subtitleField ? (data[config.subtitleField] as string) : undefined
  const media = config.mediaField ? (data[config.mediaField] as Array<{ url: string }>) : undefined

  // Log media info for debugging
  if (typeof window !== 'undefined') {
    console.log('SingleItemView media:', media)
    if (media && media.length > 0) {
      media.forEach((m, i) => console.log(`Media[${i}] url:`, m.url))
    }
  }

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
  const currentPage = pagination?.page || 1
  const totalPages = pagination?.totalPages || 1
  const totalDocs = pagination?.totalDocs || 0

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
              const title = item[config.titleField || 'title'] as string
              const media = config.mediaField
                ? (item[config.mediaField] as Array<{ url: string }>)
                : undefined

              return (
                <a
                  key={item.id}
                  href={`${locale === 'en' ? '/en' : ''}/${baseSegment}/${item.slug}`}
                  className="relative w-full aspect-square  flex items-center justify-center group overflow-hidden"
                >
                  {media && media[0] ? (
                    <>
                      <Media
                        src={(media[0] as any).baseUrl || media[0].url}
                        alt={title}
                        fill
                        size="feature"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={false}
                      />
                      <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <h2 className="text-background text-center font-medium px-2 group-hover:opacity-0 transition-opacity duration-300 text-sm md:text-base">
                          {title}
                        </h2>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-black hover:bg-foreground/50 transition-all duration-300 flex items-center justify-center">
                      <h2 className="text-white text-center font-medium px-2 text-sm md:text-base z-10">
                        {title}
                      </h2>
                    </div>
                  )}
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
