#!/usr/bin/env tsx

/**
 * Force update all flat collections
 *
 * This script will:
 * 1. Get all published items from the 9 wine collections
 * 2. For each item, either update existing flat collection or create new one
 * 3. Optionally clean up orphaned flat collections (items that no longer exist)
 *
 * Usage:
 * npm run force-update-flat-collections
 * or
 * tsx scripts/force-update-flat-collections.ts
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { logger } from '../src/lib/logger'
import { FLAT_COLLECTIONS_CONSTANTS } from '../src/constants/flatCollections'
import { FlatCollectionService } from '../src/services/FlatCollectionService'

const taskLogger = logger.child({
  task: FLAT_COLLECTIONS_CONSTANTS.LOGGING.TASK_NAMES.FORCE_UPDATE_FLAT_COLLECTIONS,
})

async function forceUpdateFlatCollections(): Promise<void> {
  const payload = await getPayload({
    config: payloadConfig,
  })

  // Create a mock PayloadRequest for the service
  const mockRequest = {
    payload,
    context: {} as any,
    i18n: {} as any,
    payloadAPI: 'REST' as const,
    user: null,
    locale: null,
    fallbackLocale: undefined,
    t: (key: string) => key,
    payloadDataLoader: {} as any,
    query: {} as any,
  } as any

  const flatCollectionService = new FlatCollectionService(mockRequest)

  try {
    taskLogger.info('Starting force update of all flat collections')

    // Step 1: Get all existing flat collections for reference
    const existingFlatCollections = await payload.find({
      collection: FLAT_COLLECTIONS_CONSTANTS.COLLECTIONS.FLAT_COLLECTIONS,
      limit: FLAT_COLLECTIONS_CONSTANTS.DATABASE.DEFAULT_LIMIT,
    })

    const existingFlatCollectionsMap = new Map(
      existingFlatCollections.docs.map((doc) => [`${doc.collectionType}-${doc.originalID}`, doc]),
    )

    taskLogger.info(`Found ${existingFlatCollections.docs.length} existing flat collections`)

    // Step 2: Process all published items from source collections
    const collections = Object.values(FLAT_COLLECTIONS_CONSTANTS.COLLECTIONS).filter(
      (collection) => collection !== FLAT_COLLECTIONS_CONSTANTS.COLLECTIONS.FLAT_COLLECTIONS,
    )

    let totalProcessed = 0
    let totalCreated = 0
    let totalUpdated = 0
    let totalErrors = 0

    for (const collection of collections) {
      taskLogger.info(`Processing collection: ${collection}`)

      try {
        // Get all published items from the collection
        const items = await payload.find({
          collection: collection as any,
          where: {
            _status: {
              equals: FLAT_COLLECTIONS_CONSTANTS.STATUS.PUBLISHED,
            },
          },
          limit: FLAT_COLLECTIONS_CONSTANTS.DATABASE.DEFAULT_LIMIT,
        })

        taskLogger.info(`Found ${items.docs.length} published items in ${collection}`)

        // Process each item
        for (const item of items.docs) {
          try {
            const key = `${collection}-${item.id}`
            const existingFlatCollection = existingFlatCollectionsMap.get(key)

            if (existingFlatCollection) {
              // Update existing flat collection
              await flatCollectionService.syncCollection(String(item.id), collection)
              totalUpdated++
              taskLogger.debug(`Updated flat collection for ${collection} ${item.id}`)
            } else {
              // Create new flat collection
              await flatCollectionService.syncCollection(String(item.id), collection)
              totalCreated++
              taskLogger.debug(`Created flat collection for ${collection} ${item.id}`)
            }

            totalProcessed++
          } catch (error) {
            totalErrors++
            taskLogger.error(`Failed to process ${collection} ${item.id}`, error as Error)
            // Continue with other items even if one fails
          }
        }

        taskLogger.info(`Processed ${items.docs.length} items from ${collection}`)
      } catch (error) {
        taskLogger.error(`Failed to process collection ${collection}`, error as Error)
        // Continue with other collections even if one fails
      }
    }

    // Step 3: Optional - Clean up orphaned flat collections
    const processedKeys = new Set()
    for (const collection of collections) {
      try {
        const items = await payload.find({
          collection: collection as any,
          where: {
            _status: {
              equals: FLAT_COLLECTIONS_CONSTANTS.STATUS.PUBLISHED,
            },
          },
          limit: FLAT_COLLECTIONS_CONSTANTS.DATABASE.DEFAULT_LIMIT,
        })

        for (const item of items.docs) {
          processedKeys.add(`${collection}-${item.id}`)
        }
      } catch (error) {
        taskLogger.error(`Failed to get items for cleanup from ${collection}`, error as Error)
      }
    }

    let totalDeleted = 0
    for (const [key, flatCollection] of existingFlatCollectionsMap) {
      if (!processedKeys.has(key)) {
        try {
          await payload.delete({
            collection: FLAT_COLLECTIONS_CONSTANTS.COLLECTIONS.FLAT_COLLECTIONS,
            id: flatCollection.id,
          })
          totalDeleted++
          taskLogger.debug(`Deleted orphaned flat collection: ${key}`)
        } catch (error) {
          taskLogger.error(`Failed to delete orphaned flat collection ${key}`, error as Error)
        }
      }
    }

    taskLogger.info('Force update completed successfully')
    taskLogger.info(`Summary:`)
    taskLogger.info(`  - Total processed: ${totalProcessed}`)
    taskLogger.info(`  - Created: ${totalCreated}`)
    taskLogger.info(`  - Updated: ${totalUpdated}`)
    taskLogger.info(`  - Deleted (orphaned): ${totalDeleted}`)
    taskLogger.info(`  - Errors: ${totalErrors}`)
  } catch (error) {
    taskLogger.error('Failed to force update flat collections', error as Error)
    throw error
  } finally {
    await payload.destroy()
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  forceUpdateFlatCollections()
    .then(() => {
      console.log('✅ Force update of flat collections completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Force update of flat collections failed:', error)
      process.exit(1)
    })
}

export { forceUpdateFlatCollections }
