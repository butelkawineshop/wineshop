import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'
import { wineriesData } from './wineries.data'
import { seedLocalizedCollection } from './seedLocalizedCollection'

async function seedWineries(): Promise<void> {
  const payload = await getPayload({ config: payloadConfig })
  await seedLocalizedCollection({
    payload,
    logger,
    collection: 'wineries',
    uniqueField: 'title.sl',
    getUniqueValue: (item) => item.title.sl,
    getSlData: (item) => ({
      title: item.title.sl,
      description: item.description?.sl || '',
      country: item.country,
      region: item.region || '',
      website: item.website || '',
      founded: item.founded || null,
    }),
    getEnData: (item) => ({
      title: item.title.en,
      description: item.description?.en || '',
      country: item.country,
      region: item.region || '',
      website: item.website || '',
      founded: item.founded || null,
    }),
    items: wineriesData,
    task: 'seed-wineries',
    logKey: 'winery',
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedWineries()
    .then(() => {
      logger.info({ task: 'seed-wineries' }, 'Seeding completed')
      process.exit(0)
    })
    .catch((error) => {
      logger.error(
        {
          task: 'seed-wineries',
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

export { seedWineries }
