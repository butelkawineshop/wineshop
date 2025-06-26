import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { logger } from '../src/lib/logger'
import { SYNC_CONSTANTS } from '../src/constants/sync'

async function testWineVariant() {
  const payload = await getPayload({
    config: payloadConfig,
  })
  const taskLogger = logger.child({ task: 'testWineVariant' })

  try {
    taskLogger.info('Testing wine variant fetch...')

    // Get just one wine variant with full depth
    const wineVariants = await payload.find({
      collection: 'wine-variants',
      limit: 1,
      depth: SYNC_CONSTANTS.MAX_DEPTH,
      locale: SYNC_CONSTANTS.DEFAULT_LOCALE,
    })

    taskLogger.info(`Found ${wineVariants.docs.length} wine variants`)

    if (wineVariants.docs.length > 0) {
      const wineVariant = wineVariants.docs[0]
      taskLogger.info(`Testing variant ID: ${wineVariant.id}`)

      // Log the structure
      taskLogger.info('Wine variant structure:', {
        id: wineVariant.id,
        hasWine: !!wineVariant.wine,
        wineType: typeof wineVariant.wine,
        wineKeys: wineVariant.wine ? Object.keys(wineVariant.wine) : 'no wine',
      })

      if (wineVariant.wine) {
        const wine = wineVariant.wine as any
        taskLogger.info('Wine structure:', {
          id: wine.id,
          title: wine.title,
          hasWinery: !!wine.winery,
          hasRegion: !!wine.region,
          hasStyle: !!wine.style,
        })

        // Test the wine data extraction
        const wineRegion = typeof wine.region === 'object' ? wine.region : null
        const wineCountry =
          wineRegion && typeof wineRegion.country === 'object' ? wineRegion.country : null
        const style = typeof wine.style === 'object' ? wine.style : null
        const winery = typeof wine.winery === 'object' ? wine.winery : null

        taskLogger.info('Extracted data:', {
          wineRegion: !!wineRegion,
          wineCountry: !!wineCountry,
          style: !!style,
          winery: !!winery,
        })

        // Test one of the fetch functions
        if (wineCountry) {
          taskLogger.info('Testing English country title fetch...')
          try {
            const englishCountryTitle = await payload.findByID({
              collection: 'wineCountries',
              id: wineCountry.id,
              locale: SYNC_CONSTANTS.ENGLISH_LOCALE,
            })
            taskLogger.info('English country title fetch successful:', !!englishCountryTitle)
          } catch (error) {
            taskLogger.error('English country title fetch failed:', error)
          }
        }
      }
    }

    process.exit(0)
  } catch (error: any) {
    taskLogger.error('Test failed:', error)
    process.exit(1)
  }
}

testWineVariant()
