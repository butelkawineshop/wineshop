import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'

interface WineVariant {
  id: string
  slug: string
  wine: {
    id: string
    slug: string
  }
}

async function checkWineVariants() {
  console.log('🔍 Checking wine variants in database...\n')

  try {
    // Initialize Payload
    const payload = await getPayload({
      // Pass the config
      config: payloadConfig,
    })

    // Get all wine variants from the database
    const wineVariantsResponse = await payload.find({
      collection: 'wine-variants',
      limit: 1000,
      depth: 1,
    })

    const wineVariants = wineVariantsResponse.docs as WineVariant[]
    console.log(`🍷 Found ${wineVariants.length} wine variants\n`)

    // Display all wine variant slugs
    console.log('📋 Wine Variant Slugs:')
    wineVariants.forEach((variant, index) => {
      console.log(`${index + 1}. ${variant.slug}`)
    })

    // Create a set of slugs for easy lookup
    const slugSet = new Set(wineVariants.map((v) => v.slug))

    console.log('\n📊 Summary:')
    console.log(`   Total wine variants: ${wineVariants.length}`)
    console.log(`   Unique slugs: ${slugSet.size}`)

    // Check for any duplicate slugs
    if (slugSet.size !== wineVariants.length) {
      console.log('   ⚠️  Warning: Some duplicate slugs found!')
    }
  } catch (error) {
    console.error('❌ Script failed:', error)
    process.exit(1)
  }
}

// Run the script
checkWineVariants()
  .then(() => {
    console.log('\n✅ Wine variant check completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error)
    process.exit(1)
  })
