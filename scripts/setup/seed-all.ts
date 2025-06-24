import 'dotenv/config'
import { logger } from '../src/lib/logger'
import { seedWineCountries } from './seed-wine-countries'
import { seedTags } from './seed-tags'
import { seedGrapeVarieties } from './seed-grape-varieties'
import { seedWineRegions } from './seed-wine-regions'
import { seedWineries } from './seed-wineries'
import { seedMoods } from './seed-moods'
import { seedWines } from './seed-wines'

async function seedAll(): Promise<void> {
  try {
    logger.info('Starting complete seeding process...', { task: 'seed-all' })

    // Seed in order of dependencies
    logger.info('Step 1: Seeding wine countries...', { task: 'seed-all', step: 1 })
    await seedWineCountries()

    logger.info('Step 2: Seeding tags...', { task: 'seed-all', step: 2 })
    await seedTags()

    logger.info('Step 3: Seeding grape varieties...', { task: 'seed-all', step: 3 })
    await seedGrapeVarieties()

    logger.info('Step 4: Seeding wine regions...', { task: 'seed-all', step: 4 })
    await seedWineRegions()

    logger.info('Step 5: Seeding wineries...', { task: 'seed-all', step: 5 })
    await seedWineries()

    logger.info('Step 6: Seeding moods...', { task: 'seed-all', step: 6 })
    await seedMoods()

    logger.info('Step 7: Seeding wines and wine variants...', { task: 'seed-all', step: 7 })
    await seedWines()

    logger.info('Complete seeding process finished successfully!', { task: 'seed-all' })
  } catch (error) {
    logger.error('Complete seeding process failed', error as Error, { task: 'seed-all' })
    throw error
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAll()
    .then(() => {
      logger.info('All seeding completed successfully', { task: 'seed-all' })
      process.exit(0)
    })
    .catch((error) => {
      logger.error('Seeding failed', error as Error, { task: 'seed-all' })
      process.exit(1)
    })
}

export { seedAll }
