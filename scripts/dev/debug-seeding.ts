import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { readFile } from 'fs/promises'
import path from 'path'
import Papa from 'papaparse'

interface CSVRow {
  ID: string
  Vendor: string
  Wine: string
  Region: string
  Country: string
  Vintage: string
  Category: string
  Size: string
  Slug: string
  [key: string]: string
}

async function debugSeeding() {
  console.log('🔍 Debugging seeding process...\n')

  try {
    // Initialize Payload
    const payload = await getPayload({
      config: payloadConfig,
    })

    // Read and parse CSV
    const csvPath = path.join(process.cwd(), 'scripts', 'Wines-All Wines.csv')
    const csvContent = await readFile(csvPath, 'utf-8')
    const csvData = Papa.parse(csvContent, { header: true })
    const csvRows = csvData.data as CSVRow[]

    console.log(`📊 CSV Analysis:`)
    console.log(`   Total rows: ${csvRows.length}`)
    console.log(
      `   Unique wines (by Vendor + Wine + Region): ${new Set(csvRows.map((row) => `${row.Vendor}-${row.Wine}-${row.Region}`)).size}`,
    )
    console.log(`   Unique variants (by Slug): ${new Set(csvRows.map((row) => row.Slug)).size}`)

    // Get all wines from database
    const winesResponse = await payload.find({
      collection: 'wines',
      limit: 1000,
      depth: 1,
    })
    const wines = winesResponse.docs

    // Get all wine variants from database
    const variantsResponse = await payload.find({
      collection: 'wine-variants',
      limit: 1000,
      depth: 1,
    })
    const variants = variantsResponse.docs

    console.log(`\n📊 Database Analysis:`)
    console.log(`   Total wines: ${wines.length}`)
    console.log(`   Total variants: ${variants.length}`)

    // Find missing variants
    const csvSlugs = new Set(csvRows.map((row) => row.Slug))
    const dbSlugs = new Set(variants.map((variant) => variant.slug))

    const missingSlugs = Array.from(csvSlugs).filter((slug) => !dbSlugs.has(slug))
    const extraSlugs = Array.from(dbSlugs).filter((slug) => !csvSlugs.has(slug))

    console.log(`\n❌ Missing variants (${missingSlugs.length}):`)
    missingSlugs.forEach((slug) => {
      const csvRow = csvRows.find((row) => row.Slug === slug)
      if (csvRow) {
        console.log(`   - ${slug} (${csvRow.Vendor} - ${csvRow.Wine} - ${csvRow.Region})`)
      }
    })

    if (extraSlugs.length > 0) {
      console.log(`\n➕ Extra variants (${extraSlugs.length}):`)
      extraSlugs.forEach((slug) => {
        console.log(`   - ${slug}`)
      })
    }

    // Check for wines that might have failed to create variants
    const winesWithoutVariants = wines.filter((wine) => {
      const wineVariants = variants.filter((variant) => variant.wine?.id === wine.id)
      return wineVariants.length === 0
    })

    if (winesWithoutVariants.length > 0) {
      console.log(`\n⚠️  Wines without variants (${winesWithoutVariants.length}):`)
      winesWithoutVariants.forEach((wine) => {
        console.log(`   - ${wine.title} (${wine.winery?.title})`)
      })
    }

    // Check for relationship issues
    console.log(`\n🔗 Relationship Analysis:`)
    const uniqueWineries = new Set(csvRows.map((row) => row.Vendor))
    const uniqueRegions = new Set(csvRows.map((row) => row.Region))

    const dbWineries = await payload.find({ collection: 'wineries', limit: 1000 })
    const dbRegions = await payload.find({ collection: 'regions', limit: 1000 })

    const dbWineryNames = new Set(dbWineries.docs.map((w) => w.title))
    const dbRegionNames = new Set(dbRegions.docs.map((r) => r.title))

    const missingWineries = Array.from(uniqueWineries).filter(
      (winery) =>
        !Array.from(dbWineryNames).some((dbName) => dbName.toLowerCase() === winery.toLowerCase()),
    )

    const missingRegions = Array.from(uniqueRegions).filter(
      (region) =>
        !Array.from(dbRegionNames).some((dbName) => dbName.toLowerCase() === region.toLowerCase()),
    )

    if (missingWineries.length > 0) {
      console.log(`   Missing wineries: ${missingWineries.join(', ')}`)
    }
    if (missingRegions.length > 0) {
      console.log(`   Missing regions: ${missingRegions.join(', ')}`)
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

debugSeeding()
