import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../src/lib/logger'
import payloadConfig from '../src/payload.config'

interface TagData {
  title: {
    sl: string
    en: string
  }
  description?: {
    sl: string
    en: string
  }
}

const tagsData: TagData[] = [
  // Farming practices
  {
    title: {
      sl: 'Biodinamično',
      en: 'Biodynamic',
    },
    description: {
      sl: 'Biodinamično kmetovanje uporablja Rudolf Steinerjeve metode za pridelavo vin z upoštevanjem luninih ciklov in naravnih ritmov.',
      en: "Biodynamic farming uses Rudolf Steiner's methods for wine production, considering lunar cycles and natural rhythms.",
    },
  },
  {
    title: {
      sl: 'Organsko',
      en: 'Organic',
    },
    description: {
      sl: 'Organsko pridelano vino brez sintetičnih pesticidov, gnojil ali herbicidov.',
      en: 'Organically produced wine without synthetic pesticides, fertilizers, or herbicides.',
    },
  },
  {
    title: {
      sl: 'Naravno',
      en: 'Natural',
    },
    description: {
      sl: 'Naravno vino, pridelano z minimalnimi posegi in brez dodanih sulfitov.',
      en: 'Natural wine produced with minimal intervention and without added sulfites.',
    },
  },
  {
    title: {
      sl: 'Tradicionalno',
      en: 'Traditional',
    },
    description: {
      sl: 'Tradicionalne metode vinarstva, ki se prenašajo iz roda v rod.',
      en: 'Traditional winemaking methods passed down from generation to generation.',
    },
  },

  // Wine characteristics
  {
    title: {
      sl: 'Elegantno',
      en: 'Elegant',
    },
    description: {
      sl: 'Elegantno vino z uravnoteženimi aromami in okusi, ki se odlikujejo z rafiniranostjo.',
      en: 'Elegant wine with balanced aromas and flavors that stand out for their refinement.',
    },
  },
  {
    title: {
      sl: 'Kompleksno',
      en: 'Complex',
    },
    description: {
      sl: 'Kompleksno vino z večplastnimi aromami in okusi, ki se razvijajo v ustih.',
      en: 'Complex wine with multi-layered aromas and flavors that develop in the mouth.',
    },
  },
  {
    title: {
      sl: 'Močno',
      en: 'Powerful',
    },
    description: {
      sl: 'Močno vino z intenzivnimi aromami in visoko vsebnostjo alkohola.',
      en: 'Powerful wine with intense aromas and high alcohol content.',
    },
  },
  {
    title: {
      sl: 'Lahko',
      en: 'Light',
    },
    description: {
      sl: 'Lahko vino z nežnimi aromami in nizko vsebnostjo alkohola.',
      en: 'Light wine with delicate aromas and low alcohol content.',
    },
  },
  {
    title: {
      sl: 'Osvežilno',
      en: 'Refreshing',
    },
    description: {
      sl: 'Osvežilno vino z visoko kislino in čistimi okusi.',
      en: 'Refreshing wine with high acidity and clean flavors.',
    },
  },
  {
    title: {
      sl: 'Mineralno',
      en: 'Mineral',
    },
    description: {
      sl: 'Mineralno vino z okusi, ki odražajo geološko sestavo tal.',
      en: 'Mineral wine with flavors that reflect the geological composition of the soil.',
    },
  },

  // Wine types
  {
    title: {
      sl: 'Rdeče',
      en: 'Red',
    },
    description: {
      sl: 'Rdeče vino, pridelano iz rdečih sort grozdja z maceracijo lupin.',
      en: 'Red wine produced from red grape varieties with skin maceration.',
    },
  },
  {
    title: {
      sl: 'Belo',
      en: 'White',
    },
    description: {
      sl: 'Belo vino, pridelano iz belih ali rdečih sort grozdja brez lupin.',
      en: 'White wine produced from white or red grape varieties without skins.',
    },
  },
  {
    title: {
      sl: 'Roze',
      en: 'Rosé',
    },
    description: {
      sl: 'Roze vino z občasnim stikom z lupinami rdečih sort grozdja.',
      en: 'Rosé wine with brief contact with red grape variety skins.',
    },
  },
  {
    title: {
      sl: 'Penino',
      en: 'Sparkling',
    },
    description: {
      sl: 'Penino vino z ogljikovim dioksidom, ki ustvarja mehurčke.',
      en: 'Sparkling wine with carbon dioxide that creates bubbles.',
    },
  },
  {
    title: {
      sl: 'Sladko',
      en: 'Sweet',
    },
    description: {
      sl: 'Sladko vino z visoko vsebnostjo sladkorja.',
      en: 'Sweet wine with high sugar content.',
    },
  },
  {
    title: {
      sl: 'Suho',
      en: 'Dry',
    },
    description: {
      sl: 'Suho vino z nizko vsebnostjo sladkorja.',
      en: 'Dry wine with low sugar content.',
    },
  },

  // Special categories
  {
    title: {
      sl: 'Cviček',
      en: 'Cviček',
    },
    description: {
      sl: 'Edinstvena slovenska mešanica rdečih in belih sort grozdja iz Posavja.',
      en: 'Unique Slovenian blend of red and white grape varieties from Posavje.',
    },
  },
  {
    title: {
      sl: 'Rebula',
      en: 'Rebula',
    },
    description: {
      sl: 'Avtohtona bela sorta grozdja iz Primorske in Podravja.',
      en: 'Indigenous white grape variety from Primorska and Podravje.',
    },
  },
  {
    title: {
      sl: 'Teran',
      en: 'Teran',
    },
    description: {
      sl: 'Avtohtona rdeča sorta grozdja iz Krasa in Istre.',
      en: 'Indigenous red grape variety from Karst and Istria.',
    },
  },
  {
    title: {
      sl: 'Refošk',
      en: 'Refošk',
    },
    description: {
      sl: 'Tradicionalna rdeča sorta grozdja iz Primorske.',
      en: 'Traditional red grape variety from Primorska.',
    },
  },

  // Quality indicators
  {
    title: {
      sl: 'Prestižno',
      en: 'Prestigious',
    },
    description: {
      sl: 'Prestižno vino z dolgoletno tradicijo in najvišjo kakovostjo.',
      en: 'Prestigious wine with a long tradition and the highest quality.',
    },
  },
  {
    title: {
      sl: 'Kakovostno',
      en: 'Quality',
    },
    description: {
      sl: 'Vino najvišje kakovosti z doslednimi standardi.',
      en: 'Highest quality wine with consistent standards.',
    },
  },
  {
    title: {
      sl: 'Ekskluzivno',
      en: 'Exclusive',
    },
    description: {
      sl: 'Ekskluzivno vino z omejeno proizvodnjo in visoko ceno.',
      en: 'Exclusive wine with limited production and high price.',
    },
  },
  {
    title: {
      sl: 'Dolgoletno',
      en: 'Long-aged',
    },
    description: {
      sl: 'Vino z dolgoletnim starjenjem v hrastovih sodih ali steklenicah.',
      en: 'Wine with long aging in oak barrels or bottles.',
    },
  },

  // Production methods
  {
    title: {
      sl: 'Zadruga',
      en: 'Cooperative',
    },
    description: {
      sl: 'Vino, pridelano v vinogradniški zadrugi, ki združuje več pridelovalcev.',
      en: 'Wine produced in a wine cooperative that combines multiple producers.',
    },
  },
  {
    title: {
      sl: 'Družinsko',
      en: 'Family',
    },
    description: {
      sl: 'Družinsko vino, pridelano v majhnih količinah z osebnim pristopom.',
      en: 'Family wine produced in small quantities with a personal approach.',
    },
  },
  {
    title: {
      sl: 'Inovativno',
      en: 'Innovative',
    },
    description: {
      sl: 'Inovativno vino z novimi metodami pridelave ali starjenja.',
      en: 'Innovative wine with new production or aging methods.',
    },
  },
  {
    title: {
      sl: 'Revolucionarno',
      en: 'Revolutionary',
    },
    description: {
      sl: 'Revolucionarno vino, ki je spremenilo standarde vinarstva.',
      en: 'Revolutionary wine that changed winemaking standards.',
    },
  },

  // Special classifications
  {
    title: {
      sl: 'Prvi Cru',
      en: 'First Growth',
    },
    description: {
      sl: 'Najprestižnejša klasifikacija bordojskih vin iz leta 1855.',
      en: 'The most prestigious classification of Bordeaux wines from 1855.',
    },
  },
  {
    title: {
      sl: 'Super Toskanski',
      en: 'Super Tuscan',
    },
    description: {
      sl: 'Inovativna toskanska vina, ki presegajo tradicionalne pravila.',
      en: 'Innovative Tuscan wines that exceed traditional rules.',
    },
  },
  {
    title: {
      sl: 'Barolo',
      en: 'Barolo',
    },
    description: {
      sl: 'Kralj vin iz Piemonta, pridelan iz sorte Nebbiolo.',
      en: 'King of wines from Piedmont, produced from the Nebbiolo variety.',
    },
  },
  {
    title: {
      sl: 'Sassicaia',
      en: 'Sassicaia',
    },
    description: {
      sl: 'Legendarno toskansko vino, ki je revolucioniralo italijansko vinarstvo.',
      en: 'Legendary Tuscan wine that revolutionized Italian winemaking.',
    },
  },
  {
    title: {
      sl: 'Riesling',
      en: 'Riesling',
    },
    description: {
      sl: 'Noble bela sorta grozdja, znana po svojih elegantnih in mineralnih vinih.',
      en: 'Noble white grape variety known for its elegant and mineral wines.',
    },
  },
  {
    title: {
      sl: 'Drago',
      en: 'Expensive',
    },
    description: {
      sl: 'Drago vino z visoko ceno zaradi kakovosti, redkosti ali prestiža.',
      en: 'Expensive wine with a high price due to quality, rarity, or prestige.',
    },
  },
  {
    title: {
      sl: 'Perfekcija',
      en: 'Perfection',
    },
    description: {
      sl: 'Vino, ki predstavlja absolutno perfekcijo v vinarstvu.',
      en: 'Wine that represents absolute perfection in winemaking.',
    },
  },
  {
    title: {
      sl: 'Legendarno',
      en: 'Legendary',
    },
    description: {
      sl: 'Legendarno vino z zgodovinskim pomenom in izjemno kakovostjo.',
      en: 'Legendary wine with historical significance and exceptional quality.',
    },
  },
]

async function seedTags(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    logger.info('Starting tags seeding...', { task: 'seed-tags' })

    for (const tagData of tagsData) {
      try {
        // Check if tag already exists
        const existingTag = await payload.find({
          collection: 'tags',
          where: {
            'title.sl': {
              equals: tagData.title.sl,
            },
          },
        })

        if (existingTag.docs.length > 0) {
          logger.info(`Tag ${tagData.title.sl} already exists, skipping...`, {
            task: 'seed-tags',
            tag: tagData.title.sl,
          })
          continue
        }

        // Create the tag with Slovenian locale
        const createdTag = await payload.create({
          collection: 'tags',
          data: {
            title: tagData.title.sl,
            description: tagData.description?.sl || '',
          },
          locale: 'sl',
        })

        // Update with English locale
        await payload.update({
          collection: 'tags',
          id: createdTag.id,
          data: {
            title: tagData.title.en,
            description: tagData.description?.en || '',
          },
          locale: 'en',
        })

        logger.info(`Created tag: ${createdTag.title.sl}`, {
          task: 'seed-tags',
          tag: tagData.title.sl,
        })
      } catch (error) {
        logger.error(
          `Failed to create tag: ${tagData.title.sl} - ${(error as Error).message}`,
          error as Error,
          {
            task: 'seed-tags',
            tag: tagData.title.sl,
          },
        )
      }
    }

    logger.info('Tags seeding completed successfully', { task: 'seed-tags' })
  } catch (error) {
    logger.error('Failed to seed tags', error as Error, { task: 'seed-tags' })
    throw error
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTags()
    .then(() => {
      logger.info('Seeding completed', { task: 'seed-tags' })
      process.exit(0)
    })
    .catch((error) => {
      logger.error('Seeding failed', error as Error, { task: 'seed-tags' })
      process.exit(1)
    })
}

export { seedTags }
