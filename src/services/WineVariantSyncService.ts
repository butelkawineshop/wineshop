import { createLogger } from '@/lib/logger'
import { ValidationError } from '@/lib/errors'
import type { PayloadRequest } from 'payload'

interface WineVariantSyncParams {
  doc: { id: string | number }
  req: PayloadRequest
  operation: 'create' | 'update'
  previousDoc?: DocumentData
}

interface DocumentData {
  id?: string | number
  wine?: Record<string, unknown>
  aromas?: unknown[]
  tags?: unknown[]
  moods?: unknown[]
  grapeVarieties?: unknown[]
  vintage?: string | number
  size?: string
  sku?: string
  price?: number
  stockOnHand?: number
  canBackorder?: boolean
  maxBackorderQuantity?: number
  servingTemp?: string
  decanting?: string
  tastingProfile?: Record<string, unknown>
  _status?: string
  media?: unknown[]
}

export class WineVariantSyncService {
  /**
   * Determines if a wine variant sync job should be queued
   */
  static async shouldQueueSync({
    doc,
    req,
    operation,
    previousDoc,
  }: WineVariantSyncParams): Promise<boolean> {
    const logger = createLogger(req, {
      task: 'WineVariantSyncService.shouldQueueSync',
      operation,
      collection: 'wine-variants',
      id: doc.id,
    })

    // Always queue for create operations
    if (operation === 'create') {
      logger.info('Create operation detected, queueing job')
      return true
    }

    // For update operations, check for changes
    if (operation === 'update') {
      const hasChanges = await this.detectChanges({ doc, req, logger, previousDoc })
      if (!hasChanges) {
        logger.info('No changes detected, skipping sync')
        return false
      }
      return true
    }

    return false
  }

  /**
   * Detects if there are meaningful changes in a wine variant update
   */
  private static async detectChanges({
    doc,
    req,
    logger,
    previousDoc,
  }: {
    doc: { id: string | number }
    req: PayloadRequest
    logger: ReturnType<typeof createLogger>
    previousDoc?: DocumentData
  }): Promise<boolean> {
    const currentDoc = (await req.payload.findByID({
      collection: 'wine-variants',
      id: doc.id,
      depth: 3,
    })) as unknown as DocumentData | null

    if (!currentDoc) {
      throw new ValidationError('Current document not found', { id: doc.id })
    }

    // If we don't have previous document data, assume there are changes
    // This is a fallback to ensure sync happens
    if (!previousDoc) {
      logger.info('No previous document data available, assuming changes exist')
      return true
    }

    // Check for related field changes
    const hasRelatedChanges = this.hasRelatedFieldChanges(previousDoc, currentDoc)

    // Check for variant field changes
    const hasVariantChanges = this.hasVariantFieldChanges(previousDoc, currentDoc)

    logger.debug('Change detection results', {
      hasRelatedChanges,
      hasVariantChanges,
      wineChanges: this.hasWineChanges(previousDoc, currentDoc),
      wineryChanges: this.hasWineryChanges(previousDoc, currentDoc),
    })

    return hasRelatedChanges || hasVariantChanges
  }

  /**
   * Checks if related fields have changed
   */
  private static hasRelatedFieldChanges(
    previousDoc: DocumentData,
    currentDoc: DocumentData,
  ): boolean {
    return (
      JSON.stringify(previousDoc?.wine) !== JSON.stringify(currentDoc?.wine) ||
      JSON.stringify(previousDoc?.aromas) !== JSON.stringify(currentDoc?.aromas) ||
      JSON.stringify(previousDoc?.tags) !== JSON.stringify(currentDoc?.tags) ||
      JSON.stringify(previousDoc?.moods) !== JSON.stringify(currentDoc?.moods) ||
      JSON.stringify(previousDoc?.grapeVarieties) !== JSON.stringify(currentDoc?.grapeVarieties)
    )
  }

  /**
   * Checks if variant-specific fields have changed
   */
  private static hasVariantFieldChanges(
    previousDoc: DocumentData,
    currentDoc: DocumentData,
  ): boolean {
    return (
      previousDoc?.vintage !== currentDoc?.vintage ||
      previousDoc?.size !== currentDoc?.size ||
      previousDoc?.sku !== currentDoc?.sku ||
      previousDoc?.price !== currentDoc?.price ||
      previousDoc?.stockOnHand !== currentDoc?.stockOnHand ||
      previousDoc?.canBackorder !== currentDoc?.canBackorder ||
      previousDoc?.maxBackorderQuantity !== currentDoc?.maxBackorderQuantity ||
      previousDoc?.servingTemp !== currentDoc?.servingTemp ||
      previousDoc?.decanting !== currentDoc?.decanting ||
      previousDoc?.tastingProfile !== currentDoc?.tastingProfile ||
      previousDoc?._status !== currentDoc?._status ||
      JSON.stringify(previousDoc?.media) !== JSON.stringify(currentDoc?.media)
    )
  }

  /**
   * Checks if wine data has changed
   */
  private static hasWineChanges(previousDoc: DocumentData, currentDoc: DocumentData): boolean {
    return !!(
      previousDoc?.wine &&
      typeof previousDoc.wine === 'object' &&
      typeof currentDoc?.wine === 'object' &&
      JSON.stringify(previousDoc.wine) !== JSON.stringify(currentDoc.wine)
    )
  }

  /**
   * Checks if winery data has changed
   */
  private static hasWineryChanges(previousDoc: DocumentData, currentDoc: DocumentData): boolean {
    return !!(
      previousDoc?.wine &&
      typeof previousDoc.wine === 'object' &&
      'winery' in previousDoc.wine &&
      currentDoc?.wine &&
      typeof currentDoc.wine === 'object' &&
      'winery' in currentDoc.wine &&
      JSON.stringify(previousDoc.wine.winery) !== JSON.stringify(currentDoc.wine.winery)
    )
  }

  /**
   * Queues a wine variant sync job
   */
  static async queueSyncJob({
    doc,
    req,
    logger,
  }: {
    doc: { id: string | number }
    req: PayloadRequest
    logger: ReturnType<typeof createLogger>
  }): Promise<void> {
    logger.info('Queueing job for variant', { id: doc.id })
    await req.payload.jobs.queue({
      task: 'syncFlatWineVariant',
      input: {
        wineVariantId: String(doc.id),
      },
    })
    logger.info('Successfully queued flat wine variant sync')
  }
}
