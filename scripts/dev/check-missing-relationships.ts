import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'

async function checkMissingRelationships() {
  console.log('🔍 Checking wineries and regions in database...\n')

  try {
    const payload = await getPayload({
      config: payloadConfig,
    })

    // Get all wineries
    const wineriesResponse = await payload.find({
      collection: 'wineries',
      limit: 1000,
      depth: 1,
    })

    const wineries = wineriesResponse.docs
    console.log(`🏭 Found ${wineries.length} wineries\n`)

    console.log('📋 Wineries:')
    wineries.forEach((winery, index) => {
      console.log(`${index + 1}. ${winery.title}`)
    })

    // Get all regions
    const regionsResponse = await payload.find({
      collection: 'regions',
      limit: 1000,
      depth: 1,
    })

    const regions = regionsResponse.docs
    console.log(`\n🗺️  Found ${regions.length} regions\n`)

    console.log('📋 Regions:')
    regions.forEach((region, index) => {
      console.log(`${index + 1}. ${region.title}`)
    })

    // Check for missing ones from the failed wines
    const missingWineries = [
      'Cambria',
      'La Vigna di Sarah',
      'Chateau du Tertre',
      'Marques de Murieta',
      'Vega Sicilia',
      'Campo di Sasso',
      "Chateau Patache d'Aux",
      'Chateau des Jacques',
      'KlenArt',
    ]

    const missingRegions = ['Santa Maria', 'Prosecco', 'Ribera del Duero', 'Beaujolais']

    console.log('\n❌ Missing Wineries:')
    missingWineries.forEach((winery) => {
      const exists = wineries.some((w) => w.title === winery)
      console.log(`${exists ? '✅' : '❌'} ${winery}`)
    })

    console.log('\n❌ Missing Regions:')
    missingRegions.forEach((region) => {
      const exists = regions.some((r) => r.title === region)
      console.log(`${exists ? '✅' : '❌'} ${region}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error checking relationships:', error)
    process.exit(1)
  }
}

checkMissingRelationships()
