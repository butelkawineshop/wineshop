#!/usr/bin/env tsx

import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { logger } from '../src/lib/logger'
import { FlatWineVariantService } from '../src/services/FlatWineVariantService'
import { RelatedWinesService } from '../src/services/RelatedWinesService'
import type { FlatWineVariant } from '../src/payload-types'

interface RelatedVariant {
  type: 'winery' | 'relatedWinery' | 'region' | 'relatedRegion' | 'grapeVariety' | 'price' | 'style'
  score: number
  reason: string
  relatedVariant: number
}

/**
 * Populate related wines for all flat wine variants
 */
async function populateRelatedWines(): Promise<void> {
  const payload = await getPayload({
    config: payloadConfig,
  })

  const mockReq = { payload } as any
  const taskLogger = logger.child({ task: 'populateRelatedWines' })
  const flatWineVariantService = new FlatWineVariantService(mockReq)
  const relatedWinesService = new RelatedWinesService(mockReq, taskLogger)

  try {
    taskLogger.info('Starting related wines population')

    // Get all flat wine variants
    const { docs: flatVariants } = await payload.find({
      collection: 'flat-wine-variants',
      where: {
        isPublished: { equals: true },
      },
      limit: 1000, // Process in batches
      depth: 1,
    })

    taskLogger.info(`Found ${flatVariants.length} flat wine variants to process`)

    let processedCount = 0
    let errorCount = 0

    for (const flatVariant of flatVariants as FlatWineVariant[]) {
      try {
        taskLogger.debug(`Processing variant ${flatVariant.id}`)

        // Find related wines using the service
        const relatedVariants = await relatedWinesService.findRelatedWinesIntelligently(flatVariant)

        // Update related wines collection using the service
        await relatedWinesService.updateRelatedWinesCollection(flatVariant.id, relatedVariants)

        processedCount++

        if (processedCount % 100 === 0) {
          taskLogger.info(`Processed ${processedCount}/${flatVariants.length} variants`)
        }
      } catch (error) {
        errorCount++
        taskLogger.error(`Error processing variant ${flatVariant.id}`, error as Error)
      }
    }

    taskLogger.info(`Completed related wines population`, {
      total: flatVariants.length,
      processed: processedCount,
      errors: errorCount,
    })
  } catch (error) {
    taskLogger.error('Error in populateRelatedWines', error as Error)
    throw error
  } finally {
    await payload.destroy()
  }
}

// Run the script
populateRelatedWines()
  .then(() => {
    console.log('✅ Related wines population completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Related wines population failed:', error)
    process.exit(1)
  })
