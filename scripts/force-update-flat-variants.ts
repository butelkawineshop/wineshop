import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { createLogger } from '../src/lib/logger'
import { FlatWineVariantService } from '../src/services/FlatWineVariantService'
import { RelatedWinesService } from '../src/services/RelatedWinesService'
import { SYNC_CONSTANTS } from '../src/constants/sync'
import type { WineVariant } from '../src/payload-types'

/**
 * Force update all flat wine variants using the existing services
 */
async function forceUpdateFlatVariants(): Promise<void> {
  const payload = await getPayload({
    config: payloadConfig,
  })

  const mockReq = { payload } as any
  const logger = createLogger(mockReq, { task: 'forceUpdateFlatVariants' })
  const flatWineVariantService = new FlatWineVariantService(mockReq)
  const relatedWinesService = new RelatedWinesService(mockReq, logger)

  try {
    logger.info('Starting force update of flat wine variants using services')

    // Get all wine variants with full depth
    const wineVariants = await payload.find({
      collection: 'wine-variants',
      limit: 1000,
      depth: SYNC_CONSTANTS.MAX_DEPTH,
      locale: SYNC_CONSTANTS.DEFAULT_LOCALE,
    })

    logger.info(`Found ${wineVariants.docs.length} wine variants to process`)

    let successCount = 0
    let errorCount = 0
    let skippedCount = 0

    // Process all variants using the services
    for (const wineVariant of wineVariants.docs as WineVariant[]) {
      try {
        logger.debug(`Processing wine variant ${wineVariant.id}`)

        // Use the service to sync the wine variant
        const syncResult = await flatWineVariantService.syncWineVariant(String(wineVariant.id))

        if (syncResult.success) {
          // Find the flat variant ID for related wines update
          const existingFlatVariants = await payload.find({
            collection: 'flat-wine-variants',
            where: {
              originalVariant: {
                equals: wineVariant.id,
              },
            },
            limit: 1,
          })

          if (existingFlatVariants.docs.length > 0) {
            const flatVariant = existingFlatVariants.docs[0] as any

            // Update related wines for this variant
            try {
              const relatedVariants =
                await relatedWinesService.findRelatedWinesIntelligently(flatVariant)
              await relatedWinesService.updateRelatedWinesCollection(
                flatVariant.id,
                relatedVariants,
              )
              logger.debug(`Related wines updated for variant ${wineVariant.id}`)
            } catch (error) {
              logger.warn(`Failed to update related wines for variant ${wineVariant.id}:`, error)
              // Don't fail the entire process for related wines errors
            }
          }

          successCount++
        } else {
          logger.warn(`Failed to sync variant ${wineVariant.id}: ${syncResult.message}`)
          errorCount++
        }

        if (successCount % 10 === 0) {
          logger.info(`Processed ${successCount} flat variants`)
        }
      } catch (error: any) {
        errorCount++
        logger.error(
          `Failed to process flat variant for ${wineVariant.id}:`,
          error && error.stack ? error.stack : error,
        )

        if (error.message && error.message.includes('Invalid wine data structure')) {
          skippedCount++
          logger.warn(
            `Skipping variant ${wineVariant.id} - invalid data structure: ${error.message}`,
          )
        }
      }
    }

    logger.info(
      `Force update complete! Successfully processed ${successCount} flat variants, ${errorCount} errors, ${skippedCount} skipped`,
    )

    // Check final count
    const finalFlatVariants = await payload.find({
      collection: 'flat-wine-variants',
      limit: 1000,
    })

    logger.info(`Final count: ${finalFlatVariants.docs.length} flat variants`)
  } catch (error: any) {
    logger.error('Failed to force update flat wine variants:', error)
    throw error
  } finally {
    await payload.destroy()
  }
}

// Run the script
if (require.main === module) {
  forceUpdateFlatVariants()
    .then(() => {
      console.log('✅ Force update of flat wine variants completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Force update of flat wine variants failed:', error)
      process.exit(1)
    })
}
