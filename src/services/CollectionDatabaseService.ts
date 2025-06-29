import { db } from '../lib/db'
import type { Locale } from '@/constants/routes'
import { mapSnakeToCamel } from '@/utils/dataTransformers'
import { DATABASE_CONSTANTS } from '@/constants/database'
import { logger } from '@/lib/logger'

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
    const tableMap = DATABASE_CONSTANTS.TABLE_NAMES
    return tableMap[collection as keyof typeof tableMap] || collection
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
    const mainTableTitleCollections = DATABASE_CONSTANTS.MAIN_TABLE_TITLE_COLLECTIONS

    if (
      mainTableTitleCollections.includes(collection as (typeof mainTableTitleCollections)[number])
    ) {
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
    return mapSnakeToCamel(obj)
  }

  /**
   * Build media base URL extraction logic
   */
  private static buildMediaBaseUrlExtraction(): string {
    const variants = DATABASE_CONSTANTS.MEDIA_VARIANTS
    return [
      'CASE WHEN m.url IS NOT NULL THEN ',
      '  CASE ',
      `    WHEN m.url LIKE '%/${variants.WINECARDS}' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 10) `,
      `    WHEN m.url LIKE '%/${variants.THUMBNAIL}' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 11) `,
      `    WHEN m.url LIKE '%/${variants.FEATURE}' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 8) `,
      `    WHEN m.url LIKE '%/${variants.HERO}' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 5) `,
      `    WHEN m.url LIKE '%/${variants.SQUARE}' THEN SUBSTRING(m.url, 1, LENGTH(m.url) - 7) `,
      '    ELSE m.url ',
      '  END ',
      'ELSE NULL END as "mediaBaseUrl"',
    ].join('\n')
  }

  /**
   * Build select fields for collection query
   */
  private static buildSelectFields(
    collection: string,
    titleField: { table: string; field: string },
    hasDescription: boolean,
  ): string[] {
    const fields = [
      '  c.id,',
      `  ${titleField.table}.${titleField.field} as "title",`,
      ...(hasDescription ? ['  cl.description as "description",'] : []),
      '  c.updated_at as "updatedAt",',
      '  c.created_at as "createdAt",',
      '  c._status,',
      '  cl.slug as "slug",',
      '  m.url as "mediaUrl",',
      this.buildMediaBaseUrlExtraction(),
    ]
    return fields
  }

  /**
   * Build the base query for collection items with media and locales
   */
  private static buildCollectionQuery(collection: string, _locale: Locale): string {
    const tableName = this.getTableName(collection)
    const localesTableName = this.getLocalesTableName(collection)
    const mediaTableName = this.getMediaTableName(collection)
    const titleField = this.getTitleField(collection)

    const collectionsWithoutDescription = DATABASE_CONSTANTS.COLLECTIONS_WITHOUT_DESCRIPTION
    const hasDescription = !collectionsWithoutDescription.includes(
      collection as (typeof collectionsWithoutDescription)[number],
    )

    // ALL collections have locales tables - this is the Payload CMS pattern
    const hasLocalesTable = true

    if (hasLocalesTable) {
      const selectFields = this.buildSelectFields(collection, titleField, hasDescription)

      const query = [
        'SELECT',
        ...selectFields,
        'FROM ' + tableName + ' c',
        'LEFT JOIN ' + localesTableName + ' cl ON c.id = cl._parent_id AND cl._locale = $1',
        'LEFT JOIN ' + mediaTableName + " mr ON c.id = mr.parent_id AND mr.path = 'media'",
        'LEFT JOIN media m ON mr.media_id = m.id',
        `WHERE c._status = '${DATABASE_CONSTANTS.STATUS.PUBLISHED}'`,
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
        this.buildMediaBaseUrlExtraction(),
      ]

      const query = [
        'SELECT',
        ...selectFields,
        'FROM ' + tableName + ' c',
        'LEFT JOIN ' + mediaTableName + " mr ON c.id = mr.parent_id AND mr.path = 'media'",
        'LEFT JOIN media m ON mr.media_id = m.id',
        `WHERE c._status = '${DATABASE_CONSTANTS.STATUS.PUBLISHED}'`,
        'ORDER BY c.title',
      ].join('\n')

      return query
    }
  }

  /**
   * Handle missing localized fields in collection items
   */
  private static handleMissingLocalizedFields(items: FlatCollectionItem[]): void {
    items.forEach((item: FlatCollectionItem) => {
      if (!item.titleEn) item.titleEn = item.title
      if (!item.slugEn) item.slugEn = item.slug
      if (!item.descriptionEn) item.descriptionEn = item.description
    })
  }

  /**
   * Execute database query with error handling
   */
  private static async executeQuery(
    query: string,
    params: unknown[],
    context: string,
  ): Promise<{ rows: Array<Record<string, unknown>> }> {
    try {
      const result = await db.query(query, params)
      return result
    } catch (error) {
      logger.error(
        { error: String(error), context, query: query.substring(0, 100) },
        'Database query failed',
      )
      throw new Error(`Database query failed for ${context}: ${String(error)}`)
    }
  }

  /**
   * Fetch a list of collection items with pagination
   */
  static async getCollectionList(
    collection: string,
    locale: Locale,
    page: number = DATABASE_CONSTANTS.DEFAULT_PAGE,
    limit: number = DATABASE_CONSTANTS.DEFAULT_LIMIT,
  ): Promise<CollectionListResult> {
    const tableName = this.getTableName(collection)
    const offset = (page - 1) * limit

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM ${tableName}
      WHERE _status = '${DATABASE_CONSTANTS.STATUS.PUBLISHED}'
    `
    const countResult = await this.executeQuery(countQuery, [], `count ${collection}`)
    const totalDocs = parseInt(String(countResult.rows[0].total))

    // Get items with pagination
    const baseQuery = this.buildCollectionQuery(collection, locale)
    const itemsQuery = baseQuery + ` LIMIT $2 OFFSET $3`

    const result = await this.executeQuery(
      itemsQuery,
      [locale, limit, offset],
      `list ${collection}`,
    )
    const items = result.rows.map(
      (row: Record<string, unknown>) => this.mapSnakeToCamel(row) as unknown as FlatCollectionItem,
    )

    // Handle missing localized fields
    this.handleMissingLocalizedFields(items)

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

    const collectionsWithoutDescription = DATABASE_CONSTANTS.COLLECTIONS_WITHOUT_DESCRIPTION
    const hasDescription = !collectionsWithoutDescription.includes(
      collection as (typeof collectionsWithoutDescription)[number],
    )

    // ALL collections have locales tables - this is the Payload CMS pattern
    const hasLocalesTable = true

    let query: string
    let params: unknown[]

    if (hasLocalesTable) {
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
        `WHERE c._status = '${DATABASE_CONSTANTS.STATUS.PUBLISHED}' AND cl.slug = $2`,
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
        `WHERE c._status = '${DATABASE_CONSTANTS.STATUS.PUBLISHED}' AND c.slug = $1`,
        'LIMIT 1',
      ].join('\n')

      params = [slug]
    }

    const result = await this.executeQuery(query, params, `single ${collection}`)
    const mapped = result.rows[0]
      ? (this.mapSnakeToCamel(result.rows[0]) as unknown as FlatCollectionItem)
      : null
    return { item: mapped }
  }

  /**
   * Search collection items by title
   */
  static async searchCollectionItems(
    collection: string,
    searchTerm: string,
    locale: Locale,
    _limit: number = 10,
  ): Promise<FlatCollectionItem[]> {
    const tableName = this.getTableName(collection)
    const localesTableName = this.getLocalesTableName(collection)
    const mediaTableName = this.getMediaTableName(collection)
    const titleField = this.getTitleField(collection)

    const collectionsWithoutDescription = DATABASE_CONSTANTS.COLLECTIONS_WITHOUT_DESCRIPTION
    const hasDescription = !collectionsWithoutDescription.includes(
      collection as (typeof collectionsWithoutDescription)[number],
    )

    // ALL collections have locales tables - this is the Payload CMS pattern
    const hasLocalesTable = true

    let query: string
    let params: unknown[]

    if (hasLocalesTable) {
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
        `WHERE c._status = '${DATABASE_CONSTANTS.STATUS.PUBLISHED}' AND ` +
          titleField.table +
          '.' +
          titleField.field +
          ' ILIKE $2',
        'ORDER BY ' + titleField.table + '.' + titleField.field,
        'LIMIT $3',
      ].join('\n')

      params = [locale, `%${searchTerm}%`, _limit]
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
        `WHERE c._status = '${DATABASE_CONSTANTS.STATUS.PUBLISHED}' AND c.title ILIKE $1`,
        'ORDER BY c.title',
        'LIMIT $2',
      ].join('\n')

      params = [`%${searchTerm}%`, _limit]
    }

    const result = await this.executeQuery(query, params, `search ${collection}`)
    const items = result.rows.map(
      (row: Record<string, unknown>) => this.mapSnakeToCamel(row) as unknown as FlatCollectionItem,
    )

    // Handle missing localized fields
    this.handleMissingLocalizedFields(items)

    return items
  }

  /**
   * Get related items for a collection item
   */
  static async getRelatedItems(
    collection: string,
    itemId: string,
    locale: Locale,
    _limit: number = 6,
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
      DATABASE_CONSTANTS.COLLECTIONS.AROMAS,
      DATABASE_CONSTANTS.COLLECTIONS.CLIMATES,
      DATABASE_CONSTANTS.COLLECTIONS.DISHES,
      DATABASE_CONSTANTS.COLLECTIONS.GRAPE_VARIETIES,
      DATABASE_CONSTANTS.COLLECTIONS.MOODS,
      DATABASE_CONSTANTS.COLLECTIONS.REGIONS,
      DATABASE_CONSTANTS.COLLECTIONS.STYLES,
      DATABASE_CONSTANTS.COLLECTIONS.TAGS,
      DATABASE_CONSTANTS.COLLECTIONS.WINE_COUNTRIES,
      DATABASE_CONSTANTS.COLLECTIONS.WINERIES,
    ]

    const result: Record<string, FlatCollectionItem[]> = {}

    for (const collection of collections) {
      try {
        const listResult = await this.getCollectionList(
          collection,
          locale,
          DATABASE_CONSTANTS.DEFAULT_PAGE,
          DATABASE_CONSTANTS.MAX_LIMIT,
        )
        result[collection] = listResult.items
      } catch (error) {
        logger.warn({ error, collection }, `Failed to fetch ${collection} for filters`)
        result[collection] = []
      }
    }

    return result
  }
}
