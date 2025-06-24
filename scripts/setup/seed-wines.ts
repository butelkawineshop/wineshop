import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'
import type { WineImageMapping } from '../../src/utilities/wineImageMapping'
import { generateWineSlug } from '../../src/utils/generateWineSlug'
import { readFile } from 'fs/promises'
import path from 'path'
import Papa from 'papaparse'

interface WineData {
  title: string
  winery: string
  region: string
  style: string
  description?: {
    sl: string
    en: string
  }
  imageMapping?: WineImageMapping
  variants: WineVariantData[]
}

interface WineVariantData {
  size: string
  vintage: string
  price: number
  stockOnHand: number
  canBackorder: boolean
  maxBackorderQuantity?: number
  servingTemp?: string
  decanting?: boolean
  tastingProfile?: {
    sl: string
    en: string
  }
  tastingNotes?: Record<string, unknown>
  grapeVarieties?: Array<{
    variety: string
    percentage: number
  }>
}

function mapCategoryToStyle(category: string): string {
  const styleMap: { [key: string]: string } = {
    Sladko: 'Cukri',
    Cukri: 'Cukri',
    Rose: 'Roza',
    Roza: 'Roza',
    Rdeče: 'Rdeče',
    Belo: 'Belo',
    Mehurčki: 'Mehurčki',
    Malčki: 'Malčki',
    Zverine: 'Zverine',
  }
  if (!styleMap[category]) {
    console.warn(`⚠️  Unknown category '${category}', defaulting to 'Belo'`)
    return 'Belo'
  }
  return styleMap[category]
}

function parseGrapeVarieties(grapeString: string): Array<{ variety: string; percentage: number }> {
  if (!grapeString) return []
  const grapes = grapeString.split(',').map((g) => g.trim())
  const percentage = Math.floor(100 / grapes.length)
  return grapes.map((grape) => ({
    variety: grape,
    percentage: percentage,
  }))
}

function parsePrice(priceString: string): number {
  if (!priceString) return 0
  return parseFloat(priceString.replace('€', '').replace(',', '.'))
}

interface CSVRow {
  Wine: string
  Vendor: string
  Region: string
  Category: string
  Size: string
  Vintage: string
  'List Price': string
  Backorder: string
  grapeVarieties: string
}

function parseWineCSVRows(rows: CSVRow[]): WineData[] {
  const wineMap = new Map<string, WineData>()
  for (const row of rows) {
    const key = `${row.Wine}|${row.Vendor}|${row.Region}`
    if (!wineMap.has(key)) {
      wineMap.set(key, {
        title: row.Wine,
        winery: row.Vendor,
        region: row.Region,
        style: mapCategoryToStyle(row.Category),
        variants: [],
      })
    }
    // Add variant
    const wine = wineMap.get(key)!
    wine.variants.push({
      size: row.Size,
      vintage: row.Vintage,
      price: parsePrice(row['List Price']),
      stockOnHand: 6,
      canBackorder: row.Backorder === 'checked',
      grapeVarieties: parseGrapeVarieties(row.grapeVarieties),
    })
  }
  return Array.from(wineMap.values())
}

async function loadWinesFromCSV(): Promise<WineData[]> {
  const csvPath = path.join(process.cwd(), 'scripts', 'Wines-All Wines.csv')
  const csvContent = await readFile(csvPath, 'utf8')
  const parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
  return parseWineCSVRows(parsed.data as CSVRow[])
}

async function seedWines(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })
    logger.info('Starting wines and wine variants seeding...', { task: 'seed-wines' })

    const winesData = await loadWinesFromCSV()
    logger.info(`📊 Loaded ${winesData.length} wines from CSV`, { task: 'seed-wines' })

    let winesCreated = 0
    let winesSkipped = 0
    let winesFailed = 0
    let variantsCreated = 0
    let variantsSkipped = 0
    let variantsFailed = 0

    for (const wineData of winesData) {
      try {
        logger.info(
          `🍷 Processing wine: ${wineData.title} (${wineData.winery} - ${wineData.region})`,
          {
            task: 'seed-wines',
            wine: wineData.title,
            variants: wineData.variants.length,
          },
        )

        // Check if wine already exists by slug (which combines winery, wine name, region, and country)
        // First, we need to generate the expected slug to check for duplicates
        let expectedSlug: string | null = null

        // Find required relationships first to generate the slug
        const [winery, region, style] = await Promise.all([
          payload.find({
            collection: 'wineries',
            where: {
              title: {
                equals: wineData.winery,
              },
            },
          }),
          payload.find({
            collection: 'regions',
            where: {
              title: {
                equals: wineData.region,
              },
            },
          }),
          payload.find({
            collection: 'styles',
            where: {
              title: {
                equals: wineData.style,
              },
            },
          }),
        ])

        if (!winery.docs[0] || !region.docs[0] || !style.docs[0]) {
          logger.info(
            `🔄 Exact match failed, trying case-insensitive lookup for: ${wineData.title}`,
            {
              task: 'seed-wines',
              wine: wineData.title,
              wineryFound: !!winery.docs[0],
              regionFound: !!region.docs[0],
              styleFound: !!style.docs[0],
            },
          )

          // Try case-insensitive lookup
          const [wineryCaseInsensitive, regionCaseInsensitive, styleCaseInsensitive] =
            await Promise.all([
              payload.find({
                collection: 'wineries',
                limit: 1000,
              }),
              payload.find({
                collection: 'regions',
                limit: 1000,
              }),
              payload.find({
                collection: 'styles',
                limit: 1000,
              }),
            ])

          const foundWinery = wineryCaseInsensitive.docs.find(
            (w) => w.title.toLowerCase() === wineData.winery.toLowerCase(),
          )
          const foundRegion = regionCaseInsensitive.docs.find(
            (r) => r.title.toLowerCase() === wineData.region.toLowerCase(),
          )
          const foundStyle = styleCaseInsensitive.docs.find(
            (s) => s.title.toLowerCase() === wineData.style.toLowerCase(),
          )

          if (!foundWinery || !foundRegion || !foundStyle) {
            logger.error(`❌ Required relationships not found for wine ${wineData.title}`, {
              task: 'seed-wines',
              wine: wineData.title,
              winery: wineData.winery,
              region: wineData.region,
              style: wineData.style,
              foundWinery: foundWinery?.title,
              foundRegion: foundRegion?.title,
              foundStyle: foundStyle?.title,
            })
            winesFailed++
            continue
          }

          logger.info(`✅ Case-insensitive lookup successful for: ${wineData.title}`, {
            task: 'seed-wines',
            wine: wineData.title,
            winery: foundWinery.title,
            region: foundRegion.title,
            style: foundStyle.title,
          })

          // Use the found relationships
          winery.docs[0] = foundWinery
          region.docs[0] = foundRegion
          style.docs[0] = foundStyle
        } else {
          logger.info(`✅ Exact relationship match found for: ${wineData.title}`, {
            task: 'seed-wines',
            wine: wineData.title,
            winery: winery.docs[0].title,
            region: region.docs[0].title,
            style: style.docs[0].title,
          })
        }

        // Now generate the expected slug to check for duplicates
        try {
          // Get country data for slug generation
          const regionWithCountry = await payload.findByID({
            collection: 'regions',
            id: region.docs[0].id,
            depth: 2,
          })

          if (regionWithCountry?.country) {
            const countryId =
              typeof regionWithCountry.country === 'number'
                ? regionWithCountry.country
                : regionWithCountry.country.id
            const country = await payload.findByID({
              collection: 'wineCountries',
              id: countryId,
            })

            if (country?.title) {
              expectedSlug = generateWineSlug({
                wineryName: winery.docs[0].title,
                wineName: wineData.title,
                regionName: region.docs[0].title,
                countryName: country.title,
              })
            }
          }
        } catch (error) {
          logger.error(`❌ Error generating slug for wine ${wineData.title}:`, error)
        }

        // Check if wine already exists by slug
        if (expectedSlug) {
          const existingWine = await payload.find({
            collection: 'wines',
            where: {
              slug: {
                equals: expectedSlug,
              },
            },
          })
          if (existingWine.docs.length > 0) {
            logger.info(`⏭️  Wine with slug "${expectedSlug}" already exists, skipping...`, {
              task: 'seed-wines',
              wine: wineData.title,
              slug: expectedSlug,
            })
            winesSkipped++
            continue
          }
        }

        logger.info(`🏗️  Creating wine: ${wineData.title}`, {
          task: 'seed-wines',
          wine: wineData.title,
        })

        // Create wine with Slovenian locale
        const createdWine = await payload.create({
          collection: 'wines',
          data: {
            title: wineData.title,
            winery: winery.docs[0].id,
            region: region.docs[0].id,
            style: style.docs[0].id,
            description: wineData.description?.sl || '',
          },
          locale: 'sl',
        })

        logger.info(`✅ Created wine: ${createdWine.title} (ID: ${createdWine.id})`, {
          task: 'seed-wines',
          wine: wineData.title,
        })
        winesCreated++

        // Create wine variants
        logger.info(`🍇 Creating ${wineData.variants.length} variants for: ${createdWine.title}`, {
          task: 'seed-wines',
          wine: wineData.title,
        })

        for (const variantData of wineData.variants) {
          try {
            // Check if variant already exists
            const existingVariant = await payload.find({
              collection: 'wine-variants',
              where: {
                and: [
                  { wine: { equals: createdWine.id } },
                  { vintage: { equals: variantData.vintage } },
                  { size: { equals: variantData.size } },
                ],
              },
            })
            if (existingVariant.docs.length > 0) {
              logger.info(
                `⏭️  Wine variant ${createdWine.title} ${variantData.vintage} ${variantData.size}ml already exists, skipping...`,
                {
                  task: 'seed-wines',
                  wine: wineData.title,
                  variant: `${variantData.vintage} ${variantData.size}ml`,
                },
              )
              variantsSkipped++
              continue
            }

            logger.info(
              `🏗️  Creating wine variant: ${createdWine.title} ${variantData.vintage} ${variantData.size}ml`,
              {
                task: 'seed-wines',
                wine: wineData.title,
                variant: `${variantData.vintage} ${variantData.size}ml`,
              },
            )

            const variantPayloadData: Record<string, unknown> = {
              wine: createdWine.id,
              size: variantData.size,
              vintage: variantData.vintage,
              price: variantData.price,
              stockOnHand: variantData.stockOnHand,
              canBackorder: variantData.canBackorder,
              maxBackorderQuantity: variantData.maxBackorderQuantity,
              servingTemp: variantData.servingTemp,
              decanting: variantData.decanting,
              tastingProfile: variantData.tastingProfile?.sl || '',
              tastingNotes: variantData.tastingNotes,
            }

            if (variantData.grapeVarieties && variantData.grapeVarieties.length > 0) {
              const grapeVarietyIds: Array<{ variety: string; percentage: number }> = []
              for (const grapeData of variantData.grapeVarieties) {
                const grapeVariety = await payload.find({
                  collection: 'grape-varieties',
                  where: {
                    title: {
                      equals: grapeData.variety,
                    },
                  },
                })
                if (grapeVariety.docs[0]) {
                  grapeVarietyIds.push({
                    variety: grapeVariety.docs[0].id as string,
                    percentage: grapeData.percentage,
                  })
                }
              }
              if (grapeVarietyIds.length > 0) {
                variantPayloadData.grapeVarieties = grapeVarietyIds
              }
            }

            const createdVariant = await payload.create({
              collection: 'wine-variants',
              data: variantPayloadData,
              locale: 'sl',
            })

            logger.info(
              `✅ Created wine variant: ${createdWine.title} ${variantData.vintage} ${variantData.size}ml (ID: ${createdVariant.id})`,
              {
                task: 'seed-wines',
                wine: wineData.title,
                variant: `${variantData.vintage} ${variantData.size}ml`,
              },
            )
            variantsCreated++
          } catch (error) {
            logger.error(
              `❌ Failed to create wine variant: ${wineData.title} ${variantData.vintage} ${variantData.size}ml - ${(error as Error).message}`,
              error as Error,
              {
                task: 'seed-wines',
                wine: wineData.title,
                variant: `${variantData.vintage} ${variantData.size}ml`,
              },
            )
            variantsFailed++
          }
        }
      } catch (error) {
        logger.error(
          `❌ Failed to create wine: ${wineData.title} - ${(error as Error).message}`,
          error as Error,
          {
            task: 'seed-wines',
            wine: wineData.title,
          },
        )
        winesFailed++
      }
    }

    // Final summary
    logger.info('📊 Seeding Summary:', {
      task: 'seed-wines',
      winesCreated,
      winesSkipped,
      winesFailed,
      variantsCreated,
      variantsSkipped,
      variantsFailed,
      totalWinesProcessed: winesData.length,
    })

    logger.info('Wines and wine variants seeding completed successfully', { task: 'seed-wines' })
  } catch (error) {
    logger.error('Failed to seed wines and wine variants', error as Error, { task: 'seed-wines' })
    throw error
  }
}

console.log('Starting wines and wine variants seeding script...')
seedWines()
  .then(() => {
    logger.info('Seeding completed', { task: 'seed-wines' })
    process.exit(0)
  })
  .catch((error) => {
    logger.error('Seeding failed', error as Error, { task: 'seed-wines' })
    process.exit(1)
  })

export { seedWines }
