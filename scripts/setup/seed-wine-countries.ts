import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../src/lib/logger'
import payloadConfig from '../src/payload.config'

interface WineCountryData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
  whyCool?: {
    sl: string
    en: string
  }
  landArea?: number
  wineriesCount?: number
}

const wineCountriesData: WineCountryData[] = [
  {
    title: {
      sl: 'Argentina',
      en: 'Argentina',
    },
    description: {
      sl: 'Argentina je največja vinogradniška država v Južni Ameriki z dolgoletno tradicijo vinarstva.',
      en: 'Argentina is the largest wine-producing country in South America with a long winemaking tradition.',
    },
    whyCool: {
      sl: 'Argentina je svetovno znana po svojih Malbec vinih iz Mendoza regije in visokogorskih vinogradih.',
      en: 'Argentina is world-renowned for its Malbec wines from the Mendoza region and high-altitude vineyards.',
    },
    landArea: 2780400,
    wineriesCount: 1200,
  },
  {
    title: {
      sl: 'Avstralija',
      en: 'Australia',
    },
    description: {
      sl: 'Avstralija je pomembna vinogradniška država z inovativnim pristopom k vinarstvu.',
      en: 'Australia is an important wine-growing country with an innovative approach to winemaking.',
    },
    whyCool: {
      sl: 'Avstralija je znana po svojih Shiraz vinih iz Barossa Valley in Chardonnay iz Margaret River.',
      en: 'Australia is known for its Shiraz wines from Barossa Valley and Chardonnay from Margaret River.',
    },
    landArea: 7692024,
    wineriesCount: 2400,
  },
  {
    title: {
      sl: 'Avstrija',
      en: 'Austria',
    },
    description: {
      sl: 'Avstrija je majhna, a pomembna vinogradniška država z visokokakovostnimi belimi vini.',
      en: 'Austria is a small but important wine-growing country with high-quality white wines.',
    },
    whyCool: {
      sl: 'Avstrija je znana po svojih Grüner Veltliner vinih in sladkih vinih iz Burgenlanda.',
      en: 'Austria is known for its Grüner Veltliner wines and sweet wines from Burgenland.',
    },
    landArea: 83879,
    wineriesCount: 23000,
  },
  {
    title: {
      sl: 'Francija',
      en: 'France',
    },
    description: {
      sl: 'Francija je svetovna prestolnica vinarstva z najbolj prestižnimi vinogradniškimi regijami.',
      en: 'France is the world capital of winemaking with the most prestigious wine regions.',
    },
    whyCool: {
      sl: 'Francija je dom najboljših vin na svetu iz regij kot so Bordeaux, Burgundy, Champagne in Rhône.',
      en: "France is home to the world's finest wines from regions like Bordeaux, Burgundy, Champagne, and Rhône.",
    },
    landArea: 551695,
    wineriesCount: 270000,
  },
  {
    title: {
      sl: 'Italija',
      en: 'Italy',
    },
    description: {
      sl: 'Italija je ena največjih vinogradniških držav na svetu z več kot 350 različnimi sortami grozdja.',
      en: 'Italy is one of the largest wine-producing countries in the world with more than 350 different grape varieties.',
    },
    whyCool: {
      sl: 'Italija je dom legendarnih vin kot so Barolo, Chianti, Brunello di Montalcino in Amarone.',
      en: 'Italy is home to legendary wines like Barolo, Chianti, Brunello di Montalcino, and Amarone.',
    },
    landArea: 301340,
    wineriesCount: 310000,
  },
  {
    title: {
      sl: 'Madžarska',
      en: 'Hungary',
    },
    description: {
      sl: 'Madžarska ima bogato vinogradniško tradicijo z edinstvenimi sladkimi vini.',
      en: 'Hungary has a rich wine-growing tradition with unique sweet wines.',
    },
    whyCool: {
      sl: 'Madžarska je dom legendarnih Tokaji vinov, enih najboljših sladkih vin na svetu.',
      en: 'Hungary is home to legendary Tokaji wines, some of the finest sweet wines in the world.',
    },
    landArea: 93028,
    wineriesCount: 22000,
  },
  {
    title: {
      sl: 'Slovenija',
      en: 'Slovenia',
    },
    description: {
      sl: 'Slovenija je majhna, a ponosna vinogradniška država z bogasto zgodovino vinarstva, ki sega več kot 2000 let nazaj.',
      en: 'Slovenia is a small but proud wine-growing country with a rich winemaking history dating back more than 2000 years.',
    },
    whyCool: {
      sl: 'Slovenija je dom edinstvenih vin, kot so Teran, Refošk in Modra Frankinja, ter prideluje vrhunske belo vino iz Rebule.',
      en: 'Slovenia is home to unique wines like Teran, Refošk, and Modra Frankinja, and produces excellent white wine from Rebula.',
    },
    landArea: 20273,
    wineriesCount: 28000,
  },
  {
    title: {
      sl: 'ZDA',
      en: 'United States',
    },
    description: {
      sl: 'ZDA so ena največjih vinogradniških držav z različnimi klimatskimi območji.',
      en: 'The United States is one of the largest wine-producing countries with diverse climate zones.',
    },
    whyCool: {
      sl: 'Kalifornija je dom najboljših ameriških vinov, predvsem iz Napa Valley in Sonoma County.',
      en: 'California is home to the finest American wines, especially from Napa Valley and Sonoma County.',
    },
    landArea: 9833517,
    wineriesCount: 11000,
  },
  {
    title: {
      sl: 'Španija',
      en: 'Spain',
    },
    description: {
      sl: 'Španija ima največjo površino vinogradov na svetu in bogato tradicijo vinarstva.',
      en: 'Spain has the largest vineyard area in the world and a rich winemaking tradition.',
    },
    whyCool: {
      sl: 'Španija je znana po svojih Tempranillo vinih, Rioji, Prioratu in sherry vinih iz Andaluzije.',
      en: 'Spain is known for its Tempranillo wines, Rioja, Priorat, and sherry wines from Andalusia.',
    },
    landArea: 505990,
    wineriesCount: 4000000,
  },
]

async function seedWineCountries(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    logger.info('Starting wine countries seeding...', { task: 'seed-wine-countries' })

    for (const countryData of wineCountriesData) {
      try {
        // Check if country already exists
        const existingCountry = await payload.find({
          collection: 'wineCountries',
          where: {
            'title.sl': {
              equals: countryData.title.sl,
            },
          },
        })

        if (existingCountry.docs.length > 0) {
          logger.info(`Country ${countryData.title.sl} already exists, skipping...`, {
            task: 'seed-wine-countries',
            country: countryData.title.sl,
          })
          continue
        }

        // Create the country with Slovenian locale
        const createdCountry = await payload.create({
          collection: 'wineCountries',
          data: {
            title: countryData.title.sl,
            description: countryData.description?.sl || '',
            whyCool: countryData.whyCool?.sl || '',
            landArea: countryData.landArea,
            wineriesCount: countryData.wineriesCount,
          },
          locale: 'sl',
        })

        // Update with English locale
        await payload.update({
          collection: 'wineCountries',
          id: createdCountry.id,
          data: {
            title: countryData.title.en,
            description: countryData.description?.en || '',
            whyCool: countryData.whyCool?.en || '',
          },
          locale: 'en',
        })

        logger.info(`Created wine country: ${createdCountry.title}`, {
          task: 'seed-wine-countries',
          country: countryData.title.sl,
        })
      } catch (error) {
        logger.error(
          `Failed to create wine country: ${countryData.title.sl} - ${(error as Error).message}`,
          error as Error,
          {
            task: 'seed-wine-countries',
            country: countryData.title.sl,
          },
        )
      }
    }

    logger.info('Wine countries seeding completed successfully', { task: 'seed-wine-countries' })
  } catch (error) {
    logger.error('Failed to seed wine countries', error as Error, { task: 'seed-wine-countries' })
    throw error
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedWineCountries()
    .then(() => {
      logger.info('Seeding completed', { task: 'seed-wine-countries' })
      process.exit(0)
    })
    .catch((error) => {
      logger.error('Seeding failed', error as Error, { task: 'seed-wine-countries' })
      process.exit(1)
    })
}

export { seedWineCountries }
