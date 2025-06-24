import payload from 'payload'
import config from '../src/payload.config.ts'

async function diagnoseFailed() {
  try {
    await payload.init({
      config,
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    })

    console.log('Diagnosing failed syncs...\n')

    // Get all wine variants and flat variants to identify missing ones
    const wineVariants = await payload.find({
      collection: 'wine-variants',
      limit: 0,
      depth: 3, // Get full relational data
    })

    const flatVariants = await payload.find({
      collection: 'flat-wine-variants',
      limit: 0,
      depth: 0,
    })

    const flatVariantWineIds = flatVariants.docs.map((fv) => fv.originalVariant)
    const missingSyncs = wineVariants.docs.filter((v) => !flatVariantWineIds.includes(v.id))

    console.log(`Found ${missingSyncs.length} wine variants that failed to sync\n`)

    // Analyze the first 10 failed wine variants
    const sampleFailures = missingSyncs.slice(0, 10)

    for (const variant of sampleFailures) {
      console.log(`🔍 Wine Variant ID: ${variant.id}`)
      console.log(`   Status: ${variant._status}`)
      console.log(`   Wine: ${typeof variant.wine}`)

      if (variant.wine && typeof variant.wine === 'object') {
        console.log(`   Wine title: ${variant.wine.title || 'MISSING'}`)
        console.log(`   Winery: ${typeof variant.wine.winery}`)

        if (variant.wine.winery && typeof variant.wine.winery === 'object') {
          console.log(`   Winery title: ${variant.wine.winery.title || 'MISSING'}`)
          console.log(`   Winery code: ${variant.wine.winery.wineryCode || 'MISSING'}`)
        } else {
          console.log(`   ❌ Winery data incomplete`)
        }

        console.log(`   Region: ${typeof variant.wine.region}`)

        if (variant.wine.region && typeof variant.wine.region === 'object') {
          console.log(`   Region title: ${variant.wine.region.title || 'MISSING'}`)
          console.log(`   Country: ${typeof variant.wine.region.country}`)

          if (variant.wine.region.country && typeof variant.wine.region.country === 'object') {
            console.log(`   Country title: ${variant.wine.region.country.title || 'MISSING'}`)
          } else {
            console.log(`   ❌ Country data incomplete`)
          }
        } else {
          console.log(`   ❌ Region data incomplete`)
        }
      } else {
        console.log(`   ❌ Wine data incomplete`)
      }

      console.log(`   Vintage: ${variant.vintage || 'MISSING'}`)
      console.log(`   Size: ${variant.size || 'MISSING'}`)
      console.log(`   SKU: ${variant.sku || 'MISSING'}`)
      console.log(`   Price: ${variant.price || 'MISSING'}`)
      console.log(`---`)
    }

    // Check for common patterns
    const unpublishedCount = missingSyncs.filter((v) => v._status !== 'published').length
    const missingWineCount = missingSyncs.filter(
      (v) => !v.wine || typeof v.wine !== 'object',
    ).length
    const missingWineryCount = missingSyncs.filter(
      (v) =>
        !v.wine ||
        typeof v.wine !== 'object' ||
        !v.wine.winery ||
        typeof v.wine.winery !== 'object',
    ).length
    const missingRegionCount = missingSyncs.filter(
      (v) =>
        !v.wine ||
        typeof v.wine !== 'object' ||
        !v.wine.region ||
        typeof v.wine.region !== 'object',
    ).length

    console.log(`\n📊 Failure Analysis:`)
    console.log(`   Unpublished variants: ${unpublishedCount}`)
    console.log(`   Missing wine data: ${missingWineCount}`)
    console.log(`   Missing winery data: ${missingWineryCount}`)
    console.log(`   Missing region data: ${missingRegionCount}`)

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

diagnoseFailed()
