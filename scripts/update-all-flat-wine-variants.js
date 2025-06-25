import payload from 'payload'
import config from '../src/payload.config.ts'

async function updateAllFlatWineVariants() {
  try {
    await payload.init({
      config,
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    })

    console.log('🚀 Starting bulk update of all flat wine variants...\n')

    // Get all wine variants that need to be synced
    const wineVariants = await payload.find({
      collection: 'wine-variants',
      limit: 1000, // Adjust if you have more than 1000 variants
      depth: 0, // We only need IDs
    })

    console.log(`📊 Found ${wineVariants.docs.length} wine variants to sync`)

    if (wineVariants.docs.length === 0) {
      console.log('✅ No wine variants found to sync!')
      process.exit(0)
    }

    console.log(`\n🚀 Queueing sync jobs for all ${wineVariants.docs.length} variants...`)

    // Queue sync tasks for all wine variants
    let queuedCount = 0
    for (const variant of wineVariants.docs) {
      try {
        await payload.jobs.queue({
          task: 'syncFlatWineVariant',
          input: {
            wineVariantId: variant.id,
          },
        })
        queuedCount++
        console.log(`   ✓ Queued sync job for variant ${variant.id}`)
      } catch (error) {
        console.error(`   ❌ Failed to queue sync for variant ${variant.id}:`, error)
      }
    }

    console.log(`\n✅ Successfully queued ${queuedCount} sync jobs!`)
    console.log('Run "pnpm payload jobs:run" to process them.')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error updating flat wine variants:', error)
    process.exit(1)
  }
}

updateAllFlatWineVariants()
