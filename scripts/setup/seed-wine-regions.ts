import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'
import { wineRegionsData } from './wine-regions.data'
import { seedLocalizedCollection } from './seedLocalizedCollection'

async function seedWineRegions(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  await seedLocalizedCollection({
    payload,
    logger,
    collection: 'wine-regions',
    uniqueField: 'title.sl',
    getUniqueValue: (item) => item.title.sl,
    getSlData: (item) => ({
      title: item.title.sl,
      description: item.description?.sl || '',
      country: item.country,
      code: item.code,
    }),
    getEnData: (item) => ({
      title: item.title.en,
      description: item.description?.en || '',
      country: item.country,
      code: item.code,
    }),
    items: wineRegionsData,
    task: 'seed-wine-regions',
    logKey: 'wine-region',
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedWineRegions()
    .then(() => {
      logger.info({ task: 'seed-wine-regions' }, 'Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(
        {
          task: 'seed-wine-regions',
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

export { seedWineRegions }
