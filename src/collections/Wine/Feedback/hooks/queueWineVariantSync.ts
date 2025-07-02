import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { createLogger } from '@/lib/logger'

export const queueWineVariantSyncAfterFeedbackChange: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  const logger = createLogger(req, {
    task: 'queueWineVariantSyncAfterFeedbackChange',
    collection: 'wine-feedback',
    id: doc.id,
  })

  try {
    // Extract wine variant ID from the feedback document
    const wineVariantId = typeof doc.wine === 'object' ? doc.wine.id : doc.wine

    if (wineVariantId) {
      logger.info('Queueing sync for wine variant', { wineVariantId })
      await req.payload.jobs.queue({
        task: 'syncFlatWineVariant',
        input: {
          wineVariantId: String(wineVariantId),
        },
      })
    } else {
      logger.warn('No wine variant ID found in feedback document')
    }
  } catch (error) {
    logger.error('Failed to queue wine variant sync', error as Error)
    // Don't throw - we don't want to break the feedback creation
  }

  return doc
}

export const queueWineVariantSyncAfterFeedbackDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  const logger = createLogger(req, {
    task: 'queueWineVariantSyncAfterFeedbackDelete',
    collection: 'wine-feedback',
    id: doc.id,
  })

  try {
    // Extract wine variant ID from the feedback document
    const wineVariantId = typeof doc.wine === 'object' ? doc.wine.id : doc.wine

    if (wineVariantId) {
      logger.info('Queueing sync for wine variant after feedback deletion', { wineVariantId })
      await req.payload.jobs.queue({
        task: 'syncFlatWineVariant',
        input: {
          wineVariantId: String(wineVariantId),
        },
      })
    } else {
      logger.warn('No wine variant ID found in deleted feedback document')
    }
  } catch (error) {
    logger.error('Failed to queue wine variant sync after feedback deletion', error as Error)
    // Don't throw - we don't want to break the feedback deletion
  }
}
