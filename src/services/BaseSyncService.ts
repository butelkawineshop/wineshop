import type { PayloadRequest } from 'payload'
import type { LogContext } from '@/lib/logger'
import { createLogger } from '@/lib/logger'
import { ValidationError } from '@/lib/errors'

/**
 * Base interface for sync results
 */
export interface SyncResult {
  success: boolean
  message: string
  id?: string
}

/**
 * Base interface for queue results
 */
export interface QueueResult {
  totalQueued: number
  message: string
}

/**
 * Base interface for sync parameters
 */
export interface SyncParams {
  doc: { id: string | number }
  req: PayloadRequest
  operation: 'create' | 'update'
  previousDoc?: Record<string, unknown>
}

/**
 * Base sync service providing common functionality for all sync operations
 */
export abstract class BaseSyncService {
  protected req: PayloadRequest
  protected logger: ReturnType<typeof createLogger>

  constructor(req: PayloadRequest, taskName: string) {
    this.req = req
    this.logger = createLogger(req, {
      task: taskName,
      operation: 'sync',
    })
  }

  /**
   * Standard error handling for sync operations
   */
  protected handleSyncError(error: unknown, context: LogContext): SyncResult {
    this.logger.error('Sync operation failed', error as Error, context)

    if (error instanceof ValidationError) {
      return {
        success: false,
        message: `Validation error: ${error.message}`,
        id: context.id as string,
      }
    }

    return {
      success: false,
      message: `Sync failed: ${(error as Error).message}`,
      id: context.id as string,
    }
  }

  /**
   * Standard success result for sync operations
   */
  protected createSuccessResult(message: string, id?: string): SyncResult {
    return {
      success: true,
      message,
      id,
    }
  }

  /**
   * Standard error handling for queue operations
   */
  protected handleQueueError(error: unknown, context: LogContext): QueueResult {
    this.logger.error('Queue operation failed', error as Error, context)

    return {
      totalQueued: 0,
      message: `Queue failed: ${(error as Error).message}`,
    }
  }

  /**
   * Standard success result for queue operations
   */
  protected createQueueSuccessResult(totalQueued: number, message: string): QueueResult {
    return {
      totalQueued,
      message,
    }
  }

  /**
   * Generic method to find a document by ID across multiple collections
   */
  protected async findDocumentById(
    id: string,
    collections: Array<{ slug: string; type: string }>,
  ): Promise<{ item: Record<string, unknown> | null; collectionType: string | null }> {
    for (const { slug, type } of collections) {
      try {
        const item = await this.req.payload.findByID({
          collection: slug as never,
          id: id,
          depth: 3,
        })
        if (item) {
          return { item: item as Record<string, unknown>, collectionType: type }
        }
      } catch (_error) {
        // Item not found in this collection, continue to next
        continue
      }
    }

    return { item: null, collectionType: null }
  }

  /**
   * Generic method to get localized value from a field
   */
  protected getLocalizedValue(field: unknown, locale: string): string | undefined {
    if (!field || typeof field !== 'object') {
      return undefined
    }

    const localizedField = field as Record<string, unknown>
    return localizedField[locale] as string | undefined
  }

  /**
   * Generic method to transform relationship arrays
   */
  protected transformRelationships(relationships: unknown): Array<Record<string, unknown>> {
    if (!Array.isArray(relationships)) {
      return []
    }

    return relationships.map((rel) => ({
      id: rel.id || rel,
      title: this.getLocalizedValue(rel.title, 'sl') || '',
      titleEn: this.getLocalizedValue(rel.title, 'en') || '',
      slug: this.getLocalizedValue(rel.slug, 'sl') || '',
      slugEn: this.getLocalizedValue(rel.slug, 'en') || '',
      wineryCode: rel.wineryCode || '',
    }))
  }

  /**
   * Generic method to transform media arrays
   */
  protected transformMedia(media: unknown): Array<Record<string, unknown>> {
    if (!Array.isArray(media)) {
      return []
    }

    return media.map((item) => ({
      id: item.id || item,
      alt: item.alt || '',
      url: item.url || '',
      thumbnailURL: item.thumbnailURL || '',
    }))
  }

  /**
   * Generic method to upsert a document
   */
  protected async upsertDocument(
    collection: string,
    data: Record<string, unknown>,
    whereClause: Record<string, unknown>,
  ): Promise<void> {
    // Check if document already exists
    const existingRecords = await this.req.payload.find({
      collection: collection as never,
      where: whereClause as never,
      limit: 1,
    })

    if (existingRecords.docs.length > 0) {
      // Update existing record
      const existingRecord = existingRecords.docs[0] as Record<string, unknown>
      await this.req.payload.update({
        collection: collection as never,
        id: existingRecord.id as string,
        data: data as never,
      })
    } else {
      // Create new record
      await this.req.payload.create({
        collection: collection as never,
        data: data as never,
      })
    }
  }

  /**
   * Generic method to delete a document if it exists
   */
  protected async deleteDocumentIfExists(collection: string, id: string): Promise<void> {
    try {
      await this.req.payload.delete({
        collection: collection as never,
        id,
      })
      this.logger.info('Deleted existing document', { collection, id })
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        (error as { name: string }).name === 'NotFound'
      ) {
        this.logger.info('Document not found for deletion', { collection, id })
      } else {
        this.logger.warn('Error deleting document', { collection, id, error: String(error) })
      }
    }
  }

  /**
   * Abstract method that must be implemented by subclasses
   */
  abstract sync(id: string): Promise<SyncResult>
}
