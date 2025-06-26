import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { logger } from '../src/lib/logger'

async function testSimpleSync() {
  const payload = await getPayload({
    config: payloadConfig,
  })
  const taskLogger = logger.child({ task: 'testSimpleSync' })

  try {
    taskLogger.info('Testing simple flat variant creation...')

    // Try to create a minimal flat variant
    const testData = {
      originalVariant: 1, // Assuming wine variant ID 1 exists
      wineID: 1,
      wineryID: 1,
      regionID: 1,
      countryID: 1,
      styleID: 1,
      wineTitle: 'Test Wine',
      wineryTitle: 'Test Winery',
      regionTitle: 'Test Region',
      countryTitle: 'Test Country',
      vintage: '2020',
      size: '750ml',
      price: 25,
      stockOnHand: 10,
      sku: 'TEST-001',
    }

    taskLogger.info('Attempting to create flat variant with data:', testData)

    try {
      const result = await payload.create({
        collection: 'flat-wine-variants',
        data: testData,
      })
      taskLogger.info('Successfully created flat variant:', result.id)
    } catch (createError: any) {
      taskLogger.error('Failed to create flat variant:', {
        error: createError.message,
        details: createError.details,
        data: createError.data,
        stack: createError.stack,
        fullError: createError,
      })
    }

    process.exit(0)
  } catch (error: any) {
    taskLogger.error('Test failed:', error)
    process.exit(1)
  }
}

testSimpleSync()
