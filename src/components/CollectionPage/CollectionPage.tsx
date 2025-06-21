import React from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { routeMappings, type Locale, getCollectionForRouteSegment } from '@/utils/routeMappings'
import { CollectionConfig, type CollectionDisplayConfig } from './CollectionConfig'
import { FieldRenderer } from './FieldRenderer'
import { logger } from '@/lib/logger'
import slMessages from '../../../messages/sl.json'
import enMessages from '../../../messages/en.json'

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

      // Workaround: Fetch all items and filter by slug since the API slug query is not working
      const result = await payload.find({
        collection,
        depth: config.depth || 1,
        locale,
        limit: 100, // Fetch more items to ensure we get the one we need
      })

      // Filter by slug on the client side
      const foundItem = result.docs.find(
        (doc: Record<string, unknown>) => doc.slug === itemSlug,
      ) as CollectionItem | undefined

      logger.info(
        {
          collection,
          itemSlug,
          totalDocs: result.docs.length,
          foundItem: foundItem?.title || foundItem?.slug,
        },
        'Single item fetch result',
      )

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
    <div className="container-wide section-padding">
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

  return (
    <article className="container-narrow">
      <header className="space-y-content">
        <h1 className="heading-1">{title}</h1>
        {subtitle && <p className="subtitle">{subtitle}</p>}
      </header>

      {media && media[0] && (
        <div className="space-y-content">
          <Image
            src={media[0].url}
            alt={title}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      <div className="prose max-w-none space-y-content">
        {config.fields?.map((field) => (
          <FieldRenderer key={field.name} field={field} data={data} locale={locale} t={t} />
        ))}
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

  return (
    <div>
      <header className="space-y-content">
        <h1 className="heading-1">{t(`${config.titleField}.list.title`)}</h1>
        {config.listDescription && (
          <p className="subtitle">{t(`${config.titleField}.list.description`)}</p>
        )}
        {totalDocs > 0 && (
          <p className="text-base text-gray-600">
            {t('common.showing')} {(currentPage - 1) * (config.listLimit || 24) + 1}-
            {Math.min(currentPage * (config.listLimit || 24), totalDocs)} {t('common.of')}{' '}
            {totalDocs} {t('common.results')}
          </p>
        )}
      </header>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
              const title = item[config.titleField || 'title'] as string
              const subtitle = config.subtitleField
                ? (item[config.subtitleField] as string)
                : undefined
              const description = config.descriptionField
                ? (item[config.descriptionField] as string)
                : undefined
              const media = config.mediaField
                ? (item[config.mediaField] as Array<{ url: string }>)
                : undefined

              return (
                <div key={item.id} className="card card-hover">
                  {media && media[0] && (
                    <Image
                      src={media[0].url}
                      alt={title}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4 space-y-content">
                    <h2 className="heading-3">
                      <a
                        href={`${locale === 'en' ? '/en' : ''}/${baseSegment}/${item.slug}`}
                        className="interactive-text"
                      >
                        {title}
                      </a>
                    </h2>
                    {subtitle && <p className="text-base text-gray-600">{subtitle}</p>}
                    {description && (
                      <p className="text-base text-gray-700 line-clamp-3">{description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              {/* Previous Page */}
              {pagination?.hasPrevPage && (
                <a href={buildPageUrl(currentPage - 1)} className="btn-secondary">
                  {t('common.previous')}
                </a>
              )}

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there's a gap
                    const showEllipsis = index > 0 && page - array[index - 1] > 1

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && <span className="px-3 py-2 text-gray-500">...</span>}
                        <a
                          href={buildPageUrl(page)}
                          className={`px-3 py-2 rounded ${
                            page === currentPage
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {page}
                        </a>
                      </React.Fragment>
                    )
                  })}
              </div>

              {/* Next Page */}
              {pagination?.hasNextPage && (
                <a href={buildPageUrl(currentPage + 1)} className="btn-secondary">
                  {t('common.next')}
                </a>
              )}
            </div>
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
