import {
  CollectionConfig,
  type CollectionDisplayConfig,
} from '@/components/CollectionPage/CollectionConfig'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import type { Locale } from '@/constants/routes'
import { CollectionDatabaseService } from './CollectionDatabaseService'
import { FLAT_COLLECTIONS_CONSTANTS } from '@/constants/flatCollections'

// Import the new GraphQL types and client
import type {
  GetFlatCollectionQueryResult,
  GetFlatCollectionsQueryResult,
  FlatCollectionFieldsFragment,
  GetAllCollectionItemsQueryResult,
} from '@/generated/graphql'
import { graphqlRequest } from '@/lib/graphql-client'
import { GetFlatCollection, GetFlatCollections, GetAllCollectionItems } from '@/generated/graphql'

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
 * Now uses GraphQL Codegen for better performance and type safety
 */
export class CollectionService {
  /**
   * Convert GraphQL FlatCollection to CollectionItem format for backward compatibility
   */
  private static convertToCollectionItem(
    graphqlItem: FlatCollectionFieldsFragment,
    _locale: Locale,
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
      id: graphqlItem.id.toString(),
      title: graphqlItem.title || '',
      slug: graphqlItem.slug || '',
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
   * Now uses GraphQL Codegen for better performance and type safety
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

      if (collectionType) {
        // Use the new GraphQL client to fetch a single collection item
        const { data, error } = await graphqlRequest<GetFlatCollectionQueryResult>({
          query: GetFlatCollection,
          variables: {
            slug,
            locale: locale as 'sl' | 'en',
          },
        })

        if (error || !data?.FlatCollections?.docs?.[0]) {
          console.warn('GraphQL query failed for single item:', error)
          return {
            data: null,
            items: [],
            pagination: null,
            isSingleItem: true,
          }
        }

        const graphqlItem = data.FlatCollections.docs[0]
        const convertedItem = CollectionService.convertToCollectionItem(graphqlItem, locale)

        return {
          data: convertedItem,
          items: [],
          pagination: null,
          isSingleItem: true,
        }
      }

      // Fallback to database service for unsupported collections
      return this.fetchSingleItemFallback({ collection, config, locale, slug })
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

      if (collectionType) {
        // Use the new GraphQL client to fetch collection items
        const { data, error } = await graphqlRequest<GetFlatCollectionsQueryResult>({
          query: GetFlatCollections,
          variables: {
            collectionType: collectionType as any,
            locale: locale as 'sl' | 'en',
            limit,
            page: currentPage,
          },
        })

        if (error || !data?.FlatCollections) {
          console.warn('GraphQL query failed for collection list:', error)
          return {
            data: null,
            items: [],
            pagination: null,
            isSingleItem: false,
          }
        }

        const items = data.FlatCollections.docs.map((doc) =>
          CollectionService.convertToCollectionItem(doc, locale),
        )

        return {
          data: null,
          items,
          pagination: {
            page: data.FlatCollections.page,
            totalPages: data.FlatCollections.totalPages,
            totalDocs: data.FlatCollections.totalDocs,
            hasNextPage: data.FlatCollections.hasNextPage,
            hasPrevPage: data.FlatCollections.hasPrevPage,
          },
          isSingleItem: false,
        }
      }

      // Fallback to database service for unsupported collections
      return this.fetchItemListFallback({ collection, config, locale, page })
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
   * Fetch collection items for filters
   * Now uses the new GraphQL approach
   */
  async fetchCollectionItems(
    locale: Locale,
    _collectionType?: string,
  ): Promise<Record<string, CollectionItem[]>> {
    try {
      // Use the new GraphQL query to fetch all collection items
      const { data, error } = await graphqlRequest<GetAllCollectionItemsQueryResult>({
        query: GetAllCollectionItems,
        variables: {
          locale: locale as 'sl' | 'en',
        },
      })

      if (error || !data) {
        console.warn('GraphQL query failed for collection items:', error)
        return this.fetchCollectionItemsFallback(locale)
      }

      // Transform the GraphQL response to the expected format
      const collectionItems: Record<string, CollectionItem[]> = {
        aromas:
          data.Aromas?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
        climates:
          data.Climates?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
        dishes:
          data.Dishes?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
        'grape-varieties':
          data.GrapeVarieties?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
        moods:
          data.Moods?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
        regions:
          data.Regions?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
        styles:
          data.Styles?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
        tags:
          data.Tags?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
        wineCountries:
          data.WineCountries?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
        wineries:
          data.Wineries?.docs?.map((item) => ({
            id: String(item.id),
            title: item.title || '',
            slug: item.slug || '',
          })) || [],
      }

      return collectionItems
    } catch (error) {
      console.warn('GraphQL query failed, falling back to fallback:', error)
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
   * Fallback method for collection items
   */
  private async fetchCollectionItemsFallback(
    _locale: Locale,
  ): Promise<Record<string, CollectionItem[]>> {
    // Return empty collections as fallback
    // This can be updated later to use the new GraphQL queries
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
    config: _config,
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
