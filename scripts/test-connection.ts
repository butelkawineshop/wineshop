import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'

async function testConnection(): Promise<void> {
  try {
    console.log('Testing Payload connection...')
    const payload = await getPayload({ config: payloadConfig })
    console.log('✅ Payload connection successful!')

    // Test a simple query
    const collections = await payload.collections
    console.log('✅ Collections loaded:', Object.keys(collections))

    process.exit(0)
  } catch (error) {
    console.error('❌ Connection failed:', error)
    process.exit(1)
  }
}

testConnection()
