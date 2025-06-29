import 'dotenv/config'
import { getPayload } from 'payload'
import payloadConfig from '../src/payload.config'
import { logger } from '../src/lib/logger'

interface CloudflareImage {
  id: string
  filename: string
  metadata?: {
    originalFilename?: string
    uploadedAt?: string
  }
  variants: string[]
  uploaded: string
  requireSignedURLs: boolean
  draft: boolean
}

interface CloudflareImagesResponse {
  success: boolean
  result: {
    images: CloudflareImage[]
    continuation_token?: string
  }
}

async function fetchCloudflareImages(continuationToken?: string): Promise<CloudflareImage[]> {
  const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
  const CLOUDFLARE_IMAGES_API_TOKEN = process.env.CLOUDFLARE_IMAGES_API_TOKEN

  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_IMAGES_API_TOKEN) {
    throw new Error('Missing Cloudflare environment variables')
  }

  let url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`
  if (continuationToken) {
    url += `?continuation_token=${continuationToken}`
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_IMAGES_API_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Cloudflare images: ${response.statusText}`)
  }

  const data: CloudflareImagesResponse = await response.json()

  if (!data.success) {
    throw new Error('Failed to fetch Cloudflare images')
  }

  return data.result.images
}

async function getAllCloudflareImages(): Promise<CloudflareImage[]> {
  const allImages: CloudflareImage[] = []
  let continuationToken: string | undefined

  do {
    logger.info(`Fetching images${continuationToken ? ' (continued)' : ''}...`)
    const images = await fetchCloudflareImages(continuationToken)
    allImages.push(...images)

    // Check if there are more images to fetch
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1${continuationToken ? `?continuation_token=${continuationToken}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_IMAGES_API_TOKEN}`,
        },
      },
    )

    const data: CloudflareImagesResponse = await response.json()
    continuationToken = data.result.continuation_token
  } while (continuationToken)

  return allImages
}

// Smart wine image slug matching function
function findBestWineImageMatch(
  wineSlug: string,
  vintage: string,
  size: string,
  cloudflareImages: CloudflareImage[],
): CloudflareImage | null {
  // Create a map of Cloudflare image names (without extensions) for faster lookup
  const cloudflareImageMap = new Map<string, CloudflareImage>()
  cloudflareImages.forEach((img) => {
    const cleanName = img.filename.replace(/\.(webp|jpg|png)$/, '').toLowerCase()
    cloudflareImageMap.set(cleanName, img)
  })

  // Debug: Show what's actually in the map
  logger.debug(`Cloudflare image map contains ${cloudflareImageMap.size} images`)
  logger.debug('Sample entries in map:', {
    sampleEntries: Array.from(cloudflareImageMap.entries())
      .slice(0, 3)
      .map(([key, img]) => ({ key, filename: img.filename })),
  })

  // Generate multiple possible slug variations using intelligent pattern matching
  const possibleSlugs = generateIntelligentSlugs(wineSlug, vintage, size)

  // Debug: Show what we're trying to match
  logger.debug(`Trying to match wine: ${wineSlug} (vintage: ${vintage}, size: ${size})`)
  logger.debug(`Generated slugs: ${possibleSlugs.slice(0, 5).join(', ')}`)

  // Try each possible slug variation
  for (const slug of possibleSlugs) {
    logger.debug(`Trying: "${slug}"`)

    const match = cloudflareImageMap.get(slug.toLowerCase())
    if (match) {
      logger.debug(`MATCH FOUND: ${match.filename}`)
      return match
    }
  }

  // Debug: Show some available Cloudflare images for comparison
  logger.debug('No match found. Available Cloudflare images (first 5):', {
    availableImages: Array.from(cloudflareImageMap.keys()).slice(0, 5),
  })

  return null
}

// Normalize punctuation to match Cloudflare's format
function normalizePunctuation(text: string): string {
  return text
    .replace(/[.'\-_]/g, '') // Remove dots, apostrophes, hyphens, underscores
    .replace(/\s+/g, '') // Remove spaces
    .toLowerCase()
}

function generateIntelligentSlugs(wineSlug: string, vintage: string, size: string): string[] {
  const parts = wineSlug.split('-')
  const possibleSlugs: string[] = []

  // Pattern 1: Remove last 2 parts (region-country) and add vintage-size
  if (parts.length >= 4) {
    const baseSlug = parts.slice(0, -2).join('-')
    possibleSlugs.push(`${baseSlug}-${vintage}-${size}ml`)
  }

  // Pattern 2: Remove last 3 parts (region-country) and add vintage-size
  if (parts.length >= 5) {
    const baseSlug = parts.slice(0, -3).join('-')
    possibleSlugs.push(`${baseSlug}-${vintage}-${size}ml`)
  }

  // Pattern 3: Remove last 1 part (country only) and add vintage-size
  if (parts.length >= 3) {
    const baseSlug = parts.slice(0, -1).join('-')
    possibleSlugs.push(`${baseSlug}-${vintage}-${size}ml`)
  }

  // Pattern 4: Intelligent wine name extraction
  const wineNameSlugs = extractWineNamesIntelligently(parts, vintage, size)
  possibleSlugs.push(...wineNameSlugs)

  // Pattern 5: Dynamic winery-based extraction
  const winerySlugs = extractWineryBasedSlugs(parts, vintage, size)
  possibleSlugs.push(...winerySlugs)

  // Pattern 6: Handle very long names with sliding window
  if (parts.length > 6) {
    const longNameSlugs = generateLongNameSlugs(parts, vintage, size)
    possibleSlugs.push(...longNameSlugs)
  }

  // Remove duplicates and return
  return [...new Set(possibleSlugs)]
}

function extractWineNamesIntelligently(parts: string[], vintage: string, size: string): string[] {
  const slugs: string[] = []

  // Common wine name patterns that appear in multiple parts
  const wineNamePatterns = [
    // Single word wines
    [
      'brda',
      'rose',
      'cipro',
      'malvazija',
      'refosk',
      'sauvignon',
      'chardonnay',
      'pinot',
      'cabernet',
      'merlot',
      'syrah',
      'barbera',
      'gewurztraminer',
      'riesling',
      'nebbiolo',
      'sangiovese',
      'tempranillo',
      'grenache',
      'mourvedre',
      'carignan',
      'cinsault',
      'viognier',
      'marsanne',
      'roussanne',
      'semillon',
      'sauvignonasse',
      'rebula',
      'vitovska',
      'pikolit',
      'frankinja',
      'teran',
      'cvicek',
      'muskat',
      'arneis',
      'barbera',
      'dolcetto',
      'freisa',
      'grignolino',
      'ruche',
      'brachetto',
      'moscato',
      'cortese',
      'favorita',
      'timorasso',
      'vermentino',
      'pigato',
      'albarola',
      'bosco',
      'callet',
      'manto',
      'prensal',
      'garnatxa',
      'sumoll',
      'monastrell',
      'bobal',
      'graciano',
      'mazuelo',
      'carinena',
      'garnacha',
      'macabeo',
      'xarel-lo',
      'parellada',
      'albarino',
      'godello',
      'mencia',
      'prieto',
      'picudo',
      'listan',
      'negro',
      'palomino',
      'pedro',
      'ximenez',
      'airén',
      'albillo',
      'verdejo',
      'viura',
      'malvasia',
      'trebbiano',
      'garganega',
      'corvina',
      'rondinella',
      'molinara',
      'negroamaro',
      'primitivo',
      'aglianico',
      'fiano',
      'greco',
      'falanghina',
      'coda',
      'volpe',
      'lacrima',
      'vernaccia',
      'sagrantino',
      'montepulciano',
      'pecorino',
      'passerina',
      'bombino',
      'bianco',
      'nero',
      'rosso',
      'bianca',
      'nera',
      'rossa',
      'brut',
      'nature',
      'reserve',
      'prestige',
      'millesime',
      'cuvee',
      'premium',
      'selekcija',
      'antique',
      'boskarin',
      'cru',
      'rete',
      'iris',
      'baby',
      'veliki',
      'vrh',
      'tinja',
      'epoca',
      'carolina',
      'rdeca',
      'rdece',
      'modra',
      'zelen',
      'jebacin',
      'stranice',
      'reddo',
      'bela',
      'white',
      'red',
      'rose',
      'orange',
      'black',
      'passion',
      'kingly',
      'joy',
      'beta',
      'first',
      'edition',
      'marlon',
      'laura',
      'carsus',
      'izbrani',
      'prulke',
      'ruje',
      'folo',
      'rosso',
      'mandolas',
      'grganja',
      'veliko',
      'braide',
      'alte',
      'andritz',
      'bianco',
      'pfaffenberg',
      'klostersatz',
      'santenots',
      'grappoli',
      'luna',
      'extra',
      'brut',
      'marcus',
      'guidalberto',
      'difese',
      'promis',
      'sito',
      'moresco',
      'perbacco',
      'cyclo',
      'plexus',
      'belleruche',
      'crozes',
      'hermitage',
      'saint',
      'joseph',
      'emilion',
      'barbaresco',
      'reyna',
      'barolo',
      'conca',
      'tre',
      'pile',
      'gavi',
      'rovereto',
      'madri',
      'pettegola',
      'soave',
      'classico',
      'ruberpan',
      'la',
      'rocca',
      'amarone',
      'sumoll',
      'garnatxa',
      'rosa',
      'insoglio',
      'cinghiale',
      'sof',
      'volte',
      'syrah',
      'case',
      'via',
      'chateauneuf',
      'pape',
      'gran',
      'reserva',
      'pommard',
      'saint-estephe',
      'margaux',
      'gevrey',
      'chambertin',
      'volnay',
      '1er',
      'cru',
      'tokaji',
      'aszu',
      'puttonyos',
      'ott',
      'teran',
      'notri',
      'sese',
      'passito',
      'pantelleria',
      'macan',
      'clasico',
      'langhe',
      'nebbiolo',
      'pinot',
      'noir',
      'estate',
      'vipava',
      'rumeni',
      'muskat',
      'aligote',
      'bourgogne',
      'blanc',
      'blancs',
      'ribolla',
      'gialla',
      'veliki',
      'vrh',
      'sauvignonasse',
      'collio',
      'bianco',
      'pikolit',
      'suho',
      'vitovska',
      'grganja',
      'katherine',
      'vineyard',
      'stranice',
      'pouilly',
      'fuisse',
      'fojana',
      'veliko',
      'chardonnay',
      'castets',
      'morey',
      'aubin',
    ],
    // Two word wines
    [
      'modri pinot',
      'renski rizling',
      'sivi pinot',
      'cabernet sauvignon',
      'pinot noir',
      'pinot bianco',
      'pinot nero',
      'blanc de blancs',
      'brut nature',
      'brut reserve',
      'pinot gris',
      'pinot grigio',
      'sauvignon blanc',
      'sauvignonasse',
      'chardonnay',
      'gewurztraminer',
      'riesling',
      'nebbiolo',
      'barbera',
      'dolcetto',
      'freisa',
      'grignolino',
      'ruche',
      'brachetto',
      'moscato',
      'cortese',
      'favorita',
      'timorasso',
      'vermentino',
      'pigato',
      'albarola',
      'bosco',
      'callet',
      'manto',
      'prensal',
      'garnatxa',
      'sumoll',
      'monastrell',
      'bobal',
      'graciano',
      'mazuelo',
      'carinena',
      'garnacha',
      'macabeo',
      'xarel-lo',
      'parellada',
      'albarino',
      'godello',
      'mencia',
      'prieto',
      'picudo',
      'listan',
      'negro',
      'palomino',
      'pedro',
      'ximenez',
      'airén',
      'albillo',
      'verdejo',
      'viura',
      'malvasia',
      'trebbiano',
      'garganega',
      'corvina',
      'rondinella',
      'molinara',
      'negroamaro',
      'primitivo',
      'aglianico',
      'fiano',
      'greco',
      'falanghina',
      'coda',
      'volpe',
      'lacrima',
      'vernaccia',
      'sagrantino',
      'montepulciano',
      'pecorino',
      'passerina',
      'bombino',
      'bianco',
      'nero',
      'rosso',
      'bianca',
      'nera',
      'rossa',
      'brut',
      'nature',
      'reserve',
      'prestige',
      'millesime',
      'cuvee',
      'premium',
      'selekcija',
      'antique',
      'boskarin',
      'cru',
      'rete',
      'iris',
      'baby',
      'veliki',
      'vrh',
      'tinja',
      'epoca',
      'carolina',
      'rdeca',
      'rdece',
      'modra',
      'zelen',
      'jebacin',
      'stranice',
      'reddo',
      'bela',
      'white',
      'red',
      'rose',
      'orange',
      'black',
      'passion',
      'kingly',
      'joy',
      'beta',
      'first',
      'edition',
      'marlon',
      'laura',
      'carsus',
      'izbrani',
      'prulke',
      'ruje',
      'folo',
      'rosso',
      'mandolas',
      'grganja',
      'veliko',
      'braide',
      'alte',
      'andritz',
      'bianco',
      'pfaffenberg',
      'klostersatz',
      'santenots',
      'grappoli',
      'luna',
      'extra',
      'brut',
      'marcus',
      'guidalberto',
      'difese',
      'promis',
      'sito',
      'moresco',
      'perbacco',
      'cyclo',
      'plexus',
      'belleruche',
      'crozes',
      'hermitage',
      'saint',
      'joseph',
      'emilion',
      'barbaresco',
      'reyna',
      'barolo',
      'conca',
      'tre',
      'pile',
      'gavi',
      'rovereto',
      'madri',
      'pettegola',
      'soave',
      'classico',
      'ruberpan',
      'la',
      'rocca',
      'amarone',
      'sumoll',
      'garnatxa',
      'rosa',
      'insoglio',
      'cinghiale',
      'sof',
      'volte',
      'syrah',
      'case',
      'via',
      'chateauneuf',
      'pape',
      'gran',
      'reserva',
      'pommard',
      'saint-estephe',
      'margaux',
      'gevrey',
      'chambertin',
      'volnay',
      '1er',
      'cru',
      'tokaji',
      'aszu',
      'puttonyos',
      'ott',
      'teran',
      'notri',
      'sese',
      'passito',
      'pantelleria',
      'macan',
      'clasico',
      'langhe',
      'nebbiolo',
      'pinot',
      'noir',
      'estate',
      'vipava',
      'rumeni',
      'muskat',
      'aligote',
      'bourgogne',
      'blanc',
      'blancs',
      'ribolla',
      'gialla',
      'veliki',
      'vrh',
      'sauvignonasse',
      'collio',
      'bianco',
      'pikolit',
      'suho',
      'vitovska',
      'grganja',
      'katherine',
      'vineyard',
      'stranice',
      'pouilly',
      'fuisse',
      'fojana',
      'veliko',
      'chardonnay',
      'castets',
      'morey',
      'aubin',
    ],
    // Three word wines
    [
      'malvazija premium',
      'refosk premium',
      'malvazija baby',
      'refosk antique',
      'refosk boskarin',
      'malvazija cru rete',
      'iris brut nature',
      'cabernet sauvignon vrh',
      'modri pinot tinja',
      'sauvignon blanc veliki vrh',
      'pinot noir carpe diem',
      'riesling altenbourg',
      'gruner veltliner klostersatz',
      'riesling pfaffenberg',
      'pinot nero buchholz',
      'gewurztraminer vom lehm',
      'insoglio del cinghiale',
      'grappoli di luna',
      'sese passito della',
      'langhe nebbiolo perbacco',
      'roero arneis le',
      'gavi di gavi',
      'barbaresco reyna',
      'barbera conca tre',
      'chateauneuf du pape',
      'saint emilion',
      'gevrey chambertin vieilles',
      'pommard vieilles vignes',
      'pouilly fuisse vieilles',
      'santenay vieilles vignes',
      'volnay 1er cru',
      'tokaji aszu 3',
      'rose by ott',
      'pinot noir estate',
      'pinot noir vipava',
      'rumeni muskat',
      'aligote de bourgogne',
      'blanc de blancs',
      'ribolla gialla',
      'gavi di gavi rovereto',
      'malvazija selekcija',
      'sauvignon blanc veliki',
      'collio bianco',
      'pikolit suho',
      'vitovska grganja',
      'katherine vineyard',
      'andritz bianco',
      'braide alte',
      'pouilly fuisse vieilles',
      'fojana rebula',
      'veliko chardonnay',
      'st aubin 1er',
      'morey st aubin',
    ],
  ]

  // Try to find wine name patterns in the slug
  for (const pattern of wineNamePatterns) {
    const patternStr = pattern.join('-')
    const slugStr = parts.join('-')

    if (slugStr.includes(patternStr)) {
      // Find the winery part (everything before the wine name)
      const wineNameIndex = slugStr.indexOf(patternStr)
      const beforeWineName = slugStr
        .substring(0, wineNameIndex)
        .split('-')
        .filter((p) => p)

      if (beforeWineName.length > 0) {
        const wineryWineSlug = `${beforeWineName.join('-')}-${patternStr}`
        slugs.push(`${wineryWineSlug}-${vintage}-${size}ml`)
      }
    }
  }

  return slugs
}

function extractWineryBasedSlugs(parts: string[], vintage: string, size: string): string[] {
  const slugs: string[] = []

  // Look for common winery patterns in the parts
  // This is more dynamic than hardcoded lists
  const wineryIndicators = [
    'chateau',
    'domaine',
    'tenuta',
    'finca',
    'bodega',
    'cantina',
    'weingut',
    'weingut',
    'kmetija',
    'vinograd',
    'vina',
    'vin',
    'wine',
    'winery',
    'estate',
    'cellar',
    'cave',
    'casa',
    'mas',
    'finca',
    'quinta',
    'pago',
    'bodega',
    'cantina',
    'azienda',
    'fattoria',
    'podere',
    'cascina',
    'masseria',
    'tenuta',
    'castello',
    'villa',
    'palazzo',
    'abbazia',
    'monastero',
    'convento',
    'chiesa',
    'santuario',
    'basilica',
    'duomo',
    'cattedrale',
    'torre',
    'rocca',
    'fortezza',
    'castello',
    'palazzo',
    'villa',
    'casa',
    'mas',
    'finca',
    'quinta',
    'pago',
    'bodega',
    'cantina',
    'azienda',
    'fattoria',
    'podere',
    'cascina',
    'masseria',
    'tenuta',
    'castello',
    'villa',
    'palazzo',
    'abbazia',
    'monastero',
    'convento',
    'chiesa',
    'santuario',
    'basilica',
    'duomo',
    'cattedrale',
    'torre',
    'rocca',
    'fortezza',
  ]

  // Find potential winery names (usually the first few parts that don't match wine indicators)
  for (let i = 0; i < Math.min(parts.length, 4); i++) {
    const potentialWinery = parts.slice(0, i + 1).join('-')

    // Check if this looks like a winery name (not a wine name)
    const isWineryName =
      wineryIndicators.some((indicator) => potentialWinery.toLowerCase().includes(indicator)) ||
      // If no clear indicator, assume first 1-3 parts are winery
      (i < 3 && !isWineName(parts[i]))

    if (isWineryName) {
      // Take winery + next 1-3 parts as wine name
      for (let j = 1; j <= 3 && i + j < parts.length; j++) {
        const wineParts = parts.slice(0, i + j + 1)
        if (wineParts.length > 1) {
          slugs.push(`${wineParts.join('-')}-${vintage}-${size}ml`)
        }
      }
    }
  }

  return slugs
}

function isWineName(part: string): boolean {
  const wineNames = [
    'brda',
    'rose',
    'cipro',
    'malvazija',
    'refosk',
    'sauvignon',
    'chardonnay',
    'pinot',
    'cabernet',
    'merlot',
    'syrah',
    'barbera',
    'gewurztraminer',
    'riesling',
    'nebbiolo',
    'sangiovese',
    'tempranillo',
    'grenache',
    'mourvedre',
    'carignan',
    'cinsault',
    'viognier',
    'marsanne',
    'roussanne',
    'semillon',
    'sauvignonasse',
    'rebula',
    'vitovska',
    'pikolit',
    'frankinja',
    'teran',
    'cvicek',
    'muskat',
    'arneis',
    'barbera',
    'dolcetto',
    'freisa',
    'grignolino',
    'ruche',
    'brachetto',
    'moscato',
    'cortese',
    'favorita',
    'timorasso',
    'vermentino',
    'pigato',
    'albarola',
    'bosco',
    'callet',
    'manto',
    'prensal',
    'garnatxa',
    'sumoll',
    'monastrell',
    'bobal',
    'graciano',
    'mazuelo',
    'carinena',
    'garnacha',
    'macabeo',
    'xarel-lo',
    'parellada',
    'albarino',
    'godello',
    'mencia',
    'prieto',
    'picudo',
    'listan',
    'negro',
    'palomino',
    'pedro',
    'ximenez',
    'airén',
    'albillo',
    'verdejo',
    'viura',
    'malvasia',
    'trebbiano',
    'garganega',
    'corvina',
    'rondinella',
    'molinara',
    'negroamaro',
    'primitivo',
    'aglianico',
    'fiano',
    'greco',
    'falanghina',
    'coda',
    'volpe',
    'lacrima',
    'vernaccia',
    'sagrantino',
    'montepulciano',
    'pecorino',
    'passerina',
    'bombino',
    'bianco',
    'nero',
    'rosso',
    'bianca',
    'nera',
    'rossa',
    'brut',
    'nature',
    'reserve',
    'prestige',
    'millesime',
    'cuvee',
    'premium',
    'selekcija',
    'antique',
    'boskarin',
    'cru',
    'rete',
    'iris',
    'baby',
    'veliki',
    'vrh',
    'tinja',
    'epoca',
    'carolina',
    'rdeca',
    'rdece',
    'modra',
    'zelen',
    'jebacin',
    'stranice',
    'reddo',
    'bela',
    'white',
    'red',
    'rose',
    'orange',
    'black',
    'passion',
    'kingly',
    'joy',
    'beta',
    'first',
    'edition',
    'marlon',
    'laura',
    'carsus',
    'izbrani',
    'prulke',
    'ruje',
    'folo',
    'rosso',
    'mandolas',
    'grganja',
    'veliko',
    'braide',
    'alte',
    'andritz',
    'bianco',
    'pfaffenberg',
    'klostersatz',
    'santenots',
    'grappoli',
    'luna',
    'extra',
    'brut',
    'marcus',
    'guidalberto',
    'difese',
    'promis',
    'sito',
    'moresco',
    'perbacco',
    'cyclo',
    'plexus',
    'belleruche',
    'crozes',
    'hermitage',
    'saint',
    'joseph',
    'emilion',
    'barbaresco',
    'reyna',
    'barolo',
    'conca',
    'tre',
    'pile',
    'gavi',
    'rovereto',
    'madri',
    'pettegola',
    'soave',
    'classico',
    'ruberpan',
    'la',
    'rocca',
    'amarone',
    'sumoll',
    'garnatxa',
    'rosa',
    'insoglio',
    'cinghiale',
    'sof',
    'volte',
    'syrah',
    'case',
    'via',
    'chateauneuf',
    'pape',
    'gran',
    'reserva',
    'pommard',
    'saint-estephe',
    'margaux',
    'gevrey',
    'chambertin',
    'volnay',
    '1er',
    'cru',
    'tokaji',
    'aszu',
    'puttonyos',
    'ott',
    'teran',
    'notri',
    'sese',
    'passito',
    'pantelleria',
    'macan',
    'clasico',
    'langhe',
    'nebbiolo',
    'pinot',
    'noir',
    'estate',
    'vipava',
    'rumeni',
    'muskat',
    'aligote',
    'bourgogne',
    'blanc',
    'blancs',
    'ribolla',
    'gialla',
    'veliki',
    'vrh',
    'sauvignonasse',
    'collio',
    'bianco',
    'pikolit',
    'suho',
    'vitovska',
    'grganja',
    'katherine',
    'vineyard',
    'stranice',
    'pouilly',
    'fuisse',
    'fojana',
    'veliko',
    'chardonnay',
    'castets',
    'morey',
    'aubin',
  ]

  return wineNames.includes(part.toLowerCase())
}

function generateLongNameSlugs(parts: string[], vintage: string, size: string): string[] {
  const slugs: string[] = []

  // For very long names, try different combinations with sliding window
  for (let i = 3; i <= Math.min(parts.length - 2, 6); i++) {
    const baseSlug = parts.slice(0, i).join('-')
    slugs.push(`${baseSlug}-${vintage}-${size}ml`)
  }

  return slugs
}

async function syncExistingWineImages(): Promise<void> {
  const taskLogger = logger.child({ task: 'syncExistingWineImages' })

  try {
    const payload = await getPayload({ config: payloadConfig })

    taskLogger.info('Fetching all Cloudflare images...')
    const cloudflareImages = await getAllCloudflareImages()
    taskLogger.info(`Found ${cloudflareImages.length} images on Cloudflare`)

    taskLogger.info('Fetching all wines...')
    const wines = await payload.find({
      collection: 'wines',
      limit: 1000,
    })
    taskLogger.info(`Found ${wines.docs.length} wines in database`)

    taskLogger.info('Fetching all Media records...')
    const mediaRecords = await payload.find({
      collection: 'media',
      limit: 1000,
    })
    taskLogger.info(`Found ${mediaRecords.docs.length} Media records in database`)

    // Debug: Show some Media record examples
    taskLogger.debug('Sample Media records:', {
      sampleRecords: mediaRecords.docs.slice(0, 5).map((media) => ({
        id: media.id,
        filename: media.filename,
        originalFilename: media.originalFilename,
        alt: media.alt,
        url: media.url,
        fields: Object.keys(media),
      })),
    })

    // Debug: Show some Cloudflare image examples
    taskLogger.debug('Sample Cloudflare images:', {
      sampleImages: cloudflareImages.slice(0, 5).map((img) => {
        const imgSlug = img.filename.replace(/\.(webp|jpg|png)$/, '').replace(/-\\d{13,}$/, '')
        return imgSlug
      }),
    })

    // Now let's show which wines have images and which don't, and link them
    taskLogger.info('Wine Image Status:')
    const winesWithImages = new Set()
    const matchedCloudflareImages = new Set()
    let linkedVariants = 0

    for (const wine of wines.docs) {
      if (!wine.slug) continue

      let hasImage = false

      // Check each variant of the wine
      if (wine.variants && wine.variants.docs && wine.variants.docs.length > 0) {
        for (const variant of wine.variants.docs) {
          // Type guard to ensure variant is an object with the expected properties
          if (typeof variant === 'object' && variant !== null) {
            const variantObj = variant as any
            const vintage = variantObj.vintage?.toString() || ''
            const size = variantObj.size || ''

            // Use the intelligent matching function
            const matchingCloudflareImage = findBestWineImageMatch(
              wine.slug,
              vintage,
              size,
              cloudflareImages,
            )

            if (matchingCloudflareImage) {
              hasImage = true
              matchedCloudflareImages.add(matchingCloudflareImage.filename)
              taskLogger.info(
                `${wine.title} (${wine.slug}) - Found image: ${matchingCloudflareImage.filename}`,
              )

              // Now link the image to the wine variant
              await linkWineVariantToImage(
                payload,
                wine,
                variantObj,
                matchingCloudflareImage,
                mediaRecords.docs,
                taskLogger,
              )
              linkedVariants++
            } else {
              // Generate some example slugs for debugging
              const exampleSlugs = generateIntelligentSlugs(wine.slug, vintage, size).slice(0, 3)
              taskLogger.warn(
                `${wine.title} (${wine.slug}) - No image found. Tried slugs: ${exampleSlugs.join(', ')}`,
              )
            }
          }
        }
      }

      if (hasImage) {
        winesWithImages.add(wine.id)
      }
    }

    taskLogger.info('Wine Image Coverage', {
      winesWithImages: winesWithImages.size,
      totalWines: wines.docs.length,
      matchedImages: matchedCloudflareImages.size,
      totalImages: cloudflareImages.length,
      linkedVariants,
    })

    // Show unmatched Cloudflare images
    const unmatchedImages = cloudflareImages.filter(
      (img) => !matchedCloudflareImages.has(img.filename),
    )
    taskLogger.info('Unmatched Cloudflare Images', {
      count: unmatchedImages.length,
      samples: unmatchedImages.slice(0, 20).map((img) => img.filename),
    })
  } catch (error) {
    taskLogger.error('Error syncing Cloudflare images:', error)
    process.exit(1)
  }
}

async function linkWineVariantToImage(
  payload: any,
  wine: any,
  variant: any,
  cloudflareImage: CloudflareImage,
  mediaRecords: any[],
  taskLogger: any,
): Promise<void> {
  try {
    // Extract the wine slug from the image filename
    // Remove file extension and any timestamp suffixes
    const imageSlug = cloudflareImage.filename
      .replace(/\.(webp|jpg|png)$/, '') // Remove extension
      .replace(/-\\d{13,}$/, '') // Remove timestamp suffix if present
      .toLowerCase()

    // Find the corresponding Media record for this Cloudflare image
    const mediaRecord = mediaRecords.find((media) => {
      // Try to match by originalFilename first (since filename is often null)
      if (media.originalFilename) {
        const mediaSlug = media.originalFilename.replace(/\.(webp|jpg|png)$/, '').toLowerCase()
        return mediaSlug === imageSlug
      }
      // Fallback to filename if originalFilename is not available
      if (media.filename) {
        const mediaSlug = media.filename.replace(/\.(webp|jpg|png)$/, '').toLowerCase()
        return mediaSlug === imageSlug
      }
      return false
    })

    let mediaId: number

    if (!mediaRecord) {
      taskLogger.info(`Creating Media record for Cloudflare image: ${cloudflareImage.filename}`)

      // Create a new Media record for this Cloudflare image
      const newMediaRecord = await payload.create({
        collection: 'media',
        data: {
          filename: cloudflareImage.filename,
          originalFilename: cloudflareImage.filename,
          cloudflareId: cloudflareImage.id,
          alt: `${wine.name} ${variant.vintage} ${variant.size}ml`,
          url: `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_ID}/${cloudflareImage.id}/winecards`,
          thumbnailURL: `https://imagedelivery.net/${process.env.CLOUDFLARE_ACCOUNT_ID}/${cloudflareImage.id}/winecards`,
          mimeType: 'image/webp',
          filesize: 0, // We don't have this info from Cloudflare API
          width: 0, // We don't have this info from Cloudflare API
          height: 0, // We don't have this info from Cloudflare API
        },
      })

      mediaId = newMediaRecord.id
      taskLogger.info(`Created Media record with ID: ${mediaId}`)
    } else {
      mediaId = mediaRecord.id
      taskLogger.info(`Found existing Media record with ID: ${mediaId}`)
    }

    // Check if the variant already has this media linked
    const currentMedia = variant.media || []
    if (currentMedia.some((m: any) => m.id === mediaId || m === mediaId)) {
      taskLogger.info(`Variant already has media linked: ${cloudflareImage.filename}`)
      return
    }

    // Add the media to the variant's media array
    const updatedMedia = [...currentMedia, mediaId]

    // Update the wine variant
    await payload.update({
      collection: 'wine-variants',
      id: variant.id,
      data: {
        media: updatedMedia,
      },
    })

    taskLogger.info(`Linked image to variant: ${cloudflareImage.filename}`)
  } catch (error) {
    taskLogger.error(`Error linking image to variant: ${error}`)
  }
}

// Run the sync
syncExistingWineImages()
