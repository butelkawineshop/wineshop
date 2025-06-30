import type { PayloadRequest } from 'payload'
import { BaseSyncService, type SyncResult } from './BaseSyncService'
import { FLAT_COLLECTIONS_CONSTANTS } from '@/constants/flatCollections'

export type CollectionType =
  (typeof FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES)[keyof typeof FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPES]

export interface FlatCollectionData {
  originalID: number
  collectionType: CollectionType
  originalSlug: string
  title: string
  slug: string
  description?: string
  titleEn?: string
  slugEn?: string
  descriptionEn?: string
  whyCool?: string
  whyCoolEn?: string
  typicalStyle?: string
  typicalStyleEn?: string
  character?: string
  characterEn?: string
  iconKey?: string
  wineryCode?: string
  priceRange?: string
  skin?: string
  climate?: string
  climateTemperature?: string
  category?: string
  colorGroup?: string
  adjective?: Record<string, unknown>
  flavour?: Record<string, unknown>
  country?: Record<string, unknown>
  climateData?: Record<string, unknown>
  statistics?: Record<string, unknown>
  climateConditions?: Record<string, unknown>
  social?: Record<string, unknown>
  synonyms?: Array<{ title: string; titleEn: string }>
  bestGrapes?: Array<Record<string, unknown>>
  bestRegions?: Array<Record<string, unknown>>
  legends?: Array<Record<string, unknown>>
  neighbours?: Array<Record<string, unknown>>
  relatedWineries?: Array<Record<string, unknown>>
  distinctiveAromas?: Array<Record<string, unknown>>
  blendingPartners?: Array<Record<string, unknown>>
  similarVarieties?: Array<Record<string, unknown>>
  tags?: Array<Record<string, unknown>>
  media?: Array<Record<string, unknown>>
  seo?: Record<string, unknown>
  syncedAt: Date
  isPublished: boolean
}

export class FlatCollectionService extends BaseSyncService {
  constructor(req: PayloadRequest) {
    super(req, FLAT_COLLECTIONS_CONSTANTS.LOGGING.TASK_NAMES.FLAT_COLLECTION_SERVICE)
  }

  /**
   * Syncs a collection item to the flat collections collection
   */
  async syncCollection(collectionId: string, collection: string): Promise<SyncResult> {
    try {
      this.logger.info('Starting sync for collection', { collectionId, collection })

      // Find the collection item and determine its type
      const { item, collectionType } = await this.findCollectionItem(collectionId, collection)
      if (!item || !collectionType) {
        return this.handleSyncError(
          new Error(FLAT_COLLECTIONS_CONSTANTS.ERROR_MESSAGES.COLLECTION_NOT_FOUND),
          { collectionId },
        )
      }

      // Transform the data for flat collection
      const flatData = await this.transformToFlatData(item, collectionType)

      // Upsert the flat collection record
      await this.upsertFlatCollection(flatData)

      this.logger.info('Successfully synced collection to flat collection', {
        collectionId,
        collectionType,
        collection,
      })

      return this.createSuccessResult(
        FLAT_COLLECTIONS_CONSTANTS.SUCCESS_MESSAGES.SYNC_COMPLETED,
        collectionId,
      )
    } catch (error) {
      return this.handleSyncError(error, { collectionId })
    }
  }

  /**
   * Main sync method implementation from BaseSyncService
   */
  async sync(id: string): Promise<SyncResult> {
    return this.syncCollection(id, id)
  }

  /**
   * Finds a collection item by ID across all supported collections
   */
  private async findCollectionItem(
    collectionId: string,
    collection: string,
  ): Promise<{
    item: Record<string, unknown> | null
    collectionType: CollectionType | null
  }> {
    const collections = [
      {
        slug: collection,
        type: FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPE_MAPPINGS[
          collection as keyof typeof FLAT_COLLECTIONS_CONSTANTS.COLLECTION_TYPE_MAPPINGS
        ],
      },
    ]
    return this.findDocumentById(collectionId, collections) as Promise<{
      item: Record<string, unknown> | null
      collectionType: CollectionType | null
    }>
  }

  /**
   * Transforms collection item data to flat collection format
   */
  private async transformToFlatData(
    item: Record<string, unknown>,
    collectionType: CollectionType,
  ): Promise<FlatCollectionData> {
    // Try localized value, then fallback to string, then ''
    let title = this.getLocalizedValue(item.title, FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN)
    if (!title && typeof item.title === 'string') title = item.title
    if (!title) title = ''

    let slug = this.getLocalizedValue(item.slug, FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN)
    if (!slug && typeof item.slug === 'string') slug = item.slug
    if (!slug) slug = ''

    this.logger.info('Transforming collection data', {
      collectionType,
      originalId: String(item.id),
      title,
      slug,
      titleField: String(item.title),
      slugField: String(item.slug),
    })

    const baseData: FlatCollectionData = {
      originalID: Number(item.id),
      collectionType,
      originalSlug: this.getOriginalSlug(item),
      title,
      slug,
      description: this.getLocalizedValue(
        item.description,
        FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN,
      ),
      titleEn: this.getLocalizedValue(item.title, FLAT_COLLECTIONS_CONSTANTS.LOCALES.ENGLISH),
      slugEn: this.getLocalizedValue(item.slug, FLAT_COLLECTIONS_CONSTANTS.LOCALES.ENGLISH),
      descriptionEn: this.getLocalizedValue(
        item.description,
        FLAT_COLLECTIONS_CONSTANTS.LOCALES.ENGLISH,
      ),
      whyCool: this.getLocalizedValue(item.whyCool, FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN),
      whyCoolEn: this.getLocalizedValue(item.whyCool, FLAT_COLLECTIONS_CONSTANTS.LOCALES.ENGLISH),
      typicalStyle: this.getLocalizedValue(
        item.typicalStyle,
        FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN,
      ),
      typicalStyleEn: this.getLocalizedValue(
        item.typicalStyle,
        FLAT_COLLECTIONS_CONSTANTS.LOCALES.ENGLISH,
      ),
      character: this.getLocalizedValue(
        item.character,
        FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN,
      ),
      characterEn: this.getLocalizedValue(
        item.character,
        FLAT_COLLECTIONS_CONSTANTS.LOCALES.ENGLISH,
      ),
      iconKey: item.iconKey as string,
      wineryCode: item.wineryCode as string,
      priceRange:
        typeof item.priceRange === 'object' && item.priceRange !== null
          ? (item.priceRange as { value?: string })?.value
          : (item.priceRange as string),
      skin:
        typeof item.skin === 'object' && item.skin !== null
          ? (item.skin as { value?: string })?.value
          : (item.skin as string),
      climate:
        typeof item.climate === 'object' && item.climate !== null
          ? (item.climate as { climate?: string })?.climate
          : (item.climate as string),
      climateTemperature:
        typeof item.climateTemperature === 'object' && item.climateTemperature !== null
          ? (item.climateTemperature as { value?: string })?.value
          : (item.climateTemperature as string),
      category:
        typeof item.category === 'object' && item.category !== null
          ? (item.category as { value?: string })?.value
          : (item.category as string),
      colorGroup:
        typeof item.colorGroup === 'object' && item.colorGroup !== null
          ? (item.colorGroup as { value?: string })?.value
          : (item.colorGroup as string),
      adjective: item.adjective as Record<string, unknown>,
      flavour: item.flavour as Record<string, unknown>,
      country: item.country as Record<string, unknown>,
      climateData: item.climate as Record<string, unknown>,
      statistics: item.statistics as Record<string, unknown>,
      climateConditions: item.climateConditions as Record<string, unknown>,
      social: item.social as Record<string, unknown>,
      synonyms: this.transformSynonyms(item.synonyms),
      bestGrapes: this.transformRelationships(item.bestGrapes),
      bestRegions: this.transformRelationships(item.bestRegions),
      legends: this.transformRelationships(item.legends),
      neighbours: this.transformRelationships(item.neighbours),
      relatedWineries: this.transformRelationships(item.relatedWineries),
      distinctiveAromas: this.transformRelationships(item.distinctiveAromas),
      blendingPartners: this.transformRelationships(item.blendingPartners),
      similarVarieties: this.transformRelationships(item.similarVarieties),
      tags: this.transformRelationships(item.tags),
      media: this.transformMedia(item.media),
      seo: item.seo as Record<string, unknown>,
      syncedAt: new Date(),
      isPublished: item._status === FLAT_COLLECTIONS_CONSTANTS.STATUS.PUBLISHED,
    }

    return baseData
  }

  /**
   * Gets localized value from a field
   */
  protected getLocalizedValue(field: unknown, locale: string): string | undefined {
    if (!field) return undefined
    if (typeof field === 'string') return field
    if (typeof field === 'object' && field !== null && locale in field) {
      return (field as Record<string, unknown>)[locale] as string | undefined
    }
    return undefined
  }

  /**
   * Gets the original slug from the item
   */
  private getOriginalSlug(item: Record<string, unknown>): string {
    return (
      this.getLocalizedValue(item.slug, FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN) ||
      String(item.id)
    )
  }

  /**
   * Transforms synonyms array
   */
  private transformSynonyms(synonyms: unknown): Array<{ title: string; titleEn: string }> {
    if (!Array.isArray(synonyms)) {
      return []
    }

    return synonyms.map((synonym) => ({
      title:
        this.getLocalizedValue(synonym.title, FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN) || '',
      titleEn:
        this.getLocalizedValue(synonym.title, FLAT_COLLECTIONS_CONSTANTS.LOCALES.ENGLISH) || '',
    }))
  }

  /**
   * Transforms relationship arrays
   */
  protected transformRelationships(relationships: unknown): Array<Record<string, unknown>> {
    if (!Array.isArray(relationships)) {
      return []
    }

    return relationships.map((rel) => ({
      originalId: rel.id || rel,
      title: this.getLocalizedValue(rel.title, FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN) || '',
      titleEn: this.getLocalizedValue(rel.title, FLAT_COLLECTIONS_CONSTANTS.LOCALES.ENGLISH) || '',
      slug: this.getLocalizedValue(rel.slug, FLAT_COLLECTIONS_CONSTANTS.LOCALES.SLOVENIAN) || '',
      slugEn: this.getLocalizedValue(rel.slug, FLAT_COLLECTIONS_CONSTANTS.LOCALES.ENGLISH) || '',
      wineryCode: rel.wineryCode || '',
    }))
  }

  /**
   * Transforms media array
   */
  protected transformMedia(media: unknown): Array<Record<string, unknown>> {
    if (!Array.isArray(media)) {
      return []
    }

    return media.map((item) => ({
      originalId: item.id || item,
      alt: item.alt || '',
      url: item.url || '',
      thumbnailURL: item.thumbnailURL || '',
    }))
  }

  /**
   * Upserts a flat collection record
   */
  private async upsertFlatCollection(data: FlatCollectionData): Promise<void> {
    try {
      const whereClause = {
        originalID: {
          equals: data.originalID,
        },
        collectionType: {
          equals: data.collectionType,
        },
      }

      await this.upsertDocument(
        FLAT_COLLECTIONS_CONSTANTS.COLLECTIONS.FLAT_COLLECTIONS,
        data as unknown as Record<string, unknown>,
        whereClause,
      )

      this.logger.info('Successfully upserted flat collection', {
        originalID: data.originalID,
        collectionType: data.collectionType,
        title: data.title,
        slug: data.slug,
      })
    } catch (error) {
      this.logger.error('Failed to upsert flat collection', error as Error, {
        originalID: data.originalID,
        collectionType: data.collectionType,
        title: data.title,
        slug: data.slug,
        error: String(error),
      })
      throw error
    }
  }
}
