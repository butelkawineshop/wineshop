import type { TaskHandler } from 'payload'
import type { FlatWineVariant } from '@/payload-types'
import { createLogger } from '@/lib/logger'
import { handleError } from '@/lib/errors'
import { FlatWineVariantService } from '@/services/FlatWineVariantService'
import { RelatedWinesService } from '@/services/RelatedWinesService'
import { QUEUE_CONSTANTS } from '@/constants/queue'

// Main task handler
export const syncFlatWineVariant: TaskHandler<'syncFlatWineVariant'> = async ({ input, req }) => {
  const logger = createLogger(req, {
    task: 'syncFlatWineVariant',
    operation: 'sync',
    id: input.wineVariantId,
  })

  logger.info('Starting sync operation')

  try {
    logger.debug('Input to task:', input)

    const flatWineVariantService = new FlatWineVariantService(req)
    const relatedWinesService = new RelatedWinesService(req, logger)

    // Sync the wine variant to flat variant
    const syncResult = await flatWineVariantService.syncWineVariant(input.wineVariantId)

    if (syncResult.success) {
      // Find the flat variant ID for related wines update
      const existingFlatVariants = await req.payload.find({
        collection: QUEUE_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS,
        where: {
          originalVariant: {
            equals: input.wineVariantId,
          },
        },
        limit: 1,
      })

      if (existingFlatVariants.docs.length > 0) {
        const flatVariant = existingFlatVariants.docs[0] as FlatWineVariant

        // Update related wines for this variant
        const relatedVariants = await relatedWinesService.findRelatedWinesIntelligently(flatVariant)
        await relatedWinesService.updateRelatedWinesCollection(flatVariant.id, relatedVariants)

        logger.info('Successfully synced flat wine variant and updated related wines')
        return {
          output: {
            success: true,
            message: 'Successfully synced flat wine variant and updated related wines',
          },
        }
      }
    }

    // Return syncResult wrapped in proper format
    return {
      output: {
        success: syncResult.success,
        message: syncResult.message,
      },
    }
  } catch (error) {
    return handleError(req, error, {
      task: 'syncFlatWineVariant',
      operation: 'sync',
      id: input.wineVariantId,
    })
  }
}
