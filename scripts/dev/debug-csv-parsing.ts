import 'dotenv/config'
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

interface CSVRowProcessed {
  title: string
  winery: string
  region: string
  style: string
  variants: Array<{
    size: string
    vintage: string
    slug: string
  }>
  slug: string
}

function parseWineCSVRows(rows: CSVRow[]): CSVRowProcessed[] {
  const wineMap = new Map<string, CSVRowProcessed>()

  console.log(`📊 Processing ${rows.length} CSV rows...`)

  for (const row of rows) {
    const key = `${row.Wine}|${row.Vendor}|${row.Region}`

    if (!wineMap.has(key)) {
      wineMap.set(key, {
        title: row.Wine,
        winery: row.Vendor,
        region: row.Region,
        style: mapCategoryToStyle(row.Category),
        variants: [],
        slug: row.Slug,
      })
    }

    // Add variant
    const wine = wineMap.get(key)!
    wine.variants.push({
      size: row.Size,
      vintage: row.Vintage,
      slug: row.Slug,
    })
  }

  return Array.from(wineMap.values())
}

async function debugCSVParsing() {
  console.log('🔍 Debugging CSV parsing...\n')

  try {
    // Read and parse CSV
    const csvPath = path.join(process.cwd(), 'scripts', 'Wines-All Wines.csv')
    const csvContent = await readFile(csvPath, 'utf-8')
    const csvData = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
    const csvRows = csvData.data as CSVRow[]

    console.log(`📊 CSV Analysis:`)
    console.log(`   Total rows: ${csvRows.length}`)
    console.log(
      `   Unique wines (by Wine + Vendor + Region): ${new Set(csvRows.map((row) => `${row.Wine}|${row.Vendor}|${row.Region}`)).size}`,
    )
    console.log(`   Unique variants (by Slug): ${new Set(csvRows.map((row) => row.Slug)).size}`)

    // Parse wines using the same logic as seed script
    const wines = parseWineCSVRows(csvRows)

    console.log(`\n📊 Parsed Wines:`)
    console.log(`   Total wines created: ${wines.length}`)
    console.log(
      `   Total variants across all wines: ${wines.reduce((sum, wine) => sum + wine.variants.length, 0)}`,
    )

    // Show wines with multiple variants
    const winesWithMultipleVariants = wines.filter((wine) => wine.variants.length > 1)
    console.log(`\n🍷 Wines with multiple variants (${winesWithMultipleVariants.length}):`)
    winesWithMultipleVariants.forEach((wine) => {
      console.log(
        `   - ${wine.title} (${wine.winery} - ${wine.region}): ${wine.variants.length} variants`,
      )
      wine.variants.forEach((variant) => {
        console.log(`     * ${variant.vintage} ${variant.size} (${variant.slug})`)
      })
    })

    // Show wines with single variants
    const winesWithSingleVariant = wines.filter((wine) => wine.variants.length === 1)
    console.log(`\n🍷 Wines with single variant (${winesWithSingleVariant.length}):`)
    winesWithSingleVariant.forEach((wine) => {
      const variant = wine.variants[0]
      console.log(
        `   - ${wine.title} (${wine.winery} - ${wine.region}): ${variant.vintage} ${variant.size} (${variant.slug})`,
      )
    })

    // Check for duplicate slugs
    const allSlugs = wines.flatMap((wine) => wine.variants.map((v) => v.slug))
    const duplicateSlugs = allSlugs.filter((slug, index) => allSlugs.indexOf(slug) !== index)

    if (duplicateSlugs.length > 0) {
      console.log(`\n⚠️  Duplicate slugs found (${duplicateSlugs.length}):`)
      duplicateSlugs.forEach((slug) => console.log(`   - ${slug}`))
    }

    // Check for missing data
    const rowsWithMissingData = csvRows.filter(
      (row) => !row.Wine || !row.Vendor || !row.Region || !row.Slug,
    )
    if (rowsWithMissingData.length > 0) {
      console.log(`\n❌ Rows with missing data (${rowsWithMissingData.length}):`)
      rowsWithMissingData.forEach((row, index) => {
        console.log(
          `   ${index + 1}. Wine: "${row.Wine}", Vendor: "${row.Vendor}", Region: "${row.Region}", Slug: "${row.Slug}"`,
        )
      })
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

debugCSVParsing()
