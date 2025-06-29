import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'
import { stylesData } from './styles.data'
import { seedLocalizedCollection } from './seedLocalizedCollection'

async function seedStyles(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  await seedLocalizedCollection({
    payload,
    logger,
    collection: 'styles',
    uniqueField: 'title.sl',
    getUniqueValue: (item) => item.title.sl,
    getSlData: (item) => ({
      title: item.title.sl,
      description: item.description?.sl || '',
      iconKey: item.iconKey,
    }),
    getEnData: (item) => ({
      title: item.title.en,
      description: item.description?.en || '',
      iconKey: item.iconKey,
    }),
    items: stylesData,
    task: 'seed-styles',
    logKey: 'style',
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedStyles()
    .then(() => {
      logger.info({ task: 'seed-styles' }, 'Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(
        {
          task: 'seed-styles',
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

export { seedStyles }
