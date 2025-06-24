import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { readFile } from 'fs/promises'
import path from 'path'
import Papa from 'papaparse'

interface CSVRow {
  Vendor: string
  Region: string
  [key: string]: string
}

async function checkMissingRelationships() {
  console.log('🔍 Checking missing relationships...\n')

  try {
    const payload = await getPayload({
      config: payloadConfig,
    })

    // Read CSV
    const csvPath = path.join(process.cwd(), 'scripts', 'Wines-All Wines.csv')
    const csvContent = await readFile(csvPath, 'utf-8')
    const csvData = Papa.parse(csvContent, { header: true })
    const csvRows = csvData.data as CSVRow[]

    // Get unique wineries and regions from CSV
    const uniqueWineries = [...new Set(csvRows.map((row) => row.Vendor))]
    const uniqueRegions = [...new Set(csvRows.map((row) => row.Region))]

    // Get database wineries and regions
    const dbWineries = await payload.find({ collection: 'wineries', limit: 1000 })
    const dbRegions = await payload.find({ collection: 'regions', limit: 1000 })

    const dbWineryNames = dbWineries.docs.map((w) => w.title)
    const dbRegionNames = dbRegions.docs.map((r) => r.title)

    console.log('📊 CSV Analysis:')
    console.log(`   Unique wineries: ${uniqueWineries.length}`)
    console.log(`   Unique regions: ${uniqueRegions.length}`)

    console.log('\n📊 Database Analysis:')
    console.log(`   Database wineries: ${dbWineryNames.length}`)
    console.log(`   Database regions: ${dbRegionNames.length}`)

    // Find missing wineries
    const missingWineries = uniqueWineries.filter(
      (winery) => !dbWineryNames.some((dbName) => dbName.toLowerCase() === winery.toLowerCase()),
    )

    // Find missing regions
    const missingRegions = uniqueRegions.filter(
      (region) => !dbRegionNames.some((dbName) => dbName.toLowerCase() === region.toLowerCase()),
    )

    if (missingWineries.length > 0) {
      console.log('\n❌ Missing Wineries:')
      missingWineries.forEach((winery) => console.log(`   - ${winery}`))
    }

    if (missingRegions.length > 0) {
      console.log('\n❌ Missing Regions:')
      missingRegions.forEach((region) => console.log(`   - ${region}`))
    }

    if (missingWineries.length === 0 && missingRegions.length === 0) {
      console.log('\n✅ All relationships exist!')
    }
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

checkMissingRelationships()
