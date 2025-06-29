import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'
import { grapeVarietiesData } from './grape-varieties.data'
import { seedLocalizedCollection } from './seedLocalizedCollection'

async function seedGrapeVarieties(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  await seedLocalizedCollection({
    payload,
    logger,
    collection: 'grape-varieties',
    uniqueField: 'title.sl',
    getUniqueValue: (item) => item.title.sl,
    getSlData: (item) => ({
      title: item.title.sl,
      description: item.description?.sl || '',
      type: item.type,
      origin: item.origin || '',
    }),
    getEnData: (item) => ({
      title: item.title.en,
      description: item.description?.en || '',
      type: item.type,
      origin: item.origin || '',
    }),
    items: grapeVarietiesData,
    task: 'seed-grape-varieties',
    logKey: 'grape-variety',
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedGrapeVarieties()
    .then(() => {
      logger.info({ task: 'seed-grape-varieties' }, 'Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(
        {
          task: 'seed-grape-varieties',
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

export { seedGrapeVarieties }
