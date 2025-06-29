export interface WineCountryData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
  code: string
}

export const wineCountriesData: WineCountryData[] = [
  // Slovenia
  {
    title: {
      sl: 'Slovenija',
      en: 'Slovenia',
    },
    description: {
      sl: 'Slovenija je majhna država v srednji Evropi, ki ima bogato vinarstvo zgodovino. Z različnimi podnebji in tereni, od alpskih regij do mediteranskih obal, proizvaja raznolike vina. Najbolj znane so regije Primorska, Posavje in Podravje.',
      en: 'Slovenia is a small country in Central Europe with a rich winemaking history. With diverse climates and terrains, from alpine regions to Mediterranean coasts, it produces varied wines. The most famous regions are Primorska, Posavje, and Podravje.',
    },
    code: 'SI',
  },
  // Italy
  {
    title: {
      sl: 'Italija',
      en: 'Italy',
    },
    description: {
      sl: 'Italija je ena največjih vinarskih držav na svetu, znana po svoji raznolikosti in kakovosti vin. Od severa do juga ponuja različne sorte in sloge, od lahkih belih vin do močnih rdečih.',
      en: 'Italy is one of the largest wine-producing countries in the world, known for its diversity and quality of wines. From north to south, it offers various varieties and styles, from light whites to powerful reds.',
    },
    code: 'IT',
  },
  // France
  {
    title: {
      sl: 'Francija',
      en: 'France',
    },
    description: {
      sl: 'Francija je dom nekaterih najbolj prestižnih vinarskih regij na svetu. Od Bordeaux do Burgundy, od Champagne do Rhône Valley, francoska vina so sinonim za eleganco in tradicijo.',
      en: 'France is home to some of the most prestigious wine regions in the world. From Bordeaux to Burgundy, from Champagne to Rhône Valley, French wines are synonymous with elegance and tradition.',
    },
    code: 'FR',
  },
  // Spain
  {
    title: {
      sl: 'Španija',
      en: 'Spain',
    },
    description: {
      sl: 'Španija je največja vinarska država po površini vinogradov. Z različnimi podnebji in tereni proizvaja vse od lahkih belih vin do močnih rdečih in sladkih sherry vin.',
      en: 'Spain is the largest wine-producing country by vineyard area. With diverse climates and terrains, it produces everything from light whites to powerful reds and sweet sherry wines.',
    },
    code: 'ES',
  },
  // Germany
  {
    title: {
      sl: 'Nemčija',
      en: 'Germany',
    },
    description: {
      sl: 'Nemčija je znana predvsem po svojih belih vinih, še posebej po Rieslingu. Z različnimi podnebji, od hladnih severnih regij do toplejših jugovzhodnih, proizvaja elegantne in aromatične vina.',
      en: 'Germany is known primarily for its white wines, especially Riesling. With diverse climates, from cool northern regions to warmer southeastern areas, it produces elegant and aromatic wines.',
    },
    code: 'DE',
  },
  // Austria
  {
    title: {
      sl: 'Avstrija',
      en: 'Austria',
    },
    description: {
      sl: 'Avstrija je majhna vinarska država z veliko tradicijo. Najbolj znana je po svojih belih vinih, še posebej po Grüner Veltliner in Riesling, ter po sladkih vinskih sortah.',
      en: 'Austria is a small wine-producing country with a great tradition. It is best known for its white wines, especially Grüner Veltliner and Riesling, as well as sweet wine varieties.',
    },
    code: 'AT',
  },
  // Croatia
  {
    title: {
      sl: 'Hrvaška',
      en: 'Croatia',
    },
    description: {
      sl: 'Hrvaška ima bogato vinarstvo zgodovino z različnimi regijami. Od kontinentalnih regij do dalmatinske obale, proizvaja raznolike vina z avtohtonimi sortami grozdja.',
      en: 'Croatia has a rich winemaking history with diverse regions. From continental regions to the Dalmatian coast, it produces varied wines with indigenous grape varieties.',
    },
    code: 'HR',
  },
  // Hungary
  {
    title: {
      sl: 'Madžarska',
      en: 'Hungary',
    },
    description: {
      sl: 'Madžarska je znana po svojih sladkih vinih, še posebej po Tokaji. Z različnimi podnebji in tereni proizvaja tako bela kot rdeča vina z bogato zgodovino.',
      en: 'Hungary is known for its sweet wines, especially Tokaji. With diverse climates and terrains, it produces both white and red wines with a rich history.',
    },
    code: 'HU',
  },
  // Portugal
  {
    title: {
      sl: 'Portugalska',
      en: 'Portugal',
    },
    description: {
      sl: 'Portugalska je znana po svojih port vinih in avtohtonih sortah grozdja. Z različnimi regijami, od severa do juga, proizvaja raznolike vina z bogato tradicijo.',
      en: 'Portugal is known for its port wines and indigenous grape varieties. With diverse regions, from north to south, it produces varied wines with a rich tradition.',
    },
    code: 'PT',
  },
  // Greece
  {
    title: {
      sl: 'Grčija',
      en: 'Greece',
    },
    description: {
      sl: 'Grčija ima eno najstarejših vinarstvo tradicij na svetu. Z različnimi otoki in celinskimi regijami proizvaja raznolike vina z avtohtonimi sortami grozdja.',
      en: 'Greece has one of the oldest winemaking traditions in the world. With diverse islands and mainland regions, it produces varied wines with indigenous grape varieties.',
    },
    code: 'GR',
  },
  // United States
  {
    title: {
      sl: 'ZDA',
      en: 'United States',
    },
    description: {
      sl: 'ZDA so ena največjih vinarskih držav na svetu. Kalifornija je najbolj znana regija, vendar se vino proizvaja v vseh 50 zveznih državah z različnimi podnebji in tereni.',
      en: 'The United States is one of the largest wine-producing countries in the world. California is the most famous region, but wine is produced in all 50 states with diverse climates and terrains.',
    },
    code: 'US',
  },
  // Australia
  {
    title: {
      sl: 'Avstralija',
      en: 'Australia',
    },
    description: {
      sl: 'Avstralija je znana po svojih Shiraz vinih in drugih sortah, ki uspevajo v različnih podnebjih. Z različnimi regijami, od hladnih do toplih, proizvaja raznolike vina.',
      en: 'Australia is known for its Shiraz wines and other varieties that thrive in diverse climates. With various regions, from cool to warm, it produces varied wines.',
    },
    code: 'AU',
  },
  // New Zealand
  {
    title: {
      sl: 'Nova Zelandija',
      en: 'New Zealand',
    },
    description: {
      sl: 'Nova Zelandija je znana po svojih Sauvignon Blanc vinih, še posebej iz Marlborough regije. Z različnimi podnebji, od severnega otoka do južnega, proizvaja elegantne in sveže vina.',
      en: 'New Zealand is known for its Sauvignon Blanc wines, especially from the Marlborough region. With diverse climates, from the North Island to the South, it produces elegant and fresh wines.',
    },
    code: 'NZ',
  },
  // South Africa
  {
    title: {
      sl: 'Južna Afrika',
      en: 'South Africa',
    },
    description: {
      sl: 'Južna Afrika ima bogato vinarstvo zgodovino z različnimi regijami. Z različnimi podnebji in tereni proizvaja raznolike vina, od belih do rdečih.',
      en: 'South Africa has a rich winemaking history with diverse regions. With diverse climates and terrains, it produces varied wines, from whites to reds.',
    },
    code: 'ZA',
  },
  // Chile
  {
    title: {
      sl: 'Čile',
      en: 'Chile',
    },
    description: {
      sl: 'Čile je znan po svojih Carmenère vinih in drugih sortah, ki uspevajo v različnih podnebjih. Z različnimi regijami, od severa do juga, proizvaja raznolike vina.',
      en: 'Chile is known for its Carmenère wines and other varieties that thrive in diverse climates. With various regions, from north to south, it produces varied wines.',
    },
    code: 'CL',
  },
  // Argentina
  {
    title: {
      sl: 'Argentina',
      en: 'Argentina',
    },
    description: {
      sl: 'Argentina je znana po svojih Malbec vinih, še posebej iz Mendoza regije. Z različnimi podnebji in nadmorskimi višinami proizvaja močne in aromatične vina.',
      en: 'Argentina is known for its Malbec wines, especially from the Mendoza region. With diverse climates and altitudes, it produces powerful and aromatic wines.',
    },
    code: 'AR',
  },
]
