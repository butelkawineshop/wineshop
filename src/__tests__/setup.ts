import payload from 'payload'
import config from '../payload.config'
import type { Config } from '../payload-types'

type CollectionSlug = keyof Config['collections']

beforeAll(async () => {
  // Set test database URI
  process.env.DATABASE_URI =
    process.env.TEST_DATABASE_URI || 'postgres://postgres:postgres@localhost:5432/wineshop'

  // Initialize payload with test configuration
  const payloadConfig = await config
  await payload.init({ config: payloadConfig })

  // Ensure all collections exist
  const collections = [
    'wineries',
    'wineCountries',
    'regions',
    'styles',
    'wines',
    'wine-variants',
    'flat-wine-variants',
  ]

  for (const collection of collections) {
    try {
      await payload.find({
        collection: collection as CollectionSlug,
        limit: 1,
      })
    } catch (error) {
      console.error(`Error initializing collection ${collection}:`, error)
      throw error
    }
  }
})

afterAll(async () => {
  await payload.destroy()
})
