import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'

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
  // Biodinamika / Biodynamics
  {
    title: {
      sl: 'Biodinamika',
      en: 'Biodynamics',
    },
    description: {
      sl: 'Biodinamika ni bav bav. Ok mogoče je malo čarovništva tu, ampak nič super norega! Obljubimo.... Največkrat nerazumljen del biodinamike je, da to ni stil vin, ampak stil vinogradništva. Najpreprostejša razlaga.\n\nTe boli glava, vzameš aspirin - konvencionalnost.\nTe boli glava, spiješ kamiličen čaj - ekološko.\nTe boli glava ... Se vprašaš "Zakaj me boli glava?" In ne zdraviš simptomov, ampak poskrbiš, da si celostno zdrav - biodinamika.\n\nOk ampak kako se to pozna v vinu? Ne po okusu! U bistvu samo po filingu. Vina imajo svojo energijo, svojo dinamiko. Je nekaj neopisljivega a veš, da je tam. Garantiramo, da na dober biodinamični dan, med 40 vini, prav vsakdo najde katera so biodinamična - in nikoli ne bo vedel zakaj.',
      en: "Biodynamics isn't some kind of hocus pocus.\nOkay, maybe there's a tiny bit of magic involved — but nothing too crazy, we promise.\n\nThe most misunderstood thing about biodynamics?\nIt's not a wine style — it's a farming philosophy.\n\nHere's the simplest way to explain it:\n\nGot a headache? Take an aspirin — that's conventional farming.\nGot a headache? Brew some chamomile tea — that's organic.\nGot a headache? Ask yourself \"Why do I have a headache?\" and focus on staying holistically healthy — that's biodynamics.\n\nSo how does it show up in wine? Not in the taste, actually. More in the feeling. Biodynamic wines have their own rhythm, their own energy. It's hard to describe, but you'll know it when it's there. We guarantee — on a good biodynamic day, give someone 40 wines and they'll always pick out the biodynamic ones. They won't know how. But they'll feel it.",
    },
  },
  // Funky
  {
    title: {
      sl: 'Funky',
      en: 'Funky',
    },
    description: {
      sl: 'Nekatera vina so naravno funky, pri drugih je to zavestna odločitev vinarja. Tukaj je zbirka vin, za katera menimo, da imajo izrazito funky karakter. To ne pomeni, da so slaba – pomeni samo, da jih je treba znati pravilno uživat. Ne dajaj slabe ocene, samo zato ker nisi vedel, v kaj se spuščaš. Ta vina so nekaj posebnega!',
      en: "Some wines are naturally funky, some are made that way by the winemaker. Here is a collection of wines, we find to be heavy on the funky side. Doesn't mean they are crap, just means you need to treat with care. Do not give it a bad rating, because you didn't know what you were getting yourself into. It's special!",
    },
  },
  // Aromatično / Aromatic
  {
    title: {
      sl: 'Aromatično',
      en: 'Aromatic',
    },
    description: {
      sl: 'Nekatere sorte so izjemno aromatične. Nekatere že kot grozdje, recimo Muškat zavohaš par vrst stran, nekatere pa se razvijejo šele v vinu. Tu je nekaj vin, za ljudi ki imajo radi ponosna vina, ki rada razglašajo svoje note.',
      en: "Some grape varieties are incredibly aromatic. Some, like Muscat, you can literally smell from a few rows away — even as grapes. Others only reveal their character once they become wine. Here's a selection for those who love proud wines — the kind that boldly declare their aromas without holding back.",
    },
  },
  // Barikirano / Oaky
  {
    title: {
      sl: 'Barikirano',
      en: 'Oaky',
    },
    description: {
      sl: 'Če ti je všeč vino z malo tistega sočnega karakterja lesa, potem so ta vina zate. Izraziti okusi sladkih začimb, vanilje, kokosa, kopra, včasih celo rahla sladkasti. Nekateri vinarji celo rahlo ožgejo sode, da vino dobi nežen dimast pridih. Vse to najdeš v tej zbirki.',
      en: 'If you like a wine with a bit of that juicy barrel character, here are some wines for you. Bold flavours of bakings spaces, vanilla, coconut, dill and sometimes even perceived sweetness. Some winemakers even char their barrels to make the wines smell a bit smoky. All of these you can find in here.',
    },
  },
  // Naravna / Natural
  {
    title: {
      sl: 'Naravna',
      en: 'Natural',
    },
    description: {
      sl: 'Ali sonaravna ali karkoli že. Vina, ki so narejena v kaosu narave. Brez kontrole vinarja, brez kontroliranih temperatur, brez dodanega žvepla ali česarkoli drugega. To so vina, ki so najbolj iskrena, kot je že v naslovu - najbolja naravna. Pogosto se zgodi, da je kakšno naravno vino malce "pobegnilo". V Butelki takih vin ni, tako da lahko prav vsem tem vinom popolnoma zaupaš.',
      en: "Call it natural, call it low-intervention — these are wines born in the chaos of nature. No temperature control, no additives, no added sulfites. No winemaker steering the ship.\n\nThese are wines at their most honest, just like the tag says — truly natural. Now, let's be real: natural wines sometimes go off the rails. But not at Butelka. Every bottle here has been vetted, tasted, and trusted. You can drink freely and confidently — no surprises, just wild beauty.",
    },
  },
  // Redko & Unikatno / Rare & Unique
  {
    title: {
      sl: 'Redko & Unikatno',
      en: 'Rare & Unique',
    },
    description: {
      sl: 'To so vina, ki jih redko srečaš — majhne serije, redke sorte, nenavadne lokacije ali enkratni poskusi. Niso vedno glasna, ampak nikoli niso običajna. Idealna za zbiratelje, raziskovalce ali kogarkoli, ki si želi vina, ki ga jutri ni več mogoče naročiti.',
      en: "These are wines you don't come across often — limited production, rare grapes, unusual places, or one-time experiments. They're not always flashy, but they're never ordinary. Perfect for collectors, explorers, or anyone who wants to drink something they can't just reorder tomorrow.",
    },
  },
  // Nefiltrirano / Unfiltered
  {
    title: {
      sl: 'Nefiltrirano',
      en: 'Unfiltered',
    },
    description: {
      sl: 'Ta vina preskočijo zadnji filtracijski korak, zato so lahko rahlo motna ali bolj teksturirana — in to namenoma. Nefiltrirana vina pogosto delujejo bolj živa, z več oprijema, globine in kompleksnosti. Ne nujno boljša ali slabša — samo malo bolj divja.',
      en: "These wines skip the final filtration step, which means they can be slightly cloudy or textured — and that's intentional. Unfiltered wines tend to feel more alive, with a bit more grip, depth, and complexity. Not better or worse — just a little wilder.",
    },
  },
  // Avtohtone sorte / Indigenous Varieties
  {
    title: {
      sl: 'Avtohtone sorte',
      en: 'Indigenous Varieties',
    },
    description: {
      sl: 'Ta vina so narejena iz sort grozdja, ki so domače svoji regiji — tistih, ki tam uspevajo že generacije, pogosto stoletja. V sebi nosijo zgodovino, identiteto in občutek kraja, ki ga ni mogoče ponarediti. Morda sort ne boš poznal, ampak ravno to je čar. Pričakuj nepričakovano.',
      en: "These wines are made from grape varieties native to their region — the kinds that have been growing there for generations, often centuries. They carry history, identity, and a sense of place you simply can't fake. You might not recognize the names, but that's part of the charm. Expect the unexpected.",
    },
  },
  // Amfora / Amphora
  {
    title: {
      sl: 'Amfora',
      en: 'Amphora',
    },
    description: {
      sl: 'Vina, ki zorijo ali fermentirajo v glinenih amforah, tako kot pred tisočletji. Amfore dajo vinu posebno teksturo, zemeljskost in atraktivno oksidacijo, brez vpliva lesa. Gre za starodavno tehniko, obujeno za radovedne pivce. Pričakuj nekaj surovega, strukturiranega in tiho divjega.',
      en: "Wines aged or fermented in clay vessels, just like they did thousands of years ago. Amphorae bring a distinct texture, earthiness, and subtle oxidation — often without the influence of oak. It's ancient winemaking, revived for the curious drinker. Expect something raw, structured, and quietly wild.",
    },
  },
  // Betonska jajca / Concrete eggs
  {
    title: {
      sl: 'Betonska jajca',
      en: 'Concrete eggs',
    },
    description: {
      sl: 'Te futuristične posode iz betona so oblikovane kot jajca, kar ustvarja naravno kroženje med fermentacijo. Brez robov, brez mrtvih kotov — samo čista, enakomerna energija. Vina iz betonskih jajc so pogosto precizna, teksturirana in izjemno zbalansirana, brez okusa po lesu ali kovini.',
      en: 'These space-age-looking vessels are made of raw concrete, shaped like eggs to create natural circulation during fermentation. No corners, no stagnation — just pure, even energy. Wines from concrete eggs are often precise, textured, and quietly intense, without picking up flavors from wood or metal.',
    },
  },
  // Unikatno staranje / Unique ageing
  {
    title: {
      sl: 'Unikatno staranje',
      en: 'Unique ageing',
    },
    description: {
      sl: 'Nekatera vina gredo po ovinkih. Zorijo pod morjem, v starih rudnikih, steklenih kupolah ali alpskih jamah — steklenice, ki jih oblikujeta čas in prostor na najbolj nenavadne načine. Razlike morda ne boš vedno okusil, a jo boš začutil. Ta vina nosijo zgodbo — in ta zgodba pusti sled.',
      en: "Some wines take a detour. Aged under the sea, in old mines, in glass domes or alpine caves — these are bottles shaped by time and place in the most unusual ways. You won't always taste the difference, but you'll feel it. These wines carry a story, and that story leaves a mark.",
    },
  },
  // Zadnje butelke / Bin Ends
  {
    title: {
      sl: 'Zadnje butelke',
      en: 'Bin Ends',
    },
    description: {
      sl: 'Zadnje steklenice teh vin — mogoče gre letnik h koncu, mogoče vinar polni novo serijo, mogoče smo pa mi že skoraj vse spili. Kakorkoli, to so zadnje kaplje. Če ti je kakšno vino všeč, ne odlašaj. Ko ga zmanjka, ga zmanjka za vedno.',
      en: "The last bottles of these wines — maybe the vintage is ending, maybe the winery is moving on, maybe we just drank most of it ourselves. Either way, these are final drops. If you see something you like, don't wait. Once it's gone, it's gone for good.",
    },
  },
  // Butelka VIW
  {
    title: {
      sl: 'Butelka VIW',
      en: 'Butelka VIW',
    },
    description: {
      sl: '',
      en: '',
    },
  },
  // Brez dodanih sulfitov / No added suplhites
  {
    title: {
      sl: 'Brez dodanih sulfitov',
      en: 'No added suplhites',
    },
    description: {
      sl: 'Žveplo (SO₂) se v vinarstvu pogosto uporablja za zaščito vina pred oksidacijo in kvarjenjem. Ni strup — že stoletja se uporablja varno in z razlogom.\n\nA nekateri vinarji se mu popolnoma odpovejo in zaupajo čistemu grozdju, stabilni fermentaciji in naravi. Takšna vina so bolj surova, izrazita in malce bolj živa — a tudi bolj občutljiva. Hranimo jih hladno in pijemo mlada. Ne bodo dolgo zdržala odprta!',
      en: "Sulfur (SO₂) is often used in winemaking to protect the wine from oxidation and spoilage. It's not poison — in fact, it's been used safely for centuries.\n\nBut some winemakers go without it entirely, relying on clean fruit, stable fermentation, and trust in nature. These wines are raw, expressive, and a little more alive — but also more fragile. Keep them cool and drink them young. And fast! They won't last long in your fridge!",
    },
  },
  // Stare trte / Old vines
  {
    title: {
      sl: 'Stare trte',
      en: 'Old vines',
    },
    description: {
      sl: 'Stare trte ne rodijo veliko, a tisto, kar dajo, je bolj koncentrirano, uravnoteženo in pogosto karakterno bogato. Njihove korenine segajo globoko, rast se upočasni, in grozdje pove bolj tiho, a ostrejšo zgodbo. Svetovno ni stroge meje, kaj pomeni "stara trta", a ko dosežejo 30, 50 ali celo 100+ let — se modrost okuša. V našem primeru so trte starejše od 40 let.',
      en: 'Old vines don\'t yield much, but what they do give is concentrated, balanced, and often deeply rooted in character. Their roots dig deep, their growth slows down, and their fruit tells a quieter, more focused story. No strict rules define "old," but when vines hit 30, 50, or even 100+ years, you taste the wisdom. In our case, we cut-off at 40 years old.',
    },
  },
  // Cru vinograd / Single Vineyard
  {
    title: {
      sl: 'Cru vinograd',
      en: 'Single Vineyard',
    },
    description: {
      sl: 'Ta vina prihajajo iz enega samega, natančno določenega vinograda — brez mešanja različnih leg. Teren ima lahko poseben tip tal, nadmorsko višino, lego ali mikroklimo. Ideja? Da en kraj spregovori sam zase, brez motenj drugih vplivov. Če iščeš čistost in preciznost, so Cru vina pravi začetek.',
      en: "These wines come from a single, clearly defined vineyard — not a blend from multiple plots. That site might have a unique soil, exposure, altitude, or microclimate. The idea? Let one place speak clearly, without noise from anywhere else. If you're chasing purity and precision, Cru wines are where it starts.",
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
