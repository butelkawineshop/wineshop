import {
  CollectionConfig,
  type CollectionDisplayConfig,
} from '@/components/CollectionPage/CollectionConfig'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import type { Locale } from '@/constants/routes'
import {
  fetchAllCollectionItemsForFilters,
  fetchFlatCollectionFilters,
  fetchFlatCollectionItems,
  fetchFlatCollectionItem,
  fetchFlatCollectionItemsForFilters,
  type FlatCollectionItem as GraphQLFlatCollectionItem,
} from '@/lib/graphql'
import { CollectionDatabaseService } from './CollectionDatabaseService'
import { FLAT_COLLECTIONS_CONSTANTS } from '@/constants/flatCollections'

// Import the rich interface from FlatCollectionService
import type { FlatCollectionData } from './FlatCollectionService'

export interface CollectionItem {
  id: string
  title: string
  slug: string
  [key: string]: unknown
}

export interface PaginationInfo {
  page: number
  totalPages: number
  totalDocs: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface CollectionData {
  data: CollectionItem | null
  items: CollectionItem[]
  pagination: PaginationInfo | null
  isSingleItem: boolean
}

export interface PaginationUrls {
  prevUrl: string | null
  nextUrl: string | null
  baseUrl: string
}

/**
 * Service class for collection-related business logic
 * Handles data fetching, pagination, and URL building
 * Now uses GraphQL exclusively for better performance and type safety
 */
export class CollectionService {
  /**
   * Convert GraphQL FlatCollectionItem to CollectionItem format for backward compatibility
   */
  private static convertToCollectionItem(
    graphqlItem: GraphQLFlatCollectionItem,
    locale: Locale,
  ): CollectionItem {
    // Handle media - GraphQL returns media array
    let mediaArray: Array<{ url: string; baseUrl: string }> = []
    if (graphqlItem.media && Array.isArray(graphqlItem.media) && graphqlItem.media.length > 0) {
      mediaArray = graphqlItem.media.map((mediaItem) => ({
        url: mediaItem.url || '',
        baseUrl: mediaItem.url || '', // Use url as baseUrl for Media component
      }))
    }

    return {
      id: graphqlItem.id,
      title: graphqlItem.title,
      slug: graphqlItem.slug,
      description: graphqlItem.description,
      media: mediaArray,
      // Include all the rich relationship data for InfoCarousel
      whyCool: graphqlItem.whyCool,
      typicalStyle: graphqlItem.typicalStyle,
      character: graphqlItem.character,
      iconKey: graphqlItem.iconKey,
      wineryCode: graphqlItem.wineryCode,
      priceRange: graphqlItem.priceRange,
      skin: graphqlItem.skin,
      climate: graphqlItem.climate,
      climateTemperature: graphqlItem.climateTemperature,
      category: graphqlItem.category,
      colorGroup: graphqlItem.colorGroup,
      adjective: graphqlItem.adjective,
      flavour: graphqlItem.flavour,
      country: graphqlItem.country,
      climateData: graphqlItem.climateData,
      statistics: graphqlItem.statistics,
      climateConditions: graphqlItem.climateConditions,
      social: graphqlItem.social,
      synonyms: graphqlItem.synonyms,
      bestGrapes: graphqlItem.bestGrapes,
      bestRegions: graphqlItem.bestRegions,
      legends: graphqlItem.legends,
      neighbours: graphqlItem.neighbours,
      relatedWineries: graphqlItem.relatedWineries,
      distinctiveAromas: graphqlItem.distinctiveAromas,
      blendingPartners: graphqlItem.blendingPartners,
      similarVarieties: graphqlItem.similarVarieties,
      tags: graphqlItem.tags,
      seo: graphqlItem.seo,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      _status: 'published',
    }
  }

  /**
   * Get the collection type for a given collection slug
   */
  private static getCollectionType(collection: string): string | null {
    const typeMap = FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPE_MAPPINGS
    return typeMap[collection as keyof typeof typeMap] || null
  }

  /**
   * Fetch collection data (single item or list)
   * Now uses GraphQL exclusively for better performance and type safety
   */
  async fetchCollectionData({
    collection,
    config,
    locale,
    slug,
    page,
  }: {
    collection: string
    config: CollectionDisplayConfig
    locale: Locale
    slug?: string
    page?: number
  }): Promise<CollectionData> {
    const isSingleItem = Boolean(slug)

    if (isSingleItem) {
      return this.fetchSingleItem({ collection, config, locale, slug: slug! })
    } else {
      return this.fetchItemList({ collection, config, locale, page })
    }
  }

  /**
   * Fetch a single collection item using GraphQL
   */
  private async fetchSingleItem({
    collection,
    config,
    locale,
    slug,
  }: {
    collection: string
    config: CollectionDisplayConfig
    locale: Locale
    slug: string
  }): Promise<CollectionData> {
    try {
      const collectionType = CollectionService.getCollectionType(collection)

      console.log('CollectionService.fetchSingleItem:', {
        collection,
        collectionType,
        slug,
        locale,
      })

      if (collectionType) {
        // First, get the item ID from the filters data
        const filters = await fetchFlatCollectionFilters(locale)
        const targetItem = filters.find((item) => {
          // Handle localized slugs - GraphQL returns the correct slug for the locale
          return item.collectionType === collectionType && item.slug === slug
        })

        console.log('CollectionService.fetchSingleItem - targetItem:', {
          found: !!targetItem,
          targetItem: targetItem
            ? {
                id: targetItem.id,
                title: targetItem.title,
                slug: targetItem.slug,
                collectionType: targetItem.collectionType,
              }
            : null,
          filtersCount: filters.length,
          matchingFilters: filters
            .filter((item) => item.collectionType === collectionType)
            .map((item) => ({
              id: item.id,
              title: item.title,
              slug: item.slug,
            })),
        })

        if (targetItem) {
          // Fetch the full item data using GraphQL
          const result = await fetchFlatCollectionItem({
            id: targetItem.id, // Pass the ID back since we're using individual collection queries
            locale,
            collectionType,
          })

          console.log('GraphQL single item query result:', {
            timestamp: new Date().toISOString(),
            hasData: !!result,
            dataKeys: result ? Object.keys(result) : [],
            sampleData: result
              ? {
                  id: result.id,
                  title: result.title,
                  description: result.description,
                  whyCool: result.whyCool,
                  statistics: result.statistics,
                  regions: (result as any).regions,
                  bestRegions: (result as any).bestRegions,
                  bestGrapes: (result as any).bestGrapes,
                  legends: (result as any).legends,
                  typicalStyle: (result as any).typicalStyle,
                  character: (result as any).character,
                  synonyms: (result as any).synonyms,
                  distinctiveAromas: (result as any).distinctiveAromas,
                  blendingPartners: (result as any).blendingPartners,
                  similarVarieties: (result as any).similarVarieties,
                  climateConditions: (result as any).climateConditions,
                  tags: (result as any).tags,
                  social: (result as any).social,
                  relatedWineries: (result as any).relatedWineries,
                }
              : null,
          })

          if (result) {
            const convertedItem = CollectionService.convertToCollectionItem(result, locale)

            return {
              data: convertedItem,
              items: [],
              pagination: null,
              isSingleItem: true,
            }
          }
        } else {
          // Fallback: Try to query the individual collection directly by slug
          console.log('Target item not found in filters, trying direct query by slug:', slug)
          const result = await fetchFlatCollectionItem({
            id: slug, // Pass the slug directly
            locale,
            collectionType,
          })

          if (result) {
            const convertedItem = CollectionService.convertToCollectionItem(result, locale)

            return {
              data: convertedItem,
              items: [],
              pagination: null,
              isSingleItem: true,
            }
          }
        }

        return {
          data: null,
          items: [],
          pagination: null,
          isSingleItem: true,
        }
      }

      // Fallback to database service for unsupported collections
      const dbResult = await CollectionDatabaseService.getCollectionItem(collection, slug, locale)

      if (dbResult.item) {
        const convertedItem = {
          id: dbResult.item.id,
          title:
            locale === 'en' ? dbResult.item.titleEn || dbResult.item.title : dbResult.item.title,
          slug: locale === 'en' ? dbResult.item.slugEn || dbResult.item.slug : dbResult.item.slug,
          description: locale === 'en' ? dbResult.item.descriptionEn : dbResult.item.description,
          media: dbResult.item.mediaUrl
            ? [
                {
                  url: dbResult.item.mediaUrl,
                  baseUrl: dbResult.item.mediaBaseUrl || dbResult.item.mediaUrl,
                },
              ]
            : [],
          updatedAt: dbResult.item.updatedAt,
          createdAt: dbResult.item.createdAt,
          _status: dbResult.item._status,
        } as CollectionItem

        return {
          data: convertedItem,
          items: [],
          pagination: null,
          isSingleItem: true,
        }
      }

      return {
        data: null,
        items: [],
        pagination: null,
        isSingleItem: true,
      }
    } catch (error) {
      console.warn('GraphQL query failed, falling back to database service:', error)
      return this.fetchSingleItemFallback({ collection, config, locale, slug })
    }
  }

  /**
   * Fetch a list of collection items with pagination using GraphQL
   */
  private async fetchItemList({
    collection,
    config,
    locale,
    page,
  }: {
    collection: string
    config: CollectionDisplayConfig
    locale: Locale
    page?: number
  }): Promise<CollectionData> {
    try {
      const currentPage = page || COLLECTION_CONSTANTS.PAGINATION.DEFAULT_PAGE
      const limit = config.listLimit || COLLECTION_CONSTANTS.PAGINATION.DEFAULT_LIMIT
      const collectionType = CollectionService.getCollectionType(collection)

      console.log('CollectionService.fetchItemList:', {
        collection,
        collectionType,
        currentPage,
        limit,
        locale,
      })

      if (collectionType) {
        // Use GraphQL for supported collections
        const result = await fetchFlatCollectionItems({
          collectionType,
          locale,
          limit,
          page: currentPage,
        })

        console.log('GraphQL collection query result:', {
          timestamp: new Date().toISOString(),
          totalDocs: result.flatCollections.totalDocs,
          docsCount: result.flatCollections.docs.length,
          collectionType,
          firstDoc: result.flatCollections.docs[0]
            ? {
                id: result.flatCollections.docs[0].id,
                title: result.flatCollections.docs[0].title,
              }
            : null,
        })

        const items = result.flatCollections.docs.map((doc) =>
          CollectionService.convertToCollectionItem(doc, locale),
        )

        return {
          data: null,
          items,
          pagination: {
            page: result.flatCollections.page,
            totalPages: result.flatCollections.totalPages,
            totalDocs: result.flatCollections.totalDocs,
            hasNextPage: result.flatCollections.hasNextPage,
            hasPrevPage: result.flatCollections.hasPrevPage,
          },
          isSingleItem: false,
        }
      }

      // Fallback to database service for unsupported collections
      const dbResult = await CollectionDatabaseService.getCollectionList(
        collection,
        locale,
        currentPage,
        limit,
      )

      const items = dbResult.items.map(
        (item) =>
          ({
            id: item.id,
            title: locale === 'en' ? item.titleEn || item.title : item.title,
            slug: locale === 'en' ? item.slugEn || item.slug : item.slug,
            description: locale === 'en' ? item.descriptionEn : item.description,
            media: item.mediaUrl
              ? [{ url: item.mediaUrl, baseUrl: item.mediaBaseUrl || item.mediaUrl }]
              : [],
            updatedAt: item.updatedAt,
            createdAt: item.createdAt,
            _status: item._status,
          }) as CollectionItem,
      )

      return {
        data: null,
        items,
        pagination: dbResult.pagination,
        isSingleItem: false,
      }
    } catch (error) {
      console.warn('GraphQL query failed, falling back to database service:', error)
      return this.fetchItemListFallback({ collection, config, locale, page })
    }
  }

  /**
   * Build pagination URLs
   */
  buildPaginationUrls({
    pagination,
    searchParams,
    locale,
    baseSegment,
  }: {
    pagination: PaginationInfo | null
    searchParams: Record<string, string | string[] | undefined>
    locale: Locale
    baseSegment: string
  }): PaginationUrls {
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
      const localePrefix = locale === 'en' ? '/en' : ''
      return `${localePrefix}/${baseSegment}${queryString ? `?${queryString}` : ''}`
    }

    const currentPage = pagination?.page || 1
    const prevUrl = pagination?.hasPrevPage ? buildPageUrl(currentPage - 1) : null
    const nextUrl = pagination?.hasNextPage ? buildPageUrl(currentPage + 1) : null
    const baseUrl = buildPageUrl(1).replace('?page=1', '').replace('&page=1', '')

    return { prevUrl, nextUrl, baseUrl }
  }

  /**
   * Fetch collection items for filters using GraphQL
   * Replaces REST API with more efficient GraphQL queries
   */
  async fetchCollectionItems(
    locale: Locale,
    collectionType?: string,
  ): Promise<Record<string, CollectionItem[]>> {
    try {
      // Use GraphQL for better performance
      const grouped = await fetchFlatCollectionItemsForFilters(locale, collectionType)

      // Convert to CollectionItem format
      const result: Record<string, CollectionItem[]> = {}

      Object.entries(grouped).forEach(([collectionSlug, items]) => {
        result[collectionSlug] = items.map(
          (item) =>
            ({
              id: item.id,
              title: item.title,
              slug: item.slug,
              updatedAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
              _status: 'published',
            }) as CollectionItem,
        )
      })

      return result
    } catch (error) {
      console.warn('GraphQL query failed, falling back to GraphQL fallback:', error)
      return this.fetchCollectionItemsFallback(locale)
    }
  }

  /**
   * Get collection slug from collection type
   */
  private getCollectionSlugFromType(collectionType: string): string | null {
    const typeMap = FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPE_MAPPINGS
    const entries = Object.entries(typeMap)
    const entry = entries.find(([_, type]) => type === collectionType)
    return entry ? entry[0] : null
  }

  /**
   * Fallback method using GraphQL for collection items
   */
  private async fetchCollectionItemsFallback(
    locale: Locale,
  ): Promise<Record<string, CollectionItem[]>> {
    try {
      const result = await fetchAllCollectionItemsForFilters(locale)

      // Helper function to extract slug string from localized slug object
      const extractSlug = (slug: string | Record<string, string> | null | undefined): string => {
        if (typeof slug === 'string') return slug
        if (slug && typeof slug === 'object') {
          return slug[locale] || slug.sl || slug.en || ''
        }
        return ''
      }

      // Transform the result to match the expected format
      const transformed = {
        aromas: result.aromas.map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
        climates: result.climates.map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
        dishes: result.dishes.map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
        'grape-varieties': result['grape-varieties'].map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
        moods: result.moods.map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
        regions: result.regions.map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
        styles: result.styles.map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
        tags: result.tags.map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
        wineCountries: result.wineCountries.map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
        wineries: result.wineries.map((item) => ({
          id: item.id,
          title: item.title || '',
          slug: extractSlug(item.slug),
        })),
      }

      return transformed
    } catch (error) {
      // Fallback to empty collections if GraphQL fails
      console.warn('Failed to fetch collection items via GraphQL, using fallback:', error)
      return {
        aromas: [],
        climates: [],
        dishes: [],
        'grape-varieties': [],
        moods: [],
        regions: [],
        styles: [],
        tags: [],
        wineCountries: [],
        wineries: [],
      }
    }
  }

  /**
   * Get collection configuration
   */
  getCollectionConfig(collection: string): CollectionDisplayConfig | null {
    return CollectionConfig[collection] || null
  }

  /**
   * Check if collection is wine-related
   */
  isWineCollection(collection: string): boolean {
    return (COLLECTION_CONSTANTS.WINE_COLLECTIONS as readonly string[]).includes(collection)
  }

  /**
   * Fallback method using database service for single item
   */
  private async fetchSingleItemFallback({
    collection,
    config,
    locale,
    slug,
  }: {
    collection: string
    config: CollectionDisplayConfig
    locale: Locale
    slug: string
  }): Promise<CollectionData> {
    try {
      const dbResult = await CollectionDatabaseService.getCollectionItem(collection, slug, locale)

      if (dbResult.item) {
        const convertedItem = {
          id: dbResult.item.id,
          title:
            locale === 'en' ? dbResult.item.titleEn || dbResult.item.title : dbResult.item.title,
          slug: locale === 'en' ? dbResult.item.slugEn || dbResult.item.slug : dbResult.item.slug,
          description: locale === 'en' ? dbResult.item.descriptionEn : dbResult.item.description,
          media: dbResult.item.mediaUrl
            ? [
                {
                  url: dbResult.item.mediaUrl,
                  baseUrl: dbResult.item.mediaBaseUrl || dbResult.item.mediaUrl,
                },
              ]
            : [],
          updatedAt: dbResult.item.updatedAt,
          createdAt: dbResult.item.createdAt,
          _status: dbResult.item._status,
        } as CollectionItem

        return {
          data: convertedItem,
          items: [],
          pagination: null,
          isSingleItem: true,
        }
      }

      return {
        data: null,
        items: [],
        pagination: null,
        isSingleItem: true,
      }
    } catch (error) {
      console.warn('Database service fallback failed:', error)
      return {
        data: null,
        items: [],
        pagination: null,
        isSingleItem: true,
      }
    }
  }

  /**
   * Fallback method using database service for item list
   */
  private async fetchItemListFallback({
    collection,
    config,
    locale,
    page,
  }: {
    collection: string
    config: CollectionDisplayConfig
    locale: Locale
    page?: number
  }): Promise<CollectionData> {
    try {
      const currentPage = page || COLLECTION_CONSTANTS.PAGINATION.DEFAULT_PAGE
      const limit = config.listLimit || COLLECTION_CONSTANTS.PAGINATION.DEFAULT_LIMIT

      const dbResult = await CollectionDatabaseService.getCollectionList(
        collection,
        locale,
        currentPage,
        limit,
      )

      const items = dbResult.items.map(
        (item) =>
          ({
            id: item.id,
            title: locale === 'en' ? item.titleEn || item.title : item.title,
            slug: locale === 'en' ? item.slugEn || item.slug : item.slug,
            description: locale === 'en' ? item.descriptionEn : item.description,
            media: item.mediaUrl
              ? [{ url: item.mediaUrl, baseUrl: item.mediaBaseUrl || item.mediaUrl }]
              : [],
            updatedAt: item.updatedAt,
            createdAt: item.createdAt,
            _status: item._status,
          }) as CollectionItem,
      )

      return {
        data: null,
        items,
        pagination: dbResult.pagination,
        isSingleItem: false,
      }
    } catch (error) {
      console.warn('Database service fallback failed:', error)
      return {
        data: null,
        items: [],
        pagination: null,
        isSingleItem: false,
      }
    }
  }
}

// Export singleton instance
export const collectionService = new CollectionService()
