import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { search } from '@/typesense'
import { createLogger } from '@/lib/logger'

const WINE_VARIANTS_COLLECTION = 'flat-wine-variants'

export const syncTypesense: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  const logger = createLogger(req, {
    task: 'syncTypesense',
    operation,
    collection: 'flat-wine-variants',
    id: doc.id,
  })

  logger.info('Typesense sync hook triggered')

  try {
    // Only sync published variants
    if (!doc.isPublished) {
      logger.info('Skipping sync for unpublished variant')
      return doc
    }

    const document = {
      id: String(doc.id),
      wineTitle: doc.wineTitle || '',
      wineryTitle: doc.wineryTitle || '',
      regionTitle: doc.regionTitle || '',
      countryTitle: doc.countryTitle || '',
      countryTitleEn: doc.countryTitleEn || '',
      styleTitle: doc.styleTitle || '',
      styleTitleEn: doc.styleTitleEn || '',
      description: doc.description || '',
      descriptionEn: doc.descriptionEn || '',
      tastingProfile: doc.tastingProfile || '',
      slug: doc.slug || '',
      vintage: doc.vintage || 0,
      size: doc.size || 0,
      price: doc.price || 0,
      isPublished: doc.isPublished || false,
      primaryImageUrl: doc.primaryImageUrl || '',
      createdAt: new Date(doc.createdAt).getTime(),
      updatedAt: new Date(doc.updatedAt).getTime(),
    }

    if (operation === 'create') {
      await search.createDocument(WINE_VARIANTS_COLLECTION, document)
      logger.info('Created document in Typesense', { variantId: doc.id })
    } else if (operation === 'update') {
      await search.updateDocument(WINE_VARIANTS_COLLECTION, String(doc.id), document)
      logger.info('Updated document in Typesense', { variantId: doc.id })
    }

    return doc
  } catch (error) {
    logger.error('Failed to sync to Typesense', error as Error)
    // Don't throw - this is a background sync operation
    return doc
  }
}

export const deleteFromTypesense: CollectionAfterDeleteHook = async ({ id, req }) => {
  const logger = createLogger(req, {
    task: 'deleteFromTypesense',
    collection: 'flat-wine-variants',
    id,
  })

  logger.info('Typesense delete hook triggered')

  try {
    await search.deleteDocument(WINE_VARIANTS_COLLECTION, String(id))
    logger.info('Deleted document from Typesense', { variantId: id })
  } catch (error) {
    logger.error('Failed to delete from Typesense', error as Error)
    // Don't throw - this is a background sync operation
  }
}
