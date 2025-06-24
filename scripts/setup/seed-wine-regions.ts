import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../src/lib/logger'
import payloadConfig from '../src/payload.config'

interface WineRegionData {
  title: string
  whyCool: {
    sl: string
    en: string
  }
  priceRange?: '8-12' | '12-18' | '18-24' | '24-30' | '30-40' | '40-50' | '50-60'
  description?: {
    sl: string
    en: string
  }
  countrySlug: string
  neighbours?: string[]
  legends?: string[]
}

const wineRegionsData: WineRegionData[] = [
  // France
  {
    title: 'Alsace',
    whyCool: {
      sl: 'Alzacija je znana po svojih elegantnih belih vinih, predvsem Riesling in Gewürztraminer.',
      en: 'Alsace is known for its elegant white wines, especially Riesling and Gewürztraminer.',
    },
    priceRange: '24-30',
    description: {
      sl: 'Alzacija je francoska regija ob meji z Nemčijo, znana po svojih aromatičnih belih vinih.',
      en: 'Alsace is a French region on the border with Germany, known for its aromatic white wines.',
    },
    countrySlug: 'francija',
  },
  {
    title: 'Beaujolais',
    whyCool: {
      sl: 'Beaujolais je znan po svojih lahkih in osvežilnih Gamay vinih.',
      en: 'Beaujolais is known for its light and refreshing Gamay wines.',
    },
    priceRange: '12-18',
    description: {
      sl: 'Beaujolais regija v južni Burgundiji prideluje elegantna vina iz Gamay sorte.',
      en: 'The Beaujolais region in southern Burgundy produces elegant wines from the Gamay variety.',
    },
    countrySlug: 'francija',
  },
  {
    title: 'Bordeaux',
    whyCool: {
      sl: 'Bordeaux je svetovna prestolnica rdečih vinov z najboljšimi Château vinogradniki na svetu.',
      en: 'Bordeaux is the world capital of red wines with the finest Château vineyards in the world.',
    },
    priceRange: '50-60',
    description: {
      sl: 'Bordeaux regija v jugozahodni Franciji je dom najprestižnejših vinov na svetu z bogasto zgodovino.',
      en: 'The Bordeaux region in southwestern France is home to the most prestigious wines in the world with a rich history.',
    },
    countrySlug: 'francija',
  },
  {
    title: 'Bourgogne',
    whyCool: {
      sl: 'Burgundija je znana po svojih Pinot Noir in Chardonnay vinih iz najboljših terroirjev na svetu.',
      en: 'Burgundy is known for its Pinot Noir and Chardonnay wines from the finest terroirs in the world.',
    },
    priceRange: '50-60',
    description: {
      sl: 'Burgundija je vzhodna francoska regija z edinstvenimi apnenčastimi tlemi za pridelavo elegantnih vin.',
      en: 'Burgundy is an eastern French region with unique limestone soils for producing elegant wines.',
    },
    countrySlug: 'francija',
  },
  {
    title: 'Champagne',
    whyCool: {
      sl: 'Šampanja je edina regija na svetu, ki lahko proizvaja pravi šampanjec z edinstveno metodo.',
      en: 'Champagne is the only region in the world that can produce true champagne with a unique method.',
    },
    priceRange: '40-50',
    description: {
      sl: 'Šampanja regija v severovzhodni Franciji je dom najboljših peninih vinov na svetu.',
      en: 'The Champagne region in northeastern France is home to the finest sparkling wines in the world.',
    },
    countrySlug: 'francija',
  },
  {
    title: 'Corbiere',
    whyCool: {
      sl: 'Corbières je znan po svojih močnih rdečih vinih iz južne Francije.',
      en: 'Corbières is known for its powerful red wines from southern France.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Corbières regija v Languedoc-Roussillon prideluje tradicionalna vina z mediteranskim vplivom.',
      en: 'The Corbières region in Languedoc-Roussillon produces traditional wines with Mediterranean influence.',
    },
    countrySlug: 'francija',
  },
  {
    title: 'Provence',
    whyCool: {
      sl: 'Provence je znan po svojih elegantnih rosé vinih in mediteranskem slogu.',
      en: 'Provence is known for its elegant rosé wines and Mediterranean style.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Provence regija v jugovzhodni Franciji je dom najboljših rosé vinov na svetu.',
      en: 'The Provence region in southeastern France is home to the finest rosé wines in the world.',
    },
    countrySlug: 'francija',
  },
  {
    title: 'Val de Rhone',
    whyCool: {
      sl: 'Rhône Valley je znan po svojih močnih rdečih vinih iz Syrah in Grenache sort.',
      en: 'The Rhône Valley is known for its powerful red wines from Syrah and Grenache varieties.',
    },
    priceRange: '24-30',
    description: {
      sl: 'Rhône Valley v jugovzhodni Franciji prideluje kompleksna vina z dolgoletno tradicijo.',
      en: 'The Rhône Valley in southeastern France produces complex wines with a long tradition.',
    },
    countrySlug: 'francija',
  },

  // Italy
  {
    title: 'Alto Adige',
    whyCool: {
      sl: 'Alto Adige je znan po svojih elegantnih belih vinih v alpskem okolju.',
      en: 'Alto Adige is known for its elegant white wines in an alpine environment.',
    },
    priceRange: '24-30',
    description: {
      sl: 'Alto Adige je južnotirolska regija z edinstvenimi mikroklimatskimi pogoji.',
      en: 'Alto Adige is a South Tyrolean region with unique microclimatic conditions.',
    },
    countrySlug: 'italija',
  },
  {
    title: 'Collio-Friuli',
    whyCool: {
      sl: 'Collio-Friuli je znan po svojih elegantnih belih vinih in edinstvenih sortah.',
      en: 'Collio-Friuli is known for its elegant white wines and unique varieties.',
    },
    priceRange: '24-30',
    description: {
      sl: 'Collio-Friuli regija v severovzhodni Italiji prideluje visokokakovostna bela vina.',
      en: 'The Collio-Friuli region in northeastern Italy produces high-quality white wines.',
    },
    countrySlug: 'italija',
  },
  {
    title: 'Piemonte',
    whyCool: {
      sl: "Piemont je dom najboljših italijanskih vinov, vključno z Barolo, Barbaresco in Barbera d'Alba.",
      en: "Piedmont is home to the finest Italian wines, including Barolo, Barbaresco, and Barbera d'Alba.",
    },
    priceRange: '40-50',
    description: {
      sl: 'Piemont je severozahodna regija Italije z alpskim podnebjem, ki prideluje kompleksna in elegantna vina.',
      en: 'Piedmont is a northwestern region of Italy with an alpine climate that produces complex and elegant wines.',
    },
    countrySlug: 'italija',
  },
  {
    title: 'Prosecco',
    whyCool: {
      sl: 'Prosecco je znan po svojih osvežilnih peninih vinih iz Glera sorte.',
      en: 'Prosecco is known for its refreshing sparkling wines from the Glera variety.',
    },
    priceRange: '12-18',
    description: {
      sl: 'Prosecco regija v severovzhodni Italiji je dom najboljših peninih vinov.',
      en: 'The Prosecco region in northeastern Italy is home to the finest sparkling wines.',
    },
    countrySlug: 'italija',
  },
  {
    title: 'Sicilia',
    whyCool: {
      sl: 'Sicilija je znana po svojih močnih rdečih vinih in edinstvenih avtohtonih sortah.',
      en: 'Sicily is known for its powerful red wines and unique indigenous varieties.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Sicilija je največji otok v Sredozemlju z bogasto vinogradniško tradicijo.',
      en: 'Sicily is the largest island in the Mediterranean with a rich wine-growing tradition.',
    },
    countrySlug: 'italija',
  },
  {
    title: 'Toscana',
    whyCool: {
      sl: 'Toskana je dom legendarnih vin kot so Chianti, Brunello di Montalcino in Vino Nobile di Montepulciano.',
      en: 'Tuscany is home to legendary wines like Chianti, Brunello di Montalcino, and Vino Nobile di Montepulciano.',
    },
    priceRange: '30-40',
    description: {
      sl: 'Toskana je ena najprestižnejših vinogradniških regij v Italiji z bogasto zgodovino in tradicijo vinarstva.',
      en: 'Tuscany is one of the most prestigious wine regions in Italy with a rich history and winemaking tradition.',
    },
    countrySlug: 'italija',
  },
  {
    title: 'Veneto',
    whyCool: {
      sl: 'Veneto je znan po svojih Amarone vinih, Prosecco in Valpolicella, ki so med najboljšimi v Italiji.',
      en: 'Veneto is known for its Amarone wines, Prosecco, and Valpolicella, which are among the best in Italy.',
    },
    priceRange: '24-30',
    description: {
      sl: 'Veneto regija obsega severovzhodno Italijo z različnimi mikroklimatskimi območji za pridelavo vin.',
      en: 'The Veneto region covers northeastern Italy with diverse microclimatic areas for wine production.',
    },
    countrySlug: 'italija',
  },

  // Spain
  {
    title: 'Penedes',
    whyCool: {
      sl: 'Penedès je znan po svojih Cava peninih vinih in tradicionalnih metodah.',
      en: 'Penedès is known for its Cava sparkling wines and traditional methods.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Penedès regija v Kataloniji je dom najboljših Cava vinov na svetu.',
      en: 'The Penedès region in Catalonia is home to the finest Cava wines in the world.',
    },
    countrySlug: 'spanija',
  },
  {
    title: 'Ribera del Duero',
    whyCool: {
      sl: 'Ribera del Duero je znan po svojih močnih Tempranillo vinih z dolgoletno tradicijo.',
      en: 'Ribera del Duero is known for its powerful Tempranillo wines with a long tradition.',
    },
    priceRange: '30-40',
    description: {
      sl: 'Ribera del Duero regija v severni Španiji prideluje visokokakovostna rdeča vina.',
      en: 'The Ribera del Duero region in northern Spain produces high-quality red wines.',
    },
    countrySlug: 'spanija',
  },
  {
    title: 'Rioja',
    whyCool: {
      sl: 'Rioja je najprestižnejša španska vinogradniška regija z dolgoletno tradicijo starjenja v hrastovih sodih.',
      en: 'Rioja is the most prestigious Spanish wine region with a long tradition of aging in oak barrels.',
    },
    priceRange: '24-30',
    description: {
      sl: 'Rioja regija v severni Španiji je znana po svojih Tempranillo vinih z dolgoletno tradicijo.',
      en: 'The Rioja region in northern Spain is known for its Tempranillo wines with a long tradition.',
    },
    countrySlug: 'spanija',
  },
  {
    title: 'Toro',
    whyCool: {
      sl: 'Toro je znan po svojih močnih Tempranillo vinih iz starejših vinogradov.',
      en: 'Toro is known for its powerful Tempranillo wines from older vineyards.',
    },
    priceRange: '24-30',
    description: {
      sl: 'Toro regija v severozahodni Španiji prideluje tradicionalna vina z močnim karakterjem.',
      en: 'The Toro region in northwestern Spain produces traditional wines with strong character.',
    },
    countrySlug: 'spanija',
  },

  // Slovenia
  {
    title: 'Bela Krajina',
    whyCool: {
      sl: 'Bela Krajina je znana po svojih lahkih in osvežilnih vinih z edinstvenim karakterjem.',
      en: 'Bela Krajina is known for its light and refreshing wines with unique character.',
    },
    priceRange: '12-18',
    description: {
      sl: 'Bela Krajina regija v jugovzhodni Sloveniji prideluje tradicionalna vina.',
      en: 'The Bela Krajina region in southeastern Slovenia produces traditional wines.',
    },
    countrySlug: 'slovenija',
  },
  {
    title: 'Dolenjska',
    whyCool: {
      sl: 'Dolenjska je znana po svojih belih vinih, predvsem Cviček, ki je edinstvena mešanica rdečih in belih sort.',
      en: 'Dolenjska is known for its white wines, especially Cviček, which is a unique blend of red and white varieties.',
    },
    priceRange: '12-18',
    description: {
      sl: 'Dolenjska regija se razteza vzdolž reke Save z zmernim podnebjem, primernim za pridelavo lahkih in osvežilnih vin.',
      en: 'The Dolenjska region stretches along the Sava River with a moderate climate suitable for producing light and refreshing wines.',
    },
    countrySlug: 'slovenija',
  },
  {
    title: 'Goriška Brda',
    whyCool: {
      sl: 'Goriška Brda je dom najboljših slovenskih vin z mediteranskim vplivom in edinstvenimi sortami.',
      en: 'Goriška Brda is home to the best Slovenian wines with Mediterranean influence and unique varieties.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Goriška Brda regija obsega zahodni del Slovenije z mediteranskim podnebjem, idealnim za pridelavo rdečih in belih vin.',
      en: 'The Goriška Brda region covers the western part of Slovenia with a Mediterranean climate, ideal for producing red and white wines.',
    },
    countrySlug: 'slovenija',
  },
  {
    title: 'Haloze',
    whyCool: {
      sl: 'Haloze je znana po svojih elegantnih belih vinih in edinstvenih terroirjih.',
      en: 'Haloze is known for its elegant white wines and unique terroirs.',
    },
    priceRange: '12-18',
    description: {
      sl: 'Haloze regija v severovzhodni Sloveniji prideluje tradicionalna bela vina.',
      en: 'The Haloze region in northeastern Slovenia produces traditional white wines.',
    },
    countrySlug: 'slovenija',
  },
  {
    title: 'Istra',
    whyCool: {
      sl: 'Istra je znana po svojih mediteranskih vinih in edinstvenih sortah.',
      en: 'Istria is known for its Mediterranean wines and unique varieties.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Istra regija v jugozahodni Sloveniji prideluje vina z mediteranskim vplivom.',
      en: 'The Istria region in southwestern Slovenia produces wines with Mediterranean influence.',
    },
    countrySlug: 'slovenija',
  },
  {
    title: 'Kras',
    whyCool: {
      sl: 'Kras je znan po svojih edinstvenih vinih iz kraških terroirjev.',
      en: 'Kras is known for its unique wines from karst terroirs.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Kras regija v jugozahodni Sloveniji prideluje vina z edinstvenimi geološkimi pogoji.',
      en: 'The Kras region in southwestern Slovenia produces wines with unique geological conditions.',
    },
    countrySlug: 'slovenija',
  },
  {
    title: 'Maribor',
    whyCool: {
      sl: 'Maribor je znan po svojih tradicionalnih vinih in zgodovinskih vinogradih.',
      en: 'Maribor is known for its traditional wines and historic vineyards.',
    },
    priceRange: '12-18',
    description: {
      sl: 'Maribor regija v severovzhodni Sloveniji prideluje tradicionalna vina.',
      en: 'The Maribor region in northeastern Slovenia produces traditional wines.',
    },
    countrySlug: 'slovenija',
  },
  {
    title: 'Prekmurje',
    whyCool: {
      sl: 'Prekmurje je znano po svojih lahkih vinih in edinstvenih sortah.',
      en: 'Prekmurje is known for its light wines and unique varieties.',
    },
    priceRange: '12-18',
    description: {
      sl: 'Prekmurje regija v severovzhodni Sloveniji prideluje tradicionalna vina.',
      en: 'The Prekmurje region in northeastern Slovenia produces traditional wines.',
    },
    countrySlug: 'slovenija',
  },
  {
    title: 'Vipavska Dolina',
    whyCool: {
      sl: 'Vipavska dolina je znana po svojih elegantnih vinih in edinstvenih mikroklimatskih pogojih.',
      en: 'Vipava Valley is known for its elegant wines and unique microclimatic conditions.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Vipavska dolina v zahodni Sloveniji prideluje vina z edinstvenimi vetrovi.',
      en: 'Vipava Valley in western Slovenia produces wines with unique winds.',
    },
    countrySlug: 'slovenija',
  },

  // Austria
  {
    title: 'Kremstal',
    whyCool: {
      sl: 'Kremstal je znan po svojih elegantnih belih vinih iz Donavske nižine.',
      en: 'Kremstal is known for its elegant white wines from the Danube Valley.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Kremstal regija v Spodnji Avstriji prideluje visokokakovostna bela vina.',
      en: 'The Kremstal region in Lower Austria produces high-quality white wines.',
    },
    countrySlug: 'avstrija',
  },
  {
    title: 'Wachau',
    whyCool: {
      sl: 'Wachau je znan po svojih najboljših Riesling vinih na svetu.',
      en: 'Wachau is known for its finest Riesling wines in the world.',
    },
    priceRange: '24-30',
    description: {
      sl: 'Wachau regija ob Donavi je dom najprestižnejših avstrijskih vinov.',
      en: 'The Wachau region along the Danube is home to the most prestigious Austrian wines.',
    },
    countrySlug: 'avstrija',
  },

  // Australia
  {
    title: 'Barossa Valley',
    whyCool: {
      sl: 'Barossa Valley je znan po svojih močnih Shiraz vinih in dolgoletni tradiciji.',
      en: 'Barossa Valley is known for its powerful Shiraz wines and long tradition.',
    },
    priceRange: '24-30',
    description: {
      sl: 'Barossa Valley v Južni Avstraliji je dom najboljših Shiraz vinov na svetu.',
      en: 'Barossa Valley in South Australia is home to the finest Shiraz wines in the world.',
    },
    countrySlug: 'avstralija',
  },
  {
    title: 'Eden Valley',
    whyCool: {
      sl: 'Eden Valley je znan po svojih elegantnih Riesling vinih in visokogorskih vinogradih.',
      en: 'Eden Valley is known for its elegant Riesling wines and high-altitude vineyards.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Eden Valley v Južni Avstraliji prideluje elegantna bela vina.',
      en: 'Eden Valley in South Australia produces elegant white wines.',
    },
    countrySlug: 'avstralija',
  },

  // USA
  {
    title: 'California',
    whyCool: {
      sl: 'Kalifornija je dom najboljših ameriških vinov z različnimi mikroklimatskimi območji.',
      en: 'California is home to the finest American wines with diverse microclimatic areas.',
    },
    priceRange: '30-40',
    description: {
      sl: 'Kalifornija je največja vinogradniška regija v ZDA z različnimi podnebji.',
      en: 'California is the largest wine region in the USA with diverse climates.',
    },
    countrySlug: 'zda',
  },

  // Argentina
  {
    title: 'Mendoza',
    whyCool: {
      sl: 'Mendoza je znana po svojih Malbec vinih iz visokogorskih vinogradov.',
      en: 'Mendoza is known for its Malbec wines from high-altitude vineyards.',
    },
    priceRange: '18-24',
    description: {
      sl: 'Mendoza regija v zahodni Argentini je dom najboljših Malbec vinov na svetu.',
      en: 'The Mendoza region in western Argentina is home to the finest Malbec wines in the world.',
    },
    countrySlug: 'argentina',
  },

  // Hungary
  {
    title: 'Tokaji',
    whyCool: {
      sl: 'Tokaji je dom legendarnih sladkih vin, enih najboljših na svetu.',
      en: 'Tokaji is home to legendary sweet wines, some of the finest in the world.',
    },
    priceRange: '40-50',
    description: {
      sl: 'Tokaji regija v severovzhodni Madžarski je znana po svojih sladkih vinih.',
      en: 'The Tokaji region in northeastern Hungary is known for its sweet wines.',
    },
    countrySlug: 'madzarska',
  },
]

async function seedWineRegions(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    logger.info('Starting wine regions seeding...', { task: 'seed-wine-regions' })

    // Get all countries for reference
    const countries = await payload.find({
      collection: 'wineCountries',
      limit: 100,
    })

    const countryMap = new Map(countries.docs.map((country) => [country.slug, country.id]))

    for (const regionData of wineRegionsData) {
      try {
        // Check if region already exists
        const existingRegion = await payload.find({
          collection: 'regions',
          where: {
            title: {
              equals: regionData.title,
            },
          },
        })

        if (existingRegion.docs.length > 0) {
          logger.info(`Region ${regionData.title} already exists, skipping...`, {
            task: 'seed-wine-regions',
            region: regionData.title,
          })
          continue
        }

        // Get country ID
        const countryId = countryMap.get(regionData.countrySlug)
        if (!countryId) {
          logger.warn(
            `Country ${regionData.countrySlug} not found for region ${regionData.title}`,
            {
              task: 'seed-wine-regions',
              region: regionData.title,
              country: regionData.countrySlug,
            },
          )
          continue
        }

        // Prepare region data with Slovenian locale
        const regionPayload = {
          title: regionData.title,
          whyCool: regionData.whyCool?.sl || '',
          priceRange: regionData.priceRange,
          description: regionData.description?.sl || '',
          country: countryId,
        }

        // Create the region with Slovenian locale
        const createdRegion = await payload.create({
          collection: 'regions',
          data: regionPayload,
          locale: 'sl',
        })

        // Update with English locale
        await payload.update({
          collection: 'regions',
          id: createdRegion.id,
          data: {
            title: regionData.title,
            whyCool: regionData.whyCool?.en || '',
            description: regionData.description?.en || '',
          },
          locale: 'en',
        })

        logger.info(`Created wine region: ${createdRegion.title}`, {
          task: 'seed-wine-regions',
          region: regionData.title,
        })
      } catch (error) {
        logger.error(`Failed to create wine region: ${regionData.title}`, error as Error, {
          task: 'seed-wine-regions',
          region: regionData.title,
        })
      }
    }

    logger.info('Wine regions seeding completed successfully', { task: 'seed-wine-regions' })
  } catch (error) {
    logger.error('Failed to seed wine regions', error as Error, { task: 'seed-wine-regions' })
    throw error
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedWineRegions()
    .then(() => {
      logger.info('Seeding completed', { task: 'seed-wine-regions' })
      process.exit(0)
    })
    .catch((error) => {
      logger.error('Seeding failed', error as Error, { task: 'seed-wine-regions' })
      process.exit(1)
    })
}

export { seedWineRegions }
