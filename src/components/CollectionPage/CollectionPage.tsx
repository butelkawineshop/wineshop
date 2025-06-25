import React from 'react'
import { notFound } from 'next/navigation'
import {
  routeMappings as _routeMappings,
  type Locale,
  getCollectionForRouteSegment,
} from '@/utils/routeMappings'
import { InfoCarousel } from '../InfoCarousel'
import { Media } from '../Media'
import { Pagination } from '../Layout/Pagination'
import * as motion from 'motion/react-client'
import FilterSortBar from '@/components/FilterSortBar'
import { collectionService } from '@/services/CollectionService'
import { TranslationUtils } from '@/utils/translationUtils'
import type { CollectionItem, PaginationInfo } from '@/services/CollectionService'
import type { CollectionDisplayConfig } from '@/components/CollectionPage/CollectionConfig'
import { CollectionLink } from '@/components/ui/CollectionLink'

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
  let baseSegment: string
  if (propBaseSegment) {
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
  const config = collectionService.getCollectionConfig(collection)
  if (!config) {
    notFound()
  }

  // Fetch collection items for filters
  const collectionItems = await collectionService.fetchCollectionItems(locale)

  // Create translation function
  const t = TranslationUtils.createTranslator(locale)

  // Extract parameters for data fetching
  const slug = resolvedParams.slug as string | undefined
  const page =
    typeof resolvedSearchParams.page === 'string'
      ? parseInt(resolvedSearchParams.page, 10)
      : undefined

  // Fetch collection data using service
  const collectionData = await collectionService.fetchCollectionData({
    collection,
    config,
    locale,
    slug,
    page,
  })

  // Handle not found for single items
  if (collectionData.isSingleItem && !collectionData.data) {
    notFound()
  }

  // Build pagination URLs using service
  const paginationUrls = collectionService.buildPaginationUrls({
    pagination: collectionData.pagination,
    searchParams: resolvedSearchParams,
    locale,
    baseSegment,
  })

  return (
    <div className="container-wide">
      {collectionData.isSingleItem ? (
        <SingleItemView
          data={collectionData.data}
          config={config}
          locale={locale}
          collection={collection}
          collectionItems={collectionItems}
          _searchParams={resolvedSearchParams}
        />
      ) : (
        <ListView
          items={collectionData.items}
          config={config}
          locale={locale}
          pagination={collectionData.pagination}
          _searchParams={resolvedSearchParams}
          t={t}
          collection={collection}
          collectionItems={collectionItems}
          prevUrl={paginationUrls.prevUrl}
          nextUrl={paginationUrls.nextUrl}
          _baseUrl={paginationUrls.baseUrl}
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
  _searchParams,
}: {
  data: CollectionItem | null
  config: CollectionDisplayConfig
  locale: Locale
  collection: string
  collectionItems: Record<string, CollectionItem[]>
  _searchParams: Record<string, string | string[] | undefined>
}) {
  if (!data) return null

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
              messages={TranslationUtils.getMessages(locale)}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Show FilterSortBar for wine-related collections */}
      {collectionService.isWineCollection(collection) && (
        <div className="mt-12">
          <FilterSortBar
            currentCollection={{ id: collection, type: collection }}
            collectionItems={collectionItems}
            locale={locale}
            showWineGrid={true}
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
  pagination,
  _searchParams,
  t,
  collection,
  collectionItems,
  prevUrl,
  nextUrl,
  _baseUrl,
}: {
  items: CollectionItem[]
  config: CollectionDisplayConfig
  locale: Locale
  pagination: PaginationInfo | null
  _searchParams: Record<string, string | string[] | undefined>
  t: (key: string) => string
  collection: string
  collectionItems: Record<string, CollectionItem[]>
  prevUrl: string | null
  nextUrl: string | null
  _baseUrl: string
}) {
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
                  staggerChildren: 0.05, // Reduced from 0.08 for better performance
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
                      y: 30, // Reduced from 50 for smoother animation
                      scale: 0.9, // Reduced from 0.8 for less dramatic effect
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 25,
                        duration: 0.5, // Reduced from 0.6
                      },
                    },
                  }}
                  whileHover={{
                    scale: 1.05,
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
                  <CollectionLink
                    collection={collection}
                    slug={String(item.slug)}
                    locale={locale}
                    className="absolute inset-0 w-full h-full z-20"
                    aria-label={title}
                  >
                    <></>
                  </CollectionLink>
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
                        priority={idx < 12} // Only prioritize first 12 images
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
      {collectionService.isWineCollection(collection) && (
        <div className="mt-12">
          <FilterSortBar
            currentCollection={{ id: collection, type: collection }}
            collectionItems={collectionItems}
            locale={locale}
            showWineGrid={true}
          />
        </div>
      )}
    </div>
  )
}
