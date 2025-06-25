import React from 'react'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import {
  routeMappings as _routeMappings,
  type Locale,
  getCollectionForRouteSegment,
} from '@/utils/routeMappings'
import { CollectionConfig, type CollectionDisplayConfig } from './CollectionConfig'
import slMessages from '../../../messages/sl.json'
import enMessages from '../../../messages/en.json'
import { InfoCarousel } from '../InfoCarousel'
import { Media } from '../Media'
import { Pagination } from '../Layout/Pagination'
import * as motion from 'motion/react-client'
import { headers } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import FilterSortBar from '@/components/FilterSortBar'

// Helper function to get nested object values
function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key] as string | undefined
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

  // Fetch collection items for filters
  const collectionItems = await fetchCollectionItems()

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
  } catch (_error) {
    notFound()
  }

  return (
    <div className="container-wide">
      {isSingleItem ? (
        <SingleItemView
          data={data}
          config={config}
          locale={locale}
          collection={collection}
          collectionItems={collectionItems}
          searchParams={resolvedSearchParams}
        />
      ) : (
        <ListView
          items={items}
          config={config}
          locale={locale}
          baseSegment={baseSegment}
          pagination={pagination}
          searchParams={resolvedSearchParams}
          t={t}
          collection={collection}
          collectionItems={collectionItems}
        />
      )}
    </div>
  )
}

function SingleItemView({
  data,
  config,
  locale,
  collection,
  collectionItems,
  searchParams,
}: {
  data: CollectionItem | null
  config: CollectionDisplayConfig
  locale: Locale
  collection: string
  collectionItems: Record<string, any[]>
  searchParams: Record<string, string | string[] | undefined>
}) {
  if (!data) return null

  console.log('🔍 Debug - SingleItemView collection:', collection)
  console.log('🔍 Debug - SingleItemView collectionItems keys:', Object.keys(collectionItems))

  return (
    <article className="container-narrow">
      <header className="space-y-content"></header>
      {/* InfoCarousel for field-by-field display */}
      <div className="my-8">
        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Peel effect - starts from top-left corner */}
          <motion.div
            className="relative"
            initial={{
              clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)',
              opacity: 0,
            }}
            animate={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
              delay: 0.2,
            }}
          >
            <InfoCarousel
              item={data}
              fields={config.fields}
              mediaField={config.mediaField || 'media'}
              locale={locale}
              messages={locale === 'sl' ? slMessages : enMessages}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Show FilterSortBar for wine-related collections */}
      {[
        'regions',
        'wineries',
        'wineCountries',
        'aromas',
        'moods',
        'climates',
        'dishes',
        'grape-varieties',
        'styles',
        'tags',
      ].includes(collection) && (
        <div className="mt-12">
          <FilterSortBar
            currentCollection={{ id: data.id, type: collection }}
            searchParams={searchParams}
            collectionItems={collectionItems}
            locale={locale}
            showWineGrid={true}
            showPagination={true}
            baseUrl=""
          />
        </div>
      )}
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
  collection,
  collectionItems,
}: {
  items: CollectionItem[]
  config: CollectionDisplayConfig
  locale: Locale
  baseSegment: string
  pagination: PaginationInfo | null
  searchParams: Record<string, string | string[] | undefined>
  t: (key: string) => string
  collection: string
  collectionItems: Record<string, any[]>
}) {
  // TEMP: Log media field for debugging
  // (Debug log removed)

  console.log('🔍 Debug - ListView collection:', collection)
  console.log('🔍 Debug - ListView baseSegment:', baseSegment)
  console.log('🔍 Debug - ListView collectionItems keys:', Object.keys(collectionItems))

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
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 w-full min-h-0 min-w-0"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            {items.map((item, idx) => {
              const title = config.titleField ? (item[config.titleField] as string) : ''
              type MediaObj = { url?: string; baseUrl?: string }
              const mediaArr = Array.isArray(item[config.mediaField || 'media'])
                ? (item[config.mediaField || 'media'] as MediaObj[])
                : []
              const mediaObj = mediaArr[0]
              const imageBase = mediaObj?.baseUrl || mediaObj?.url

              return (
                <motion.div
                  key={item.id || item.slug || idx}
                  className="relative w-full aspect-square min-h-[200px] h-full flex items-center justify-center group overflow-hidden"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 50,
                      scale: 0.8,
                      rotateY: -15,
                      filter: 'blur(4px)',
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotateY: 0,
                      filter: 'blur(0px)',
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                        duration: 0.6,
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 20,
                    },
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 },
                  }}
                >
                  <a
                    href={`${locale === 'en' ? '/en' : ''}/${baseSegment}/${item.slug}`}
                    className="absolute inset-0 w-full h-full z-20"
                    tabIndex={0}
                    aria-label={title}
                  ></a>
                  {imageBase && (
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{
                        scale: 1.1,
                        transition: { duration: 0.4, ease: 'easeOut' },
                      }}
                    >
                      <Media
                        src={imageBase}
                        alt={title}
                        fill
                        size="square"
                        className="object-cover w-full h-full"
                        priority={false}
                      />
                    </motion.div>
                  )}
                  <div
                    className={`absolute inset-0 flex items-center justify-center ${!imageBase ? 'bg-black' : ''}`}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                      whileHover={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
                        transition: { duration: 0.3 },
                      }}
                    />
                    <motion.h2
                      className="relative text-white text-center font-medium px-2 text-sm md:text-base z-10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      whileHover={{
                        scale: 1.05,
                        textShadow: '0 0 8px rgba(255,255,255,0.5)',
                        transition: { duration: 0.2 },
                      }}
                    >
                      {title}
                    </motion.h2>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

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

      {/* Show FilterSortBar for wine-related collections at the bottom */}
      {[
        'regions',
        'wineries',
        'wineCountries',
        'aromas',
        'moods',
        'climates',
        'dishes',
        'grape-varieties',
        'styles',
        'tags',
      ].includes(collection) && (
        <div className="mt-12">
          <FilterSortBar
            currentCollection={undefined}
            searchParams={searchParams}
            collectionItems={collectionItems}
            locale={locale}
            showWineGrid={true}
            showPagination={true}
            baseUrl={buildPageUrl(1).replace('?page=1', '').replace('&page=1', '')}
          />
        </div>
      )}
    </div>
  )
}

// Helper function to fetch collection items for filters
const fetchCollectionItems = async () => {
  const payloadClient = getPayloadClient()
  const collections = [
    'aromas',
    'climates',
    'dishes', // Changed from 'foods' to 'dishes'
    'grape-varieties',
    'moods',
    'regions',
    'styles',
    'tags',
    'wineCountries', // Changed from 'wineCountries' to 'wine-countries'
    'wineries',
  ]

  const results: Record<string, any[]> = {}

  for (const collection of collections) {
    try {
      const response = await payloadClient.find({
        collection,
        limit: 100,
        depth: 0,
        fields: ['id', 'title', 'slug'],
      })
      results[collection] = response.docs
    } catch (error) {
      console.error(`Error fetching collection items:`, error)
      results[collection] = []
    }
  }

  return results
}
