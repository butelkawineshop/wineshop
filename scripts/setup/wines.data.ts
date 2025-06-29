export interface WineData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
  winery: string
  region?: string
  country: string
  grapeVarieties?: string[]
  style?: string
  vintage?: number
  price?: number
  alcohol?: number
  sweetness?: 'dry' | 'off-dry' | 'medium-sweet' | 'sweet'
  body?: 'light' | 'medium' | 'full'
  acidity?: 'low' | 'medium' | 'high'
  tannins?: 'low' | 'medium' | 'high'
}

export const winesData: WineData[] = [
  // Slovenian Wines
  {
    title: {
      sl: 'Movia Lunar',
      en: 'Movia Lunar',
    },
    description: {
      sl: 'Naravno belo vino iz Rebule, pridelano z minimalnimi posegi.',
      en: 'Natural white wine from Rebula, produced with minimal intervention.',
    },
    winery: 'Movia',
    region: 'Goriška Brda',
    country: 'Slovenija',
    grapeVarieties: ['Rebula'],
    style: 'white',
    vintage: 2022,
    price: 25,
    alcohol: 12.5,
    sweetness: 'dry',
    body: 'medium',
    acidity: 'high',
  },
  {
    title: {
      sl: 'Edi Simčič Barrique',
      en: 'Edi Simčič Barrique',
    },
    description: {
      sl: 'Elegantno belo vino iz Chardonnaya, starano v hrastovih sodih.',
      en: 'Elegant white wine from Chardonnay, aged in oak barrels.',
    },
    winery: 'Edi Simčič',
    region: 'Goriška Brda',
    country: 'Slovenija',
    grapeVarieties: ['Chardonnay'],
    style: 'white',
    vintage: 2021,
    price: 30,
    alcohol: 13.5,
    sweetness: 'dry',
    body: 'full',
    acidity: 'medium',
  },
  {
    title: {
      sl: 'Ščurek Stara Brajda',
      en: 'Ščurek Stara Brajda',
    },
    description: {
      sl: 'Naravno rdeče vino iz Merlota, pridelano v Vipavski dolini.',
      en: 'Natural red wine from Merlot, produced in Vipava Valley.',
    },
    winery: 'Ščurek',
    region: 'Vipavska Dolina',
    country: 'Slovenija',
    grapeVarieties: ['Merlot'],
    style: 'red',
    vintage: 2021,
    price: 28,
    alcohol: 13.0,
    sweetness: 'dry',
    body: 'medium',
    acidity: 'medium',
    tannins: 'medium',
  },
  // Italian Wines
  {
    title: {
      sl: 'Gaja Barbaresco',
      en: 'Gaja Barbaresco',
    },
    description: {
      sl: 'Prestižno rdeče vino iz Nebbiola, eno najboljših piemontskih vinov.',
      en: 'Prestigious red wine from Nebbiolo, one of the finest Piedmont wines.',
    },
    winery: 'Gaja',
    region: 'Piemont',
    country: 'Italija',
    grapeVarieties: ['Nebbiolo'],
    style: 'red',
    vintage: 2019,
    price: 200,
    alcohol: 14.0,
    sweetness: 'dry',
    body: 'full',
    acidity: 'high',
    tannins: 'high',
  },
  {
    title: {
      sl: 'Antinori Chianti Classico',
      en: 'Antinori Chianti Classico',
    },
    description: {
      sl: 'Klasično toskansko vino iz Sangiovese, elegantno in kompleksno.',
      en: 'Classic Tuscan wine from Sangiovese, elegant and complex.',
    },
    winery: 'Antinori',
    region: 'Toskana',
    country: 'Italija',
    grapeVarieties: ['Sangiovese'],
    style: 'red',
    vintage: 2020,
    price: 35,
    alcohol: 13.5,
    sweetness: 'dry',
    body: 'medium',
    acidity: 'high',
    tannins: 'medium',
  },
  // French Wines
  {
    title: {
      sl: 'Château Margaux',
      en: 'Château Margaux',
    },
    description: {
      sl: 'Eno najprestižnejših bordojskih vinov, elegantno in starajoče se.',
      en: 'One of the most prestigious Bordeaux wines, elegant and age-worthy.',
    },
    winery: 'Château Margaux',
    region: 'Bordeaux',
    country: 'Francija',
    grapeVarieties: ['Cabernet Sauvignon', 'Merlot'],
    style: 'red',
    vintage: 2018,
    price: 800,
    alcohol: 13.5,
    sweetness: 'dry',
    body: 'full',
    acidity: 'medium',
    tannins: 'high',
  },
  {
    title: {
      sl: 'Domaine de la Romanée-Conti',
      en: 'Domaine de la Romanée-Conti',
    },
    description: {
      sl: 'Najprestižnejše burgundsko vino, eno najdražjih vinov na svetu.',
      en: 'The most prestigious Burgundy wine, one of the most expensive wines in the world.',
    },
    winery: 'Domaine de la Romanée-Conti',
    region: 'Burgundija',
    country: 'Francija',
    grapeVarieties: ['Pinot Noir'],
    style: 'red',
    vintage: 2019,
    price: 15000,
    alcohol: 13.0,
    sweetness: 'dry',
    body: 'medium',
    acidity: 'high',
    tannins: 'low',
  },
  // Spanish Wines
  {
    title: {
      sl: 'Vega Sicilia Único',
      en: 'Vega Sicilia Único',
    },
    description: {
      sl: 'Najprestižnejše špansko vino, dolgoletno starano in kompleksno.',
      en: 'The most prestigious Spanish wine, long-aged and complex.',
    },
    winery: 'Vega Sicilia',
    region: 'Ribera del Duero',
    country: 'Španija',
    grapeVarieties: ['Tempranillo'],
    style: 'red',
    vintage: 2015,
    price: 400,
    alcohol: 14.0,
    sweetness: 'dry',
    body: 'full',
    acidity: 'medium',
    tannins: 'high',
  },
  // German Wines
  {
    title: {
      sl: 'Egon Müller Scharzhofberger',
      en: 'Egon Müller Scharzhofberger',
    },
    description: {
      sl: 'Eno najboljših Riesling vinov na svetu, elegantno in mineralno.',
      en: 'One of the finest Riesling wines in the world, elegant and mineral.',
    },
    winery: 'Egon Müller',
    region: 'Mosel',
    country: 'Nemčija',
    grapeVarieties: ['Riesling'],
    style: 'white',
    vintage: 2021,
    price: 150,
    alcohol: 8.5,
    sweetness: 'medium-sweet',
    body: 'light',
    acidity: 'high',
  },
  // Austrian Wines
  {
    title: {
      sl: 'Domäne Wachau Grüner Veltliner',
      en: 'Domäne Wachau Grüner Veltliner',
    },
    description: {
      sl: 'Elegantno avstrijsko belo vino, sveže in mineralno.',
      en: 'Elegant Austrian white wine, fresh and mineral.',
    },
    winery: 'Domäne Wachau',
    region: 'Wachau',
    country: 'Avstrija',
    grapeVarieties: ['Grüner Veltliner'],
    style: 'white',
    vintage: 2022,
    price: 25,
    alcohol: 12.5,
    sweetness: 'dry',
    body: 'medium',
    acidity: 'high',
  },
  // Croatian Wines
  {
    title: {
      sl: 'Kozlović Malvazija',
      en: 'Kozlović Malvazija',
    },
    description: {
      sl: 'Aromatično belo vino iz Istre, mediteransko in sveže.',
      en: 'Aromatic white wine from Istria, Mediterranean and fresh.',
    },
    winery: 'Kozlović',
    region: 'Istra',
    country: 'Hrvaška',
    grapeVarieties: ['Malvasia'],
    style: 'white',
    vintage: 2022,
    price: 20,
    alcohol: 12.0,
    sweetness: 'dry',
    body: 'medium',
    acidity: 'medium',
  },
  // Hungarian Wines
  {
    title: {
      sl: 'Royal Tokaji Aszú',
      en: 'Royal Tokaji Aszú',
    },
    description: {
      sl: 'Sladko vino iz Tokaja, eno najboljših sladkih vinov na svetu.',
      en: 'Sweet wine from Tokaj, one of the finest sweet wines in the world.',
    },
    winery: 'Royal Tokaji',
    region: 'Tokaj',
    country: 'Madžarska',
    grapeVarieties: ['Furmint'],
    style: 'white',
    vintage: 2017,
    price: 80,
    alcohol: 11.0,
    sweetness: 'sweet',
    body: 'full',
    acidity: 'high',
  },
  // Portuguese Wines
  {
    title: {
      sl: 'Quinta do Noval Vintage Port',
      en: 'Quinta do Noval Vintage Port',
    },
    description: {
      sl: 'Prestižno port vino, močno in starajoče se.',
      en: 'Prestigious port wine, powerful and age-worthy.',
    },
    winery: 'Quinta do Noval',
    region: 'Douro',
    country: 'Portugalska',
    grapeVarieties: ['Touriga Nacional'],
    style: 'red',
    vintage: 2018,
    price: 120,
    alcohol: 20.0,
    sweetness: 'sweet',
    body: 'full',
    acidity: 'medium',
    tannins: 'high',
  },
  // Greek Wines
  {
    title: {
      sl: 'Domaine Sigalas Assyrtiko',
      en: 'Domaine Sigalas Assyrtiko',
    },
    description: {
      sl: 'Mineralno belo vino iz Santorini, edinstveno in sveže.',
      en: 'Mineral white wine from Santorini, unique and fresh.',
    },
    winery: 'Domaine Sigalas',
    region: 'Santorini',
    country: 'Grčija',
    grapeVarieties: ['Assyrtiko'],
    style: 'white',
    vintage: 2022,
    price: 35,
    alcohol: 13.0,
    sweetness: 'dry',
    body: 'medium',
    acidity: 'high',
  },
  // US Wines
  {
    title: {
      sl: 'Opus One',
      en: 'Opus One',
    },
    description: {
      sl: 'Prestižno kalifornijsko vino, elegantno in kompleksno.',
      en: 'Prestigious Californian wine, elegant and complex.',
    },
    winery: 'Opus One',
    region: 'Napa Valley',
    country: 'ZDA',
    grapeVarieties: ['Cabernet Sauvignon', 'Merlot'],
    style: 'red',
    vintage: 2019,
    price: 500,
    alcohol: 14.5,
    sweetness: 'dry',
    body: 'full',
    acidity: 'medium',
    tannins: 'high',
  },
  // Australian Wines
  {
    title: {
      sl: 'Penfolds Grange',
      en: 'Penfolds Grange',
    },
    description: {
      sl: 'Najprestižnejše avstralsko vino, močno in starajoče se.',
      en: 'The most prestigious Australian wine, powerful and age-worthy.',
    },
    winery: 'Penfolds',
    region: 'Barossa Valley',
    country: 'Avstralija',
    grapeVarieties: ['Shiraz'],
    style: 'red',
    vintage: 2018,
    price: 800,
    alcohol: 14.5,
    sweetness: 'dry',
    body: 'full',
    acidity: 'medium',
    tannins: 'high',
  },
  // New Zealand Wines
  {
    title: {
      sl: 'Cloudy Bay Sauvignon Blanc',
      en: 'Cloudy Bay Sauvignon Blanc',
    },
    description: {
      sl: 'Aromatično belo vino iz Marlborough, sveže in travnato.',
      en: 'Aromatic white wine from Marlborough, fresh and grassy.',
    },
    winery: 'Cloudy Bay',
    region: 'Marlborough',
    country: 'Nova Zelandija',
    grapeVarieties: ['Sauvignon Blanc'],
    style: 'white',
    vintage: 2023,
    price: 30,
    alcohol: 13.0,
    sweetness: 'dry',
    body: 'light',
    acidity: 'high',
  },
  // South African Wines
  {
    title: {
      sl: 'Kanonkop Paul Sauer',
      en: 'Kanonkop Paul Sauer',
    },
    description: {
      sl: 'Prestižno južnoafriško vino, močno in elegantno.',
      en: 'Prestigious South African wine, powerful and elegant.',
    },
    winery: 'Kanonkop',
    region: 'Stellenbosch',
    country: 'Južna Afrika',
    grapeVarieties: ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'],
    style: 'red',
    vintage: 2019,
    price: 60,
    alcohol: 14.0,
    sweetness: 'dry',
    body: 'full',
    acidity: 'medium',
    tannins: 'high',
  },
  // Argentine Wines
  {
    title: {
      sl: 'Catena Zapata Malbec',
      en: 'Catena Zapata Malbec',
    },
    description: {
      sl: 'Elegantno argentinsko vino iz Malbeca, bogato in aromatično.',
      en: 'Elegant Argentine wine from Malbec, rich and aromatic.',
    },
    winery: 'Catena Zapata',
    region: 'Mendoza',
    country: 'Argentina',
    grapeVarieties: ['Malbec'],
    style: 'red',
    vintage: 2021,
    price: 45,
    alcohol: 14.0,
    sweetness: 'dry',
    body: 'full',
    acidity: 'medium',
    tannins: 'medium',
  },
  // Chilean Wines
  {
    title: {
      sl: 'Concha y Toro Don Melchor',
      en: 'Concha y Toro Don Melchor',
    },
    description: {
      sl: 'Prestižno čilsko vino, elegantno in kompleksno.',
      en: 'Prestigious Chilean wine, elegant and complex.',
    },
    winery: 'Concha y Toro',
    region: 'Maipo Valley',
    country: 'Čile',
    grapeVarieties: ['Cabernet Sauvignon'],
    style: 'red',
    vintage: 2019,
    price: 120,
    alcohol: 14.0,
    sweetness: 'dry',
    body: 'full',
    acidity: 'medium',
    tannins: 'high',
  },
]
