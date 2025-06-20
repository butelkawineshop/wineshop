import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../src/lib/logger'
import payloadConfig from '../src/payload.config'

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
  // Social occasions
  {
    title: {
      sl: 'Družinski obrok',
      en: 'Family Dinner',
    },
    description: {
      sl: 'Popolno vino za družinske obroke in praznične večerje z ljubljenimi.',
      en: 'Perfect wine for family dinners and holiday meals with loved ones.',
    },
  },
  {
    title: {
      sl: 'Romantična večerja',
      en: 'Romantic Dinner',
    },
    description: {
      sl: 'Elegantno vino za romantične večerje in posebne trenutke z partnerjem.',
      en: 'Elegant wine for romantic dinners and special moments with your partner.',
    },
  },
  {
    title: {
      sl: 'Prijateljski sestanek',
      en: 'Friends Gathering',
    },
    description: {
      sl: 'Osvežilno vino za prijateljske sestanke in zabavne večere.',
      en: 'Refreshing wine for friendly gatherings and fun evenings.',
    },
  },
  {
    title: {
      sl: 'Poslovna večerja',
      en: 'Business Dinner',
    },
    description: {
      sl: 'Prestižno vino za poslovne večerje in pomembne sestanke.',
      en: 'Prestigious wine for business dinners and important meetings.',
    },
  },

  // Relaxation and comfort
  {
    title: {
      sl: 'Spočitek ob ognju',
      en: 'Relaxing by the Fire',
    },
    description: {
      sl: 'Toplo in močno vino za večere ob ognju in sproščujoče trenutke.',
      en: 'Warm and powerful wine for evenings by the fire and relaxing moments.',
    },
  },
  {
    title: {
      sl: 'Večerni spopad',
      en: 'Evening Chill',
    },
    description: {
      sl: 'Lahko vino za sproščujoče večere in mirne trenutke.',
      en: 'Light wine for relaxing evenings and quiet moments.',
    },
  },
  {
    title: {
      sl: 'Vikend počitek',
      en: 'Weekend Relaxation',
    },
    description: {
      sl: 'Osvežilno vino za vikend počitek in sproščujoče dni.',
      en: 'Refreshing wine for weekend relaxation and relaxing days.',
    },
  },
  {
    title: {
      sl: 'Spa večer',
      en: 'Spa Evening',
    },
    description: {
      sl: 'Elegantno vino za spa večere in wellness trenutke.',
      en: 'Elegant wine for spa evenings and wellness moments.',
    },
  },

  // Celebration and special occasions
  {
    title: {
      sl: 'Rojstni dan',
      en: 'Birthday',
    },
    description: {
      sl: 'Posebno vino za rojstnodnevne proslave in veselje.',
      en: 'Special wine for birthday celebrations and joy.',
    },
  },
  {
    title: {
      sl: 'Poroka',
      en: 'Wedding',
    },
    description: {
      sl: 'Elegantno vino za poročne proslave in najpomembnejše trenutke.',
      en: 'Elegant wine for wedding celebrations and the most important moments.',
    },
  },
  {
    title: {
      sl: 'Novo leto',
      en: 'New Year',
    },
    description: {
      sl: 'Penino vino za novoletne proslave in začetek novega leta.',
      en: 'Sparkling wine for New Year celebrations and the start of a new year.',
    },
  },
  {
    title: {
      sl: 'Praznik',
      en: 'Holiday',
    },
    description: {
      sl: 'Posebno vino za praznične proslave in družinske sestanke.',
      en: 'Special wine for holiday celebrations and family gatherings.',
    },
  },

  // Food pairing moods
  {
    title: {
      sl: 'Morska hrana',
      en: 'Seafood',
    },
    description: {
      sl: 'Osvežilno belo vino za morsko hrano in ribje jedi.',
      en: 'Refreshing white wine for seafood and fish dishes.',
    },
  },
  {
    title: {
      sl: 'Meso na žaru',
      en: 'Grilled Meat',
    },
    description: {
      sl: 'Močno rdeče vino za meso na žaru in barbecue.',
      en: 'Powerful red wine for grilled meat and barbecue.',
    },
  },
  {
    title: {
      sl: 'Italijanska kuhinja',
      en: 'Italian Cuisine',
    },
    description: {
      sl: 'Tradicionalno italijansko vino za pasta, pizza in mediteranske jedi.',
      en: 'Traditional Italian wine for pasta, pizza, and Mediterranean dishes.',
    },
  },
  {
    title: {
      sl: 'Sladice',
      en: 'Desserts',
    },
    description: {
      sl: 'Sladko vino za sladice in sladke poslastice.',
      en: 'Sweet wine for desserts and sweet treats.',
    },
  },

  // Seasonal moods
  {
    title: {
      sl: 'Pomlad',
      en: 'Spring',
    },
    description: {
      sl: 'Sveže in osvežilno vino za pomladne dni in cvetoče narave.',
      en: 'Fresh and refreshing wine for spring days and blooming nature.',
    },
  },
  {
    title: {
      sl: 'Poletje',
      en: 'Summer',
    },
    description: {
      sl: 'Lahko in osvežilno vino za poletne večere in terase.',
      en: 'Light and refreshing wine for summer evenings and terraces.',
    },
  },
  {
    title: {
      sl: 'Jesen',
      en: 'Autumn',
    },
    description: {
      sl: 'Toplo in kompleksno vino za jesenske večere in padajoče liste.',
      en: 'Warm and complex wine for autumn evenings and falling leaves.',
    },
  },
  {
    title: {
      sl: 'Zima',
      en: 'Winter',
    },
    description: {
      sl: 'Močno in toplo vino za zimske večere in snežne dni.',
      en: 'Strong and warm wine for winter evenings and snowy days.',
    },
  },

  // Activity-based moods
  {
    title: {
      sl: 'Gledanje filma',
      en: 'Movie Night',
    },
    description: {
      sl: 'Udobno vino za gledanje filmov in večere pred televizorjem.',
      en: 'Comfortable wine for watching movies and evenings in front of the TV.',
    },
  },
  {
    title: {
      sl: 'Branje knjige',
      en: 'Reading a Book',
    },
    description: {
      sl: 'Mirno vino za branje knjig in introspektivne trenutke.',
      en: 'Quiet wine for reading books and introspective moments.',
    },
  },
  {
    title: {
      sl: 'Muzika',
      en: 'Music',
    },
    description: {
      sl: 'Vino za poslušanje glasbe in umetniške trenutke.',
      en: 'Wine for listening to music and artistic moments.',
    },
  },
  {
    title: {
      sl: 'Kuhanje',
      en: 'Cooking',
    },
    description: {
      sl: 'Vino za kuhanje in kulinarične eksperimente.',
      en: 'Wine for cooking and culinary experiments.',
    },
  },

  // Emotional moods
  {
    title: {
      sl: 'Veselje',
      en: 'Joy',
    },
    description: {
      sl: 'Veselo vino za srečne trenutke in praznovanje.',
      en: 'Joyful wine for happy moments and celebration.',
    },
  },
  {
    title: {
      sl: 'Melanholija',
      en: 'Melancholy',
    },
    description: {
      sl: 'Kompleksno vino za melanholične trenutke in razmišljanja.',
      en: 'Complex wine for melancholic moments and reflections.',
    },
  },
  {
    title: {
      sl: 'Navdih',
      en: 'Inspiration',
    },
    description: {
      sl: 'Vino za navdih in kreativne trenutke.',
      en: 'Wine for inspiration and creative moments.',
    },
  },
  {
    title: {
      sl: 'Spoštovanje',
      en: 'Appreciation',
    },
    description: {
      sl: 'Prestižno vino za spoštovanje in posebne trenutke.',
      en: 'Prestigious wine for appreciation and special moments.',
    },
  },

  // Lifestyle moods
  {
    title: {
      sl: 'Wellness',
      en: 'Wellness',
    },
    description: {
      sl: 'Zdravstveno vino za wellness trenutke in skrb za sebe.',
      en: 'Healthy wine for wellness moments and self-care.',
    },
  },
  {
    title: {
      sl: 'Luxury',
      en: 'Luxury',
    },
    description: {
      sl: 'Luksuzno vino za ekskluzivne trenutke in posebne priložnosti.',
      en: 'Luxury wine for exclusive moments and special occasions.',
    },
  },
  {
    title: {
      sl: 'Avantura',
      en: 'Adventure',
    },
    description: {
      sl: 'Eksperimentalno vino za nove izkušnje in avanture.',
      en: 'Experimental wine for new experiences and adventures.',
    },
  },
  {
    title: {
      sl: 'Tradicija',
      en: 'Tradition',
    },
    description: {
      sl: 'Tradicionalno vino za ohranjanje tradicij in zgodovine.',
      en: 'Traditional wine for preserving traditions and history.',
    },
  },

  // Time-based moods
  {
    title: {
      sl: 'Zajtrk',
      en: 'Breakfast',
    },
    description: {
      sl: 'Lahko vino za zajtrk in začetek dneva.',
      en: 'Light wine for breakfast and the start of the day.',
    },
  },
  {
    title: {
      sl: 'Kosilo',
      en: 'Lunch',
    },
    description: {
      sl: 'Osvežilno vino za kosilo in sredino dneva.',
      en: 'Refreshing wine for lunch and the middle of the day.',
    },
  },
  {
    title: {
      sl: 'Večerja',
      en: 'Dinner',
    },
    description: {
      sl: 'Elegantno vino za večerjo in konec dneva.',
      en: 'Elegant wine for dinner and the end of the day.',
    },
  },
  {
    title: {
      sl: 'Pozna noč',
      en: 'Late Night',
    },
    description: {
      sl: 'Močno vino za pozne nočne ure in nočne sestanke.',
      en: 'Strong wine for late night hours and night gatherings.',
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
