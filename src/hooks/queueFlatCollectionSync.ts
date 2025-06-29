import type { CollectionAfterChangeHook } from 'payload'
import { createLogger } from '@/lib/logger'
import { FlatCollectionsSyncService } from '@/services/FlatCollectionsSyncService'
import { FLAT_COLLECTIONS_CONSTANTS } from '@/constants/flatCollections'

export const queueFlatCollectionSync: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
  collection,
}): Promise<typeof doc> => {
  const collectionName = collection?.slug || 'unknown'

  const logger = createLogger(req, {
    task: FLAT_COLLECTIONS_CONSTANTS.LOGGING.TASK_NAMES.QUEUE_FLAT_COLLECTION_SYNC,
    operation,
    collection: collectionName,
    id: doc.id,
  })

  logger.info('Hook triggered', {
    collectionName,
    operation,
    docId: doc.id,
    hasPreviousDoc: !!previousDoc,
  })

  try {
    const shouldQueue = await FlatCollectionsSyncService.shouldQueueSync({
      doc,
      req,
      operation,
      previousDoc,
      collection: collectionName,
    })

    if (shouldQueue) {
      await FlatCollectionsSyncService.queueSyncJob({
        doc,
        req,
        logger,
        collection: collectionName,
      })
    }
  } catch (error) {
    logger.error(FLAT_COLLECTIONS_CONSTANTS.ERROR_MESSAGES.SYNC_FAILED, error as Error)
    throw error // Re-throw to let Payload handle the error
  }

  return doc
}
