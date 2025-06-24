import payload from 'payload'
import config from '../src/payload.config.ts'

async function debugSingleVariant() {
  try {
    await payload.init({
      config,
      secret: process.env.PAYLOAD_SECRET,
      local: true,
    })

    console.log('Testing single variant sync...\n')

    // Get one published variant that failed
    const testVariantId = 646 // From our earlier failed jobs

    console.log(`🔍 Testing variant ${testVariantId}`)

    const wineVariant = await payload.findByID({
      collection: 'wine-variants',
      id: testVariantId,
      depth: 3,
    })

    console.log('Wine variant data:', {
      id: wineVariant.id,
      status: wineVariant._status,
      wineTitle: wineVariant.wine?.title,
      wineryTitle: wineVariant.wine?.winery?.title,
    })

    // Prepare the exact same data as the sync task
    const wine = wineVariant.wine

    const mapTitleOnly = (arr) =>
      arr?.map((item) => {
        if (typeof item === 'object' && item !== null) {
          return {
            title: typeof item.title === 'string' ? item.title : null,
          }
        }
        return { title: typeof item === 'string' ? item : String(item) }
      })

    const mapGrapeVarieties = (arr) =>
      arr?.map((gv) => {
        let title = null
        if (gv && typeof gv === 'object') {
          if (gv.variety && typeof gv.variety === 'object') {
            title = typeof gv.variety.title === 'string' ? gv.variety.title : null
          } else if (typeof gv.variety === 'string' || typeof gv.variety === 'number') {
            title = String(gv.variety)
          }
        }
        return { title }
      })

    let primaryImageUrl = undefined
    if (Array.isArray(wineVariant.media) && wineVariant.media.length > 0) {
      const media0 = wineVariant.media[0]
      if (
        media0 &&
        typeof media0 === 'object' &&
        'url' in media0 &&
        typeof media0.url === 'string'
      ) {
        primaryImageUrl = media0.url
      }
    }

    const flatVariantData = {
      originalVariant: wineVariant.id,
      wineTitle: wine.title,
      wineryTitle: wine.winery.title,
      wineryCode: wine.winery.wineryCode,
      regionTitle: wine.region.title,
      countryTitle: wine.region.country.title,
      vintage: wineVariant.vintage,
      size: wineVariant.size,
      sku: wineVariant.sku,
      price: wineVariant.price,
      stockOnHand: wineVariant.stockOnHand,
      canBackorder: wineVariant.canBackorder,
      maxBackorderQuantity: wineVariant.maxBackorderQuantity,
      servingTemp: wineVariant.servingTemp,
      decanting: wineVariant.decanting,
      tastingProfile: wineVariant.tastingProfile,
      aromas: wineVariant.aromas ? mapTitleOnly(wineVariant.aromas) : undefined,
      tags: wineVariant.tags ? mapTitleOnly(wineVariant.tags) : undefined,
      moods: wineVariant.moods ? mapTitleOnly(wineVariant.moods) : undefined,
      grapeVarieties: wineVariant.grapeVarieties
        ? mapGrapeVarieties(wineVariant.grapeVarieties)
        : undefined,
      primaryImageUrl,
      isPublished: wineVariant._status === 'published',
      syncedAt: new Date().toISOString(),
    }

    console.log('\n📊 Flat variant data to create:')
    console.log(JSON.stringify(flatVariantData, null, 2))

    console.log('\n🚀 Attempting to create flat variant...')

    try {
      const createResult = await payload.create({
        collection: 'flat-wine-variants',
        data: flatVariantData,
      })
      console.log('✅ Success! Created flat variant:', createResult.id)
    } catch (error) {
      console.error('❌ Failed to create flat variant:', error.message)
      console.error('Error details:', {
        name: error.name,
        data: error.data,
        field: error.field,
        stack: error.stack?.split('\n').slice(0, 3).join('\n'),
      })
    }

    process.exit(0)
  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

debugSingleVariant()
