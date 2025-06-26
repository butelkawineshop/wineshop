import { createPayloadService } from '@/lib/payload'
import {
  CollectionConfig,
  type CollectionDisplayConfig,
} from '@/components/CollectionPage/CollectionConfig'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import type { Locale } from '@/utils/routeMappings'
import { fetchAllCollectionItemsForFilters } from '@/lib/graphql'

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
 */
export class CollectionService {
  private payload = createPayloadService()

  /**
   * Fetch collection data (single item or list)
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
   * Fetch a single collection item
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
          const value = foundItem[field.name]
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
   * Fetch a list of collection items with pagination
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
   * Fetch collection items for filters using GraphQL
   * Replaces 10 REST API calls with 1 efficient GraphQL query
   */
  async fetchCollectionItems(locale: Locale): Promise<Record<string, CollectionItem[]>> {
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
