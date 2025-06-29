import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'
import { wineCountriesData } from './wine-countries.data'
import { seedLocalizedCollection } from './seedLocalizedCollection'

async function seedWineCountries(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  await seedLocalizedCollection({
    payload,
    logger,
    collection: 'wine-countries',
    uniqueField: 'title.sl',
    getUniqueValue: (item) => item.title.sl,
    getSlData: (item) => ({
      title: item.title.sl,
      description: item.description?.sl || '',
      code: item.code,
    }),
    getEnData: (item) => ({
      title: item.title.en,
      description: item.description?.en || '',
      code: item.code,
    }),
    items: wineCountriesData,
    task: 'seed-wine-countries',
    logKey: 'wine-country',
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedWineCountries()
    .then(() => {
      logger.info({ task: 'seed-wine-countries' }, 'Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(
        {
          task: 'seed-wine-countries',
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

export { seedWineCountries }
