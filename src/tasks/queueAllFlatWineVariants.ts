import type { PayloadRequest } from 'payload'
import { createLogger } from '../lib/logger'
import { handleError } from '../lib/errors'
import { QUEUE_CONSTANTS } from '@/constants/queue'

// Types
interface QueueResult {
  count: number
  message: string
}

interface TaskInput {
  wineVariantId: string
}

interface WineVariant {
  id: number
}

// Helper functions
async function fetchAllWineVariants(
  req: PayloadRequest,
  logger: ReturnType<typeof createLogger>,
): Promise<WineVariant[]> {
  const result = await req.payload.find({
    collection: QUEUE_CONSTANTS.COLLECTIONS.WINE_VARIANTS,
    limit: QUEUE_CONSTANTS.DEFAULTS.LIMIT,
    depth: QUEUE_CONSTANTS.DEFAULTS.DEPTH,
  })

  logger.debug('Found wine variants', { count: result.docs.length })
  return result.docs as WineVariant[]
}

async function queueWineVariant(
  req: PayloadRequest,
  wineVariant: WineVariant,
  logger: ReturnType<typeof createLogger>,
): Promise<void> {
  const taskInput: TaskInput = {
    wineVariantId: String(wineVariant.id),
  }

  await req.payload.jobs.queue({
    task: QUEUE_CONSTANTS.TASKS.SYNC_FLAT_WINE_VARIANT,
    input: taskInput,
  })

  logger.debug('Queued wine variant', { id: wineVariant.id })
}

// Main workflow handler
export const queueAllFlatWineVariants = async ({ req }: { req: PayloadRequest }) => {
  const logger = createLogger(req, {
    task: 'queueAllFlatWineVariants',
    operation: 'queue',
  })

  logger.info('Starting queue operation for all wine variants')

  try {
    // Fetch all wine variants
    const wineVariants = await fetchAllWineVariants(req, logger)

    if (wineVariants.length === 0) {
      logger.info('No wine variants found to queue')
      return {
        output: {
          success: true,
          message: 'No wine variants found to queue',
        },
      }
    }

    // Queue each wine variant
    for (const wineVariant of wineVariants) {
      await queueWineVariant(req, wineVariant, logger)
    }

    const result: QueueResult = {
      count: wineVariants.length,
      message: `Successfully queued ${wineVariants.length} wine variants for sync`,
    }

    logger.info('Successfully queued all wine variants', {
      count: result.count,
      message: result.message,
    })
    return {
      output: {
        success: true,
        ...result,
      },
    }
  } catch (error) {
    return handleError(req, error, {
      task: 'queueAllFlatWineVariants',
      operation: 'queue',
    })
  }
}
