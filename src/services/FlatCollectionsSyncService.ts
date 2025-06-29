import { createLogger } from '@/lib/logger'
import { ValidationError } from '@/lib/errors'
import type { PayloadRequest } from 'payload'
import { FLAT_COLLECTIONS_CONSTANTS } from '@/constants/flatCollections'

interface FlatCollectionSyncParams {
  doc: { id: string | number }
  req: PayloadRequest
  operation: 'create' | 'update'
  previousDoc?: DocumentData
  collection: string
}

interface DocumentData {
  id?: string | number
  title?: Record<string, unknown>
  slug?: Record<string, unknown>
  description?: Record<string, unknown>
  whyCool?: Record<string, unknown>
  typicalStyle?: Record<string, unknown>
  character?: Record<string, unknown>
  iconKey?: string
  wineryCode?: string
  priceRange?: string
  skin?: string
  climate?: string
  climateTemperature?: string
  category?: string
  colorGroup?: string
  adjective?: unknown
  flavour?: unknown
  country?: unknown
  climateData?: unknown
  statistics?: Record<string, unknown>
  climateConditions?: Record<string, unknown>
  social?: Record<string, unknown>
  synonyms?: unknown[]
  bestGrapes?: unknown[]
  bestRegions?: unknown[]
  legends?: unknown[]
  neighbours?: unknown[]
  relatedWineries?: unknown[]
  distinctiveAromas?: unknown[]
  blendingPartners?: unknown[]
  similarVarieties?: unknown[]
  tags?: unknown[]
  media?: unknown[]
  seo?: Record<string, unknown>
  _status?: string
}

export class FlatCollectionsSyncService {
  /**
   * Determines if a flat collection sync job should be queued
   */
  static async shouldQueueSync({
    doc,
    req,
    operation,
    previousDoc,
    collection,
  }: FlatCollectionSyncParams): Promise<boolean> {
    const logger = createLogger(req, {
      task: FLAT_COLLECTIONS_CONSTANTS.LOGGING.TASK_NAMES.FLAT_COLLECTIONS_SYNC_SERVICE,
      operation,
      collection,
      id: doc.id,
    })

    // Don't queue sync jobs for flat-collections collection itself
    if (collection === 'flat-collections') {
      logger.info('Skipping sync for flat-collections collection to prevent infinite loop')
      return false
    }

    // Always queue for create operations
    if (operation === 'create') {
      logger.info('Create operation detected, queueing job')
      return true
    }

    // For update operations, check for changes
    if (operation === 'update') {
      const hasChanges = await this.detectChanges({ doc, req, logger, previousDoc, collection })
      if (!hasChanges) {
        logger.info('No changes detected, skipping sync')
        return false
      }
      return true
    }

    return false
  }

  /**
   * Detects if there are meaningful changes in a collection update
   */
  private static async detectChanges({
    doc,
    req,
    logger,
    previousDoc,
    collection,
  }: {
    doc: { id: string | number }
    req: PayloadRequest
    logger: ReturnType<typeof createLogger>
    previousDoc?: DocumentData
    collection: string
  }): Promise<boolean> {
    const currentDoc = (await req.payload.findByID({
      collection: collection as never,
      id: doc.id,
      depth: FLAT_COLLECTIONS_CONSTANTS.DATABASE.MAX_DEPTH,
    })) as unknown as DocumentData | null

    if (!currentDoc) {
      throw new ValidationError('Current document not found', { id: doc.id })
    }

    // If we don't have previous document data, assume there are changes
    if (!previousDoc) {
      logger.info('No previous document data available, assuming changes exist')
      return true
    }

    // Simple approach: compare the entire documents using JSON.stringify
    // This is the same approach used in the working wine variant sync
    const hasChanges = JSON.stringify(previousDoc) !== JSON.stringify(currentDoc)

    logger.debug('Change detection results', {
      hasChanges,
      previousDocKeys: previousDoc ? Object.keys(previousDoc) : [],
      currentDocKeys: Object.keys(currentDoc),
      hasPreviousDoc: !!previousDoc,
    })

    return hasChanges
  }

  /**
   * Queues a flat collection sync job
   */
  static async queueSyncJob({
    doc,
    req,
    logger,
    collection,
  }: {
    doc: { id: string | number }
    req: PayloadRequest
    logger: ReturnType<typeof createLogger>
    collection: string
  }): Promise<void> {
    logger.info('Queueing job for flat collection', { id: doc.id, collection })
    await req.payload.jobs.queue({
      task: FLAT_COLLECTIONS_CONSTANTS.TASKS.SYNC_FLAT_COLLECTION as string,
      input: {
        collectionId: String(doc.id),
        collection,
      },
    } as never)
    logger.info('Successfully queued flat collection sync')
  }
}
