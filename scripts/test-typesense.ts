#!/usr/bin/env tsx

import 'dotenv/config'
import { search } from '../src/typesense'
import { logger } from '../src/lib/logger'

async function testTypesense() {
  try {
    logger.info('Testing Typesense connection...')

    // Test health check
    const isHealthy = await search.healthCheck()
    if (!isHealthy) {
      logger.error('Typesense health check failed')
      process.exit(1)
    }
    logger.info('✅ Typesense is healthy')

    // Test search functionality
    const searchResults = await search.search('wine-variants', {
      q: '*',
      query_by: 'wineTitle',
      per_page: 5,
    })

    logger.info(`✅ Found ${searchResults.length} documents in wine-variants collection`)

    if (searchResults.length > 0) {
      const firstResult = searchResults[0] as any
      logger.info('Sample document:', {
        id: firstResult.id,
        wineTitle: firstResult.wineTitle,
        wineryTitle: firstResult.wineryTitle,
        price: firstResult.price,
      })
    }

    // Test specific search
    if (searchResults.length > 0) {
      const firstWineTitle = (searchResults[0] as any).wineTitle
      if (firstWineTitle) {
        const specificSearch = await search.search('wine-variants', {
          q: firstWineTitle.split(' ')[0], // Search for first word of wine title
          query_by: 'wineTitle',
          per_page: 3,
        })
        logger.info(`✅ Specific search found ${specificSearch.length} results`)
      }
    }

    logger.info('🎉 All Typesense tests passed!')
    process.exit(0)
  } catch (error) {
    logger.error('Typesense test failed:', error)
    process.exit(1)
  }
}

testTypesense()
