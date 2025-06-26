import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'

interface MoodData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
}

const moodsData: MoodData[] = [
  // Netflix & Chill / Neftlix & Chill
  {
    title: {
      sl: 'Netflix & Chill',
      en: 'Neftlix & Chill',
    },
    description: {
      sl: 'Ko rabiš butelko za boljšo atmosfero .. .pri gledanju filmov.',
      en: 'When you need a bottle to set the mood for... movie watching.',
    },
  },
  // Piknik / Picnic
  {
    title: {
      sl: 'Piknik',
      en: 'Picnic',
    },
    description: {
      sl: 'Vina, ki prenesejo travne madeže, plastične kozarce in mlačen sir. Lahkotna, sveža in prijazna do odej.',
      en: "Wines that don't mind grass stains, plastic cups, or warm cheese. Easy, breezy, and park-friendly.",
    },
  },
  // Sam doma / Home alone
  {
    title: {
      sl: 'Sam doma',
      en: 'Home alone',
    },
    description: {
      sl: 'Ker ne piješ sam, ampak samo vnaprej tejstaš… za obiske, ki pridejo.... enkrat.',
      en: "Because you're not drinking alone, you're just pre-tasting before guests arrive… at some point.",
    },
  },
  // Tisti dnevi / Those days
  {
    title: {
      sl: 'Tisti dnevi',
      en: 'Those days',
    },
    description: {
      sl: 'Veš, kateri dnevi. Ne sprašuj – samo toči.',
      en: "You know the ones. Don't ask, just pour.",
    },
  },
  // Zmenkarije / Date night
  {
    title: {
      sl: 'Zmenkarije',
      en: 'Date night',
    },
    description: {
      sl: 'Vina, ki šepetajo sladke neumnosti… in potem mogoče še kaj več.',
      en: 'Wines that whisper sweet nothings… and then maybe a little something more.',
    },
  },
  // Neki novga / Something new
  {
    title: {
      sl: 'Neki novga',
      en: 'Something new',
    },
    description: {
      sl: 'Dovolj malvazije in refoška? Dobrodošel v globokem koncu vinskega bazena.',
      en: 'Tired of Pinot this and Chardonnay that? Welcome to the deep end of the wine pool.',
    },
  },
  // Prepotentni kolegi? / Snobby friends?
  {
    title: {
      sl: 'Prepotentni kolegi?',
      en: 'Snobby friends?',
    },
    description: {
      sl: 'Ko rabiš vino, da naredi vtis namesto tebe.',
      en: 'When you need a wine to impress instead of you.',
    },
  },
  // Za tasta / Impress her dad
  {
    title: {
      sl: 'Za tasta',
      en: 'Impress her dad',
    },
    description: {
      sl: 'Ne zajebi situacije. Prinesi mu vino, ki bo njemu kul!',
      en: "Don't mess this up. Bring a wine he thinks is amazing.",
    },
  },
  // Za taščo / For mother in law
  {
    title: {
      sl: 'Za taščo',
      en: 'For mother in law',
    },
    description: {
      sl: 'Ko rabiš vino, da se neha vtikat v tvojga otroka.',
      en: 'When you need a wine to keep her out of your parenting decisions.',
    },
  },
  // Ikone & Legende / Icons & Legends
  {
    title: {
      sl: 'Ikone & Legende',
      en: 'Icons & Legends',
    },
    description: {
      sl: 'Ta vina se niso prišla igrat. Prišla so pokazat, kdo je šefe!',
      en: "These wines didn't come to play. They came to remind the rest who's boss.",
    },
  },
  // Žurka / Parteeey
  {
    title: {
      sl: 'Žurka',
      en: 'Parteeey',
    },
    description: {
      sl: 'Vina, ki držijo tempo in glasnost. Bleščice niso obvezne, so pa zaželjene.',
      en: 'Wines that keep the vibe up and the volume loud. Preferably with glitter.',
    },
  },
  // Jadranje / Sailing
  {
    title: {
      sl: 'Jadranje',
      en: 'Sailing',
    },
    description: {
      sl: 'Za slan zrak, opečena ramena in vina, ki se dobro ujemajo z žulji od vrvi. Pa tudi z radensko če si skipper!',
      en: "For salty air, sunburnt noses, and wines that pair well with rope burns. And bubbly water if you're the skipper!",
    },
  },
  // Vsakodnevci / Daily Boozers
  {
    title: {
      sl: 'Vsakodnevci',
      en: 'Daily Boozers ',
    },
    description: {
      sl: 'Vina za med tednom, ki te ne obsojajo, tudi če pogledaš tri sezone v enem večeru.',
      en: "Weekday wines that go down easy and don't judge your bingeing.",
    },
  },
  // Wroooče! / Hot in herre
  {
    title: {
      sl: 'Wroooče!',
      en: 'Hot in herre',
    },
    description: {
      sl: 'Ko švicaš v kopalkah, rabiš vino v kterga lahko vržeš par kock ledu.',
      en: 'Wines for your ice cubes when you are sweating in your bathing suit.',
    },
  },
  // Lepe Butelke / Nice bottle
  {
    title: {
      sl: 'Lepe Butelke',
      en: 'Nice bottle',
    },
    description: {
      sl: 'Lahko ga spiješ, ampak je ful lušna butelka - za darilo?',
      en: "You could drink it, but this bottle sooo nice — it's perfect for gifting. ",
    },
  },
  // Na vrhuncu / Peaking
  {
    title: {
      sl: 'Na vrhuncu',
      en: 'Peaking',
    },
    description: {
      sl: 'Ta vina so na vrhuncu. Zorjena, pripravljena in z eno nogo že v legendi. Brez derez. Na kaj si pa ti pomislil?',
      en: 'These wines are at their peak. Aged, poised, and ready to blow your mind. No climbing gear needed.',
    },
  },
  // Snob? / Snob much?
  {
    title: {
      sl: 'Snob?',
      en: 'Snob much?',
    },
    description: {
      sl: 'Funky, divja in rahlo nerazumljena. Tako kot ti.',
      en: 'Funky, wild, and slightly misunderstood. Just like you.',
    },
  },
  // Someljejčki / Sommstuff
  {
    title: {
      sl: 'Someljejčki',
      en: 'Sommstuff',
    },
    description: {
      sl: 'Ful lep PH! Kako dolgo na drožeh? In mikroklima? Če s tem ponavadi težiš vinarjem — si doma.',
      en: "Niche, nerdy, and not for everyone. But if you're geeking out over lees contact — you're home.",
    },
  },
]

async function seedMoods(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    logger.info('Starting moods seeding...', { task: 'seed-moods' })

    for (const moodData of moodsData) {
      try {
        // Check if mood already exists
        const existingMood = await payload.find({
          collection: 'moods',
          where: {
            'title.sl': {
              equals: moodData.title.sl,
            },
          },
        })

        if (existingMood.docs.length > 0) {
          logger.info(`Mood ${moodData.title.sl} already exists, skipping...`, {
            task: 'seed-moods',
            mood: moodData.title.sl,
          })
          continue
        }

        // Create the mood with Slovenian locale
        const createdMood = await payload.create({
          collection: 'moods',
          data: {
            title: moodData.title.sl,
            description: moodData.description?.sl || '',
          },
          locale: 'sl',
        })

        // Update with English locale
        await payload.update({
          collection: 'moods',
          id: createdMood.id,
          data: {
            title: moodData.title.en,
            description: moodData.description?.en || '',
          },
          locale: 'en',
        })

        logger.info(`Created mood: ${createdMood.title.sl}`, {
          task: 'seed-moods',
          mood: moodData.title.sl,
        })
      } catch (error) {
        logger.error(`Failed to create mood: ${moodData.title.sl}`, error as Error, {
          task: 'seed-moods',
          mood: moodData.title.sl,
        })
      }
    }

    logger.info('Moods seeding completed successfully', { task: 'seed-moods' })
  } catch (error) {
    logger.error('Failed to seed moods', error as Error, { task: 'seed-moods' })
    throw error
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMoods()
    .then(() => {
      logger.info('Seeding completed', { task: 'seed-moods' })
      process.exit(0)
    })
    .catch((error) => {
      logger.error('Seeding failed', error as Error, { task: 'seed-moods' })
      process.exit(1)
    })
}

export { seedMoods }
