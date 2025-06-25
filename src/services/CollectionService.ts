import { createPayloadService } from '@/lib/payload'
import {
  CollectionConfig,
  type CollectionDisplayConfig,
} from '@/components/CollectionPage/CollectionConfig'
import { COLLECTION_CONSTANTS } from '@/constants/collections'
import type { Locale } from '@/utils/routeMappings'

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
    const result = await this.payload.find(collection, {
      depth: config.depth || 1,
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
   * Fetch collection items for filters
   */
  async fetchCollectionItems(locale: Locale): Promise<Record<string, CollectionItem[]>> {
    const collections = [
      'aromas',
      'climates',
      'dishes',
      'grape-varieties',
      'moods',
      'regions',
      'styles',
      'tags',
      'wineCountries',
      'wineries',
    ]

    // Use Promise.all for parallel requests instead of sequential
    const collectionPromises = collections.map(async (collection) => {
      try {
        const response = await this.payload.find(collection, {
          limit: 100,
          depth: 0,
          locale,
          fields: ['id', 'title', 'slug'],
          where: {
            _status: {
              equals: 'published',
            },
          },
        })
        return [collection, response.docs]
      } catch (error) {
        // Log error but don't break the entire page
        console.warn(`Failed to fetch ${collection}:`, error)
        return [collection, []]
      }
    })

    const results = await Promise.all(collectionPromises)
    return Object.fromEntries(results)
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
