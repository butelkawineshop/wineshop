import { createPayloadService } from '@/lib/payload'
import {
  CollectionConfig,
  type CollectionDisplayConfig,
} from '@/components/CollectionPage/CollectionConfig'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import type { Locale } from '@/constants/routes'
import { fetchAllCollectionItemsForFilters } from '@/lib/graphql'
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
 * Now uses flat collections for better performance and consistency
 */
export class CollectionService {
  private payload = createPayloadService()

  /**
   * Convert FlatCollectionData to CollectionItem format for backward compatibility
   */
  private static convertToCollectionItem(
    flatItem: FlatCollectionData,
    locale: Locale,
  ): CollectionItem {
    // Handle media - flat collections have media array instead of mediaBaseUrl/mediaUrl
    let mediaArray: Array<{ url: string; baseUrl: string }> = []
    if (flatItem.media && Array.isArray(flatItem.media) && flatItem.media.length > 0) {
      mediaArray = flatItem.media.map((mediaItem: { url?: string }) => ({
        url: mediaItem.url || '',
        baseUrl: mediaItem.url || '', // Use url as baseUrl for Media component
      }))
    }

    return {
      id: String(flatItem.originalID), // Use originalID as id
      title: locale === 'en' ? flatItem.titleEn || flatItem.title : flatItem.title,
      slug: locale === 'en' ? flatItem.slugEn || flatItem.slug : flatItem.slug,
      description: locale === 'en' ? flatItem.descriptionEn : flatItem.description,
      media: mediaArray,
      // Include all the rich relationship data for InfoCarousel
      whyCool: locale === 'en' ? flatItem.whyCoolEn : flatItem.whyCool,
      typicalStyle: locale === 'en' ? flatItem.typicalStyleEn : flatItem.typicalStyle,
      character: locale === 'en' ? flatItem.characterEn : flatItem.character,
      iconKey: flatItem.iconKey,
      wineryCode: flatItem.wineryCode,
      priceRange: flatItem.priceRange,
      skin: flatItem.skin,
      climate: flatItem.climate,
      climateTemperature: flatItem.climateTemperature,
      category: flatItem.category,
      colorGroup: flatItem.colorGroup,
      adjective: flatItem.adjective,
      flavour: flatItem.flavour,
      country: flatItem.country,
      climateData: flatItem.climateData,
      statistics: flatItem.statistics,
      climateConditions: flatItem.climateConditions,
      social: flatItem.social,
      synonyms: flatItem.synonyms,
      bestGrapes: flatItem.bestGrapes,
      bestRegions: flatItem.bestRegions,
      legends: flatItem.legends,
      neighbours: flatItem.neighbours,
      relatedWineries: flatItem.relatedWineries,
      distinctiveAromas: flatItem.distinctiveAromas,
      blendingPartners: flatItem.blendingPartners,
      similarVarieties: flatItem.similarVarieties,
      tags: flatItem.tags,
      seo: flatItem.seo,
      updatedAt: flatItem.syncedAt.toISOString(),
      createdAt: flatItem.syncedAt.toISOString(),
      _status: flatItem.isPublished ? 'published' : 'draft',
    }
  }

  /**
   * Convert FlatCollectionItem from database service to FlatCollectionData format
   */
  private static convertFlatCollectionItemToData(
    item: import('./CollectionDatabaseService').FlatCollectionItem,
    collectionType: string,
  ): FlatCollectionData {
    return {
      // Required FlatCollectionData fields
      title: item.title,
      titleEn: item.titleEn,
      slug: item.slug,
      slugEn: item.slugEn,
      description: item.description,
      descriptionEn: item.descriptionEn,
      isPublished: item.isPublished,
      syncedAt: new Date(item.updatedAt),

      // Additional fields from FlatCollectionData
      collectionType,
      originalID: parseInt(item.id),
      originalSlug: item.slug,
      media: item.mediaUrl
        ? [{ url: item.mediaUrl, baseUrl: item.mediaBaseUrl || item.mediaUrl }]
        : [],

      // Optional fields that might not be present in FlatCollectionItem
      whyCool: undefined,
      whyCoolEn: undefined,
      typicalStyle: undefined,
      typicalStyleEn: undefined,
      character: undefined,
      characterEn: undefined,
      iconKey: undefined,
      wineryCode: undefined,
      priceRange: undefined,
      skin: undefined,
      climate: undefined,
      climateTemperature: undefined,
      category: undefined,
      colorGroup: undefined,
      adjective: undefined,
      flavour: undefined,
      country: undefined,
      climateData: undefined,
      statistics: undefined,
      climateConditions: undefined,
      social: undefined,
      synonyms: undefined,
      bestGrapes: undefined,
      bestRegions: undefined,
      legends: undefined,
      neighbours: undefined,
      relatedWineries: undefined,
      distinctiveAromas: undefined,
      blendingPartners: undefined,
      similarVarieties: undefined,
      tags: undefined,
      seo: undefined,
    } as FlatCollectionData
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
   * Now uses flat collections for better performance and consistency
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
   * Fetch a single collection item using flat collections for better performance
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
      console.log('CollectionService.fetchSingleItem:', {
        collection,
        slug,
        locale,
      })

      const collectionType = CollectionService.getCollectionType(collection)

      if (collectionType) {
        // Use flat collections for supported collections
        const result = await this.payload.find('flat-collections', {
          depth: 1,
          locale,
          limit: 1000, // Get all items to filter
          sort: config.sort || '-createdAt',
        })

        // Filter by collection type and slug in JavaScript
        const filteredDocs = result.docs.filter((doc: Record<string, unknown>) => {
          const docSlug =
            locale === 'en' ? (doc.slugEn as string) || (doc.slug as string) : (doc.slug as string)
          return doc.collectionType === collectionType && docSlug === slug
        })

        console.log('Flat collection single item query result:', {
          timestamp: new Date().toISOString(),
          totalDocs: filteredDocs.length,
          collectionType,
          foundSlug: filteredDocs[0]?.slug,
          foundTitle: filteredDocs[0]?.title,
        })

        if (filteredDocs.length > 0) {
          const item = CollectionService.convertToCollectionItem(
            filteredDocs[0] as unknown as FlatCollectionData,
            locale,
          )
          return {
            data: item,
            items: [],
            pagination: null,
            isSingleItem: true,
          }
        }
      }

      // Fallback to database service for unsupported collections
      const dbResult = await CollectionDatabaseService.getCollectionItem(collection, slug, locale)

      if (dbResult.item) {
        const collectionType = CollectionService.getCollectionType(collection) || collection
        const convertedData = CollectionService.convertFlatCollectionItemToData(
          dbResult.item,
          collectionType,
        )
        const convertedItem = CollectionService.convertToCollectionItem(convertedData, locale)
        return {
          data: convertedItem,
          items: [],
          pagination: null,
          isSingleItem: true,
        }
      }

      // Final fallback to Payload API with different approach
      return this.fetchSingleItemFallback({ collection, config, locale, slug })
    } catch (error) {
      console.warn('Flat collection query failed, falling back to database service:', error)
      return this.fetchSingleItemFallback({ collection, config, locale, slug })
    }
  }

  /**
   * Fetch a list of collection items with pagination using flat collections
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
        // Use flat collections for supported collections
        // Fetch all items and filter in JavaScript since Payload queries are not working
        const result = await this.payload.find('flat-collections', {
          depth: 1,
          locale,
          limit: 1000, // Get all items to filter
          sort: config.sort || '-createdAt',
        })

        // Filter by collection type in JavaScript
        const filteredDocs = result.docs.filter(
          (doc: Record<string, unknown>) => doc.collectionType === collectionType,
        )

        // Apply pagination manually
        const startIndex = (currentPage - 1) * limit
        const endIndex = startIndex + limit
        const paginatedDocs = filteredDocs.slice(startIndex, endIndex)

        console.log('Flat collection query result:', {
          timestamp: new Date().toISOString(),
          totalDocs: filteredDocs.length,
          docsCount: paginatedDocs.length,
          collectionType,
          firstDoc: paginatedDocs[0]
            ? {
                id: paginatedDocs[0].id,
                title: paginatedDocs[0].title,
                collectionType: paginatedDocs[0].collectionType,
              }
            : null,
          allDocs: paginatedDocs.map((doc: Record<string, unknown>) => ({
            id: doc.id,
            title: doc.title,
            collectionType: doc.collectionType,
          })),
        })

        const items = paginatedDocs.map((doc) =>
          CollectionService.convertToCollectionItem(doc as unknown as FlatCollectionData, locale),
        )

        return {
          data: null,
          items,
          pagination: {
            page: currentPage,
            totalPages: Math.ceil(filteredDocs.length / limit),
            totalDocs: filteredDocs.length,
            hasNextPage: endIndex < filteredDocs.length,
            hasPrevPage: currentPage > 1,
          },
          isSingleItem: false,
        }
      }

      // Fallback to original database service for unsupported collections
      const dbResult = await CollectionDatabaseService.getCollectionList(
        collection,
        locale,
        currentPage,
        limit,
      )

      const items = dbResult.items.map((item) => {
        const collectionType = CollectionService.getCollectionType(collection) || collection
        const convertedData = CollectionService.convertFlatCollectionItemToData(
          item,
          collectionType,
        )
        return CollectionService.convertToCollectionItem(convertedData, locale)
      })

      return {
        data: null,
        items,
        pagination: dbResult.pagination,
        isSingleItem: false,
      }
    } catch (error) {
      console.warn('Flat collection query failed, falling back to database service:', error)
      return this.fetchItemListFallback({ collection, config, locale, page })
    }
  }

  /**
   * Fallback method using Payload API for item list
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
    const currentPage = page || COLLECTION_CONSTANTS.PAGINATION.DEFAULT_PAGE
    const limit = config.listLimit || COLLECTION_CONSTANTS.PAGINATION.DEFAULT_LIMIT

    const result = await this.payload.find(collection, {
      depth: 1,
      locale,
      limit,
      page: currentPage,
      sort: config.sort || '-createdAt',
      fields: ['title', 'slug', 'media'],
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    return {
      data: null,
      items: result.docs as CollectionItem[],
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        totalDocs: result.totalDocs,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
      isSingleItem: false,
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
   * Fetch collection items for filters using flat collections
   * Replaces GraphQL with more efficient flat collection queries
   */
  async fetchCollectionItems(
    locale: Locale,
    collectionType?: string,
  ): Promise<Record<string, CollectionItem[]>> {
    try {
      // Build where clause
      const where: Record<string, unknown> = {
        isPublished: {
          equals: true,
        },
      }

      // Add collection type filter if specified
      if (collectionType) {
        where.collectionType = {
          in: [collectionType],
        }
      }

      // Use flat collections for better performance
      const result = await this.payload.find('flat-collections', {
        depth: 1,
        locale,
        limit: 1000, // Get all items for filters
        where,
        sort: 'title',
      })

      // Group items by collection type
      const grouped: Record<string, CollectionItem[]> = {}

      result.docs.forEach((doc) => {
        const flatItem = doc as unknown as FlatCollectionData
        const itemCollectionType = flatItem.collectionType

        // Get the collection slug from the type
        const collectionSlug = this.getCollectionSlugFromType(itemCollectionType)
        if (!collectionSlug) return

        if (!grouped[collectionSlug]) {
          grouped[collectionSlug] = []
        }

        const convertedItem = CollectionService.convertToCollectionItem(flatItem, locale)
        grouped[collectionSlug].push(convertedItem)
      })

      return grouped
    } catch (error) {
      console.warn('Flat collection query failed, falling back to GraphQL:', error)
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
   * Fallback method using Payload API for single item
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
    // Ensure minimum depth of 2 to populate relationship fields properly
    const depth = Math.max(config.depth || 1, 2)

    const result = await this.payload.find(collection, {
      depth,
      locale,
      limit: 100,
      where: {
        _status: {
          equals: 'published',
        },
      },
    })

    const foundItem = result.docs.find((doc: Record<string, unknown>) => doc.slug === slug) as
      | CollectionItem
      | undefined

    if (foundItem) {
      // Log relationship fields specifically
      config.fields.forEach((field) => {
        if (field.type === 'relationship') {
          const _value = foundItem[field.name]
        }
      })
    }

    return {
      data: foundItem || null,
      items: [],
      pagination: null,
      isSingleItem: true,
    }
  }
}

// Export singleton instance
export const collectionService = new CollectionService()
