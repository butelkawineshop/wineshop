import type { PayloadRequest } from 'payload'
import { createLogger } from '@/lib/logger'
import { handleError } from '@/lib/errors'
import { FlatCollectionService } from '@/services/FlatCollectionService'
import { FLAT_COLLECTIONS_CONSTANTS } from '@/constants/flatCollections'

// Types
interface SyncResult {
  success: boolean
  message: string
  collectionId: string
}

// Main task handler
export const syncFlatCollection = async ({
  input,
  req,
}: {
  input: { collectionId: string; collection: string }
  req: PayloadRequest
}): Promise<{ output: SyncResult }> => {
  const logger = createLogger(req, {
    task: FLAT_COLLECTIONS_CONSTANTS.LOGGING.TASK_NAMES.SYNC_FLAT_COLLECTION,
    operation: FLAT_COLLECTIONS_CONSTANTS.LOGGING.OPERATIONS.SYNC,
    id: input.collectionId,
    collection: input.collection,
  })

  logger.info('Starting flat collection sync operation')

  try {
    logger.debug('Input to task:', input)

    const flatCollectionService = new FlatCollectionService(req)

    // Sync the collection item to flat collection
    const syncResult = await flatCollectionService.syncCollection(
      input.collectionId,
      input.collection,
    )

    const result: SyncResult = {
      success: syncResult.success,
      message: syncResult.success
        ? FLAT_COLLECTIONS_CONSTANTS.SUCCESS_MESSAGES.SYNC_COMPLETED
        : syncResult.message,
      collectionId: input.collectionId,
    }

    if (syncResult.success) {
      logger.info('Successfully synced flat collection')
    } else {
      logger.warn('Failed to sync flat collection', { message: syncResult.message })
    }

    return {
      output: result,
    }
  } catch (error) {
    const errorResult = await handleError(req, error, {
      task: FLAT_COLLECTIONS_CONSTANTS.LOGGING.TASK_NAMES.SYNC_FLAT_COLLECTION,
      operation: FLAT_COLLECTIONS_CONSTANTS.LOGGING.OPERATIONS.SYNC,
      id: input.collectionId,
      collection: input.collection,
    })

    // Ensure the error result matches our SyncResult interface
    return {
      output: {
        success: false,
        message:
          errorResult.output.message || FLAT_COLLECTIONS_CONSTANTS.ERROR_MESSAGES.SYNC_FAILED,
        collectionId: input.collectionId,
      },
    }
  }
}
