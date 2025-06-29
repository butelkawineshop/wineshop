#!/usr/bin/env tsx

import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { search } from '../src/typesense'
import { logger } from '../src/lib/logger'
import type { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections'

const WINE_VARIANTS_COLLECTION = 'flat-wine-variants'

const wineVariantsSchema: CollectionCreateSchema = {
  name: WINE_VARIANTS_COLLECTION,
  fields: [
    { name: 'id', type: 'string' },
    { name: 'wineTitle', type: 'string' },
    { name: 'wineryTitle', type: 'string' },
    { name: 'regionTitle', type: 'string' },
    { name: 'countryTitle', type: 'string' },
    { name: 'countryTitleEn', type: 'string' },
    { name: 'styleTitle', type: 'string' },
    { name: 'styleTitleEn', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'descriptionEn', type: 'string' },
    { name: 'tastingProfile', type: 'string' },
    { name: 'slug', type: 'string' },
    { name: 'vintage', type: 'string' },
    { name: 'size', type: 'string' },
    { name: 'price', type: 'float' },
    { name: 'isPublished', type: 'bool' },
    { name: 'primaryImageUrl', type: 'string' },
    { name: 'createdAt', type: 'int64' },
    { name: 'updatedAt', type: 'int64' },
  ],
  default_sorting_field: 'updatedAt',
}

const COLLECTION_SCHEMAS: CollectionCreateSchema[] = [
  wineVariantsSchema,
  {
    name: 'flat-collections',
    fields: [
      { name: 'id', type: 'string' },
      { name: 'title', type: 'string', sort: true },
      { name: 'titleEn', type: 'string' },
      { name: 'slug', type: 'string' },
      { name: 'slugEn', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'descriptionEn', type: 'string' },
      { name: 'collectionType', type: 'string' },
      { name: 'originalID', type: 'int32' },
      { name: 'originalSlug', type: 'string' },
      { name: 'isPublished', type: 'bool' },
      { name: 'syncedAt', type: 'int64' },
      { name: 'createdAt', type: 'int64' },
      { name: 'updatedAt', type: 'int64' },
    ],
    default_sorting_field: 'title',
  },
]

async function setupTypesense() {
  try {
    logger.info('Setting up Typesense...')
    const isHealthy = await search.healthCheck()
    if (!isHealthy) {
      logger.error('Typesense is not healthy. Please check if it is running.')
      process.exit(1)
    }
    logger.info('Typesense is healthy')
    for (const schema of COLLECTION_SCHEMAS) {
      try {
        await search.createCollection(schema)
        logger.info(`Created collection: ${schema.name}`)
      } catch (error: any) {
        if (error.message?.includes('already exists')) {
          logger.info(`Collection ${schema.name} already exists`)
        } else {
          throw error
        }
      }
    }
    logger.info('Typesense setup completed successfully')
  } catch (error) {
    logger.error({ err: error }, 'Failed to setup Typesense')
    process.exit(1)
  }
}

async function syncCollection(payload: any, collection: string, transform: (doc: any) => any) {
  const docs = await payload.find({ collection, limit: 1000 })
  logger.info(`Found ${docs.docs.length} docs to sync for ${collection}`)

  let created = 0
  let updated = 0
  let errors = 0

  for (const doc of docs.docs) {
    const document = transform(doc)
    try {
      // Try to update first (document exists)
      await search.updateDocument(collection, String(document.id), document)
      updated++
      logger.debug(`Updated ${collection} doc: ${doc.title || doc.id}`)
    } catch (updateError: any) {
      // If update fails with ObjectNotFound, try to create (document doesn't exist)
      if (updateError.name === 'ObjectNotFound') {
        try {
          await search.createDocument(collection, document)
          created++
          logger.debug(`Created ${collection} doc: ${doc.title || doc.id}`)
        } catch (createError: any) {
          errors++
          logger.error({ err: createError, docId: doc.id }, `Failed to create ${collection} doc`)
        }
      } else {
        // If it's not ObjectNotFound, it's a real error
        errors++
        logger.error({ err: updateError, docId: doc.id }, `Failed to update ${collection} doc`)
      }
    }
  }

  logger.info(
    `Sync completed for ${collection}: ${created} created, ${updated} updated, ${errors} errors`,
  )
}

async function syncWineData() {
  try {
    logger.info('Starting wine data sync...')
    const payload = await getPayload({ config: payloadConfig })

    // Sync flat wine variants
    await syncCollection(payload, 'flat-wine-variants', (variant) => ({
      id: String(variant.id),
      wineTitle: variant.wineTitle || '',
      wineryTitle: variant.wineryTitle || '',
      regionTitle: variant.regionTitle || '',
      countryTitle: variant.countryTitle || '',
      countryTitleEn: variant.countryTitleEn || '',
      styleTitle: variant.styleTitle || '',
      styleTitleEn: variant.styleTitleEn || '',
      description: variant.description || '',
      descriptionEn: variant.descriptionEn || '',
      tastingProfile: variant.tastingProfile || '',
      slug: variant.slug || '',
      vintage: variant.vintage || '',
      size: variant.size ? String(variant.size) : '',
      price: variant.price || 0,
      isPublished: variant.isPublished || false,
      primaryImageUrl: variant.primaryImageUrl || '',
      createdAt: new Date(variant.createdAt).getTime(),
      updatedAt: new Date(variant.updatedAt).getTime(),
    }))

    // Sync flat collections
    await syncCollection(payload, 'flat-collections', (doc) => ({
      id: String(doc.originalID), // Use originalID for flat collections
      title: doc.title || '',
      titleEn: doc.titleEn || '',
      description: doc.description || '',
      descriptionEn: doc.descriptionEn || '',
      slug: doc.slug || '',
      slugEn: doc.slugEn || '',
      collectionType: doc.collectionType || '',
      originalID: doc.originalID || 0,
      originalSlug: doc.originalSlug || '',
      isPublished: doc.isPublished || false,
      syncedAt: doc.syncedAt ? new Date(doc.syncedAt).getTime() : 0,
      createdAt: new Date(doc.createdAt).getTime(),
      updatedAt: new Date(doc.updatedAt).getTime(),
    }))

    logger.info('Wine data sync completed successfully')
  } catch (error) {
    logger.error({ err: error }, 'Failed to sync wine data')
    process.exit(1)
  }
}

async function main() {
  const command = process.argv[2]

  switch (command) {
    case 'setup':
      await setupTypesense()
      break
    case 'sync':
      await syncWineData()
      break
    case 'full':
      await setupTypesense()
      await syncWineData()
      break
    default:
      console.log('Usage: tsx scripts/setup-typesense.ts [setup|sync|full]')
      console.log('  setup: Create Typesense collections')
      console.log('  sync: Sync wine data from Payload CMS')
      console.log('  full: Run both setup and sync')
      process.exit(1)
  }

  process.exit(0)
}

main().catch((error) => {
  logger.error({ err: error }, 'Script failed')
  process.exit(1)
})
