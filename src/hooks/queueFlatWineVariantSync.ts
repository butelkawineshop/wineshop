import type { CollectionAfterChangeHook } from 'payload'
import { createLogger } from '../lib/logger'
import { ValidationError } from '../lib/errors'
import type { Wine } from '../payload-types'

export const queueFlatWineVariantSync: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}) => {
  const logger = createLogger(req, {
    task: 'queueFlatWineVariantSync',
    operation,
    collection: 'wine-variants',
    id: doc.id,
  })

  logger.info('Hook triggered')

  try {
    // Always queue the job if it's a create operation
    if (operation === 'create') {
      logger.info('Create operation detected, queueing job')
      await req.payload.jobs.queue({
        task: 'syncFlatWineVariant',
        input: {
          wineVariantId: doc.id,
        },
      })
      logger.info('Successfully queued flat wine variant sync')
      return
    }

    // For update operations, check for changes
    if (operation === 'update') {
      // Get the current version of the document with all relationships
      const currentDoc = await req.payload.findByID({
        collection: 'wine-variants',
        id: doc.id,
        depth: 3,
      })
      logger.debug('Current document', {
        id: currentDoc?.id,
        title:
          typeof currentDoc?.wine === 'object' && 'title' in currentDoc.wine
            ? (currentDoc.wine as Wine).title
            : null,
        vintage: currentDoc?.vintage,
        status: currentDoc?._status,
      })

      if (!currentDoc) {
        throw new ValidationError('Current document not found', { id: doc.id })
      }

      // Get the previous version of the document to compare changes
      const previousDoc = await req.payload.findByID({
        collection: 'wine-variants',
        id: doc.id,
        depth: 3,
      })
      logger.debug('Previous document', {
        id: previousDoc?.id,
        title:
          typeof previousDoc?.wine === 'object' && 'title' in previousDoc.wine
            ? (previousDoc.wine as Wine).title
            : null,
        vintage: previousDoc?.vintage,
        status: previousDoc?._status,
      })

      if (!previousDoc) {
        throw new ValidationError('Previous document not found', { id: doc.id })
      }

      // Check if any related fields have changed by comparing the full objects
      const hasRelatedChanges =
        JSON.stringify(previousDoc?.wine) !== JSON.stringify(currentDoc?.wine) ||
        JSON.stringify(previousDoc?.aromas) !== JSON.stringify(currentDoc?.aromas) ||
        JSON.stringify(previousDoc?.tags) !== JSON.stringify(currentDoc?.tags) ||
        JSON.stringify(previousDoc?.moods) !== JSON.stringify(currentDoc?.moods) ||
        JSON.stringify(previousDoc?.grapeVarieties) !== JSON.stringify(currentDoc?.grapeVarieties)

      // Check if any wine variant fields have changed
      const hasVariantChanges =
        previousDoc?.vintage !== currentDoc?.vintage ||
        previousDoc?.size !== currentDoc?.size ||
        previousDoc?.sku !== currentDoc?.sku ||
        previousDoc?.price !== currentDoc?.price ||
        previousDoc?.stockOnHand !== currentDoc?.stockOnHand ||
        previousDoc?.canBackorder !== currentDoc?.canBackorder ||
        previousDoc?.maxBackorderQuantity !== currentDoc?.maxBackorderQuantity ||
        previousDoc?.servingTemp !== currentDoc?.servingTemp ||
        previousDoc?.decanting !== currentDoc?.decanting ||
        previousDoc?.tastingProfile !== currentDoc?.tastingProfile ||
        previousDoc?._status !== currentDoc?._status ||
        JSON.stringify(previousDoc?.media) !== JSON.stringify(currentDoc?.media)

      if (!hasRelatedChanges && !hasVariantChanges) {
        logger.info('No changes detected, skipping sync')
        return
      }

      // Log detailed change information
      const wineChanges =
        previousDoc?.wine &&
        typeof previousDoc.wine === 'object' &&
        typeof currentDoc?.wine === 'object'
          ? JSON.stringify(previousDoc.wine) !== JSON.stringify(currentDoc.wine)
          : false

      const wineryChanges =
        previousDoc?.wine &&
        typeof previousDoc.wine === 'object' &&
        'winery' in previousDoc.wine &&
        currentDoc?.wine &&
        typeof currentDoc.wine === 'object' &&
        'winery' in currentDoc.wine
          ? JSON.stringify(previousDoc.wine.winery) !== JSON.stringify(currentDoc.wine.winery)
          : false

      logger.debug('Changes detected', {
        hasRelatedChanges,
        hasVariantChanges,
        wineChanges,
        wineryChanges,
        previousWinery:
          typeof previousDoc?.wine === 'object' &&
          'winery' in previousDoc.wine &&
          typeof previousDoc.wine.winery === 'object' &&
          'title' in previousDoc.wine.winery
            ? previousDoc.wine.winery.title
            : null,
        currentWinery:
          typeof currentDoc?.wine === 'object' &&
          'winery' in currentDoc.wine &&
          typeof currentDoc.wine.winery === 'object' &&
          'title' in currentDoc.wine.winery
            ? currentDoc.wine.winery.title
            : null,
      })
    }

    logger.info('Queueing job for variant', { id: doc.id })
    await req.payload.jobs.queue({
      task: 'syncFlatWineVariant',
      input: {
        wineVariantId: doc.id,
      },
    })
    logger.info('Successfully queued flat wine variant sync')
  } catch (error) {
    logger.error('Failed to queue flat wine variant job', error as Error)
    throw error // Re-throw to let Payload handle the error
  }
}
