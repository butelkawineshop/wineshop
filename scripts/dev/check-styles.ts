import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'

async function checkStyles() {
  console.log('🔍 Checking styles in database...\n')

  try {
    // Initialize Payload
    const payload = await getPayload({
      // Pass the config
      config: payloadConfig,
    })

    // Get all styles from the database
    const stylesResponse = await payload.find({
      collection: 'styles',
      limit: 1000,
      depth: 1,
    })

    const styles = stylesResponse.docs
    console.log(`🎨 Found ${styles.length} styles\n`)

    // Display all style titles
    console.log('📋 Style Titles:')
    styles.forEach((style, index) => {
      console.log(`${index + 1}. ${style.title}`)
    })

    // Create a summary
    console.log('\n📊 Summary:')
    console.log(`Total styles: ${styles.length}`)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error checking styles:', error)
    process.exit(1)
  }
}

checkStyles()
