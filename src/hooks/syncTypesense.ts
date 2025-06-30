import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { search } from '@/typesense'
import { createLogger } from '@/lib/logger'
import { HOOK_CONSTANTS } from '@/constants/hooks'
import type { FlatWineVariant, FlatCollection } from '@/payload-types'

const WINE_VARIANTS_COLLECTION = HOOK_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS
const FLAT_COLLECTIONS_COLLECTION = 'flat-collections'

/**
 * Maps a FlatWineVariant to a Typesense document format
 */
function mapWineVariantToTypesense(doc: FlatWineVariant): Record<string, unknown> {
  return {
    id: String(doc.id),
    wineTitle: doc.wineTitle || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    wineryTitle: doc.wineryTitle || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    regionTitle: doc.regionTitle || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    countryTitle: doc.countryTitle || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    countryTitleEn: doc.countryTitleEn || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    styleTitle: doc.styleTitle || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    styleTitleEn: doc.styleTitleEn || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    description: doc.description || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    descriptionEn: doc.descriptionEn || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    tastingProfile: doc.tastingProfile || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    slug: doc.slug || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    vintage: doc.vintage || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.NUMBER,
    size: doc.size || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.NUMBER,
    price: doc.price || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.NUMBER,
    isPublished: doc.isPublished || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.BOOLEAN,
    primaryImageUrl: doc.primaryImageUrl || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    createdAt: new Date(doc.createdAt).getTime(),
    updatedAt: new Date(doc.updatedAt).getTime(),
  }
}

/**
 * Maps a FlatCollection document to a Typesense document format
 */
function mapFlatCollectionToTypesense(doc: FlatCollection): Record<string, unknown> {
  return {
    id: String(doc.originalID),
    title: doc.title || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    titleEn: doc.titleEn || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    slug: doc.slug || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    slugEn: doc.slugEn || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    description: doc.description || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    descriptionEn: doc.descriptionEn || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    collectionType: doc.collectionType || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    originalID: doc.originalID || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.NUMBER,
    originalSlug: doc.originalSlug || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.STRING,
    isPublished: doc.isPublished || HOOK_CONSTANTS.TYPESENSE_DEFAULTS.BOOLEAN,
    syncedAt: doc.syncedAt
      ? new Date(doc.syncedAt).getTime()
      : HOOK_CONSTANTS.TYPESENSE_DEFAULTS.NUMBER,
    createdAt: new Date(doc.createdAt).getTime(),
    updatedAt: new Date(doc.updatedAt).getTime(),
  }
}

export const syncTypesense: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
}): Promise<typeof doc> => {
  const logger = createLogger(req, {
    task: 'syncTypesense',
    operation,
    collection: 'syncTypesense',
    id: doc.id,
  })

  logger.info('Typesense sync hook triggered')

  try {
    // Only sync published documents
    if (!doc.isPublished) {
      logger.info('Skipping sync for unpublished document')
      return doc
    }

    // Determine which collection this is and map accordingly
    let document: Record<string, unknown>
    let typesenseCollection: string
    let documentId: string

    if ('wineTitle' in doc) {
      // This is a flat wine variant
      document = mapWineVariantToTypesense(doc as FlatWineVariant)
      typesenseCollection = WINE_VARIANTS_COLLECTION
      documentId = String(doc.id)
    } else if ('collectionType' in doc) {
      // This is a flat collection
      document = mapFlatCollectionToTypesense(doc as FlatCollection)
      typesenseCollection = FLAT_COLLECTIONS_COLLECTION
      documentId = String((doc as FlatCollection).originalID)
    } else {
      logger.warn('Unknown document type for Typesense sync')
      return doc
    }

    // Always use upsert to handle both create and update operations
    try {
      // Try to update first (document exists)
      await search.updateDocument(typesenseCollection, documentId, document)
      logger.debug('Updated document in Typesense', {
        collection: typesenseCollection,
        id: documentId,
        operation,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (updateError: any) {
      // If update fails with ObjectNotFound, try to create (document doesn't exist)
      if (updateError.name === 'ObjectNotFound') {
        try {
          await search.createDocument(typesenseCollection, document)
          logger.debug('Created document in Typesense', {
            collection: typesenseCollection,
            id: documentId,
            operation,
          })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (createError: any) {
          logger.error('Failed to create document in Typesense', createError as Error, {
            collection: typesenseCollection,
            id: documentId,
            operation,
          })
          throw createError
        }
      } else {
        // If it's not ObjectNotFound, it's a real error
        logger.error('Failed to update document in Typesense', updateError as Error, {
          collection: typesenseCollection,
          id: documentId,
          operation,
        })
        throw updateError
      }
    }

    logger.info('Typesense sync completed successfully', {
      collection: typesenseCollection,
      id: documentId,
      operation,
    })

    return doc
  } catch (error) {
    logger.error(HOOK_CONSTANTS.ERROR_MESSAGES.TYPESENSE_SYNC_FAILED, error as Error)
    // Don't throw - this is a background sync operation
    return doc
  }
}

export const deleteFromTypesense: CollectionAfterDeleteHook = async ({
  id,
  req,
  collection,
}): Promise<void> => {
  const logger = createLogger(req, {
    task: 'deleteFromTypesense',
    collection: 'deleteFromTypesense',
    id,
  })

  logger.info('Typesense delete hook triggered')

  try {
    // Determine which Typesense collection to delete from based on the Payload collection
    const typesenseCollection =
      collection?.slug === 'flat-wine-variants'
        ? WINE_VARIANTS_COLLECTION
        : FLAT_COLLECTIONS_COLLECTION

    // For flat collections, we need to get the originalID to delete the correct document
    let documentId = String(id)

    if (collection?.slug === 'flat-collections') {
      // Try to get the originalID from the deleted document
      // Since the document is already deleted, we'll use the ID as is
      // This might need adjustment based on how the deletion is handled
      documentId = String(id)
    }

    await search.deleteDocument(typesenseCollection, documentId)
    logger.info('Deleted document from Typesense', {
      collection: typesenseCollection,
      id: documentId,
    })
  } catch (error) {
    logger.error(HOOK_CONSTANTS.ERROR_MESSAGES.TYPESENSE_DELETE_FAILED, error as Error)
    // Don't throw - this is a background sync operation
  }
}
