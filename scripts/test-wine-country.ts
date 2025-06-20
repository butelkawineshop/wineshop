import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'

async function testWineCountry(): Promise<void> {
  try {
    console.log('Testing wine country creation...')
    const payload = await getPayload({ config: payloadConfig })

    const testCountry = {
      title: {
        sl: 'Test Country',
        en: 'Test Country',
      },
      description: {
        sl: 'Test description',
        en: 'Test description',
      },
      whyCool: {
        sl: 'Test why cool',
        en: 'Test why cool',
      },
      landArea: 1000,
      wineriesCount: 10,
    }

    console.log('Creating test country...')
    const created = await payload.create({
      collection: 'wineCountries',
      data: testCountry,
    })

    console.log('✅ Successfully created:', created)
  } catch (error) {
    console.error('❌ Error creating wine country:')
    console.error('Error message:', (error as Error).message)
    console.error('Full error:', error)
  }
}

testWineCountry()
