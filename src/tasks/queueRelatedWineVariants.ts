import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, PayloadRequest } from 'payload'
import { QUEUE_CONSTANTS, type LookupField, type CollectionName } from '@/constants/queue'

// Types
interface TaskInput {
  wineVariantId: string
}

interface WineVariantWithId {
  id: number
}

interface WineWithId {
  id: number
}

// Helper function to get lookup field from collection
function getLookupFieldFromCollection(collection: string): LookupField | null {
  return QUEUE_CONSTANTS.COLLECTION_MAPPINGS[collection as CollectionName] || null
}

// Helper functions
async function findWineVariantsByWines(
  req: PayloadRequest,
  wineIds: string[],
): Promise<WineVariantWithId[]> {
  const result = await req.payload.find({
    collection: QUEUE_CONSTANTS.COLLECTIONS.WINE_VARIANTS,
    where: {
      wine: {
        in: wineIds,
      },
    },
    depth: QUEUE_CONSTANTS.DEFAULTS.DEPTH,
  })

  return result.docs as WineVariantWithId[]
}

async function findWinesByWinery(
  req: PayloadRequest,
  wineryId: string | number,
): Promise<WineWithId[]> {
  const result = await req.payload.find({
    collection: QUEUE_CONSTANTS.COLLECTIONS.WINES,
    where: {
      winery: {
        equals: wineryId,
      },
    },
    depth: QUEUE_CONSTANTS.DEFAULTS.DEPTH,
  })

  return result.docs as WineWithId[]
}

async function findWineVariantsByRegion(
  req: PayloadRequest,
  regionId: string | number,
): Promise<WineVariantWithId[]> {
  const wines = await findWinesByRegion(req, regionId)
  const wineIds = wines.map((w: WineWithId) => String(w.id))

  if (wineIds.length === 0) {
    return []
  }

  return findWineVariantsByWines(req, wineIds)
}

async function findWinesByRegion(
  req: PayloadRequest,
  regionId: string | number,
): Promise<WineWithId[]> {
  const result = await req.payload.find({
    collection: QUEUE_CONSTANTS.COLLECTIONS.WINES,
    where: {
      region: {
        equals: regionId,
      },
    },
    depth: QUEUE_CONSTANTS.DEFAULTS.DEPTH,
  })

  return result.docs as WineWithId[]
}

async function findWineVariantsByCountry(
  req: PayloadRequest,
  countryId: string | number,
): Promise<WineVariantWithId[]> {
  const wines = await findWinesByCountry(req, countryId)
  const wineIds = wines.map((w: WineWithId) => String(w.id))

  if (wineIds.length === 0) {
    return []
  }

  return findWineVariantsByWines(req, wineIds)
}

async function findWinesByCountry(
  req: PayloadRequest,
  countryId: string | number,
): Promise<WineWithId[]> {
  const result = await req.payload.find({
    collection: QUEUE_CONSTANTS.COLLECTIONS.WINES,
    where: {
      'region.country': {
        equals: countryId,
      },
    },
    depth: QUEUE_CONSTANTS.DEFAULTS.DEPTH,
  })

  return result.docs as WineWithId[]
}

async function findWineVariantsByDirectField(
  req: PayloadRequest,
  field: string,
  docId: string | number,
): Promise<WineVariantWithId[]> {
  const result = await req.payload.find({
    collection: QUEUE_CONSTANTS.COLLECTIONS.WINE_VARIANTS,
    where: {
      [field]: {
        equals: docId,
      },
    },
    depth: QUEUE_CONSTANTS.DEFAULTS.DEPTH,
  })

  return result.docs as WineVariantWithId[]
}

async function findWineVariantsByGrapeVariety(
  req: PayloadRequest,
  grapeVarietyId: string | number,
): Promise<WineVariantWithId[]> {
  const result = await req.payload.find({
    collection: QUEUE_CONSTANTS.COLLECTIONS.WINE_VARIANTS,
    where: {
      'grapeVarieties.variety': {
        equals: grapeVarietyId,
      },
    },
    depth: QUEUE_CONSTANTS.DEFAULTS.DEPTH,
  })

  return result.docs as WineVariantWithId[]
}

async function queueWineVariantSyncJobs(
  req: PayloadRequest,
  variants: WineVariantWithId[],
): Promise<void> {
  await Promise.allSettled(
    variants.map((variant) =>
      req.payload.jobs.queue({
        task: QUEUE_CONSTANTS.TASKS.SYNC_FLAT_WINE_VARIANT,
        input: {
          wineVariantId: String(variant.id),
        } as TaskInput,
      }),
    ),
  )
}

async function handleWineLookup(req: PayloadRequest, docId: string | number): Promise<void> {
  const wineIds = [String(docId)]
  const variants = await findWineVariantsByWines(req, wineIds)

  if (variants.length === 0) {
    req.payload.logger?.info?.(`[queueRelatedWineVariants] No variants found for wine:${docId}`)
    return
  }

  await queueWineVariantSyncJobs(req, variants)
}

async function handleWineryLookup(req: PayloadRequest, docId: string | number): Promise<void> {
  const wines = await findWinesByWinery(req, docId)
  const wineIds = wines.map((w: WineWithId) => String(w.id))

  if (wineIds.length === 0) {
    req.payload.logger?.info?.(`[queueRelatedWineVariants] No wines found for winery:${docId}`)
    return
  }

  const variants = await findWineVariantsByWines(req, wineIds)

  if (variants.length === 0) {
    req.payload.logger?.info?.(`[queueRelatedWineVariants] No variants found for winery:${docId}`)
    return
  }

  await queueWineVariantSyncJobs(req, variants)
}

async function handleRegionLookup(req: PayloadRequest, docId: string | number): Promise<void> {
  const variants = await findWineVariantsByRegion(req, docId)

  if (variants.length === 0) {
    req.payload.logger?.info?.(`[queueRelatedWineVariants] No variants found for region:${docId}`)
    return
  }

  await queueWineVariantSyncJobs(req, variants)
}

async function handleCountryLookup(req: PayloadRequest, docId: string | number): Promise<void> {
  const variants = await findWineVariantsByCountry(req, docId)

  if (variants.length === 0) {
    req.payload.logger?.info?.(`[queueRelatedWineVariants] No variants found for country:${docId}`)
    return
  }

  await queueWineVariantSyncJobs(req, variants)
}

async function handleDirectFieldLookup(
  req: PayloadRequest,
  field: string,
  docId: string | number,
): Promise<void> {
  const variants = await findWineVariantsByDirectField(req, field, docId)

  if (variants.length === 0) {
    req.payload.logger?.info?.(`[queueRelatedWineVariants] No variants found for ${field}:${docId}`)
    return
  }

  await queueWineVariantSyncJobs(req, variants)
}

async function handleGrapeVarietyLookup(
  req: PayloadRequest,
  docId: string | number,
): Promise<void> {
  const variants = await findWineVariantsByGrapeVariety(req, docId)

  if (variants.length === 0) {
    req.payload.logger?.info?.(
      `[queueRelatedWineVariants] No variants found for grapeVariety:${docId}`,
    )
    return
  }

  await queueWineVariantSyncJobs(req, variants)
}

async function processLookupField(
  req: PayloadRequest,
  lookupField: LookupField,
  docId: string | number,
): Promise<void> {
  try {
    switch (lookupField) {
      case QUEUE_CONSTANTS.LOOKUP_FIELDS.WINE:
        await handleWineLookup(req, docId)
        break
      case QUEUE_CONSTANTS.LOOKUP_FIELDS.WINERY:
        await handleWineryLookup(req, docId)
        break
      case QUEUE_CONSTANTS.LOOKUP_FIELDS.REGION:
        await handleRegionLookup(req, docId)
        break
      case QUEUE_CONSTANTS.LOOKUP_FIELDS.COUNTRY:
        await handleCountryLookup(req, docId)
        break
      case QUEUE_CONSTANTS.LOOKUP_FIELDS.AROMA:
      case QUEUE_CONSTANTS.LOOKUP_FIELDS.TAG:
      case QUEUE_CONSTANTS.LOOKUP_FIELDS.MOOD:
        await handleDirectFieldLookup(req, lookupField, docId)
        break
      case QUEUE_CONSTANTS.LOOKUP_FIELDS.GRAPE_VARIETY:
        await handleGrapeVarietyLookup(req, docId)
        break
      default:
        req.payload.logger?.warn?.(
          `[queueRelatedWineVariants] Unknown lookup field: ${lookupField}`,
        )
    }
  } catch (err) {
    req.payload.logger?.error?.(
      `[queueRelatedWineVariants] Failed to queue jobs for ${lookupField}:${docId}`,
      err,
    )
  }
}

// Main hook functions
export const queueRelatedWineVariants = (collection: string) => {
  const afterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
    const docId = doc.id

    if (!docId) {
      req.payload.logger?.warn?.('[queueRelatedWineVariants] No document ID found')
      return
    }

    // Determine the lookup field based on the collection
    const lookupField = getLookupFieldFromCollection(collection)

    if (!lookupField) {
      req.payload.logger?.warn?.(`[queueRelatedWineVariants] Unknown collection: ${collection}`)
      return
    }

    await processLookupField(req, lookupField, docId)
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ id, req }) => {
    if (!id) {
      req.payload.logger?.warn?.('[queueRelatedWineVariants] No document ID found for deletion')
      return
    }

    // Determine the lookup field based on the collection
    const lookupField = getLookupFieldFromCollection(collection)

    if (!lookupField) {
      req.payload.logger?.warn?.(`[queueRelatedWineVariants] Unknown collection: ${collection}`)
      return
    }

    await processLookupField(req, lookupField, id)
  }

  return { afterChange, afterDelete }
}
