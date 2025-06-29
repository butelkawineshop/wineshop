import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { search } from '@/typesense'
import { createLogger } from '@/lib/logger'
import { HOOK_CONSTANTS } from '@/constants/hooks'
import type { FlatWineVariant } from '@/payload-types'

const WINE_VARIANTS_COLLECTION = HOOK_CONSTANTS.COLLECTIONS.FLAT_WINE_VARIANTS

/**
 * Maps a FlatWineVariant to a Typesense document format
 */
function mapToTypesenseDocument(doc: FlatWineVariant): Record<string, unknown> {
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

export const syncTypesense: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc: _previousDoc,
}): Promise<typeof doc> => {
  const logger = createLogger(req, {
    task: 'syncTypesense',
    operation,
    collection: WINE_VARIANTS_COLLECTION,
    id: doc.id,
  })

  logger.info('Typesense sync hook triggered')

  try {
    // Only sync published variants
    if (!doc.isPublished) {
      logger.info('Skipping sync for unpublished variant')
      return doc
    }

    const document = mapToTypesenseDocument(doc)

    if (operation === 'create') {
      await search.createDocument(WINE_VARIANTS_COLLECTION, document)
      logger.info('Created document in Typesense', { variantId: doc.id })
    } else if (operation === 'update') {
      await search.updateDocument(WINE_VARIANTS_COLLECTION, String(doc.id), document)
      logger.info('Updated document in Typesense', { variantId: doc.id })
    }

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
}): Promise<void> => {
  const logger = createLogger(req, {
    task: 'deleteFromTypesense',
    collection: WINE_VARIANTS_COLLECTION,
    id,
  })

  logger.info('Typesense delete hook triggered')

  try {
    await search.deleteDocument(WINE_VARIANTS_COLLECTION, String(id))
    logger.info('Deleted document from Typesense', { variantId: id })
  } catch (error) {
    logger.error(HOOK_CONSTANTS.ERROR_MESSAGES.TYPESENSE_DELETE_FAILED, error as Error)
    // Don't throw - this is a background sync operation
  }
}
