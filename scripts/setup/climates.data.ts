export interface ClimateData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
  climate: 'desert' | 'maritime' | 'mediterranean' | 'continental' | 'alpine'
  climateTemperature: 'cool' | 'moderate' | 'warm' | 'hot'
  diurnalTemperatureRange: 'low' | 'medium' | 'high'
  climateHumidity: 'dry' | 'moderate' | 'humid'
}

export const climatesData: ClimateData[] = [
  // Hladno kontinentalno / Cool Continental
  {
    title: {
      sl: 'Hladno kontinentalno',
      en: 'Cool Continental',
    },
    description: {
      sl: 'Hladne noči, kratka poletja in vina z napetostjo. Hladen celinski podnebni pas daje visoke kisline in nizke alkohole. Super za rizling, chardonnay, pinot noir. Velike temperaturne razlike čez dan upočasnijo zorenje. Trgatev pozna – razen če jo vzame slana.',
      en: "Sharp nights, short summers, and wines with tension. Cool continental climates deliver high acidity and leaner alcohol. Great for Riesling, Chardonnay, Pinot Noir. Big diurnal swings slow ripening, keeping things bright and age-worthy. Harvests run late—when they're not ruined by frost.",
    },
    climate: 'continental',
    climateTemperature: 'cool',
    diurnalTemperatureRange: 'high',
    climateHumidity: 'dry',
  },
  // Zmerno kontinentalno / Moderate Continental
  {
    title: {
      sl: 'Zmerno kontinentalno',
      en: 'Moderate Continental',
    },
    description: {
      sl: 'Več ravnotežja, več predvidljivosti. Zmerno celinsko podnebje dozori grozdje do konca, a kisline ostanejo. Rdeča vina dobijo strukturo (pinot, modra frankinja), bela ostanejo živa. Dnevna nihanja še vedno velika – vino ni nikoli tanko.',
      en: 'More balance, more consistency. Moderate continental zones ripen grapes fully while keeping acidity in check. Reds gain structure (think Pinot, Blaufränkisch), whites stay vibrant. Diurnal shifts are still big, so you get concentration without flab. Ideal for both serious and drink-now wines.',
    },
    climate: 'continental',
    climateTemperature: 'moderate',
    diurnalTemperatureRange: 'high',
    climateHumidity: 'moderate',
  },
  // Toplo kontinentalno / Warm Continental
  {
    title: {
      sl: 'Toplo kontinentalno',
      en: 'Warm Continental',
    },
    description: {
      sl: 'Topli dnevi, zrelo grozdje. Vina so polna, a zaradi hladnih noči ne izgubijo fokusa. Idealno za syrah, cabernet, malbec. Kisline še ostanejo, trgatev zgodnejša – brez žganih tonov.',
      en: 'Warmer days, riper fruit. These wines have power, but thanks to those chilly nights, they stay focused. Think Syrah, Cabernet, Malbec. Acidity hangs on just enough. Harvests are earlier than in cooler zones, but still safe from scorching heat.',
    },
    climate: 'continental',
    climateTemperature: 'warm',
    diurnalTemperatureRange: 'high',
    climateHumidity: 'dry',
  },
  // Vroče Kontinentalno / Hot Continental
  {
    title: {
      sl: 'Vroče Kontinentalno',
      en: 'Hot Continental',
    },
    description: {
      sl: 'Podnevi peče, ponoči zebe. Vina so močna, alkoholna in maksimalno zrela. Dnevna temperaturna nihanja rešujejo pred marmelado. Super za močna rdeča, pozne trgatve in ljubitelje bomb.',
      en: 'Brutal heat by day, deep chills by night. These wines are bold, boozy, and often sun-drenched. Diurnal swings help save them from being syrup. Great for high-alcohol reds, late harvest styles, or when you just want a wine that lifts weights.',
    },
    climate: 'continental',
    climateTemperature: 'hot',
    diurnalTemperatureRange: 'high',
    climateHumidity: 'dry',
  },
  // Hladno oceansko / Cool Maritime
  {
    title: {
      sl: 'Hladno oceansko',
      en: 'Cool Maritime',
    },
    description: {
      sl: 'Megleno, vlažno, počasno. Hladno oceansko podnebje pomeni dolgo sezono in kisline za deset let. Sauvignon, albariño, pinot noir. Vlaga je tečna, a megla je naravna klima. Trgatev pozna in počasna.',
      en: "Mild, misty, and moody. Cool maritime climates mean looooong growing seasons, steady sugar build-up, and acidity that sticks around forever. Perfect for Sauvignon Blanc, Albariño, Pinot Noir. Humidity's a pain, but fog = free aircon. Harvests run late and slow.",
    },
    climate: 'maritime',
    climateTemperature: 'cool',
    diurnalTemperatureRange: 'low',
    climateHumidity: 'humid',
  },
  // Zmerno oceansko / Moderate Maritime
  {
    title: {
      sl: 'Zmerno oceansko',
      en: 'Moderate Maritime',
    },
    description: {
      sl: 'Sproščeno in zanesljivo. Zmerno oceansko podnebje redko speče ali zmrzne – letniki so stabilni. Vina uravnotežena, mehka, všečna. Merlot, cabernet franc, chardonnay. Kisline manj ostre, struktura bolj zaokrožena.',
      en: 'Easy-breezy and reliable. Moderate maritime regions rarely fry or freeze, so vintages are steady and clean. Wines are balanced, textured, and crowd-friendly. Ideal for Merlot, Cab Franc, Chardonnay. Low diurnal range means softer acids, rounder structure.',
    },
    climate: 'maritime',
    climateTemperature: 'moderate',
    diurnalTemperatureRange: 'low',
    climateHumidity: 'moderate',
  },
  // Toplo oceansko / Warm Maritime
  {
    title: {
      sl: 'Toplo oceansko',
      en: 'Warm Maritime',
    },
    description: {
      sl: 'Sadno, a ne marmeladno. Toplo oceansko podnebje prinaša zrelo grozdje, manj bolezni in kanček soli. Syrah, bogata bela, resna rosé vina. Morski vetrič drži kisline skupaj.',
      en: 'Richer styles, but not over the top. Warm maritime climates bring ripe fruit, low disease pressure, and a touch of salinity. Think plush Syrah, broad whites, and deep rosés. Gentle sea breeze helps hold acidity together.',
    },
    climate: 'maritime',
    climateTemperature: 'warm',
    diurnalTemperatureRange: 'medium',
    climateHumidity: 'moderate',
  },
  // Hladno mediteransko / Cool Mediterranean
  {
    title: {
      sl: 'Hladno mediteransko',
      en: 'Cool Mediterranean',
    },
    description: {
      sl: 'Hladno z dodatkom sonca. Zeliščna bela, mineralna rosé, rdeča z napetostjo. Kislina ostane, tanini mehki. Trgatev konec septembra, ko se veter končno umiri.',
      en: "Cool temps with sun on the side. You get herbal whites, mineral rosés, and reds that stay taut. Acid's still lively, tannins stay in check. Harvests come in late September, when the sea breeze stops napping.",
    },
    climate: 'mediterranean',
    climateTemperature: 'cool',
    diurnalTemperatureRange: 'medium',
    climateHumidity: 'moderate',
  },
  // Zmerno mediteransko / Moderate Mediterranean
  {
    title: {
      sl: 'Zmerno mediteransko',
      en: 'Moderate Mediterranean',
    },
    description: {
      sl: 'Uravnoteženo in izrazito. Zmerno sredozemsko podnebje pomeni vroče dni, hladnejše noči in suho rastno sezono. Grenache, vermentino, sangiovese – tu so doma. Kisline zdržijo, tanini dozorijo. Trgatev točno, ko mora biti.',
      en: 'Balanced and expressive. Moderate Mediterranean zones mean hot days, cool-ish nights, and dry growing seasons. Think Grenache, Vermentino, or Sangiovese in their element. Acid holds, tannins ripen gently, and harvests hit right on schedule.',
    },
    climate: 'mediterranean',
    climateTemperature: 'moderate',
    diurnalTemperatureRange: 'medium',
    climateHumidity: 'dry',
  },
  // Toplo mediteransko / Warm Mediterranean
  {
    title: {
      sl: 'Toplo mediteransko',
      en: 'Warm Mediterranean',
    },
    description: {
      sl: 'Polni okusi, nič sramežljivosti. Toplo sredozemsko podnebje rodi sončna, bujna vina s sadjem in žametnimi tanini. Če ujameš pravi čas, ostane tudi kislina. Idealno za močna rdeča in resna rosé vina.',
      en: 'This is where flavor gets juicy. Warm Mediterranean regions pump out sun-drenched, bold wines with generous fruit and velvet tannins. Acidity hangs in if you harvest on time. Great for bold reds and serious rosé.',
    },
    climate: 'mediterranean',
    climateTemperature: 'warm',
    diurnalTemperatureRange: 'low',
    climateHumidity: 'dry',
  },
  // Vroče mediteransko / Hot Mediterranean
  {
    title: {
      sl: 'Vroče mediteransko',
      en: 'Hot Mediterranean',
    },
    description: {
      sl: "Zrelost do konca. Vroče sredozemsko podnebje je za pogumne – džemasti okusi, pozna trgatev, nizke kisline. Tanini se raztopijo v sadje, ravnotežje je izziv. Super za primitivo, nero d'avolo in nasploh glasna vina.",
      en: "Full throttle ripeness. Hot Mediterranean climates are for the fearless — jammy reds, late harvests, and low acid. Tannins melt into plush fruit, but balance is tricky. Great for Primitivo, Nero d'Avola, or just making a statement.",
    },
    climate: 'mediterranean',
    climateTemperature: 'hot',
    diurnalTemperatureRange: 'low',
    climateHumidity: 'dry',
  },
]
