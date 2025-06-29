export interface WineryData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
  country: string
  region?: string
  website?: string
  founded?: number
}

export const wineriesData: WineryData[] = [
  // Slovenian Wineries
  {
    title: {
      sl: 'Movia',
      en: 'Movia',
    },
    description: {
      sl: 'Movia je ena najstarejših in najprestižnejših slovenskih vinarij, znana po svojih naravnih vinih.',
      en: 'Movia is one of the oldest and most prestigious Slovenian wineries, known for its natural wines.',
    },
    country: 'Slovenija',
    region: 'Goriška Brda',
    website: 'https://www.movia.si',
    founded: 1820,
  },
  {
    title: {
      sl: 'Klet Brda',
      en: 'Klet Brda',
    },
    description: {
      sl: 'Klet Brda je zadruga, ki združuje več kot 400 vinogradnikov iz Goriških Brd.',
      en: 'Klet Brda is a cooperative that unites more than 400 winegrowers from Goriška Brda.',
    },
    country: 'Slovenija',
    region: 'Goriška Brda',
    website: 'https://www.klet-brda.si',
    founded: 1957,
  },
  {
    title: {
      sl: 'Edi Simčič',
      en: 'Edi Simčič',
    },
    description: {
      sl: 'Edi Simčič je družinska vinarija, znana po svojih elegantnih vinih iz Goriških Brd.',
      en: 'Edi Simčič is a family winery, known for its elegant wines from Goriška Brda.',
    },
    country: 'Slovenija',
    region: 'Goriška Brda',
    website: 'https://www.edisimcic.si',
    founded: 1860,
  },
  {
    title: {
      sl: 'Ščurek',
      en: 'Ščurek',
    },
    description: {
      sl: 'Ščurek je družinska vinarija iz Vipavske doline, znana po svojih naravnih vinih.',
      en: 'Ščurek is a family winery from Vipava Valley, known for its natural wines.',
    },
    country: 'Slovenija',
    region: 'Vipavska Dolina',
    website: 'https://www.scurek.si',
    founded: 1973,
  },
  {
    title: {
      sl: 'Burja',
      en: 'Burja',
    },
    description: {
      sl: 'Burja je majhna vinarija iz Vipavske doline, znana po svojih naravnih vinih.',
      en: 'Burja is a small winery from Vipava Valley, known for its natural wines.',
    },
    country: 'Slovenija',
    region: 'Vipavska Dolina',
    website: 'https://www.burja-wine.com',
    founded: 2008,
  },
  // Italian Wineries
  {
    title: {
      sl: 'Gaja',
      en: 'Gaja',
    },
    description: {
      sl: 'Gaja je ena najprestižnejših italijanskih vinarij, znana po svojih Barolo vinih.',
      en: 'Gaja is one of the most prestigious Italian wineries, known for its Barolo wines.',
    },
    country: 'Italija',
    region: 'Piemont',
    website: 'https://www.gaja.com',
    founded: 1859,
  },
  {
    title: {
      sl: 'Antinori',
      en: 'Antinori',
    },
    description: {
      sl: 'Antinori je ena najstarejših italijanskih vinarij, znana po svojih Chianti vinih.',
      en: 'Antinori is one of the oldest Italian wineries, known for its Chianti wines.',
    },
    country: 'Italija',
    region: 'Toskana',
    website: 'https://www.antinori.it',
    founded: 1385,
  },
  // French Wineries
  {
    title: {
      sl: 'Château Margaux',
      en: 'Château Margaux',
    },
    description: {
      sl: 'Château Margaux je ena najprestižnejših francoskih vinarij, znana po svojih Bordeaux vinih.',
      en: 'Château Margaux is one of the most prestigious French wineries, known for its Bordeaux wines.',
    },
    country: 'Francija',
    region: 'Bordeaux',
    website: 'https://www.chateau-margaux.com',
    founded: 1500,
  },
  {
    title: {
      sl: 'Domaine de la Romanée-Conti',
      en: 'Domaine de la Romanée-Conti',
    },
    description: {
      sl: 'Domaine de la Romanée-Conti je ena najprestižnejših burgundskih vinarij.',
      en: 'Domaine de la Romanée-Conti is one of the most prestigious Burgundian wineries.',
    },
    country: 'Francija',
    region: 'Burgundija',
    website: 'https://www.romanee-conti.com',
    founded: 1869,
  },
  // Spanish Wineries
  {
    title: {
      sl: 'Vega Sicilia',
      en: 'Vega Sicilia',
    },
    description: {
      sl: 'Vega Sicilia je ena najprestižnejših španskih vinarij, znana po svojih Ribera del Duero vinih.',
      en: 'Vega Sicilia is one of the most prestigious Spanish wineries, known for its Ribera del Duero wines.',
    },
    country: 'Španija',
    region: 'Ribera del Duero',
    website: 'https://www.vega-sicilia.com',
    founded: 1864,
  },
  // German Wineries
  {
    title: {
      sl: 'Egon Müller',
      en: 'Egon Müller',
    },
    description: {
      sl: 'Egon Müller je ena najprestižnejših nemških vinarij, znana po svojih Riesling vinih.',
      en: 'Egon Müller is one of the most prestigious German wineries, known for its Riesling wines.',
    },
    country: 'Nemčija',
    region: 'Mosel',
    website: 'https://www.egonmueller.com',
    founded: 1797,
  },
  // Austrian Wineries
  {
    title: {
      sl: 'Domäne Wachau',
      en: 'Domäne Wachau',
    },
    description: {
      sl: 'Domäne Wachau je ena najprestižnejših avstrijskih vinarij, znana po svojih Grüner Veltliner vinih.',
      en: 'Domäne Wachau is one of the most prestigious Austrian wineries, known for its Grüner Veltliner wines.',
    },
    country: 'Avstrija',
    region: 'Wachau',
    website: 'https://www.domaene-wachau.at',
    founded: 1938,
  },
  // Croatian Wineries
  {
    title: {
      sl: 'Kozlović',
      en: 'Kozlović',
    },
    description: {
      sl: 'Kozlović je družinska vinarija iz Istre, znana po svojih Malvaziji vinih.',
      en: 'Kozlović is a family winery from Istria, known for its Malvasia wines.',
    },
    country: 'Hrvaška',
    region: 'Istra',
    website: 'https://www.kozlovic.hr',
    founded: 1904,
  },
  // Hungarian Wineries
  {
    title: {
      sl: 'Royal Tokaji',
      en: 'Royal Tokaji',
    },
    description: {
      sl: 'Royal Tokaji je ena najprestižnejših madžarskih vinarij, znana po svojih sladkih vinih.',
      en: 'Royal Tokaji is one of the most prestigious Hungarian wineries, known for its sweet wines.',
    },
    country: 'Madžarska',
    region: 'Tokaj',
    website: 'https://www.royaltokaji.com',
    founded: 1990,
  },
  // Portuguese Wineries
  {
    title: {
      sl: 'Quinta do Noval',
      en: 'Quinta do Noval',
    },
    description: {
      sl: 'Quinta do Noval je ena najprestižnejših portugalskih vinarij, znana po svojih port vinih.',
      en: 'Quinta do Noval is one of the most prestigious Portuguese wineries, known for its port wines.',
    },
    country: 'Portugalska',
    region: 'Douro',
    website: 'https://www.quintadonoval.com',
    founded: 1715,
  },
  // Greek Wineries
  {
    title: {
      sl: 'Domaine Sigalas',
      en: 'Domaine Sigalas',
    },
    description: {
      sl: 'Domaine Sigalas je ena najprestižnejših grških vinarij, znana po svojih Assyrtiko vinih.',
      en: 'Domaine Sigalas is one of the most prestigious Greek wineries, known for its Assyrtiko wines.',
    },
    country: 'Grčija',
    region: 'Santorini',
    website: 'https://www.sigalas-wine.com',
    founded: 1991,
  },
  // US Wineries
  {
    title: {
      sl: 'Opus One',
      en: 'Opus One',
    },
    description: {
      sl: 'Opus One je ena najprestižnejših ameriških vinarij, znana po svojih Cabernet Sauvignon vinih.',
      en: 'Opus One is one of the most prestigious American wineries, known for its Cabernet Sauvignon wines.',
    },
    country: 'ZDA',
    region: 'Napa Valley',
    website: 'https://www.opusonewinery.com',
    founded: 1979,
  },
  // Australian Wineries
  {
    title: {
      sl: 'Penfolds',
      en: 'Penfolds',
    },
    description: {
      sl: 'Penfolds je ena najprestižnejših avstralskih vinarij, znana po svojih Shiraz vinih.',
      en: 'Penfolds is one of the most prestigious Australian wineries, known for its Shiraz wines.',
    },
    country: 'Avstralija',
    region: 'Barossa Valley',
    website: 'https://www.penfolds.com',
    founded: 1844,
  },
  // New Zealand Wineries
  {
    title: {
      sl: 'Cloudy Bay',
      en: 'Cloudy Bay',
    },
    description: {
      sl: 'Cloudy Bay je ena najprestižnejših novozelandskih vinarij, znana po svojih Sauvignon Blanc vinih.',
      en: 'Cloudy Bay is one of the most prestigious New Zealand wineries, known for its Sauvignon Blanc wines.',
    },
    country: 'Nova Zelandija',
    region: 'Marlborough',
    website: 'https://www.cloudybay.co.nz',
    founded: 1985,
  },
  // South African Wineries
  {
    title: {
      sl: 'Kanonkop',
      en: 'Kanonkop',
    },
    description: {
      sl: 'Kanonkop je ena najprestižnejših južnoafriških vinarij, znana po svojih Cabernet Sauvignon vinih.',
      en: 'Kanonkop is one of the most prestigious South African wineries, known for its Cabernet Sauvignon wines.',
    },
    country: 'Južna Afrika',
    region: 'Stellenbosch',
    website: 'https://www.kanonkop.co.za',
    founded: 1910,
  },
  // Argentine Wineries
  {
    title: {
      sl: 'Catena Zapata',
      en: 'Catena Zapata',
    },
    description: {
      sl: 'Catena Zapata je ena najprestižnejših argentinskih vinarij, znana po svojih Malbec vinih.',
      en: 'Catena Zapata is one of the most prestigious Argentine wineries, known for its Malbec wines.',
    },
    country: 'Argentina',
    region: 'Mendoza',
    website: 'https://www.catenazapata.com',
    founded: 1902,
  },
  // Chilean Wineries
  {
    title: {
      sl: 'Concha y Toro',
      en: 'Concha y Toro',
    },
    description: {
      sl: 'Concha y Toro je ena največjih čilskih vinarij, znana po svojih Carmenère vinih.',
      en: 'Concha y Toro is one of the largest Chilean wineries, known for its Carmenère wines.',
    },
    country: 'Čile',
    region: 'Maipo Valley',
    website: 'https://www.conchaytoro.com',
    founded: 1883,
  },
]
