import { db } from '../lib/db'
import type { Locale } from '@/constants/routes'

export interface FlatCollectionItem {
  id: string
  title: string
  titleEn: string
  slug: string
  slugEn: string
  description: string
  descriptionEn: string
  mediaUrl: string
  mediaBaseUrl?: string
  isPublished: boolean
  updatedAt: string
  createdAt: string
  _status: string
}

export interface CollectionListResult {
  items: FlatCollectionItem[]
  pagination: {
    page: number
    totalPages: number
    totalDocs: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface CollectionSingleResult {
  item: FlatCollectionItem | null
}

export class CollectionDatabaseService {
  /**
   * Convert snake_case database names to camelCase collection names
   */
  private static getTableName(collection: string): string {
    const tableMap: Record<string, string> = {
      regions: 'regions',
      wineries: 'wineries',
      wineCountries: 'wine_countries',
      'grape-varieties': 'grape_varieties',
    }
    return tableMap[collection] || collection
  }

  /**
   * Get the locales table name for a collection
   */
  private static getLocalesTableName(collection: string): string {
    const tableName = this.getTableName(collection)
    return `${tableName}_locales`
  }

  /**
   * Get the media relationships table name for a collection
   */
  private static getMediaTableName(collection: string): string {
    const tableName = this.getTableName(collection)
    return `${tableName}_rels`
  }

  /**
   * Get the title field for a collection (some collections have title in main table, others in locales)
   */
  private static getTitleField(collection: string): { table: string; field: string } {
    // Collections that have title in main table
    const mainTableTitleCollections = ['regions', 'wineries']

    if (mainTableTitleCollections.includes(collection)) {
      // These collections have title in main table
      return { table: 'c', field: 'title' }
    } else {
      // All other collections have title only in locales table
      return { table: 'cl', field: 'title' }
    }
  }

  /**
   * Convert snake_case database row to camelCase object
   */
  private static mapSnakeToCamel(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelKey] = value
    }
    return result
  }

  /**
   * Build the base query for collection items with media and locales
   */
  private static buildCollectionQuery(collection: string, locale: Locale): string {
    const tableName = this.getTableName(collection)
    const localesTableName = this.getLocalesTableName(collection)
    const mediaTableName = this.getMediaTableName(collection)
    const titleField = this.getTitleField(collection)

    // Collections that don't have description in locales table
    const collectionsWithoutDescription = ['aromas']
    const hasDescription = !collectionsWithoutDescription.includes(collection)

    // ALL collections have locales tables - this is the Payload CMS pattern
    const hasLocalesTable = true

    if (hasLocalesTable) {
      // Build select fields array
      const selectFields = [
        '  c.id,',
        `  ${titleField.table}.${titleField.field} as "title",`,
        ...(hasDescription ? ['  cl.description as "description",'] : []),
        '  c.updated_at as "updatedAt",',
        '  c.created_at as "createdAt",',
        '  c._status,',
        '  cl.slug as "slug",',
        '  m.url as "mediaUrl",',
        // Extract baseUrl from media URL by removing variant suffix
        '  CASE WHEN m.url IS NOT NULL THEN ' +
          '    CASE ' +
          "      WHEN m.url LIKE '%/winecards' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 10) " +
          "      WHEN m.url LIKE '%/thumbnail' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 11) " +
          "      WHEN m.url LIKE '%/feature' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 8) " +
          "      WHEN m.url LIKE '%/hero' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 5) " +
          "      WHEN m.url LIKE '%/square' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 7) " +
          '      ELSE m.url ' +
          '    END ' +
          '  ELSE NULL END as "mediaBaseUrl"',
      ]

      const query = [
        'SELECT',
        ...selectFields,
        'FROM ' + tableName + ' c',
        'LEFT JOIN ' + localesTableName + ' cl ON c.id = cl._parent_id AND cl._locale = $1',
        'LEFT JOIN ' + mediaTableName + " mr ON c.id = mr.parent_id AND mr.path = 'media'",
        'LEFT JOIN media m ON mr.media_id = m.id',
        "WHERE c._status = 'published'",
        'ORDER BY ' + titleField.table + '.' + titleField.field,
      ].join('\n')

      return query
    } else {
      // Fallback for collections without locales tables
      const selectFields = [
        '  c.id,',
        '  c.title,',
        '  c.description,',
        '  c.updated_at as "updatedAt",',
        '  c.created_at as "createdAt",',
        '  c._status,',
        '  c.slug,',
        '  m.url as "mediaUrl",',
        // Extract baseUrl from media URL by removing variant suffix
        '  CASE WHEN m.url IS NOT NULL THEN ' +
          '    CASE ' +
          "      WHEN m.url LIKE '%/winecards' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 10) " +
          "      WHEN m.url LIKE '%/thumbnail' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 11) " +
          "      WHEN m.url LIKE '%/feature' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 8) " +
          "      WHEN m.url LIKE '%/hero' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 5) " +
          "      WHEN m.url LIKE '%/square' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 7) " +
          '      ELSE m.url ' +
          '    END ' +
          '  ELSE NULL END as "mediaBaseUrl"',
      ]

      const query = [
        'SELECT',
        ...selectFields,
        'FROM ' + tableName + ' c',
        'LEFT JOIN ' + mediaTableName + " mr ON c.id = mr.parent_id AND mr.path = 'media'",
        'LEFT JOIN media m ON mr.media_id = m.id',
        "WHERE c._status = 'published'",
        'ORDER BY c.title',
      ].join('\n')

      return query
    }
  }

  /**
   * Fetch a list of collection items with pagination
   */
  static async getCollectionList(
    collection: string,
    locale: Locale,
    page: number = 1,
    limit: number = 18,
  ): Promise<CollectionListResult> {
    const tableName = this.getTableName(collection)
    const offset = (page - 1) * limit

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${tableName}
      WHERE _status = 'published'
    `
    const countResult = await db.query(countQuery)
    const totalDocs = parseInt(countResult.rows[0].total)

    // Get items with pagination
    const baseQuery = this.buildCollectionQuery(collection, locale)
    const itemsQuery = baseQuery + ` LIMIT $2 OFFSET $3`

    try {
      const result = await db.query(itemsQuery, [locale, limit, offset])
      const items = result.rows.map(
        (row: Record<string, unknown>) =>
          this.mapSnakeToCamel(row) as unknown as FlatCollectionItem,
      )

      // Handle missing localized fields
      items.forEach((item: FlatCollectionItem) => {
        if (!item.titleEn) item.titleEn = item.title
        if (!item.slugEn) item.slugEn = item.slug
        if (!item.descriptionEn) item.descriptionEn = item.description
      })

      const totalPages = Math.ceil(totalDocs / limit)
      const hasNextPage = page < totalPages
      const hasPrevPage = page > 1

      return {
        items,
        pagination: {
          page,
          totalPages,
          totalDocs,
          hasNextPage,
          hasPrevPage,
        },
      }
    } catch (error) {
      console.error('Database query failed, falling back to Payload API:', error)
      throw error
    }
  }

  /**
   * Fetch a single collection item by slug
   */
  static async getCollectionItem(
    collection: string,
    slug: string,
    locale: Locale,
  ): Promise<CollectionSingleResult> {
    const tableName = this.getTableName(collection)
    const localesTableName = this.getLocalesTableName(collection)
    const mediaTableName = this.getMediaTableName(collection)
    const titleField = this.getTitleField(collection)

    // Collections that don't have description in locales table
    const collectionsWithoutDescription = ['aromas']
    const hasDescription = !collectionsWithoutDescription.includes(collection)

    // ALL collections have locales tables - this is the Payload CMS pattern
    const hasLocalesTable = true

    let query: string
    let params: unknown[]

    if (hasLocalesTable) {
      // Build select fields array
      const selectFields = [
        '  c.id,',
        `  ${titleField.table}.${titleField.field} as "title",`,
        ...(hasDescription ? ['  cl.description as "description",'] : []),
        '  c.updated_at as "updatedAt",',
        '  c.created_at as "createdAt",',
        '  c._status,',
        '  cl.slug as "slug",',
        '  m.url as "mediaUrl"',
      ]

      query = [
        'SELECT',
        ...selectFields,
        'FROM ' + tableName + ' c',
        'LEFT JOIN ' + localesTableName + ' cl ON c.id = cl._parent_id AND cl._locale = $1',
        'LEFT JOIN ' + mediaTableName + " mr ON c.id = mr.parent_id AND mr.path = 'media'",
        'LEFT JOIN media m ON mr.media_id = m.id',
        "WHERE c._status = 'published' AND cl.slug = $2",
        'LIMIT 1',
      ].join('\n')

      params = [locale, slug]
    } else {
      query = [
        'SELECT',
        '  c.id,',
        '  c.title,',
        '  c.description,',
        '  c.updated_at as "updatedAt",',
        '  c.created_at as "createdAt",',
        '  c._status,',
        '  c.slug,',
        '  m.url as "mediaUrl"',
        'FROM ' + tableName + ' c',
        'LEFT JOIN ' + mediaTableName + " mr ON c.id = mr.parent_id AND mr.path = 'media'",
        'LEFT JOIN media m ON mr.media_id = m.id',
        "WHERE c._status = 'published' AND c.slug = $1",
        'LIMIT 1',
      ].join('\n')

      params = [slug]
    }

    try {
      const result = await db.query(query, params)
      const mapped = result.rows[0]
        ? (this.mapSnakeToCamel(result.rows[0]) as unknown as FlatCollectionItem)
        : null
      return { item: mapped }
    } catch (error) {
      console.error('Database query failed, falling back to Payload API:', error)
      throw error
    }
  }

  /**
   * Search collection items by title
   */
  static async searchCollectionItems(
    collection: string,
    searchTerm: string,
    locale: Locale,
    limit: number = 10,
  ): Promise<FlatCollectionItem[]> {
    const tableName = this.getTableName(collection)
    const localesTableName = this.getLocalesTableName(collection)
    const mediaTableName = this.getMediaTableName(collection)
    const titleField = this.getTitleField(collection)

    // Collections that don't have description in locales table
    const collectionsWithoutDescription = ['aromas']
    const hasDescription = !collectionsWithoutDescription.includes(collection)

    // ALL collections have locales tables - this is the Payload CMS pattern
    const hasLocalesTable = true

    let query: string
    let params: unknown[]

    if (hasLocalesTable) {
      // Build select fields array
      const selectFields = [
        '  c.id,',
        `  ${titleField.table}.${titleField.field} as "title",`,
        ...(hasDescription ? ['  cl.description as "description",'] : []),
        '  c.updated_at as "updatedAt",',
        '  c.created_at as "createdAt",',
        '  c._status,',
        '  cl.slug as "slug",',
        '  m.url as "mediaUrl"',
      ]

      query = [
        'SELECT',
        ...selectFields,
        'FROM ' + tableName + ' c',
        'LEFT JOIN ' + localesTableName + ' cl ON c.id = cl._parent_id AND cl._locale = $1',
        'LEFT JOIN ' + mediaTableName + " mr ON c.id = mr.parent_id AND mr.path = 'media'",
        'LEFT JOIN media m ON mr.media_id = m.id',
        "WHERE c._status = 'published' AND " +
          titleField.table +
          '.' +
          titleField.field +
          ' ILIKE $2',
        'ORDER BY ' + titleField.table + '.' + titleField.field,
        'LIMIT $3',
      ].join('\n')

      params = [locale, `%${searchTerm}%`, limit]
    } else {
      query = [
        'SELECT',
        '  c.id,',
        '  c.title,',
        '  c.description,',
        '  c.updated_at as "updatedAt",',
        '  c.created_at as "createdAt",',
        '  c._status,',
        '  c.slug,',
        '  m.url as "mediaUrl"',
        'FROM ' + tableName + ' c',
        'LEFT JOIN ' + mediaTableName + " mr ON c.id = mr.parent_id AND mr.path = 'media'",
        'LEFT JOIN media m ON mr.media_id = m.id',
        "WHERE c._status = 'published' AND c.title ILIKE $1",
        'ORDER BY c.title',
        'LIMIT $2',
      ].join('\n')

      params = [`%${searchTerm}%`, limit]
    }

    try {
      const result = await db.query(query, params)
      const items = result.rows.map(
        (row: Record<string, unknown>) =>
          this.mapSnakeToCamel(row) as unknown as FlatCollectionItem,
      )

      // Handle missing localized fields
      items.forEach((item: FlatCollectionItem) => {
        if (!item.titleEn) item.titleEn = item.title
        if (!item.slugEn) item.slugEn = item.slug
        if (!item.descriptionEn) item.descriptionEn = item.description
      })

      return items
    } catch (error) {
      console.error('Database query failed, falling back to Payload API:', error)
      throw error
    }
  }

  /**
   * Get related items for a collection item
   */
  static async getRelatedItems(
    collection: string,
    itemId: string,
    locale: Locale,
    limit: number = 6,
  ): Promise<FlatCollectionItem[]> {
    // This would need to be implemented based on the specific relationship logic
    // For now, return empty array
    return []
  }

  /**
   * Get all collections for filters (used in search/filter functionality)
   */
  static async getAllCollectionsForFilters(
    locale: Locale,
  ): Promise<Record<string, FlatCollectionItem[]>> {
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

    const result: Record<string, FlatCollectionItem[]> = {}

    for (const collection of collections) {
      try {
        const listResult = await this.getCollectionList(collection, locale, 1, 1000) // Get all items
        result[collection] = listResult.items
      } catch (error) {
        console.warn(`Failed to fetch ${collection} for filters:`, error)
        result[collection] = []
      }
    }

    return result
  }
}
