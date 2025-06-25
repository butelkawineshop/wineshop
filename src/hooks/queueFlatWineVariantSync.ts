import type { CollectionAfterChangeHook } from 'payload'
import { createLogger } from '@/lib/logger'
import { WineVariantSyncService } from '@/services/WineVariantSyncService'

export const queueFlatWineVariantSync: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  const logger = createLogger(req, {
    task: 'queueFlatWineVariantSync',
    operation,
    collection: 'wine-variants',
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
    logger.error('Failed to queue flat wine variant job', error as Error)
    throw error // Re-throw to let Payload handle the error
  }
}
