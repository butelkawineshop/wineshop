import { createLogger } from './logger'
import type { PayloadRequest } from 'payload'

const PAYLOAD_API_URL = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000'

/**
 * Response structure for collection queries
 */
export interface CollectionResponse<T = Record<string, unknown>> {
  docs: T[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Query parameters for collection operations
 */
export interface CollectionQueryParams {
  where?: Record<string, unknown>
  depth?: number
  page?: number
  limit?: number
  sort?: string
  locale?: string
  fields?: string[]
}

/**
 * Service class for interacting with Payload CMS API
 * Follows the layer architecture pattern for data access
 */
export class PayloadService {
  private readonly baseUrl: string
  private logger: ReturnType<typeof createLogger>

  constructor(req?: PayloadRequest) {
    this.baseUrl = PAYLOAD_API_URL
    this.logger = createLogger(req || ({} as PayloadRequest), {
      task: 'PayloadService',
      operation: 'api_call',
    })
  }

  /**
   * Fetch multiple documents from a collection
   * @param collection - Collection name
   * @param params - Query parameters
   * @returns Collection response with documents and pagination info
   */
  async find<T = Record<string, unknown>>(
    collection: string,
    params: CollectionQueryParams = {},
  ): Promise<CollectionResponse<T>> {
    const {
      where = {},
      depth = 0,
      page = 1,
      limit = 10,
      sort = '-createdAt',
      locale = 'all',
      fields = [],
    } = params

    try {
      const urlParams = new URLSearchParams({
        depth: depth.toString(),
        page: page.toString(),
        limit: limit.toString(),
        sort,
        locale,
      })

      if (Object.keys(where).length > 0) {
        urlParams.set('where', JSON.stringify(where))
      }

      if (fields.length > 0) {
        fields.forEach((field) => {
          urlParams.append('fields', field)
        })
      }

      const response = await fetch(`${this.baseUrl}/api/${collection}?${urlParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collection}: ${response.statusText}`)
      }

      const data = await response.json()
      this.logger.info(`Successfully fetched ${data.docs.length} documents from ${collection}`)

      return data as CollectionResponse<T>
    } catch (error) {
      this.logger.error(`Failed to fetch collection ${collection}`, error as Error, {
        collection,
        params: JSON.parse(JSON.stringify(params)),
      })
      throw error
    }
  }

  /**
   * Find a document by slug in a collection
   * @param collection - Collection name
   * @param slug - Document slug
   * @param params - Additional query parameters
   * @returns Document or null if not found
   */
  async findBySlug<T = Record<string, unknown>>(
    collection: string,
    slug: string,
    params: Omit<CollectionQueryParams, 'where'> = {},
  ): Promise<T | null> {
    const { depth = 0, locale = 'all' } = params

    try {
      const urlParams = new URLSearchParams({
        depth: depth.toString(),
        locale,
        where: JSON.stringify({
          slug: {
            equals: slug,
          },
        }),
      })

      const response = await fetch(`${this.baseUrl}/api/${collection}?${urlParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collection} by slug: ${response.statusText}`)
      }

      const data = await response.json()
      const document = data.docs[0] || null

      this.logger.info(`Successfully fetched document by slug from ${collection}`, {
        collection,
        slug,
        found: !!document,
      })

      return document as T | null
    } catch (error) {
      this.logger.error(`Failed to fetch document by slug from ${collection}`, error as Error, {
        collection,
        slug,
      })
      throw error
    }
  }

  /**
   * Find a single document in a collection
   * @param collection - Collection name
   * @param params - Query parameters including where clause
   * @returns Document or null if not found
   */
  async findOne<T = Record<string, unknown>>(
    collection: string,
    params: CollectionQueryParams = {},
  ): Promise<T | null> {
    const { where = {}, depth = 0, locale = 'all' } = params

    try {
      const urlParams = new URLSearchParams({
        depth: depth.toString(),
        locale,
        limit: '1',
        where: JSON.stringify(where),
      })

      const response = await fetch(`${this.baseUrl}/api/${collection}?${urlParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch ${collection}: ${response.statusText}`)
      }

      const data = await response.json()
      const document = data.docs[0] || null

      this.logger.info(`Successfully fetched single document from ${collection}`, {
        collection,
        found: !!document,
      })

      return document as T | null
    } catch (error) {
      this.logger.error(`Failed to fetch single document from ${collection}`, error as Error, {
        collection,
        params: JSON.parse(JSON.stringify(params)),
      })
      throw error
    }
  }
}

/**
 * Factory function to create a PayloadService instance
 * @param req - Optional PayloadRequest for logging context
 * @returns PayloadService instance
 */
export const createPayloadService = (req?: PayloadRequest): PayloadService => {
  return new PayloadService(req)
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use createPayloadService() instead
 */
export const getPayloadClient = () => {
  const service = new PayloadService()

  return {
    find: service.find.bind(service),
    findBySlug: service.findBySlug.bind(service),
    findOne: service.findOne.bind(service),
  }
}
