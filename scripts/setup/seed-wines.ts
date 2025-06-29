import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'
import { winesData } from './wines.data'
import { seedLocalizedCollection } from './seedLocalizedCollection'

async function seedWines(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  await seedLocalizedCollection({
    payload,
    logger,
    collection: 'wines',
    uniqueField: 'title.sl',
    getUniqueValue: (item) => item.title.sl,
    getSlData: (item) => ({
      title: item.title.sl,
      description: item.description?.sl || '',
      winery: item.winery,
      region: item.region || '',
      country: item.country,
      grapeVarieties: item.grapeVarieties || [],
      style: item.style || '',
      vintage: item.vintage || null,
      price: item.price || null,
      alcohol: item.alcohol || null,
      sweetness: item.sweetness || 'dry',
      body: item.body || 'medium',
      acidity: item.acidity || 'medium',
      tannins: item.tannins || 'medium',
    }),
    getEnData: (item) => ({
      title: item.title.en,
      description: item.description?.en || '',
      winery: item.winery,
      region: item.region || '',
      country: item.country,
      grapeVarieties: item.grapeVarieties || [],
      style: item.style || '',
      vintage: item.vintage || null,
      price: item.price || null,
      alcohol: item.alcohol || null,
      sweetness: item.sweetness || 'dry',
      body: item.body || 'medium',
      acidity: item.acidity || 'medium',
      tannins: item.tannins || 'medium',
    }),
    items: winesData,
    task: 'seed-wines',
    logKey: 'wine',
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedWines()
    .then(() => {
      logger.info({ task: 'seed-wines' }, 'Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(
        {
          task: 'seed-wines',
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

export { seedWines }
