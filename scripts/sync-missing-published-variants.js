import payload from 'payload'
import config from '../src/payload.config.ts'

async function syncMissingPublished() {
  try {
    await payload.init({
      config,
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    })

    console.log('Finding published wine variants that need syncing...\n')

    // Get all published wine variants
    const publishedVariants = await payload.find({
      collection: 'wine-variants',
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 0,
      depth: 0,
    })

    // Get existing flat wine variants
    const flatVariants = await payload.find({
      collection: 'flat-wine-variants',
      limit: 0,
      depth: 0,
    })

    const flatVariantWineIds = flatVariants.docs.map((fv) => fv.originalVariant)
    const missingSyncs = publishedVariants.docs.filter((v) => !flatVariantWineIds.includes(v.id))

    console.log(`📊 Published wine variants: ${publishedVariants.totalDocs}`)
    console.log(`📊 Existing flat variants: ${flatVariants.totalDocs}`)
    console.log(`🎯 Published variants needing sync: ${missingSyncs.length}`)

    if (missingSyncs.length === 0) {
      console.log('✅ All published variants are already synced!')
      process.exit(0)
    }

    console.log(`\n🚀 Queueing sync jobs for ${missingSyncs.length} published variants...`)

    // Queue sync jobs for missing published variants
    for (const variant of missingSyncs) {
      await payload.jobs.queue({
        task: 'syncFlatWineVariant',
        input: {
          wineVariantId: variant.id,
        },
      })
      console.log(`   ✓ Queued sync job for variant ${variant.id}`)
    }

    console.log(`\n✅ Successfully queued ${missingSyncs.length} sync jobs!`)
    console.log('Run "pnpm payload jobs:run" to process them.')

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

syncMissingPublished()
