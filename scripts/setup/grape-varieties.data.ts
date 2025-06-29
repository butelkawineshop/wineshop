export interface GrapeVarietyData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
  type: 'white' | 'red' | 'pink'
  origin?: string
}

export const grapeVarietiesData: GrapeVarietyData[] = [
  // White Varieties
  {
    title: {
      sl: 'Chardonnay',
      en: 'Chardonnay',
    },
    description: {
      sl: 'Chardonnay je ena najbolj prilagodljivih belih sort grozdja, ki uspeva v različnih podnebjih.',
      en: 'Chardonnay is one of the most adaptable white grape varieties, thriving in diverse climates.',
    },
    type: 'white',
    origin: 'Francija',
  },
  {
    title: {
      sl: 'Sauvignon Blanc',
      en: 'Sauvignon Blanc',
    },
    description: {
      sl: 'Sauvignon Blanc je znan po svojih aromatičnih belih vinih z izrazitimi travnatimi notami.',
      en: 'Sauvignon Blanc is known for its aromatic white wines with distinctive grassy notes.',
    },
    type: 'white',
    origin: 'Francija',
  },
  {
    title: {
      sl: 'Riesling',
      en: 'Riesling',
    },
    description: {
      sl: 'Riesling je ena najbolj aromatičnih belih sort, znana po svojih mineralnih vinih.',
      en: 'Riesling is one of the most aromatic white varieties, known for its mineral wines.',
    },
    type: 'white',
    origin: 'Nemčija',
  },
  {
    title: {
      sl: 'Pinot Grigio',
      en: 'Pinot Grigio',
    },
    description: {
      sl: 'Pinot Grigio je lahek in svež, priljubljen po vsem svetu.',
      en: 'Pinot Grigio is light and fresh, popular worldwide.',
    },
    type: 'white',
    origin: 'Italija',
  },
  {
    title: {
      sl: 'Gewürztraminer',
      en: 'Gewürztraminer',
    },
    description: {
      sl: 'Gewürztraminer je znan po svojih aromatičnih vinih z eksotičnimi notami.',
      en: 'Gewürztraminer is known for its aromatic wines with exotic notes.',
    },
    type: 'white',
    origin: 'Italija',
  },
  {
    title: {
      sl: 'Viognier',
      en: 'Viognier',
    },
    description: {
      sl: 'Viognier prideluje bogata in aromatična bela vina.',
      en: 'Viognier produces rich and aromatic white wines.',
    },
    type: 'white',
    origin: 'Francija',
  },
  {
    title: {
      sl: 'Grüner Veltliner',
      en: 'Grüner Veltliner',
    },
    description: {
      sl: 'Grüner Veltliner je avstrijska sorta, znana po svojih svežih in mineralnih vinih.',
      en: 'Grüner Veltliner is an Austrian variety, known for its fresh and mineral wines.',
    },
    type: 'white',
    origin: 'Avstrija',
  },
  {
    title: {
      sl: 'Albariño',
      en: 'Albariño',
    },
    description: {
      sl: 'Albariño je španska sorta, znana po svojih aromatičnih belih vinih.',
      en: 'Albariño is a Spanish variety, known for its aromatic white wines.',
    },
    type: 'white',
    origin: 'Španija',
  },
  {
    title: {
      sl: 'Assyrtiko',
      en: 'Assyrtiko',
    },
    description: {
      sl: 'Assyrtiko je grška sorta, znana po svojih mineralnih vinih iz Santorini.',
      en: 'Assyrtiko is a Greek variety, known for its mineral wines from Santorini.',
    },
    type: 'white',
    origin: 'Grčija',
  },
  {
    title: {
      sl: 'Malvasia',
      en: 'Malvasia',
    },
    description: {
      sl: 'Malvasia je sorta, ki se uporablja za bela in sladka vina.',
      en: 'Malvasia is a variety used for white and sweet wines.',
    },
    type: 'white',
    origin: 'Grčija',
  },
  // Red Varieties
  {
    title: {
      sl: 'Cabernet Sauvignon',
      en: 'Cabernet Sauvignon',
    },
    description: {
      sl: 'Cabernet Sauvignon je ena najbolj priljubljenih rdečih sort na svetu.',
      en: 'Cabernet Sauvignon is one of the most popular red varieties in the world.',
    },
    type: 'red',
    origin: 'Francija',
  },
  {
    title: {
      sl: 'Merlot',
      en: 'Merlot',
    },
    description: {
      sl: 'Merlot prideluje mehka in dostopna rdeča vina.',
      en: 'Merlot produces soft and approachable red wines.',
    },
    type: 'red',
    origin: 'Francija',
  },
  {
    title: {
      sl: 'Pinot Noir',
      en: 'Pinot Noir',
    },
    description: {
      sl: 'Pinot Noir je znan po svojih elegantnih in kompleksnih vinih.',
      en: 'Pinot Noir is known for its elegant and complex wines.',
    },
    type: 'red',
    origin: 'Francija',
  },
  {
    title: {
      sl: 'Syrah',
      en: 'Syrah',
    },
    description: {
      sl: 'Syrah prideluje močna in aromatična rdeča vina.',
      en: 'Syrah produces powerful and aromatic red wines.',
    },
    type: 'red',
    origin: 'Francija',
  },
  {
    title: {
      sl: 'Sangiovese',
      en: 'Sangiovese',
    },
    description: {
      sl: 'Sangiovese je glavna sorta v Toskani, znana po svojih Chianti vinih.',
      en: 'Sangiovese is the main variety in Tuscany, known for its Chianti wines.',
    },
    type: 'red',
    origin: 'Italija',
  },
  {
    title: {
      sl: 'Nebbiolo',
      en: 'Nebbiolo',
    },
    description: {
      sl: 'Nebbiolo je sorta za Barolo in Barbaresco, najprestižnejša piemontska vina.',
      en: 'Nebbiolo is the variety for Barolo and Barbaresco, the most prestigious Piedmont wines.',
    },
    type: 'red',
    origin: 'Italija',
  },
  {
    title: {
      sl: 'Tempranillo',
      en: 'Tempranillo',
    },
    description: {
      sl: 'Tempranillo je glavna sorta v Španiji, znana po svojih Rioja vinih.',
      en: 'Tempranillo is the main variety in Spain, known for its Rioja wines.',
    },
    type: 'red',
    origin: 'Španija',
  },
  {
    title: {
      sl: 'Grenache',
      en: 'Grenache',
    },
    description: {
      sl: 'Grenache je sorta, ki se uporablja za rdeča vina in rosé.',
      en: 'Grenache is a variety used for red wines and rosé.',
    },
    type: 'red',
    origin: 'Španija',
  },
  {
    title: {
      sl: 'Malbec',
      en: 'Malbec',
    },
    description: {
      sl: 'Malbec je argentinska sorta, znana po svojih močnih rdečih vinih.',
      en: 'Malbec is an Argentine variety, known for its powerful red wines.',
    },
    type: 'red',
    origin: 'Francija',
  },
  {
    title: {
      sl: 'Carmenère',
      en: 'Carmenère',
    },
    description: {
      sl: 'Carmenère je čilska sorta, znana po svojih elegantnih rdečih vinih.',
      en: 'Carmenère is a Chilean variety, known for its elegant red wines.',
    },
    type: 'red',
    origin: 'Francija',
  },
  {
    title: {
      sl: 'Zinfandel',
      en: 'Zinfandel',
    },
    description: {
      sl: 'Zinfandel je ameriška sorta, znana po svojih močnih rdečih vinih.',
      en: 'Zinfandel is an American variety, known for its powerful red wines.',
    },
    type: 'red',
    origin: 'ZDA',
  },
  {
    title: {
      sl: 'Shiraz',
      en: 'Shiraz',
    },
    description: {
      sl: 'Shiraz je avstralska sorta, znana po svojih močnih rdečih vinih.',
      en: 'Shiraz is an Australian variety, known for its powerful red wines.',
    },
    type: 'red',
    origin: 'Francija',
  },
  // Slovenian Varieties
  {
    title: {
      sl: 'Rebula',
      en: 'Ribolla Gialla',
    },
    description: {
      sl: 'Rebula je tradicionalna slovenska sorta iz Goriških Brd.',
      en: 'Rebula is a traditional Slovenian variety from Goriška Brda.',
    },
    type: 'white',
    origin: 'Slovenija',
  },
  {
    title: {
      sl: 'Malvazija',
      en: 'Malvasia',
    },
    description: {
      sl: 'Malvazija je sorta, ki se uporablja za bela vina v Istri.',
      en: 'Malvazija is a variety used for white wines in Istria.',
    },
    type: 'white',
    origin: 'Slovenija',
  },
  {
    title: {
      sl: 'Cviček',
      en: 'Cviček',
    },
    description: {
      sl: 'Cviček je tradicionalna mešanica rdečih in belih sort iz Dolenjske.',
      en: 'Cviček is a traditional blend of red and white varieties from Dolenjska.',
    },
    type: 'red',
    origin: 'Slovenija',
  },
  {
    title: {
      sl: 'Refošk',
      en: 'Refosco',
    },
    description: {
      sl: 'Refošk je tradicionalna rdeča sorta iz Primorske.',
      en: 'Refošk is a traditional red variety from Primorska.',
    },
    type: 'red',
    origin: 'Slovenija',
  },
  {
    title: {
      sl: 'Žametovka',
      en: 'Žametovka',
    },
    description: {
      sl: 'Žametovka je najstarejša sorta grozdja na svetu, raste v Mariboru.',
      en: 'Žametovka is the oldest grape variety in the world, growing in Maribor.',
    },
    type: 'red',
    origin: 'Slovenija',
  },
]
