import type { CollectionAfterChangeHook } from 'payload'
import { createLogger } from '@/lib/logger'

export const queueRelatedWinesUpdate: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc: _previousDoc,
}) => {
  const logger = createLogger(req, {
    task: 'queueRelatedWinesUpdate',
    operation,
    collection: 'flat-wine-variants',
    id: doc.id,
  })

  logger.info('Hook triggered for related wines update')

  try {
    // Only queue if this is a flat wine variant that was created or updated
    if (operation === 'create' || operation === 'update') {
      // Queue the related wines update as part of the existing sync process
      // This will be handled by the existing syncFlatWineVariant task
      logger.info('Related wines will be updated as part of sync process', { variantId: doc.id })
    }
  } catch (error) {
    logger.error('Failed to queue related wines update', error as Error)
    // Don't throw - this is a background optimization
  }
}
