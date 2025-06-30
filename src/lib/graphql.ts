import { GRAPHQL_CONSTANTS } from '@/constants/api'
import { logger } from './logger'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

interface GraphQLResponse<T = unknown> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: string[]
  }>
}

interface GraphQLRequest {
  query: string
  variables?: Record<string, unknown>
}

/**
 * GraphQL client utility for making queries to Payload's GraphQL endpoint
 *
 * Follows project conventions:
 * - Proper error handling with structured logging
 * - Type-safe responses
 * - Consistent error response format
 * - No exposed internal error details
 */
export async function graphqlRequest<T = unknown>(
  request: GraphQLRequest,
): Promise<{ data: T | null; error: string | null }> {
  try {
    const response = await fetch('/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      logger.warn('GraphQL request failed', {
        status: response.status,
        statusText: response.statusText,
        url: '/api/graphql',
      })
      return { data: null, error: GRAPHQL_CONSTANTS.ERROR_MESSAGES.FETCH_FAILED }
    }

    const result: GraphQLResponse<T> = await response.json()

    if (result.errors && result.errors.length > 0) {
      logger.warn('GraphQL errors', {
        errors: result.errors,
        query: request.query,
        variables: request.variables,
      })
      return {
        data: null,
        error: `GraphQL errors: ${result.errors.map((e) => e.message).join(', ')}`,
      }
    }

    return { data: result.data || null, error: null }
  } catch (error) {
    logger.error('GraphQL request error', {
      error,
      query: request.query,
      variables: request.variables,
    })
    return { data: null, error: GRAPHQL_CONSTANTS.ERROR_MESSAGES.NETWORK_ERROR }
  }
}

/**
 * GraphQL query for fetching collection items by IDs
 * Optimized for fetching minimal data (title and slug only)
 */
export const COLLECTION_ITEMS_QUERY = `
  query GetCollectionItems($locale: Locale) {
    Aromas(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    Tags(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    Moods(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    GrapeVarieties(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
  }
`

/**
 * GraphQL query for fetching all collection items for filters
 * Replaces multiple REST API calls with a single efficient query
 */
export const ALL_COLLECTION_ITEMS_QUERY = `
  query GetAllCollectionItems($locale: Locale) {
    Aromas(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    Climates(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    Dishes(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    GrapeVarieties(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    Moods(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    Regions(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    Styles(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    Tags(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    WineCountries(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
    Wineries(limit: 1000, locale: $locale) {
      docs {
        id
        title
        slug
      }
    }
  }
`

interface CollectionItem {
  id: string
  title?: string | null
  slug?: string | null
}

interface CollectionItemsResponse {
  Aromas: { docs: CollectionItem[] }
  Tags: { docs: CollectionItem[] }
  Moods: { docs: CollectionItem[] }
  GrapeVarieties: { docs: CollectionItem[] }
}

interface AllCollectionItemsResponse {
  Aromas: { docs: CollectionItem[] }
  Climates: { docs: CollectionItem[] }
  Dishes: { docs: CollectionItem[] }
  GrapeVarieties: { docs: CollectionItem[] }
  Moods: { docs: CollectionItem[] }
  Regions: { docs: CollectionItem[] }
  Styles: { docs: CollectionItem[] }
  Tags: { docs: CollectionItem[] }
  WineCountries: { docs: CollectionItem[] }
  Wineries: { docs: CollectionItem[] }
}

// Global cache for all collection items
const globalCollectionItemsCache = new Map<string, CollectionItem>()

// Pending requests to prevent duplicate calls
let pendingRequest: Promise<{
  aromas: CollectionItem[]
  tags: CollectionItem[]
  moods: CollectionItem[]
  grapeVarieties: CollectionItem[]
}> | null = null

let pendingAllCollectionItemsRequest: Promise<Record<string, CollectionItem[]>> | null = null

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
let lastFetchTime = 0
let lastAllCollectionItemsFetchTime = 0

// Cache for filter data to avoid repeated GraphQL requests
const filterCache = new Map<string, { data: FlatCollectionFilters[]; timestamp: number }>()

/**
 * Extract all unique collection item IDs from wine variants
 */
function extractAllCollectionIds(variants: FlatWineVariant[]): {
  aromaIds: Set<string>
  tagIds: Set<string>
  moodIds: Set<string>
  grapeIds: Set<string>
} {
  const aromaIds = new Set<string>()
  const tagIds = new Set<string>()
  const moodIds = new Set<string>()
  const grapeIds = new Set<string>()

  variants.forEach((variant) => {
    variant.aromas?.forEach((item) => {
      if (item.id) aromaIds.add(item.id)
    })
    variant.tags?.forEach((item) => {
      if (item.id) tagIds.add(item.id)
    })
    variant.moods?.forEach((item) => {
      if (item.id) moodIds.add(item.id)
    })
    variant.grapeVarieties?.forEach((item) => {
      if (item.id) grapeIds.add(item.id)
    })
  })

  return { aromaIds, tagIds, moodIds, grapeIds }
}

/**
 * Fetch all collection items for filters using GraphQL or Local API
 * Replaces 10 REST API calls with 1 efficient query
 */
export async function fetchAllCollectionItemsForFilters(
  locale: Locale,
): Promise<Record<string, CollectionItem[]>> {
  // Check if we have a recent cache
  if (
    Date.now() - lastAllCollectionItemsFetchTime < CACHE_DURATION &&
    pendingAllCollectionItemsRequest
  ) {
    logger.debug('Using cached all collection items for filters')
    return pendingAllCollectionItemsRequest
  }

  // If there's an ongoing request, wait for it
  if (pendingAllCollectionItemsRequest) {
    logger.debug('Waiting for ongoing all collection items request')
    return pendingAllCollectionItemsRequest
  }

  // Create new request promise
  pendingAllCollectionItemsRequest = (async () => {
    try {
      logger.debug('Starting collection items request for filters')

      // Check if we're on the server side
      if (typeof window === 'undefined') {
        // Server-side: Use Payload's Local API
        const { getPayload } = await import('payload')
        const config = await import('@/payload.config').then((m) => m.default)
        const payload = await getPayload({ config })

        // Fetch all collections in parallel
        const [
          aromas,
          climates,
          dishes,
          grapeVarieties,
          moods,
          regions,
          styles,
          tags,
          wineCountries,
          wineries,
        ] = await Promise.all([
          payload.find({
            collection: 'aromas',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
          payload.find({
            collection: 'climates',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
          payload.find({
            collection: 'dishes',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
          payload.find({
            collection: 'grape-varieties',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
          payload.find({
            collection: 'moods',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
          payload.find({
            collection: 'regions',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
          payload.find({
            collection: 'styles',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
          payload.find({
            collection: 'tags',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
          payload.find({
            collection: 'wineCountries',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
          payload.find({
            collection: 'wineries',
            depth: 0,
            limit: 1000,
            locale,
            where: { _status: { equals: 'published' } },
          }),
        ])

        lastAllCollectionItemsFetchTime = Date.now()

        logger.info('Fetched all collection items for filters via Local API', {
          aromas: aromas.docs.length,
          climates: climates.docs.length,
          dishes: dishes.docs.length,
          grapeVarieties: grapeVarieties.docs.length,
          moods: moods.docs.length,
          regions: regions.docs.length,
          styles: styles.docs.length,
          tags: tags.docs.length,
          wineCountries: wineCountries.docs.length,
          wineries: wineries.docs.length,
        })

        return {
          aromas: aromas.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
          climates: climates.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
          dishes: dishes.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
          'grape-varieties': grapeVarieties.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
          moods: moods.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
          regions: regions.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
          styles: styles.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
          tags: tags.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
          wineCountries: wineCountries.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
          wineries: wineries.docs.map((doc) => ({
            id: doc.id.toString(),
            title: doc.title,
            slug: String(doc.slug || ''),
          })),
        }
      } else {
        // Client-side: Use GraphQL
        const { data, error } = await graphqlRequest<AllCollectionItemsResponse>({
          query: ALL_COLLECTION_ITEMS_QUERY,
          variables: { locale },
        })

        if (error) {
          logger.error('GraphQL request failed with error', { error })
          throw new Error(error)
        }

        if (!data) {
          logger.error('GraphQL request returned no data')
          throw new Error('No data returned from GraphQL')
        }

        lastAllCollectionItemsFetchTime = Date.now()

        logger.info('Fetched all collection items for filters via GraphQL', {
          aromas: data.Aromas.docs.length,
          climates: data.Climates.docs.length,
          dishes: data.Dishes.docs.length,
          grapeVarieties: data.GrapeVarieties.docs.length,
          moods: data.Moods.docs.length,
          regions: data.Regions.docs.length,
          styles: data.Styles.docs.length,
          tags: data.Tags.docs.length,
          wineCountries: data.WineCountries.docs.length,
          wineries: data.Wineries.docs.length,
        })

        return {
          aromas: data.Aromas.docs || [],
          climates: data.Climates.docs || [],
          dishes: data.Dishes.docs || [],
          'grape-varieties': data.GrapeVarieties.docs || [],
          moods: data.Moods.docs || [],
          regions: data.Regions.docs || [],
          styles: data.Styles.docs || [],
          tags: data.Tags.docs || [],
          wineCountries: data.WineCountries.docs || [],
          wineries: data.Wineries.docs || [],
        }
      }
    } catch (error) {
      logger.error('Failed to fetch all collection items for filters', { error })
      throw error
    } finally {
      pendingAllCollectionItemsRequest = null
    }
  })()

  return pendingAllCollectionItemsRequest
}

/**
 * Fetch all collection items for multiple wine variants in a single request
 * This is much more efficient than individual requests per variant
 */
export async function fetchAllCollectionItems(
  variants: FlatWineVariant[],
  locale: Locale = 'sl',
): Promise<{
  aromas: CollectionItem[]
  tags: CollectionItem[]
  moods: CollectionItem[]
  grapeVarieties: CollectionItem[]
}> {
  // Check if we have a recent cache
  if (Date.now() - lastFetchTime < CACHE_DURATION && globalCollectionItemsCache.size > 0) {
    logger.debug('Using cached collection items', { cacheSize: globalCollectionItemsCache.size })
    return {
      aromas: Array.from(globalCollectionItemsCache.values()).filter(
        (item) => item.id.startsWith('aroma-') || item.id.includes('aroma'),
      ),
      tags: Array.from(globalCollectionItemsCache.values()).filter(
        (item) => item.id.startsWith('tag-') || item.id.includes('tag'),
      ),
      moods: Array.from(globalCollectionItemsCache.values()).filter(
        (item) => item.id.startsWith('mood-') || item.id.includes('mood'),
      ),
      grapeVarieties: Array.from(globalCollectionItemsCache.values()).filter(
        (item) => item.id.startsWith('grape-') || item.id.includes('grape'),
      ),
    }
  }

  // If there's an ongoing request, wait for it
  if (pendingRequest) {
    logger.debug('Waiting for ongoing collection items request')
    return pendingRequest
  }

  // Create new request promise
  pendingRequest = (async () => {
    try {
      // Extract all unique IDs for filtering
      const { aromaIds, tagIds, moodIds, grapeIds } = extractAllCollectionIds(variants)

      const { data, error } = await graphqlRequest<CollectionItemsResponse>({
        query: COLLECTION_ITEMS_QUERY,
        variables: { locale },
      })

      if (error || !data) {
        logger.warn('Failed to fetch collection items', { error })
        return {
          aromas: [],
          tags: [],
          moods: [],
          grapeVarieties: [],
        }
      }

      // Update global cache with the new response structure
      const allItems = [
        ...data.Aromas.docs.map((item) => ({
          ...item,
          type: 'aroma',
          id: item.id.toString(),
        })),
        ...data.Tags.docs.map((item) => ({
          ...item,
          type: 'tag',
          id: item.id.toString(),
        })),
        ...data.Moods.docs.map((item) => ({
          ...item,
          type: 'mood',
          id: item.id.toString(),
        })),
        ...data.GrapeVarieties.docs.map((item) => ({
          ...item,
          type: 'grape',
          id: item.id.toString(),
        })),
      ]

      allItems.forEach((item) => {
        // Use the item.id as the cache key (ensuring it's a string)
        globalCollectionItemsCache.set(item.id, item)
      })

      lastFetchTime = Date.now()

      logger.info('Fetched collection items', {
        totalItems: allItems.length,
        aromas: data.Aromas.docs.length,
        tags: data.Tags.docs.length,
        moods: data.Moods.docs.length,
        grapeVarieties: data.GrapeVarieties.docs.length,
        cacheSize: globalCollectionItemsCache.size,
        sampleIds: allItems.slice(0, 5).map((item) => ({ id: item.id, type: item.type })),
      })

      // Debug: Log sample items to see their structure
      logger.debug('Sample collection items structure:', {
        sampleAroma: data.Aromas.docs[0],
        sampleTag: data.Tags.docs[0],
        sampleMood: data.Moods.docs[0],
        sampleGrape: data.GrapeVarieties.docs[0],
      })

      // Filter results to only include items that match the requested IDs
      const filteredResults = {
        aromas: data.Aromas.docs.filter((item) => aromaIds.has(item.id)),
        tags: data.Tags.docs.filter((item) => tagIds.has(item.id)),
        moods: data.Moods.docs.filter((item) => moodIds.has(item.id)),
        grapeVarieties: data.GrapeVarieties.docs.filter((item) => grapeIds.has(item.id)),
      }

      logger.info('Filtered collection items', {
        requestedAromas: aromaIds.size,
        foundAromas: filteredResults.aromas.length,
        requestedTags: tagIds.size,
        foundTags: filteredResults.tags.length,
        requestedMoods: moodIds.size,
        foundMoods: filteredResults.moods.length,
        requestedGrapes: grapeIds.size,
        foundGrapes: filteredResults.grapeVarieties.length,
      })

      return filteredResults
    } catch (error) {
      logger.error('Error fetching collection items', { error })
      return {
        aromas: [],
        tags: [],
        moods: [],
        grapeVarieties: [],
      }
    } finally {
      pendingRequest = null
    }
  })()

  return pendingRequest
}

/**
 * Get collection items for a specific variant from the global cache
 */
export function getCollectionItemsForVariant(variant: FlatWineVariant): {
  aromas: CollectionItem[]
  tags: CollectionItem[]
  moods: CollectionItem[]
  grapeVarieties: CollectionItem[]
} {
  const aromaIds =
    variant.aromas?.map((item) => item.id?.toString()).filter((id): id is string => Boolean(id)) ||
    []
  const tagIds =
    variant.tags?.map((item) => item.id?.toString()).filter((id): id is string => Boolean(id)) || []
  const moodIds =
    variant.moods?.map((item) => item.id?.toString()).filter((id): id is string => Boolean(id)) ||
    []
  const grapeIds =
    variant.grapeVarieties
      ?.map((item) => item.id?.toString())
      .filter((id): id is string => Boolean(id)) || []

  // Debug logging
  logger.debug('Looking up collection items for variant', {
    variantId: variant.id,
    aromaIds,
    tagIds,
    moodIds,
    grapeIds,
    cacheSize: globalCollectionItemsCache.size,
    cacheKeys: Array.from(globalCollectionItemsCache.keys()).slice(0, 10), // First 10 keys
  })

  const result = {
    aromas: aromaIds
      .map((id) => globalCollectionItemsCache.get(id))
      .filter(Boolean) as CollectionItem[],
    tags: tagIds
      .map((id) => globalCollectionItemsCache.get(id))
      .filter(Boolean) as CollectionItem[],
    moods: moodIds
      .map((id) => globalCollectionItemsCache.get(id))
      .filter(Boolean) as CollectionItem[],
    grapeVarieties: grapeIds
      .map((id) => globalCollectionItemsCache.get(id))
      .filter(Boolean) as CollectionItem[],
  }

  logger.debug('Found collection items for variant', {
    variantId: variant.id,
    aromasFound: result.aromas.length,
    tagsFound: result.tags.length,
    moodsFound: result.moods.length,
    grapeVarietiesFound: result.grapeVarieties.length,
  })

  return result
}

// Legacy function for backward compatibility
export async function fetchCollectionItems(variant: FlatWineVariant): Promise<{
  aromas: CollectionItem[]
  tags: CollectionItem[]
  moods: CollectionItem[]
  grapeVarieties: CollectionItem[]
}> {
  // This should be replaced with the new batching approach
  logger.warn(
    'fetchCollectionItems called - consider using fetchAllCollectionItems for better performance',
  )
  const result = await fetchAllCollectionItems([variant])
  return result
}

/**
 * GraphQL query for fetching wine variant data by slug
 * Includes all necessary fields for wine detail display
 */
export const WINE_VARIANT_QUERY = `
  query GetWineVariant($slug: String!, $locale: LocaleInputType!) {
    FlatWineVariants(where: { slug: { equals: $slug }, isPublished: { equals: true } }, limit: 1, locale: $locale) {
      docs {
        id
        slug
        wineTitle
        vintage
        size
        price
        stockOnHand
        description
        tastingProfile
        servingTemp
        decanting
        primaryImageUrl
        originalVariant { id slug }
        wineryTitle
        regionTitle
        countryTitle
        styleTitle
        dishes {
          id
          title
          titleEn
        }
        tastingNotes {
          dry
          ripe
          creamy
          oaky
          complex
          light
          smooth
          youthful
          energetic
          alcohol
        }
      }
    }
  }
`

/**
 * GraphQL query for fetching all variants of a wine by wine title
 */
export const WINE_VARIANTS_QUERY = `
  query GetWineVariants($wineTitle: String!, $locale: LocaleInputType!) {
    FlatWineVariants(
      where: { 
        AND: [
          { wineTitle: { equals: $wineTitle } }, 
          { isPublished: { equals: true } }
        ] 
      }, 
      sort: "vintage", 
      locale: $locale
    ) {
      docs {
        id
        slug
        wineTitle
        vintage
        size
        price
        stockOnHand
        originalVariant { id slug }
        wineryTitle
        regionTitle
        countryTitle
        styleTitle
        primaryImageUrl
      }
    }
  }
`

/**
 * GraphQL query for fetching related wine variants
 */
export const RELATED_WINE_VARIANTS_QUERY = `
  query GetRelatedWineVariants($variantId: Float!, $locale: LocaleInputType!) {
    RelatedWineVariants(
      where: { 
        variantId: { equals: $variantId }
      }, 
      limit: 1, 
      locale: $locale
    ) {
      docs {
        id
        variantId
        relatedVariants {
          type
          relatedVariant {
            ... on FlatWineVariant {
              id
              slug
              wineTitle
              vintage
              size
              price
              stockOnHand
              primaryImageUrl
              wineryTitle
              regionTitle
              countryTitle
              styleTitle
              styleIconKey
              styleSlug
              originalVariant { id slug }
            }
          }
        }
      }
    }
  }
`

/**
 * GraphQL query for fetching related wine variants by IDs
 */
export const RELATED_VARIANTS_BY_IDS_QUERY = `
  query GetRelatedVariantsByIds($locale: LocaleInputType!, $id0: Int, $id1: Int, $id2: Int, $id3: Int, $id4: Int, $id5: Int, $id6: Int, $id7: Int, $id8: Int, $id9: Int, $id10: Int, $id11: Int, $id12: Int, $id13: Int, $id14: Int, $id15: Int, $id16: Int, $id17: Int, $id18: Int, $id19: Int) {
    FlatWineVariants(
      where: { 
        OR: [
          { id: { equals: $id0 } },
          { id: { equals: $id1 } },
          { id: { equals: $id2 } },
          { id: { equals: $id3 } },
          { id: { equals: $id4 } },
          { id: { equals: $id5 } },
          { id: { equals: $id6 } },
          { id: { equals: $id7 } },
          { id: { equals: $id8 } },
          { id: { equals: $id9 } },
          { id: { equals: $id10 } },
          { id: { equals: $id11 } },
          { id: { equals: $id12 } },
          { id: { equals: $id13 } },
          { id: { equals: $id14 } },
          { id: { equals: $id15 } },
          { id: { equals: $id16 } },
          { id: { equals: $id17 } },
          { id: { equals: $id18 } },
          { id: { equals: $id19 } }
        ]
      }, 
      limit: 20, 
      locale: $locale
    ) {
      docs {
        id
        slug
        wineTitle
        vintage
        size
        price
        stockOnHand
        primaryImageUrl
        wineryTitle
        regionTitle
        countryTitle
        styleTitle
        styleIconKey
        styleSlug
        originalVariant { id slug }
      }
    }
  }
`

/**
 * GraphQL query for fetching complete wine detail data in a single call
 * Replaces three separate queries (variant, variants, relatedVariants) with one efficient query
 */
export const WINE_DETAIL_QUERY = `
  query WineDetail($slug: String!, $locale: String!) {
    wineDetail(slug: $slug, locale: $locale) {
      variant {
        id
        slug
        wineTitle
        vintage
        size
        price
        stockOnHand
        description
        tastingProfile
        servingTemp
        decanting
        primaryImageUrl
        originalVariant { id slug }
        wineryTitle
        regionTitle
        countryTitle
        styleTitle
        dishes {
          id
          title
          titleEn
        }
        tastingNotes {
          dry
          ripe
          creamy
          oaky
          complex
          light
          smooth
          youthful
          energetic
          alcohol
        }
        climateData {
          temperature
          rainfall
          humidity
          sunshine
        }
        statistics {
          landArea
          wineriesCount
          vineyardsCount
          productionVolume
        }
        climateConditions {
          temperature
          rainfall
          humidity
          sunshine
        }
      }
      variants {
        id
        slug
        wineTitle
        vintage
        size
        price
        stockOnHand
        originalVariant { id slug }
        wineryTitle
        regionTitle
        countryTitle
        styleTitle
        primaryImageUrl
      }
      relatedVariants {
        type
        title
        variants {
          id
          slug
          wineTitle
          vintage
          size
          price
          stockOnHand
          primaryImageUrl
          wineryTitle
          regionTitle
          countryTitle
          styleTitle
          styleIconKey
          styleSlug
          originalVariant { id slug }
        }
      }
      error
    }
  }
`

/**
 * GraphQL service functions for wine data
 */

interface WineVariantResponse {
  FlatWineVariants: {
    docs: FlatWineVariant[]
  }
}

interface RelatedWineVariantsResponse {
  RelatedWineVariants: {
    docs: Array<{
      id: string
      variantId: number
      relatedVariants: Array<{
        type: string
        relatedVariant: FlatWineVariant | number
      }>
    }>
  }
}

// Import the RelatedWineVariant type from WineService
export interface RelatedWineVariant {
  type: 'winery' | 'relatedWinery' | 'region' | 'relatedRegion' | 'grapeVariety' | 'price'
  title: string
  variants: FlatWineVariant[]
}

interface WineVariantData {
  variant: FlatWineVariant | null
  variants: FlatWineVariant[]
  relatedVariants: RelatedWineVariant[]
  error: string | null
}

interface WineDetailResponse {
  wineDetail: {
    variant: FlatWineVariant | null
    variants: FlatWineVariant[]
    relatedVariants: RelatedWineVariant[]
    error: string | null
  }
}

/**
 * Fetch wine variant by slug using GraphQL
 */
export async function fetchWineVariantBySlug(
  slug: string,
  locale: string,
): Promise<{ data: FlatWineVariant | null; error: string | null }> {
  const { data, error } = await graphqlRequest<WineVariantResponse>({
    query: WINE_VARIANT_QUERY,
    variables: { slug, locale },
  })

  if (error) {
    logger.error('Failed to fetch wine variant by slug via GraphQL', { error, slug, locale })
    return { data: null, error }
  }

  if (!data?.FlatWineVariants?.docs?.length) {
    return { data: null, error: 'Variant not found' }
  }

  return { data: data.FlatWineVariants.docs[0], error: null }
}

/**
 * Fetch all variants for a wine by wine title using GraphQL
 */
export async function fetchWineVariants(
  wineTitle: string,
  locale: string,
): Promise<{ data: FlatWineVariant[]; error: string | null }> {
  const { data, error } = await graphqlRequest<WineVariantResponse>({
    query: WINE_VARIANTS_QUERY,
    variables: { wineTitle, locale },
  })

  if (error) {
    logger.error('Failed to fetch wine variants via GraphQL', { error, wineTitle, locale })
    return { data: [], error }
  }

  return { data: data?.FlatWineVariants?.docs || [], error: null }
}

/**
 * Fetch related wine variants using GraphQL
 */
export async function fetchRelatedWineVariants(
  variantId: number,
  locale: string,
): Promise<{ data: RelatedWineVariant[]; error: string | null }> {
  const { data: relatedData, error: relatedError } =
    await graphqlRequest<RelatedWineVariantsResponse>({
      query: RELATED_WINE_VARIANTS_QUERY,
      variables: { variantId, locale },
    })

  if (relatedError) {
    logger.error('Failed to fetch related wine variants document via GraphQL', {
      error: relatedError,
      variantId,
      locale,
    })
    return { data: [], error: relatedError }
  }

  if (!relatedData?.RelatedWineVariants?.docs?.length) {
    return { data: [], error: null }
  }

  const relatedDoc = relatedData.RelatedWineVariants.docs[0]

  if (relatedDoc.variantId !== variantId) {
    logger.error('Data integrity issue: wrong variantId', {
      searchedFor: variantId,
      found: relatedDoc.variantId,
      documentId: relatedDoc.id,
    })
    return { data: [], error: null }
  }

  if (!relatedDoc.relatedVariants || !Array.isArray(relatedDoc.relatedVariants)) {
    return { data: [], error: null }
  }

  const variantIds = relatedDoc.relatedVariants
    .map((rel) => {
      if (typeof rel.relatedVariant === 'number') return rel.relatedVariant
      if (
        rel.relatedVariant &&
        typeof rel.relatedVariant === 'object' &&
        'id' in rel.relatedVariant
      ) {
        return rel.relatedVariant.id
      }
      return null
    })
    .filter((id): id is number => id !== null)

  if (variantIds.length === 0) {
    return { data: [], error: null }
  }

  // Limit to 20 IDs to match the query structure
  const limitedVariantIds = variantIds.slice(0, 20)

  // Create variables object with individual ID parameters
  const variables: Record<string, unknown> = { locale }

  // Set all 20 possible ID variables
  for (let i = 0; i < 20; i++) {
    variables[`id${i}`] = limitedVariantIds[i] || null
  }

  const { data: variantData, error: variantError } = await graphqlRequest<WineVariantResponse>({
    query: RELATED_VARIANTS_BY_IDS_QUERY,
    variables,
  })

  if (variantError) {
    logger.error('Failed to fetch related variants by IDs via GraphQL', {
      error: variantError,
      variantIds: limitedVariantIds,
      locale,
    })
    return { data: [], error: variantError }
  }

  const variantMap = new Map(
    (variantData?.FlatWineVariants?.docs || []).map((doc) => [doc.id, doc]),
  )

  const groups: Record<string, RelatedWineVariant> = {}

  for (const rel of relatedDoc.relatedVariants) {
    const type = rel.type
    if (!groups[type]) {
      groups[type] = {
        type: type as RelatedWineVariant['type'],
        title: getTypeTitle(type),
        variants: [],
      }
    }

    const variantId =
      typeof rel.relatedVariant === 'number' ? rel.relatedVariant : rel.relatedVariant?.id

    if (variantId && variantMap.has(variantId)) {
      groups[type].variants.push(variantMap.get(variantId)!)
    }
  }

  const result = Object.values(groups)

  return { data: result, error: null }
}

/**
 * Get type title for display
 */
function getTypeTitle(type: string): string {
  const titles: Record<string, string> = {
    winery: 'Related by Winery',
    relatedWinery: 'Related Wineries',
    region: 'Related by Region',
    relatedRegion: 'Related Regions',
    grapeVariety: 'Related by Grape Variety',
    price: 'Similar Price Range',
  }
  return titles[type] || type
}

/**
 * Fetch complete wine variant data using the new wineDetail query
 * Returns structured data for the Detail Wine View
 */
export async function fetchWineVariantData(slug: string, locale: string): Promise<WineVariantData> {
  const { data, error } = await graphqlRequest<WineDetailResponse>({
    query: WINE_DETAIL_QUERY,
    variables: { slug, locale },
  })

  if (error) {
    return {
      variant: null,
      variants: [],
      relatedVariants: [],
      error: error,
    }
  }

  if (!data?.wineDetail) {
    return {
      variant: null,
      variants: [],
      relatedVariants: [],
      error: 'No data received from server',
    }
  }

  const result = data.wineDetail

  return {
    variant: result.variant,
    variants: result.variants || [],
    relatedVariants: result.relatedVariants || [],
    error: result.error,
  }
}

/**
 * GraphQL queries for flat collections
 * Replaces REST API calls for better performance and type safety
 */

export interface FlatCollectionFilters {
  id: string
  title: string
  slug: string
  collectionType: string
}

export interface FlatCollectionItem {
  id: string
  title: string
  slug: string
  media?: Array<{ url: string; alt?: string }>
  description?: string
  // Rich relationship fields for detail view
  whyCool?: string
  typicalStyle?: string
  character?: string
  iconKey?: string
  wineryCode?: string
  priceRange?: string
  skin?: string
  climate?: string
  climateTemperature?: string
  category?: string
  colorGroup?: string
  adjective?: string
  flavour?: string
  country?: string
  climateData?: any
  statistics?: any
  climateConditions?: any
  social?: any
  synonyms?: string[]
  bestGrapes?: string[]
  bestRegions?: string[]
  legends?: string[]
  neighbours?: string[]
  relatedWineries?: any[]
  distinctiveAromas?: string[]
  blendingPartners?: string[]
  similarVarieties?: string[]
  tags?: string[]
  seo?: any
}

export interface FlatCollectionsResponse {
  flatCollections: {
    docs: FlatCollectionItem[]
    totalDocs: number
    totalPages: number
    page: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface FlatCollectionResponse {
  flatCollection: FlatCollectionItem
}

/**
 * Get the base URL for API calls (works in both client and server)
 */
function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    // Client-side: use relative URL
    return ''
  } else {
    // Server-side: use absolute URL
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  }
}

/**
 * Fetch all collection items for filters using individual collection queries
 * Now with caching to avoid repeated requests
 */
export async function fetchFlatCollectionFilters(locale: Locale): Promise<FlatCollectionFilters[]> {
  const cacheKey = `filters_${locale}`
  const now = Date.now()

  // Check cache first
  const cached = filterCache.get(cacheKey)
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  // Use individual collection queries since flatCollections doesn't exist in GraphQL schema
  const queries = [
    'WineCountries',
    'Styles',
    'Regions',
    'Aromas',
    'Climates',
    'Dishes',
    'GrapeVarieties',
    'Moods',
    'Tags',
    'Wineries',
  ]

  const allItems: FlatCollectionFilters[] = []

  for (const collectionName of queries) {
    try {
      const query = `
        query Get${collectionName}($locale: LocaleInputType!) {
          ${collectionName}(
            where: { _status: { equals: published } }
            sort: "title"
            locale: $locale
          ) {
            docs {
              id
              title
              slug
            }
          }
        }
      `

      const baseUrl = getApiBaseUrl()
      const response = await fetch(`${baseUrl}/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { locale },
        }),
      })

      if (response.ok) {
        const result = await response.json()

        if (result.data && result.data[collectionName]) {
          const items = result.data[collectionName].docs.map((item: any) => ({
            id: String(item.id),
            title: item.title,
            slug:
              typeof item.slug === 'string'
                ? item.slug
                : item.slug?.[locale] || item.slug?.sl || '',
            collectionType: getCollectionTypeFromName(collectionName),
          }))
          allItems.push(...items)
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch ${collectionName}:`, error)
    }
  }

  // Cache the result
  filterCache.set(cacheKey, { data: allItems, timestamp: now })

  return allItems
}

/**
 * Get collection type from collection name
 */
function getCollectionTypeFromName(collectionName: string): string {
  const typeMap: Record<string, string> = {
    WineCountries: 'wineCountry',
    Styles: 'style',
    Regions: 'region',
    Aromas: 'aroma',
    Climates: 'climate',
    Dishes: 'dish',
    GrapeVarieties: 'grapeVariety',
    Moods: 'mood',
    Tags: 'tag',
    Wineries: 'winery',
  }
  return typeMap[collectionName] || collectionName.toLowerCase()
}

/**
 * Fetch collection items for a specific collection type using individual collection queries
 */
export async function fetchFlatCollectionItems({
  collectionType,
  locale,
  limit = 18,
  page = 1,
}: {
  collectionType: string
  locale: Locale
  limit?: number
  page?: number
}): Promise<FlatCollectionsResponse> {
  const collectionName = getCollectionNameFromType(collectionType)

  const query = `
    query Get${collectionName}($locale: LocaleInputType!, $limit: Int!, $page: Int!) {
      ${collectionName}(
        where: { _status: { equals: published } }
        limit: $limit
        page: $page
        sort: "title"
        locale: $locale
      ) {
        docs {
          id
          title
          slug
          media {
            url
            alt
          }
        }
        totalDocs
        totalPages
        page
        hasNextPage
        hasPrevPage
      }
    }
  `

  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { locale, limit, page },
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
  }

  return {
    flatCollections: result.data[collectionName],
  }
}

/**
 * Get collection name from collection type
 */
function getCollectionNameFromType(collectionType: string): string {
  const nameMap: Record<string, string> = {
    wineCountry: 'WineCountries',
    winery: 'Wineries',
    style: 'Styles',
    region: 'Regions',
    aroma: 'Aromas',
    climate: 'Climates',
    dish: 'Dishes',
    grapeVariety: 'GrapeVarieties',
    mood: 'Moods',
    tag: 'Tags',
  }
  return nameMap[collectionType] || 'WineCountries'
}

/**
 * Get singular collection name for single item queries
 */
function getSingularCollectionName(collectionType: string): string {
  const nameMap: Record<string, string> = {
    wineCountry: 'WineCountry',
    winery: 'Winery',
    style: 'Style',
    region: 'Region',
    aroma: 'Aroma',
    climate: 'Climate',
    dish: 'Dish',
    grapeVariety: 'GrapeVariety',
    mood: 'Mood',
    tag: 'Tag',
  }
  return nameMap[collectionType] || 'WineCountry'
}

/**
 * Fetch a single collection item with all fields for detail view
 */
export async function fetchFlatCollectionItem({
  id,
  locale,
  collectionType,
}: {
  id: string
  locale: Locale
  collectionType: string
}): Promise<FlatCollectionItem | null> {
  // Debug: Check if the item exists in the individual collection
  const debugQuery = `
    query Debug${getSingularCollectionName(collectionType)}($slug: String!, $locale: LocaleInputType!) {
      ${getCollectionNameFromType(collectionType)}(
        where: { slug: { equals: $slug } }
        limit: 1
        locale: $locale
      ) {
        docs {
          id
          title
          slug
        }
      }
    }
  `

  const baseUrl = getApiBaseUrl()
  const debugResponse = await fetch(`${baseUrl}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: debugQuery,
      variables: { slug: id, locale },
    }),
  })

  const debugResult = await debugResponse.json()

  const collectionName = getCollectionNameFromType(collectionType)

  // Create a slug-based query instead of ID-based
  let query = ''

  if (collectionType === 'wineCountry') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            whyCool
            statistics {
              landArea
              wineriesCount
            }
            bestRegions {
              id
              title
              slug
            }
            bestGrapes {
              id
              title
              slug
            }
            legends {
              id
              title
              slug
            }
            seo {
              title
              description
            }
          }
        }
      }
    `
  } else if (collectionType === 'winery') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            whyCool
            wineryCode
            tags {
              id
              title
              slug
            }
            social {
              instagram
              website
            }
            relatedWineries {
              id
              title
              slug
            }
            seo {
              title
              description
            }
          }
        }
      }
    `
  } else if (collectionType === 'region') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            whyCool
            climate {
              id
              title
              slug
            }
            country {
              id
              title
              slug
            }
            neighbours {
              id
              title
              slug
            }
            bestGrapes {
              id
              title
              slug
            }
            legends {
              id
              title
              slug
            }
            priceRange
          }
        }
      }
    `
  } else if (collectionType === 'grapeVariety') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            typicalStyle
            character
            whyCool
            synonyms { title }
            distinctiveAromas {
              id
              title
              slug
            }
            bestRegions {
              id
              title
              slug
            }
            blendingPartners {
              id
              title
              slug
            }
            similarVarieties {
              id
              title
              slug
            }
            seo {
              title
              description
            }
          }
        }
      }
    `
  } else if (collectionType === 'style') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            whyCool
            typicalStyle
            character
            iconKey
            priceRange
            skin
            climate
            climateTemperature
            category
            colorGroup
            adjective
            flavour
            country
            climateData
            statistics
            climateConditions
            seo {
              title
              description
            }
          }
        }
      }
    `
  } else if (collectionType === 'aroma') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            wines {
              id
              title
              slug
            }
          }
        }
      }
    `
  } else if (collectionType === 'climate') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            climateConditions {
              diurnalRange
              humidity
            }
            bestRegions {
              id
              title
              slug
            }
            bestGrapes {
              id
              title
              slug
            }
          }
        }
      }
    `
  } else if (collectionType === 'dish') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            wines {
              id
              title
              slug
            }
          }
        }
      }
    `
  } else if (collectionType === 'mood') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            wines {
              id
              title
              slug
            }
          }
        }
      }
    `
  } else if (collectionType === 'tag') {
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
            wines {
              id
              title
              slug
            }
          }
        }
      }
    `
  } else {
    // Generic query for other collection types
    query = `
      query Get${getSingularCollectionName(collectionType)}Item($slug: String!, $locale: LocaleInputType!) {
        ${collectionName}(
          where: { slug: { equals: $slug } }
          limit: 1
          locale: $locale
        ) {
          docs {
            id
            title
            slug
            description
            media {
              url
              alt
            }
          }
        }
      }
    `
  }

  const response = await fetch(`${baseUrl}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { slug: id, locale },
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
  }

  // Return the first document from the docs array
  const docs = result.data[collectionName]?.docs
  return docs && docs.length > 0 ? docs[0] : null
}

/**
 * Fetch flat collection items grouped by collection type for filters
 */
export async function fetchFlatCollectionItemsForFilters(
  locale: Locale,
  collectionType?: string,
): Promise<Record<string, FlatCollectionFilters[]>> {
  const filters = await fetchFlatCollectionFilters(locale)

  // Group by collection slug (not collection type) to match FilterSortBar expectations
  const grouped: Record<string, FlatCollectionFilters[]> = {}

  filters.forEach((item) => {
    if (collectionType && item.collectionType !== collectionType) {
      return
    }

    // Map collection type to collection slug
    const collectionSlugMap: Record<string, string> = {
      wineCountry: 'wineCountries',
      style: 'styles',
      region: 'regions',
      aroma: 'aromas',
      climate: 'climates',
      dish: 'dishes',
      grapeVariety: 'grape-varieties',
      mood: 'moods',
      tag: 'tags',
      winery: 'wineries',
    }

    const collectionSlug = collectionSlugMap[item.collectionType] || item.collectionType

    if (!grouped[collectionSlug]) {
      grouped[collectionSlug] = []
    }

    grouped[collectionSlug].push(item)
  })

  return grouped
}
