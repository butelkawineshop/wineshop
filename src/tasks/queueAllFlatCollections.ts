import type { PayloadRequest } from 'payload'
import { createLogger } from '@/lib/logger'
import { handleError } from '@/lib/errors'
import { FLAT_COLLECTIONS_CONSTANTS } from '@/constants/flatCollections'

// Types
interface QueueResult {
  totalQueued: number
  message: string
}

// Main workflow handler
export const queueAllFlatCollections = async ({
  req,
}: {
  req: PayloadRequest
}): Promise<{ output: { success: boolean } & QueueResult }> => {
  const logger = createLogger(req, {
    task: FLAT_COLLECTIONS_CONSTANTS.LOGGING.TASK_NAMES.QUEUE_ALL_FLAT_COLLECTIONS,
    operation: FLAT_COLLECTIONS_CONSTANTS.LOGGING.OPERATIONS.QUEUE,
  })

  logger.info('Starting to queue all flat collections sync')

  try {
    const collections = Object.values(FLAT_COLLECTIONS_CONSTANTS.COLLECTIONS).filter(
      (collection) => collection !== FLAT_COLLECTIONS_CONSTANTS.COLLECTIONS.FLAT_COLLECTIONS,
    )

    let totalQueued = 0

    for (const collection of collections) {
      logger.info(`Processing collection: ${collection}`)

      try {
        // Get all published items from the collection
        const items = await req.payload.find({
          collection: collection as never,
          where: {
            _status: {
              equals: FLAT_COLLECTIONS_CONSTANTS.STATUS.PUBLISHED,
            },
          },
          limit: FLAT_COLLECTIONS_CONSTANTS.DATABASE.DEFAULT_LIMIT,
        })

        logger.info(`Found ${items.docs.length} items in ${collection}`)

        // Queue sync job for each item
        for (const item of items.docs) {
          const itemWithId = item as Record<string, unknown>
          await req.payload.jobs.queue({
            task: FLAT_COLLECTIONS_CONSTANTS.TASKS.SYNC_FLAT_COLLECTION as string,
            input: {
              collectionId: String(itemWithId.id),
              collection,
            },
          } as never)
          totalQueued++
        }

        logger.info(`Queued ${items.docs.length} items from ${collection}`)
      } catch (error) {
        logger.error(`Failed to process collection ${collection}`, error as Error)
        // Continue with other collections even if one fails
      }
    }

    const result: QueueResult = {
      totalQueued,
      message: FLAT_COLLECTIONS_CONSTANTS.SUCCESS_MESSAGES.QUEUE_COMPLETED.replace(
        '{count}',
        totalQueued.toString(),
      ),
    }

    logger.info('Successfully queued all flat collections', {
      totalQueued: result.totalQueued,
      message: result.message,
    })

    return {
      output: {
        success: true,
        ...result,
      },
    }
  } catch (error) {
    const errorResult = await handleError(req, error, {
      task: FLAT_COLLECTIONS_CONSTANTS.LOGGING.TASK_NAMES.QUEUE_ALL_FLAT_COLLECTIONS,
      operation: FLAT_COLLECTIONS_CONSTANTS.LOGGING.OPERATIONS.QUEUE,
    })

    // Ensure the error result matches our QueueResult interface
    return {
      output: {
        success: false,
        totalQueued: 0,
        message:
          errorResult.output.message || FLAT_COLLECTIONS_CONSTANTS.ERROR_MESSAGES.SYNC_FAILED,
      },
    }
  }
}
