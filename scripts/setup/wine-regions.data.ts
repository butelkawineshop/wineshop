export interface WineRegionData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
  country: string
  code: string
}

export const wineRegionsData: WineRegionData[] = [
  // Primorska
  {
    title: {
      sl: 'Primorska',
      en: 'Primorska',
    },
    description: {
      sl: 'Primorska je najbolj znana slovenska vinska regija, ki se razteza od italijanske meje do reke Vipave. Z mediteranskim podnebjem in različnimi tereni proizvaja raznolike vina, od belih do rdečih.',
      en: 'Primorska is the most famous Slovenian wine region, stretching from the Italian border to the Vipava River. With Mediterranean climate and diverse terrains, it produces varied wines, from whites to reds.',
    },
    country: 'Slovenija',
    code: 'SI-PR',
  },
  // Posavje
  {
    title: {
      sl: 'Posavje',
      en: 'Posavje',
    },
    description: {
      sl: 'Posavje je vinska regija v osrednji Sloveniji, ki se razteza vzdolž reke Save. Z kontinentalnim podnebjem proizvaja predvsem bela vina in rdeča vina.',
      en: 'Posavje is a wine region in central Slovenia, stretching along the Sava River. With continental climate, it produces mainly white wines and red wines.',
    },
    country: 'Slovenija',
    code: 'SI-PO',
  },
  // Podravje
  {
    title: {
      sl: 'Podravje',
      en: 'Podravje',
    },
    description: {
      sl: 'Podravje je največja slovenska vinska regija, ki se razteza v severovzhodni Sloveniji. Z različnimi podnebji proizvaja predvsem bela vina.',
      en: 'Podravje is the largest Slovenian wine region, stretching in northeastern Slovenia. With diverse climates, it produces mainly white wines.',
    },
    country: 'Slovenija',
    code: 'SI-PD',
  },
  // Tuscany
  {
    title: {
      sl: 'Toskana',
      en: 'Tuscany',
    },
    description: {
      sl: 'Toskana je ena najbolj znanih italijanskih vinskih regij, znana po svojih Chianti vinih in Sangiovese sorti. Z različnimi tereni proizvaja elegantne in kompleksne vina.',
      en: 'Tuscany is one of the most famous Italian wine regions, known for its Chianti wines and Sangiovese variety. With diverse terrains, it produces elegant and complex wines.',
    },
    country: 'Italija',
    code: 'IT-TOS',
  },
  // Piedmont
  {
    title: {
      sl: 'Piemont',
      en: 'Piedmont',
    },
    description: {
      sl: 'Piemont je vinska regija v severozahodni Italiji, znana po svojih Barolo in Barbaresco vinih. Z alpskim podnebjem proizvaja močne in aromatične vina.',
      en: 'Piedmont is a wine region in northwestern Italy, known for its Barolo and Barbaresco wines. With alpine climate, it produces powerful and aromatic wines.',
    },
    country: 'Italija',
    code: 'IT-PIE',
  },
  // Bordeaux
  {
    title: {
      sl: 'Bordeaux',
      en: 'Bordeaux',
    },
    description: {
      sl: 'Bordeaux je ena najprestižnejših francoskih vinskih regij, znana po svojih rdečih vinih iz Cabernet Sauvignon in Merlot sort. Z oceanskim podnebjem proizvaja elegantne in starajoče se vina.',
      en: 'Bordeaux is one of the most prestigious French wine regions, known for its red wines from Cabernet Sauvignon and Merlot varieties. With oceanic climate, it produces elegant and age-worthy wines.',
    },
    country: 'Francija',
    code: 'FR-BOR',
  },
  // Burgundy
  {
    title: {
      sl: 'Burgundija',
      en: 'Burgundy',
    },
    description: {
      sl: 'Burgundija je vinska regija v vzhodni Franciji, znana po svojih Pinot Noir in Chardonnay vinih. Z kontinentalnim podnebjem proizvaja elegantne in kompleksne vina.',
      en: 'Burgundy is a wine region in eastern France, known for its Pinot Noir and Chardonnay wines. With continental climate, it produces elegant and complex wines.',
    },
    country: 'Francija',
    code: 'FR-BUR',
  },
  // Rioja
  {
    title: {
      sl: 'Rioja',
      en: 'Rioja',
    },
    description: {
      sl: 'Rioja je najbolj znana španska vinska regija, znana po svojih Tempranillo vinih. Z kontinentalnim podnebjem proizvaja elegantne in starajoče se vina.',
      en: 'Rioja is the most famous Spanish wine region, known for its Tempranillo wines. With continental climate, it produces elegant and age-worthy wines.',
    },
    country: 'Španija',
    code: 'ES-RIO',
  },
  // Mosel
  {
    title: {
      sl: 'Mosel',
      en: 'Mosel',
    },
    description: {
      sl: 'Mosel je vinska regija v zahodni Nemčiji, znana po svojih Riesling vinih. Z hladnim podnebjem proizvaja elegantne in aromatične vina.',
      en: 'Mosel is a wine region in western Germany, known for its Riesling wines. With cool climate, it produces elegant and aromatic wines.',
    },
    country: 'Nemčija',
    code: 'DE-MOS',
  },
  // Wachau
  {
    title: {
      sl: 'Wachau',
      en: 'Wachau',
    },
    description: {
      sl: 'Wachau je vinska regija v severni Avstriji, znana po svojih Grüner Veltliner vinih. Z alpskim podnebjem proizvaja elegantne in sveže vina.',
      en: 'Wachau is a wine region in northern Austria, known for its Grüner Veltliner wines. With alpine climate, it produces elegant and fresh wines.',
    },
    country: 'Avstrija',
    code: 'AT-WAC',
  },
  // Istria
  {
    title: {
      sl: 'Istra',
      en: 'Istria',
    },
    description: {
      sl: 'Istra je polotok v severni Hrvaški, znan po svojih belih vinih in Malvaziji sorti. Z mediteranskim podnebjem proizvaja aromatične in sveže vina.',
      en: 'Istria is a peninsula in northern Croatia, known for its white wines and Malvasia variety. With Mediterranean climate, it produces aromatic and fresh wines.',
    },
    country: 'Hrvaška',
    code: 'HR-IST',
  },
  // Tokaj
  {
    title: {
      sl: 'Tokaj',
      en: 'Tokaj',
    },
    description: {
      sl: 'Tokaj je vinska regija v severovzhodni Madžarski, znana po svojih sladkih vinih. Z kontinentalnim podnebjem proizvaja kompleksne in starajoče se vina.',
      en: 'Tokaj is a wine region in northeastern Hungary, known for its sweet wines. With continental climate, it produces complex and age-worthy wines.',
    },
    country: 'Madžarska',
    code: 'HU-TOK',
  },
  // Douro
  {
    title: {
      sl: 'Douro',
      en: 'Douro',
    },
    description: {
      sl: 'Douro je vinska regija v severni Portugalski, znana po svojih port vinih. Z kontinentalnim podnebjem proizvaja močne in aromatične vina.',
      en: 'Douro is a wine region in northern Portugal, known for its port wines. With continental climate, it produces powerful and aromatic wines.',
    },
    country: 'Portugalska',
    code: 'PT-DOU',
  },
  // Santorini
  {
    title: {
      sl: 'Santorini',
      en: 'Santorini',
    },
    description: {
      sl: 'Santorini je grški otok, znan po svojih belih vinih iz Assyrtiko sorte. Z mediteranskim podnebjem proizvaja mineralne in sveže vina.',
      en: 'Santorini is a Greek island, known for its white wines from Assyrtiko variety. With Mediterranean climate, it produces mineral and fresh wines.',
    },
    country: 'Grčija',
    code: 'GR-SAN',
  },
  // Napa Valley
  {
    title: {
      sl: 'Napa Valley',
      en: 'Napa Valley',
    },
    description: {
      sl: 'Napa Valley je najbolj znana kalifornijska vinska regija, znana po svojih Cabernet Sauvignon vinih. Z mediteranskim podnebjem proizvaja močne in bogate vina.',
      en: 'Napa Valley is the most famous Californian wine region, known for its Cabernet Sauvignon wines. With Mediterranean climate, it produces powerful and rich wines.',
    },
    country: 'ZDA',
    code: 'US-NAP',
  },
  // Marlborough
  {
    title: {
      sl: 'Marlborough',
      en: 'Marlborough',
    },
    description: {
      sl: 'Marlborough je najbolj znana novozelandska vinska regija, znana po svojih Sauvignon Blanc vinih. Z hladnim podnebjem proizvaja aromatične in sveže vina.',
      en: 'Marlborough is the most famous New Zealand wine region, known for its Sauvignon Blanc wines. With cool climate, it produces aromatic and fresh wines.',
    },
    country: 'Nova Zelandija',
    code: 'NZ-MAR',
  },
  // Stellenbosch
  {
    title: {
      sl: 'Stellenbosch',
      en: 'Stellenbosch',
    },
    description: {
      sl: 'Stellenbosch je najbolj znana južnoafriška vinska regija, znana po svojih Cabernet Sauvignon vinih. Z mediteranskim podnebjem proizvaja močne in bogate vina.',
      en: 'Stellenbosch is the most famous South African wine region, known for its Cabernet Sauvignon wines. With Mediterranean climate, it produces powerful and rich wines.',
    },
    country: 'Južna Afrika',
    code: 'ZA-STE',
  },
  // Mendoza
  {
    title: {
      sl: 'Mendoza',
      en: 'Mendoza',
    },
    description: {
      sl: 'Mendoza je najbolj znana argentinska vinska regija, znana po svojih Malbec vinih. Z kontinentalnim podnebjem proizvaja močne in aromatične vina.',
      en: 'Mendoza is the most famous Argentine wine region, known for its Malbec wines. With continental climate, it produces powerful and aromatic wines.',
    },
    country: 'Argentina',
    code: 'AR-MEN',
  },
  // Maipo Valley
  {
    title: {
      sl: 'Maipo Valley',
      en: 'Maipo Valley',
    },
    description: {
      sl: 'Maipo Valley je najbolj znana čilska vinska regija, znana po svojih Carmenère vinih. Z mediteranskim podnebjem proizvaja elegantne in kompleksne vina.',
      en: 'Maipo Valley is the most famous Chilean wine region, known for its Carmenère wines. With Mediterranean climate, it produces elegant and complex wines.',
    },
    country: 'Čile',
    code: 'CL-MAI',
  },
]
