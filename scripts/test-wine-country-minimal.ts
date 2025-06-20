import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'

async function testWineCountryMinimal(): Promise<void> {
  try {
    console.log('Testing minimal wine country creation...')
    const payload = await getPayload({ config: payloadConfig })

    const testCountry = {
      title: {
        sl: 'Test Country',
        en: 'Test Country',
      },
    }

    console.log('Creating test country with just title...')
    const created = await payload.create({
      collection: 'wineCountries',
      data: testCountry,
    })

    console.log('✅ Successfully created:', created)
  } catch (error) {
    console.error('❌ Error creating wine country:')
    console.error('Error message:', (error as Error).message)
    console.error('Full error:', error)

    // Try to get more details about the validation error
    if ((error as any).data?.errors) {
      console.error('Validation errors:', (error as any).data.errors)
    }
  }
}

testWineCountryMinimal()
