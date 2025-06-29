import { Payload } from 'payload'
import { logger as baseLogger } from '../../src/lib/logger'

interface LocalizedSeedOptions<T> {
  payload: Payload
  logger: typeof baseLogger
  collection: string
  uniqueField: string // e.g. 'title.sl' or 'title'
  getUniqueValue: (item: T) => string
  getSlData: (item: T) => Record<string, any>
  getEnData: (item: T) => Record<string, any>
  items: T[]
  task: string
  logKey: string
}

export async function seedLocalizedCollection<T>({
  payload,
  logger,
  collection,
  uniqueField,
  getUniqueValue,
  getSlData,
  getEnData,
  items,
  task,
  logKey,
}: LocalizedSeedOptions<T>): Promise<void> {
  for (const item of items) {
    try {
      // Existence check
      const where = uniqueField.includes('.')
        ? { [uniqueField]: { equals: getUniqueValue(item) } }
        : { [uniqueField]: { equals: getUniqueValue(item) } }
      const existing = await payload.find({ collection, where })
      if (existing.docs.length > 0) {
        logger.info(
          { task, [logKey]: getUniqueValue(item) },
          `${logKey} ${getUniqueValue(item)} already exists, skipping...`,
        )
        continue
      }
      // Create in Slovenian
      const created = await payload.create({
        collection,
        data: getSlData(item),
        locale: 'sl',
      })
      // Update in English
      await payload.update({
        collection,
        id: created.id,
        data: getEnData(item),
        locale: 'en',
      })
      logger.info(
        { task, [logKey]: getUniqueValue(item) },
        `Created ${logKey}: ${getUniqueValue(item)}`,
      )
    } catch (error) {
      logger.error(
        {
          task,
          [logKey]: getUniqueValue(item),
          err:
            error instanceof Error
              ? { message: error.message, stack: error.stack, name: error.name }
              : error,
        },
        `Failed to create ${logKey}: ${getUniqueValue(item)}`,
      )
    }
  }
}
