import type { CollectionAfterChangeHook } from 'payload'
import { createLogger } from '@/lib/logger'
import { WineVariantSyncService } from '@/services/WineVariantSyncService'
import { HOOK_CONSTANTS } from '@/constants/hooks'

export const queueFlatWineVariantSync: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}): Promise<typeof doc> => {
  const logger = createLogger(req, {
    task: 'queueFlatWineVariantSync',
    operation,
    collection: HOOK_CONSTANTS.COLLECTIONS.WINE_VARIANTS,
    id: doc.id,
  })

  logger.info('Hook triggered')

  try {
    const shouldQueue = await WineVariantSyncService.shouldQueueSync({
      doc,
      req,
      operation,
      previousDoc,
    })

    if (shouldQueue) {
      await WineVariantSyncService.queueSyncJob({ doc, req, logger })
    }
  } catch (error) {
    logger.error(HOOK_CONSTANTS.ERROR_MESSAGES.FLAT_WINE_VARIANT_SYNC_FAILED, error as Error)
    throw error // Re-throw to let Payload handle the error
  }

  return doc
}
