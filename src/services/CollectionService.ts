import { createPayloadService } from '@/lib/payload'
import {
  CollectionConfig,
  type CollectionDisplayConfig,
} from '@/components/CollectionPage/CollectionConfig'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import type { Locale } from '@/constants/routes'
import { fetchAllCollectionItemsForFilters } from '@/lib/graphql'
import { CollectionDatabaseService, type FlatCollectionItem } from './CollectionDatabaseService'

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
 * Now uses direct database queries for better performance
 */
export class CollectionService {
  private payload = createPayloadService()

  /**
   * Convert FlatCollectionItem to CollectionItem format for backward compatibility
   */
  private static convertToCollectionItem(
    flatItem: FlatCollectionItem,
    locale: Locale,
  ): CollectionItem {
    // Use mediaBaseUrl if available, otherwise compute from mediaUrl
    let mediaBaseUrl = flatItem.mediaBaseUrl || ''
    if (flatItem.mediaUrl && !mediaBaseUrl) {
      // Extract base URL from media URL if it's a Cloudflare URL
      const urlMatch = flatItem.mediaUrl.match(/^(https:\/\/[^\/]+\/[^\/]+)\//)
      if (urlMatch) {
        mediaBaseUrl = urlMatch[1]
      }
    }

    return {
      id: flatItem.id,
      title: locale === 'en' ? flatItem.titleEn : flatItem.title,
      slug: locale === 'en' ? flatItem.slugEn : flatItem.slug,
      description: locale === 'en' ? flatItem.descriptionEn : flatItem.description,
      media: flatItem.mediaBaseUrl
        ? [
            {
              url: flatItem.mediaBaseUrl, // Use baseUrl so Media component can construct variants
              baseUrl: flatItem.mediaBaseUrl,
            },
          ]
        : [],
      updatedAt: flatItem.updatedAt,
      createdAt: flatItem.createdAt,
      _status: flatItem._status,
    }
  }

  /**
   * Fetch collection data (single item or list)
   * Now uses direct database queries for better performance
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
   * Fetch a single collection item using direct database query
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
      // Try direct database query first for better performance
      const dbResult = await CollectionDatabaseService.getCollectionItem(collection, slug, locale)

      if (dbResult.item) {
        const convertedItem = CollectionService.convertToCollectionItem(dbResult.item, locale)
        return {
          data: convertedItem,
          items: [],
          pagination: null,
          isSingleItem: true,
        }
      }

      // Fallback to Payload API if database query fails or item not found
      return this.fetchSingleItemFallback({ collection, config, locale, slug })
    } catch (error) {
      console.warn('Database query failed, falling back to Payload API:', error)
      return this.fetchSingleItemFallback({ collection, config, locale, slug })
    }
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

  /**
   * Fetch a list of collection items with pagination using direct database query
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

      // Use direct database query for better performance
      const dbResult = await CollectionDatabaseService.getCollectionList(
        collection,
        locale,
        currentPage,
        limit,
      )

      const items = dbResult.items.map((item) =>
        CollectionService.convertToCollectionItem(item, locale),
      )

      return {
        data: null,
        items,
        pagination: dbResult.pagination,
        isSingleItem: false,
      }
    } catch (error) {
      console.warn('Database query failed, falling back to Payload API:', error)
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
   * Fetch collection items for filters using direct database queries
   * Replaces GraphQL with more efficient database queries
   */
  async fetchCollectionItems(locale: Locale): Promise<Record<string, CollectionItem[]>> {
    try {
      // Use direct database queries for better performance
      const dbResult = await CollectionDatabaseService.getAllCollectionsForFilters(locale)

      // Transform the result to match the expected format
      const transformed: Record<string, CollectionItem[]> = {}

      Object.entries(dbResult).forEach(([collection, items]) => {
        transformed[collection] = items.map((item: FlatCollectionItem) =>
          CollectionService.convertToCollectionItem(item, locale),
        )
      })

      return transformed
    } catch (error) {
      console.warn('Database queries failed, falling back to GraphQL:', error)
      return this.fetchCollectionItemsFallback(locale)
    }
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
}

// Export singleton instance
export const collectionService = new CollectionService()
