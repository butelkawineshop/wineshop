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
      return { data: null, error: 'Failed to fetch data' }
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
    return { data: null, error: 'Network error' }
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
