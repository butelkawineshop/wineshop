import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import type { FlatWineVariant } from '../src/payload-types'

async function debugSpecificWine() {
  const payload = await getPayload({ config })

  // Let's check a wine that should have grape variety compositions
  const variantId = 166 // Change this to the specific wine you're looking at

  console.log(`🔍 Debugging wine variant ID: ${variantId}`)

  // Get the variant
  const variant = (await payload.findByID({
    collection: 'flat-wine-variants',
    id: variantId,
  })) as FlatWineVariant

  console.log('📋 Variant details:')
  console.log(`  - Title: ${variant.wineTitle}`)
  console.log(`  - Winery: ${variant.wineryTitle}`)
  console.log(`  - Region: ${variant.regionTitle}`)
  console.log(`  - Grape Varieties:`, variant.grapeVarieties)
  console.log(`  - Price: ${variant.price}`)

  // Get related wines
  const relatedRecord = await payload.find({
    collection: 'related-wine-variants',
    where: { variantId: { equals: variantId } },
    limit: 1,
  })

  if (relatedRecord.docs.length === 0) {
    console.log('❌ No related wines record found')
    return
  }

  const relatedWines = relatedRecord.docs[0]
  console.log(`\n📊 Related wines count: ${relatedWines.relatedCount}`)
  console.log('📋 Related wines details:')

  if (!relatedWines.relatedVariants || relatedWines.relatedVariants.length === 0) {
    console.log('❌ No related variants found')
    return
  }

  // Group by type
  const groupedByType = relatedWines.relatedVariants.reduce((acc: any, rel: any) => {
    const type = rel.type
    if (!acc[type]) acc[type] = []
    acc[type].push(rel)
    return acc
  }, {})

  for (const [type, variants] of Object.entries(groupedByType)) {
    console.log(`\n🎯 ${type.toUpperCase()} (${(variants as any[]).length} wines):`)
    for (const rel of variants as any[]) {
      console.log(`  - Score: ${rel.score}, Reason: ${rel.reason}`)

      // Get the actual variant details
      const relatedVariant = (await payload.findByID({
        collection: 'flat-wine-variants',
        id: typeof rel.relatedVariant === 'object' ? rel.relatedVariant.id : rel.relatedVariant,
      })) as FlatWineVariant

      console.log(`    ${relatedVariant.wineTitle} (${relatedVariant.wineryTitle})`)
      console.log(`    Grape varieties:`, relatedVariant.grapeVarieties)
      console.log(`    Price: ${relatedVariant.price}`)
    }
  }

  // Check for grape variety compositions specifically
  console.log('\n🍇 Checking grape variety compositions...')

  if (variant.grapeVarieties && variant.grapeVarieties.length > 0) {
    console.log(`Current wine has ${variant.grapeVarieties.length} grape variety(ies):`)
    variant.grapeVarieties.forEach((gv, index) => {
      console.log(`  ${index + 1}. ${gv.title} (${gv.percentage}%)`)
    })

    // Find wines with compositions
    const compositionWines = await payload.find({
      collection: 'flat-wine-variants',
      where: {
        and: [
          { grapeVarieties__title: { equals: variant.grapeVarieties[0].title } },
          { id: { not_equals: variantId } },
          { isPublished: { equals: true } },
          { stockOnHand: { greater_than: 0 } },
        ],
      },
      limit: 10,
      sort: '-createdAt',
      depth: 1,
    })

    console.log(
      `\nFound ${compositionWines.docs.length} wines containing ${variant.grapeVarieties[0].title}:`,
    )
    for (const wine of compositionWines.docs as FlatWineVariant[]) {
      console.log(
        `  - ${wine.wineTitle}: ${wine.grapeVarieties?.map((gv) => `${gv.title} (${gv.percentage}%)`).join(', ')}`,
      )
    }
  }

  await payload.destroy()
}

debugSpecificWine().catch(console.error)
