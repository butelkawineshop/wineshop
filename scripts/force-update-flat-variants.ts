import { createPayloadService } from '../src/lib/payload'
import { logger } from '../src/lib/logger'

async function forceUpdateFlatVariants() {
  const payload = createPayloadService()
  const taskLogger = logger.child({ task: 'forceUpdateFlatVariants' })

  try {
    taskLogger.info('Starting force update of flat wine variants to new structure')

    // Get all wine variants with full depth
    const wineVariants = await payload.find('wine-variants', {
      limit: 1000,
      depth: 3,
      locale: 'sl',
    })

    taskLogger.info(`Found ${wineVariants.docs.length} wine variants to process`)

    // Delete all existing flat variants first
    const existingFlatVariants = await payload.find('flat-wine-variants', {
      limit: 1000,
    })

    if (existingFlatVariants.docs.length > 0) {
      taskLogger.info(`Deleting ${existingFlatVariants.docs.length} existing flat variants`)

      for (const flatVariant of existingFlatVariants.docs) {
        await payload.delete('flat-wine-variants', String(flatVariant.id))
      }

      taskLogger.info('Successfully deleted all existing flat variants')
    }

    // Create new flat variants directly
    let successCount = 0
    let errorCount = 0

    for (const wineVariant of wineVariants.docs) {
      try {
        // Get the wine with full relationships
        const wine = wineVariant.wine as any
        if (!wine || typeof wine !== 'object') {
          taskLogger.warn(`Skipping variant ${wineVariant.id} - no wine relationship`)
          continue
        }

        // Get region and country info
        const region = (wine.region ?? {}) as any
        const country = region && typeof region === 'object' ? region.country : null
        const style = wine.style as any
        const winery = wine.winery as any

        if (!region || !country || !style || !winery) {
          taskLogger.warn(`Skipping variant ${wineVariant.id} - missing relationships`)
          continue
        }

        // Prepare flat variant data
        const flatVariantData = {
          originalVariant: wineVariant.id,
          wineTitle: wine.title,
          wineryTitle: winery.title,
          wineryCode: winery.wineryCode,
          regionTitle: region.title,
          countryTitle: country.title,
          countryTitleEn: null,
          styleTitle: style.title,
          styleTitleEn: null,
          styleIconKey: style.iconKey,
          styleSlug: style.slug,
          vintage: wineVariant.vintage,
          size: wineVariant.size,
          sku: wineVariant.sku,
          price: wineVariant.price,
          stockOnHand: wineVariant.stockOnHand,
          canBackorder: wineVariant.canBackorder,
          maxBackorderQuantity: wineVariant.maxBackorderQuantity,
          servingTemp: wineVariant.servingTemp || '',
          decanting: wineVariant.decanting || false,
          tastingProfile: wineVariant.tastingProfile || '',
          // Add the missing tastingNotes group field
          tastingNotes: {
            dry: (wineVariant.tastingNotes as any)?.dry || null,
            ripe: (wineVariant.tastingNotes as any)?.ripe || null,
            creamy: (wineVariant.tastingNotes as any)?.creamy || null,
            oaky: (wineVariant.tastingNotes as any)?.oaky || null,
            complex: (wineVariant.tastingNotes as any)?.complex || null,
            light: (wineVariant.tastingNotes as any)?.light || null,
            smooth: (wineVariant.tastingNotes as any)?.smooth || null,
            youthful: (wineVariant.tastingNotes as any)?.youthful || null,
            energetic: (wineVariant.tastingNotes as any)?.energetic || null,
            alcohol: (wineVariant.tastingNotes as any)?.alcohol || null,
          },
          aromas: wineVariant.aromas || [],
          tags: wineVariant.tags || [],
          moods: wineVariant.moods || [],
          grapeVarieties: wineVariant.grapeVarieties || [],
          climates: wineVariant.climates || [],
          dishes: wineVariant.dishes || [],
          primaryImageUrl:
            Array.isArray(wineVariant.media) &&
            wineVariant.media.length > 0 &&
            typeof wineVariant.media[0] === 'object'
              ? (wineVariant.media[0] as any).url
              : null,
          isPublished: wineVariant.isPublished,
          syncedAt: new Date().toISOString(),
        }

        // Create the flat variant
        await payload.create('flat-wine-variants', flatVariantData)

        successCount++

        if (successCount % 10 === 0) {
          taskLogger.info(`Created ${successCount} flat variants`)
        }
      } catch (error: any) {
        errorCount++
        taskLogger.error(`Failed to create flat variant for ${wineVariant.id}:`, error.message)
      }
    }

    taskLogger.info(
      `Force update complete! Successfully created ${successCount} flat variants, ${errorCount} errors`,
    )

    // Check final count
    const finalFlatVariants = await payload.find('flat-wine-variants', {
      limit: 1000,
    })

    taskLogger.info(`Final count: ${finalFlatVariants.docs.length} flat variants`)

    process.exit(0)
  } catch (error: any) {
    taskLogger.error('Failed to force update flat wine variants:', error)
    process.exit(1)
  }
}

forceUpdateFlatVariants()
