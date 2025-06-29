import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'
import { climatesData } from './climates.data'
import { seedLocalizedCollection } from './seedLocalizedCollection'

async function seedClimates(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  await seedLocalizedCollection({
    payload,
    logger,
    collection: 'climates',
    uniqueField: 'title.sl',
    getUniqueValue: (item) => item.title.sl,
    getSlData: (item) => ({
      title: item.title.sl,
      description: item.description?.sl || '',
      climate: item.climate,
      climateTemperature: item.climateTemperature,
      diurnalTemperatureRange: item.diurnalTemperatureRange,
      climateHumidity: item.climateHumidity,
    }),
    getEnData: (item) => ({
      title: item.title.en,
      description: item.description?.en || '',
      climate: item.climate,
      climateTemperature: item.climateTemperature,
      diurnalTemperatureRange: item.diurnalTemperatureRange,
      climateHumidity: item.climateHumidity,
    }),
    items: climatesData,
    task: 'seed-climates',
    logKey: 'climate',
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedClimates()
    .then(() => {
      logger.info({ task: 'seed-climates' }, 'Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(
        {
          task: 'seed-climates',
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

export { seedClimates }
