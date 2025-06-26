import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'

interface WineCountryData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
  whyCool?: {
    sl: string
    en: string
  }
  landArea?: number
  wineriesCount?: number
}

const wineCountriesData: WineCountryData[] = [
  // Slovenija / Slovenia
  {
    title: {
      sl: 'Slovenija',
      en: 'Slovenia',
    },
    description: {
      sl: 'Slovenija od kod lepote tvoje. Naša kokoška z izjemno pisanim okoljem, je dom skoraj 30.000 kletem in mnogo mnogo različnim stilom. Od lahkih, svežin vin, do kompleksnih barikiranih zadevc pa seveda naše maceracije, ki so mednarodno gledano naš paradni konj.',
      en: 'Because this is our land, the land of champions haha. We love it for its variety of climates, environments and of course many many many different wine styles. Fresh whites, to oaked complexities, but it seems our main identity as far as the international market is concerned are our skin contact wines.',
    },
    whyCool: {
      sl: 'Ker so Praslovani  tisočletja nazaj zbrali ravno naše področje za svoje prve kampe, ker je bil njihov cilj "se ustavit kjer rastejo trte".',
      en: 'Because the ancient Slavic peoples decided this was the land to settle after following their credo of "we will settle where the vines will grow".',
    },
    landArea: 15261,
    wineriesCount: 28481,
  },
  // Italija / Italy
  {
    title: {
      sl: 'Italija',
      en: 'Italy',
    },
    description: {
      sl: 'Naši zahodni sosedje, ki vino jemljejo tako resno, kot jemljejo njihovo hrano. No, skoraj. Njihova vina so romantična in glasna, a vendar imajo tisti neopisljiv eleganten občutek, ki ga znajo samo Italijani. Preko 700 sort raste po celi Italiji in seveda, da ne bi bilo preveč preprosto imajo zanje več kot 3000 imen. Da si ne bi slučajno kdo drznil razumet cele države.',
      en: "Crazy Italians. They don't like things easy, do they? They have 700 different grape varieties with over 3000 names for them, just in case some smartass wanted to understand the country. Their wines are romantic and loud, but with the sofisticated Italian elegance, nobody else can quite mimic.",
    },
    whyCool: {
      sl: 'Ker je vino za delit in ni je države, ki bi to bolj resno vzela kot Italijani. In ker je za njih vino hrana, nujen spremljeavelc vsakega obeda in ker so komplicirani.',
      en: 'Because wine is made for sharing, and noone takes that more seriously than the Italians. Because wine is food to them and it belongs with every meal. How can you not love them!',
    },
    landArea: 702000,
    wineriesCount: 32000,
  },
  // Francija / France
  {
    title: {
      sl: 'Francija',
      en: 'France',
    },
    description: {
      sl: 'Absolutni kralji v vinskem svetu, a večini nam gre to kar malo v nos. Daleč od tega, da bi bili prvi, ki bi razumeli kako pomembno je lahko vino, a pismo, dolžni smo jim vsi. Menihi v srednjem veku so do potankosti preučili vinograde in tega znanja drugi pač nimamo. Jih pa zato vsi kopiramo! Kako ne bi? Vina z izjemno eleganco in prefinjenostjo, predvsem pa z izjemnim občutkom za "terroir" - krajem od koder vsaka butelka prihaja.',
      en: 'Oh, our snobby little friends. We may dislike their attitudes, but we adore their wines. Crafted to absolute perfection, thanks to the Middle Ages and the monks in local monasteries carefully keeping records about each planted vineyard. Their understanding of terroir is second to none. No wonder, we all want to copy them.',
    },
    whyCool: {
      sl: 'Ker so preprosto stoletja pred vsemi z razumevanjem njihove zemlje. A zavist nam ne bo pomagala, le trdno delo in skrbno varovanje zapiskov.',
      en: 'Because they know what they are doing. They have managed to make the whole world look up to them, and their wines are the ONLY references we need when communicating about wine. How cool is that?!',
    },
    landArea: 747000,
    wineriesCount: 270000,
  },
  // Madžarska / Hungary
  {
    title: {
      sl: 'Madžarska',
      en: 'Hungary',
    },
    description: {
      sl: 'Madžari se nam mogoče ne zdijo, kot pomembna vinska regija, a potrebno si je zapomnit, da so izgubili cca 200 let z vpadom Turkov, ko so morali posekati svoje vinograde. Kljub temu, so bili eni prvih, ki so razumeli, da imajo posebno vino, saj je Tokaji kot območje z zaščitenim geografskim poreklom obstajalo že v prvi polovici 18.stoletja.',
      en: 'Hungary is not the first place you think about when wine is the topic of discussion. But this could be very different had there not been for the Turkish invading Hungary, forcing them to chop down their vineyards. In spite of this 200 year setback, the Hungarians were still among the first countries to have a wine with a designated origin in Tokaji, as far back as 1737.',
    },
    whyCool: {
      sl: 'Ker, če ne bi bilo turkov, si upamo trditi, da bi bila Madžarska to kar je danes Francija. Referenca svetonih vin!',
      en: 'Because we firmly believe they would be a reference for world wine, if they were not slowed down in their prime. They would be what France is today!',
    },
    landArea: 61000,
    wineriesCount: 1600,
  },
  // Argentina
  {
    title: {
      sl: 'Argentina',
      en: 'Argentina',
    },
    description: {
      sl: 'Argentina je OGROMNA! In še bolj pomembno, razpotegnjena! Kar pomeni, da ima velik razpon vinskih regij, vse od severne Salte pa do južne Patagonije. Kljub temu, se bolj fokusirajo na mogočna, bogata vina, predvsem pa na vina, ki grejo fantastično z njihovim asadom (po domače žar).',
      en: 'One of the longest countries in the world from North to South, meaning they have a variety of climates available to them. In spite of this, they focus on rich, bold wines, mainly to go with their beautiful asado!',
    },
    whyCool: {
      sl: 'Ker se je njihov predsednik leta 1884 odločil, da oni bodo pa znani po Malbecu. Sicer so potrebovali 100 let, ampak evo jih tu!',
      en: 'Because their president decided back in 1884 that they shall be famous for Malbec. And look at them now. Took them 100 years, but who cares!',
    },
    landArea: 220000,
    wineriesCount: 2000,
  },
  // Avstrija / Austria
  {
    title: {
      sl: 'Avstrija',
      en: 'Austria',
    },
    description: {
      sl: 'Avstrijsi so si dovolil en ne tako majhen kiks v 80ih prejšnjega stoletja. Mogoče so malo po pomoti zastrupili nekaj ljudi. Upsi! Ampak, če kaj vemo o naših severnih sosedih, je to da se iz zgodovine marsikej naučijo (wink wink). Moderna vinska Avstrija postaja velesila! Z uspešnim vlaganjem in sistematičnim delom, postajajo konkurečni celo francozom. Njihova vina stremijo k svežini in preciznosti - kakopak.',
      en: "Austria not to be confused with Australia my murican friends did a bit of a woopsie in the 1980s. They may have almost, kind of... poisoned some people. Woopsie! No biggie, if there is anything we know about Austrians, they learn from their past (wink wink). But let's let bygones be bygones. These days they are serious contenders in the wine business. Excellent funding and systematic approach has made them one of the most important wine regions in the world. Their wines are racy and often a bit spicy, but mainly just beautifully refreshing.",
    },
    whyCool: {
      sl: 'Brez pogrevanja zgodovine, njihova vina so noro dobra. Slovijo po svežini in kdo si ne želi osvežitve ko pije vino??',
      en: 'Because of their wines. I mean the freshness is something we crave for as wine people, and Austrians deliver it in heaps!',
    },
    landArea: 44913,
    wineriesCount: 23000,
  },
  // Avstralija / Australia
  {
    title: {
      sl: 'Avstralija',
      en: 'Australia',
    },
    description: {
      sl: 'Avstralija v Sloveniji ni ravno spoštovana kot vinska regija. Škoda! V bistvu se tam skrivajo fantasična vina, ki so zaenkrat še super cenovno ugodna. Ampak tudi to se spreminja. Kljub prepričanju, da je tam vse vroče, ne pozabimo kako blizu Antarktiki so, zato imajo precej tudi hladnega vpliva, ki je idealn za vina. Še vedno je vroče seveda, zato so vina takšna kot Avstralci. Glasna in aromatična!',
      en: "Ozzies wines are just about as cool as they are. Loud, fun, easy to drink. People forgot that yes, it's hot. But Antarctica is close by, so there is some cool corridors perfect for making wines. Tasmania makes incredible bubbles, and Eden valley some seriously delicious cool-climate Rieslings. Give them a try, don't be shy.",
    },
    whyCool: {
      sl: 'Ker so vina super preprosta za pit, niso zategnjena, prevsem pa so mehka. Aja pa, zato ker ko so dobri valovi, gredo raje surfat, kot pa v vinograd. Work-life balance? Check!',
      en: 'Anyone that will drop everything and go surfing when the waves are up instead of working in the searing heat in the vineyards is our kind of person. Work-life balance? Check.',
    },
    landArea: 170000,
    wineriesCount: 2400,
  },
  // Španija / Spain
  {
    title: {
      sl: 'Španija',
      en: 'Spain',
    },
    description: {
      sl: 'Španci so zanimiva nacija. Delajo vse od pljuske za v Sangrijo, pa super elegantnih prestižnih vin, ki stanejo tisoče evrov. Uživajo življenje in to se pozna na vinih. Imajo ogromno karakterja, kar je včasih tudi slabo, ampak vedno je dogodivščina! Več vin je bogatih kot svežih, a to ne pomeni, da jih ni. Sploh na zahodu delajo super lepa sveža vina.',
      en: "Spain has the largest vineyard area in the world. It's absolutely massive. In spite of this, they have relatively few wineries - they are mostly huge though. Their wines match their character, they are bold, friendly, very smooth. The western part actually make some really nice fresh wines too. You got to, next to the Atlantic, right?",
    },
    whyCool: {
      sl: 'Za razliko od Italijanov, so veliko bolj preprosti za razumet. To mislimo seveda v vinskem smislu (a ne?).',
      en: 'Because they are huge, but much easier to learn and understand than Italians. Wines are made for Sangria and for thousands and thousands. The choice is yours!',
    },
    landArea: 961000,
    wineriesCount: 4000,
  },
  // ZDA / USA
  {
    title: {
      sl: 'ZDA',
      en: 'USA',
    },
    description: {
      sl: 'Američani proizvajajo vino v vseh svojih državah. Tudi Aljaski in na Havajih. Tega jim res ne bi bilo potrebno. Najboljše države so še vedno Kalifornija, Oregon, New York in Virginia. Vina so si izjemno različna v stilih, temu seveda botruje pisana kulturna dediščina in pa predvsem njihov kapitalistični pogled na ... vse! To ne pomeni, da vina niso fantastična. So pa verjetno na dnu, kar se tiče njihove vrednosti napram kvaliteti.',
      en: "The americans produce wines in all of their states. Including Alaska and Hawaii. Well, maybe this wasn't necessary. The finest wine states are still California, Oregon, New York and Virginia. Their wines are as unique as their cultural heritage, but yes, there is some perceived sweetness to the wines too. Not necessarily a bad thing though!",
    },
    whyCool: {
      sl: 'Ker niso tako tradicionalni, kot smo v Evropi. Riskirajo, eksperimentirajo in ustvarjajo super vina. Ok so malce na slajši strani, ampak to ni nujno slabo!',
      en: "Because they are bold risk takers and are not afraid to experiment. Us Europeans are waaaay too traditional and we tend to fight over stupid little things. They don't care. And this makes the wines super fun!",
    },
    landArea: 420000,
    wineriesCount: 7221,
  },
]

async function seedWineCountries(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    logger.info('Starting wine countries seeding...', { task: 'seed-wine-countries' })

    for (const countryData of wineCountriesData) {
      try {
        // Check if country already exists
        const existingCountry = await payload.find({
          collection: 'wineCountries',
          where: {
            'title.sl': {
              equals: countryData.title.sl,
            },
          },
        })

        if (existingCountry.docs.length > 0) {
          logger.info(`Country ${countryData.title.sl} already exists, skipping...`, {
            task: 'seed-wine-countries',
            country: countryData.title.sl,
          })
          continue
        }

        // Create the country with Slovenian locale
        const createdCountry = await payload.create({
          collection: 'wineCountries',
          data: {
            title: countryData.title.sl,
            description: countryData.description?.sl || '',
            whyCool: countryData.whyCool?.sl || '',
            statistics: {
              landArea: countryData.landArea || null,
              wineriesCount: countryData.wineriesCount || null,
            },
          },
          locale: 'sl',
        })

        // Update with English locale
        await payload.update({
          collection: 'wineCountries',
          id: createdCountry.id,
          data: {
            title: countryData.title.en,
            description: countryData.description?.en || '',
            whyCool: countryData.whyCool?.en || '',
          },
          locale: 'en',
        })

        logger.info(`Created wine country: ${createdCountry.title}`, {
          task: 'seed-wine-countries',
          country: countryData.title.sl,
        })
      } catch (error) {
        logger.error(
          `Failed to create wine country: ${countryData.title.sl} - ${(error as Error).message}`,
          error as Error,
          {
            task: 'seed-wine-countries',
            country: countryData.title.sl,
          },
        )
      }
    }

    logger.info('Wine countries seeding completed successfully', { task: 'seed-wine-countries' })
  } catch (error) {
    logger.error('Failed to seed wine countries', error as Error, { task: 'seed-wine-countries' })
    throw error
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedWineCountries()
    .then(() => {
      logger.info('Seeding completed', { task: 'seed-wine-countries' })
      process.exit(0)
    })
    .catch((error) => {
      logger.error('Seeding failed', error as Error, { task: 'seed-wine-countries' })
      process.exit(1)
    })
}

export { seedWineCountries }
