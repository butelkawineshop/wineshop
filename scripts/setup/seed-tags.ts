import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'
import { tagsData } from './tags.data'
import { seedLocalizedCollection } from './seedLocalizedCollection'

async function seedTags(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  await seedLocalizedCollection({
    payload,
    logger,
    collection: 'tags',
    uniqueField: 'title.sl',
    getUniqueValue: (item) => item.title.sl,
    getSlData: (item) => ({
      title: item.title.sl,
      description: item.description?.sl || '',
    }),
    getEnData: (item) => ({
      title: item.title.en,
      description: item.description?.en || '',
    }),
    items: tagsData,
    task: 'seed-tags',
    logKey: 'tag',
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedTags()
    .then(() => {
      logger.info({ task: 'seed-tags' }, 'Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(
        {
          task: 'seed-tags',
          err:
            error instanceof Error
              ? { message: error.message, stack: error.stack, name: error.name }
              : error,
        },
        'Seeding failed',
      )
      process.exit(1)
    })
}

export { seedTags }
