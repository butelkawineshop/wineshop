import payload from 'payload'
import config from '../src/payload.config.ts'

async function checkSyncStatus() {
  try {
    await payload.init({
      config,
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    })

    console.log('Checking sync status...\n')

    // Check wine variants
    const wineVariants = await payload.find({
      collection: 'wine-variants',
      limit: 0,
      depth: 0,
    })
    console.log(`📊 Total wine variants: ${wineVariants.totalDocs}`)

    // Check flat wine variants
    const flatVariants = await payload.find({
      collection: 'flat-wine-variants',
      limit: 0,
      depth: 0,
    })
    console.log(`📊 Total flat wine variants: ${flatVariants.totalDocs}`)

    // Find wine variants that don't have corresponding flat variants
    const wineVariantIds = wineVariants.docs.map((v) => v.id)
    const flatVariantWineIds = flatVariants.docs.map((fv) => fv.originalVariant)

    const missingSyncs = wineVariantIds.filter((id) => !flatVariantWineIds.includes(id))

    console.log(`\n❌ Missing syncs: ${missingSyncs.length}`)
    if (missingSyncs.length > 0) {
      console.log(
        'Missing wine variant IDs:',
        missingSyncs.slice(0, 10),
        missingSyncs.length > 10 ? '...' : '',
      )
    }

    // Check for any remaining jobs
    const remainingJobs = await payload.find({
      collection: 'payload-jobs',
      where: {
        taskSlug: {
          equals: 'syncFlatWineVariant',
        },
      },
      limit: 0,
    })
    console.log(`\n📋 Remaining sync jobs: ${remainingJobs.totalDocs}`)

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

checkSyncStatus()
