import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../src/lib/logger'
import payloadConfig from '../src/payload.config'

interface GrapeVarietyData {
  title: string
  description?: {
    sl: string
    en: string
  }
  typicalStyle?: {
    sl: string
    en: string
  }
  whyCool?: {
    sl: string
    en: string
  }
  character?: {
    sl: string
    en: string
  }
  skin: 'red' | 'white'
  synonyms?: string[]
}

const grapeVarietiesData: GrapeVarietyData[] = [
  // Red grape varieties
  {
    title: 'Cabernet Sauvignon',
    description: {
      sl: 'Cabernet Sauvignon je ena najbolj razširjenih rdečih sort grozdja na svetu.',
      en: 'Cabernet Sauvignon is one of the most widely planted red grape varieties in the world.',
    },
    typicalStyle: {
      sl: 'Močna, kompleksna vina z aromami črnega ribeza, višnje in cedrovine.',
      en: 'Powerful, complex wines with aromas of blackcurrant, cherry, and cedar.',
    },
    whyCool: {
      sl: 'Cabernet Sauvignon je osnova najboljših bordojskih vinov in kalifornijskih kultnih vinov.',
      en: 'Cabernet Sauvignon is the foundation of the finest Bordeaux wines and California cult wines.',
    },
    character: {
      sl: 'Polna, taninska vina z dolgoletnim potencialom za starjenje.',
      en: 'Full-bodied, tannic wines with long-term aging potential.',
    },
    skin: 'red',
    synonyms: ['Cabernet', 'CS'],
  },
  {
    title: 'Merlot',
    description: {
      sl: 'Merlot je mehka in elegantna rdeča sorta grozdja.',
      en: 'Merlot is a soft and elegant red grape variety.',
    },
    typicalStyle: {
      sl: 'Mehka vina z aromami slive, črnega ribeza in čokolade.',
      en: 'Soft wines with aromas of plum, blackcurrant, and chocolate.',
    },
    whyCool: {
      sl: 'Merlot je znan po svoji dostopnosti in elegantnosti.',
      en: 'Merlot is known for its approachability and elegance.',
    },
    character: {
      sl: 'Srednje polna vina z mehkimi tanini in okusnim okusom.',
      en: 'Medium-bodied wines with soft tannins and fruity taste.',
    },
    skin: 'red',
  },
  {
    title: 'Pinot Noir',
    description: {
      sl: 'Pinot Noir je elegantna in kompleksna rdeča sorta grozdja.',
      en: 'Pinot Noir is an elegant and complex red grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami jagod, malin in zemlje.',
      en: 'Elegant wines with aromas of strawberries, raspberries, and earth.',
    },
    whyCool: {
      sl: 'Pinot Noir je osnova najboljših burgundskih vinov.',
      en: 'Pinot Noir is the foundation of the finest Burgundy wines.',
    },
    character: {
      sl: 'Lahka do srednje polna vina z elegantnimi tanini.',
      en: 'Light to medium-bodied wines with elegant tannins.',
    },
    skin: 'red',
  },
  {
    title: 'Syrah',
    description: {
      sl: 'Syrah je močna in aromatična rdeča sorta grozdja.',
      en: 'Syrah is a powerful and aromatic red grape variety.',
    },
    typicalStyle: {
      sl: 'Močna vina z aromami črnega sadeža, paprike in dima.',
      en: 'Powerful wines with aromas of black fruit, pepper, and smoke.',
    },
    whyCool: {
      sl: 'Syrah je osnova najboljših Rhône vinov in avstralskih Shiraz vinov.',
      en: 'Syrah is the foundation of the finest Rhône wines and Australian Shiraz wines.',
    },
    character: {
      sl: 'Polna vina z močnimi tanini in dolgotrajnim okusom.',
      en: 'Full-bodied wines with strong tannins and long finish.',
    },
    skin: 'red',
    synonyms: ['Shiraz'],
  },
  {
    title: 'Grenache',
    description: {
      sl: 'Grenache je vročinska rdeča sorta grozdja.',
      en: 'Grenache is a warm-climate red grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami jagod, malin in začimb.',
      en: 'Medium-bodied wines with aromas of strawberries, raspberries, and spices.',
    },
    whyCool: {
      sl: 'Grenache je osnova Châteauneuf-du-Pape in številnih južnih vinov.',
      en: 'Grenache is the foundation of Châteauneuf-du-Pape and many southern wines.',
    },
    character: {
      sl: 'Srednje polna vina z mehkimi tanini in visoko alkoholno vsebnostjo.',
      en: 'Medium-bodied wines with soft tannins and high alcohol content.',
    },
    skin: 'red',
  },
  {
    title: 'Tempranillo',
    description: {
      sl: 'Tempranillo je španska rdeča sorta grozdja.',
      en: 'Tempranillo is a Spanish red grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami črnega sadeža, vanilije in hrasta.',
      en: 'Medium-bodied wines with aromas of black fruit, vanilla, and oak.',
    },
    whyCool: {
      sl: 'Tempranillo je osnova najboljših španskih vinov iz Rioje in Ribera del Duero.',
      en: 'Tempranillo is the foundation of the finest Spanish wines from Rioja and Ribera del Duero.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženimi tanini.',
      en: 'Medium-bodied wines with balanced tannins.',
    },
    skin: 'red',
  },
  {
    title: 'Sangiovese',
    description: {
      sl: 'Sangiovese je italijanska rdeča sorta grozdja.',
      en: 'Sangiovese is an Italian red grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami češnje, slive in zemlje.',
      en: 'Medium-bodied wines with aromas of cherry, plum, and earth.',
    },
    whyCool: {
      sl: 'Sangiovese je osnova najboljših toskanskih vinov kot so Chianti in Brunello.',
      en: 'Sangiovese is the foundation of the finest Tuscan wines like Chianti and Brunello.',
    },
    character: {
      sl: 'Srednje polna vina z visoko kislino in tanini.',
      en: 'Medium-bodied wines with high acidity and tannins.',
    },
    skin: 'red',
  },
  {
    title: 'Nebbiolo',
    description: {
      sl: 'Nebbiolo je piemontska rdeča sorta grozdja.',
      en: 'Nebbiolo is a Piedmont red grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami rož, višnje, zemlje in tartufov.',
      en: 'Elegant wines with aromas of roses, cherry, earth, and truffles.',
    },
    whyCool: {
      sl: 'Nebbiolo je osnova najboljših Barolo in Barbaresco vinov.',
      en: 'Nebbiolo is the foundation of the finest Barolo and Barbaresco wines.',
    },
    character: {
      sl: 'Elegantna vina z močnimi tanini in visoko kislino.',
      en: 'Elegant wines with strong tannins and high acidity.',
    },
    skin: 'red',
  },
  {
    title: 'Malbec',
    description: {
      sl: 'Malbec je argentinska rdeča sorta grozdja.',
      en: 'Malbec is an Argentine red grape variety.',
    },
    typicalStyle: {
      sl: 'Polna vina z aromami črnega sadeža, čokolade in sladkega duhana.',
      en: 'Full-bodied wines with aromas of black fruit, chocolate, and sweet tobacco.',
    },
    whyCool: {
      sl: 'Malbec je osnova najboljših argentinskih vinov iz Mendoza.',
      en: 'Malbec is the foundation of the finest Argentine wines from Mendoza.',
    },
    character: {
      sl: 'Polna vina z mehkimi tanini in bogatim okusom.',
      en: 'Full-bodied wines with soft tannins and rich taste.',
    },
    skin: 'red',
  },
  {
    title: 'Refošk',
    description: {
      sl: 'Refošk je slovenska rdeča sorta grozdja.',
      en: 'Refošk is a Slovenian red grape variety.',
    },
    typicalStyle: {
      sl: 'Močna vina z aromami črnega sadeža in začimb.',
      en: 'Powerful wines with aromas of black fruit and spices.',
    },
    whyCool: {
      sl: 'Refošk je osnova najboljših slovenskih vinov iz Primorske.',
      en: 'Refošk is the foundation of the finest Slovenian wines from Primorska.',
    },
    character: {
      sl: 'Polna vina z močnimi tanini in dolgotrajnim okusom.',
      en: 'Full-bodied wines with strong tannins and long finish.',
    },
    skin: 'red',
  },
  {
    title: 'Teran',
    description: {
      sl: 'Teran je kraška rdeča sorta grozdja.',
      en: 'Teran is a karst red grape variety.',
    },
    typicalStyle: {
      sl: 'Močna vina z aromami črnega sadeža in mineralov.',
      en: 'Powerful wines with aromas of black fruit and minerals.',
    },
    whyCool: {
      sl: 'Teran je edinstvena kraška sorta z visoko vsebnostjo železa.',
      en: 'Teran is a unique karst variety with high iron content.',
    },
    character: {
      sl: 'Polna vina z močnimi tanini in mineralnim okusom.',
      en: 'Full-bodied wines with strong tannins and mineral taste.',
    },
    skin: 'red',
  },
  {
    title: 'Modra Frankinja',
    description: {
      sl: 'Modra Frankinja je slovenska rdeča sorta grozdja.',
      en: 'Modra Frankinja is a Slovenian red grape variety.',
    },
    typicalStyle: {
      sl: 'Lahka vina z aromami črnega sadeža in začimb.',
      en: 'Light wines with aromas of black fruit and spices.',
    },
    whyCool: {
      sl: 'Modra Frankinja je osnova tradicionalnih slovenskih vinov.',
      en: 'Modra Frankinja is the foundation of traditional Slovenian wines.',
    },
    character: {
      sl: 'Lahka vina z mehkimi tanini in osvežilnim okusom.',
      en: 'Light wines with soft tannins and refreshing taste.',
    },
    skin: 'red',
  },
  {
    title: 'Gamay',
    description: {
      sl: 'Gamay je francoska rdeča sorta grozdja.',
      en: 'Gamay is a French red grape variety.',
    },
    typicalStyle: {
      sl: 'Lahka vina z aromami jagod, malin in banan.',
      en: 'Light wines with aromas of strawberries, raspberries, and bananas.',
    },
    whyCool: {
      sl: 'Gamay je osnova Beaujolais vinov.',
      en: 'Gamay is the foundation of Beaujolais wines.',
    },
    character: {
      sl: 'Lahka vina z nizko kislino in mehkimi tanini.',
      en: 'Light wines with low acidity and soft tannins.',
    },
    skin: 'red',
  },
  {
    title: 'Corvina',
    description: {
      sl: 'Corvina je italijanska rdeča sorta grozdja.',
      en: 'Corvina is an Italian red grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami češnje in začimb.',
      en: 'Medium-bodied wines with aromas of cherry and spices.',
    },
    whyCool: {
      sl: 'Corvina je osnova Amarone in Valpolicella vinov.',
      en: 'Corvina is the foundation of Amarone and Valpolicella wines.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženimi tanini.',
      en: 'Medium-bodied wines with balanced tannins.',
    },
    skin: 'red',
  },
  {
    title: 'Carignan',
    description: {
      sl: 'Carignan je južna rdeča sorta grozdja.',
      en: 'Carignan is a southern red grape variety.',
    },
    typicalStyle: {
      sl: 'Močna vina z aromami črnega sadeža in zemlje.',
      en: 'Powerful wines with aromas of black fruit and earth.',
    },
    whyCool: {
      sl: 'Carignan je osnova tradicionalnih južnih vinov.',
      en: 'Carignan is the foundation of traditional southern wines.',
    },
    character: {
      sl: 'Polna vina z močnimi tanini in visoko kislino.',
      en: 'Full-bodied wines with strong tannins and high acidity.',
    },
    skin: 'red',
  },
  {
    title: 'Mourvedre',
    description: {
      sl: 'Mourvedre je južna rdeča sorta grozdja.',
      en: 'Mourvedre is a southern red grape variety.',
    },
    typicalStyle: {
      sl: 'Močna vina z aromami črnega sadeža, začimb in zemlje.',
      en: 'Powerful wines with aromas of black fruit, spices, and earth.',
    },
    whyCool: {
      sl: 'Mourvedre je pomembna sestavina južnih mešanic.',
      en: 'Mourvedre is an important component of southern blends.',
    },
    character: {
      sl: 'Polna vina z močnimi tanini in dolgotrajnim okusom.',
      en: 'Full-bodied wines with strong tannins and long finish.',
    },
    skin: 'red',
  },
  {
    title: 'Cinsault',
    description: {
      sl: 'Cinsault je južna rdeča sorta grozdja.',
      en: 'Cinsault is a southern red grape variety.',
    },
    typicalStyle: {
      sl: 'Lahka vina z aromami jagod in rož.',
      en: 'Light wines with aromas of strawberries and roses.',
    },
    whyCool: {
      sl: 'Cinsault je pomembna sestavina rosé vinov.',
      en: 'Cinsault is an important component of rosé wines.',
    },
    character: {
      sl: 'Lahka vina z mehkimi tanini in osvežilnim okusom.',
      en: 'Light wines with soft tannins and refreshing taste.',
    },
    skin: 'red',
  },
  {
    title: "Nero d'Avola",
    description: {
      sl: "Nero d'Avola je sicilijanska rdeča sorta grozdja.",
      en: "Nero d'Avola is a Sicilian red grape variety.",
    },
    typicalStyle: {
      sl: 'Močna vina z aromami črnega sadeža in začimb.',
      en: 'Powerful wines with aromas of black fruit and spices.',
    },
    whyCool: {
      sl: "Nero d'Avola je osnova najboljših sicilijanskih vinov.",
      en: "Nero d'Avola is the foundation of the finest Sicilian wines.",
    },
    character: {
      sl: 'Polna vina z močnimi tanini in bogatim okusom.',
      en: 'Full-bodied wines with strong tannins and rich taste.',
    },
    skin: 'red',
  },
  {
    title: 'Barbera',
    description: {
      sl: 'Barbera je piemontska rdeča sorta grozdja.',
      en: 'Barbera is a Piedmont red grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami črnega sadeža in visoko kislino.',
      en: 'Medium-bodied wines with aromas of black fruit and high acidity.',
    },
    whyCool: {
      sl: 'Barbera je najbolj razširjena sorta v Piemontu.',
      en: 'Barbera is the most widely planted variety in Piedmont.',
    },
    character: {
      sl: 'Srednje polna vina z visoko kislino in mehkimi tanini.',
      en: 'Medium-bodied wines with high acidity and soft tannins.',
    },
    skin: 'red',
  },
  {
    title: 'Dolcetto',
    description: {
      sl: 'Dolcetto je piemontska rdeča sorta grozdja.',
      en: 'Dolcetto is a Piedmont red grape variety.',
    },
    typicalStyle: {
      sl: 'Lahka vina z aromami jagod in malin.',
      en: 'Light wines with aromas of strawberries and raspberries.',
    },
    whyCool: {
      sl: 'Dolcetto prideluje dostopna in okusna vina.',
      en: 'Dolcetto produces approachable and fruity wines.',
    },
    character: {
      sl: 'Lahka vina z mehkimi tanini in osvežilnim okusom.',
      en: 'Light wines with soft tannins and refreshing taste.',
    },
    skin: 'red',
  },
  {
    title: 'Bonarda',
    description: {
      sl: 'Bonarda je argentinska rdeča sorta grozdja.',
      en: 'Bonarda is an Argentine red grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami črnega sadeža in začimb.',
      en: 'Medium-bodied wines with aromas of black fruit and spices.',
    },
    whyCool: {
      sl: 'Bonarda je druga najbolj razširjena sorta v Argentini.',
      en: 'Bonarda is the second most widely planted variety in Argentina.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženimi tanini.',
      en: 'Medium-bodied wines with balanced tannins.',
    },
    skin: 'red',
  },

  // White grape varieties
  {
    title: 'Chardonnay',
    description: {
      sl: 'Chardonnay je ena najbolj razširjenih belih sort grozdja na svetu.',
      en: 'Chardonnay is one of the most widely planted white grape varieties in the world.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami jabolk, citrusov in vanilije.',
      en: 'Elegant wines with aromas of apples, citrus, and vanilla.',
    },
    whyCool: {
      sl: 'Chardonnay je osnova najboljših burgundskih in kalifornijskih vinov.',
      en: 'Chardonnay is the foundation of the finest Burgundy and California wines.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženo kislino.',
      en: 'Medium-bodied wines with balanced acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Riesling',
    description: {
      sl: 'Riesling je elegantna bela sorta grozdja.',
      en: 'Riesling is an elegant white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami citrusov, jabolk in mineralov.',
      en: 'Elegant wines with aromas of citrus, apples, and minerals.',
    },
    whyCool: {
      sl: 'Riesling je osnova najboljših nemških in avstrijskih vinov.',
      en: 'Riesling is the foundation of the finest German and Austrian wines.',
    },
    character: {
      sl: 'Lahka do srednje polna vina z visoko kislino.',
      en: 'Light to medium-bodied wines with high acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Sauvignon Blanc',
    description: {
      sl: 'Sauvignon Blanc je aromatična bela sorta grozdja.',
      en: 'Sauvignon Blanc is an aromatic white grape variety.',
    },
    typicalStyle: {
      sl: 'Aromatična vina z aromami citrusov, zelišč in zelenjave.',
      en: 'Aromatic wines with aromas of citrus, herbs, and vegetables.',
    },
    whyCool: {
      sl: 'Sauvignon Blanc je osnova najboljših loirskih in novozelandskih vinov.',
      en: 'Sauvignon Blanc is the foundation of the finest Loire and New Zealand wines.',
    },
    character: {
      sl: 'Lahka vina z visoko kislino in osvežilnim okusom.',
      en: 'Light wines with high acidity and refreshing taste.',
    },
    skin: 'white',
  },
  {
    title: 'Pinot Grigio',
    description: {
      sl: 'Pinot Grigio je italijanska bela sorta grozdja.',
      en: 'Pinot Grigio is an Italian white grape variety.',
    },
    typicalStyle: {
      sl: 'Lahka vina z aromami citrusov in zelenih jabolk.',
      en: 'Light wines with aromas of citrus and green apples.',
    },
    whyCool: {
      sl: 'Pinot Grigio je osnova najboljših severnoitalijanskih vinov.',
      en: 'Pinot Grigio is the foundation of the finest northern Italian wines.',
    },
    character: {
      sl: 'Lahka vina z nizko kislino in osvežilnim okusom.',
      en: 'Light wines with low acidity and refreshing taste.',
    },
    skin: 'white',
  },
  {
    title: 'Gewürztraminer',
    description: {
      sl: 'Gewürztraminer je aromatična bela sorta grozdja.',
      en: 'Gewürztraminer is an aromatic white grape variety.',
    },
    typicalStyle: {
      sl: 'Aromatična vina z aromami rož, začimb in eksotičnega sadeža.',
      en: 'Aromatic wines with aromas of roses, spices, and exotic fruit.',
    },
    whyCool: {
      sl: 'Gewürztraminer je osnova najboljših alzaških vinov.',
      en: 'Gewürztraminer is the foundation of the finest Alsace wines.',
    },
    character: {
      sl: 'Srednje polna vina z nizko kislino in aromatičnim okusom.',
      en: 'Medium-bodied wines with low acidity and aromatic taste.',
    },
    skin: 'white',
  },
  {
    title: 'Pinot Gris',
    description: {
      sl: 'Pinot Gris je francoska bela sorta grozdja.',
      en: 'Pinot Gris is a French white grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami sadja in začimb.',
      en: 'Medium-bodied wines with aromas of fruit and spices.',
    },
    whyCool: {
      sl: 'Pinot Gris je osnova najboljših alzaških vinov.',
      en: 'Pinot Gris is the foundation of the finest Alsace wines.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženo kislino.',
      en: 'Medium-bodied wines with balanced acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Glera',
    description: {
      sl: 'Glera je italijanska bela sorta grozdja za penine vina.',
      en: 'Glera is an Italian white grape variety for sparkling wines.',
    },
    typicalStyle: {
      sl: 'Osvežilna penina vina z aromami sadja in cvetov.',
      en: 'Refreshing sparkling wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Glera je osnova Prosecco vinov.',
      en: 'Glera is the foundation of Prosecco wines.',
    },
    character: {
      sl: 'Lahka penina vina z nizko kislino in osvežilnim okusom.',
      en: 'Light sparkling wines with low acidity and refreshing taste.',
    },
    skin: 'white',
  },
  {
    title: 'Malvazija',
    description: {
      sl: 'Malvazija je slovenska bela sorta grozdja.',
      en: 'Malvazija is a Slovenian white grape variety.',
    },
    typicalStyle: {
      sl: 'Aromatična vina z aromami sadja in cvetov.',
      en: 'Aromatic wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Malvazija je osnova najboljših slovenskih belih vinov.',
      en: 'Malvazija is the foundation of the finest Slovenian white wines.',
    },
    character: {
      sl: 'Srednje polna vina z aromatičnim okusom.',
      en: 'Medium-bodied wines with aromatic taste.',
    },
    skin: 'white',
  },
  {
    title: 'Laški Rizling',
    description: {
      sl: 'Laški Rizling je slovenska bela sorta grozdja.',
      en: 'Laški Rizling is a Slovenian white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami citrusov in mineralov.',
      en: 'Elegant wines with aromas of citrus and minerals.',
    },
    whyCool: {
      sl: 'Laški Rizling je najbolj razširjena bela sorta v Sloveniji.',
      en: 'Laški Rizling is the most widely planted white variety in Slovenia.',
    },
    character: {
      sl: 'Srednje polna vina z visoko kislino in mineralnim okusom.',
      en: 'Medium-bodied wines with high acidity and mineral taste.',
    },
    skin: 'white',
  },
  {
    title: 'Gruner Veltliner',
    description: {
      sl: 'Gruner Veltliner je avstrijska bela sorta grozdja.',
      en: 'Gruner Veltliner is an Austrian white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami citrusov, zelišč in belega popra.',
      en: 'Elegant wines with aromas of citrus, herbs, and white pepper.',
    },
    whyCool: {
      sl: 'Gruner Veltliner je osnova najboljših avstrijskih vinov.',
      en: 'Gruner Veltliner is the foundation of the finest Austrian wines.',
    },
    character: {
      sl: 'Srednje polna vina z visoko kislino in mineralnim okusom.',
      en: 'Medium-bodied wines with high acidity and mineral taste.',
    },
    skin: 'white',
  },
  {
    title: 'Weissburgunder',
    description: {
      sl: 'Weissburgunder je avstrijska bela sorta grozdja.',
      en: 'Weissburgunder is an Austrian white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami sadja in mineralov.',
      en: 'Elegant wines with aromas of fruit and minerals.',
    },
    whyCool: {
      sl: 'Weissburgunder je pomembna bela sorta v Avstriji.',
      en: 'Weissburgunder is an important white variety in Austria.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženo kislino.',
      en: 'Medium-bodied wines with balanced acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Friulano',
    description: {
      sl: 'Friulano je italijanska bela sorta grozdja.',
      en: 'Friulano is an Italian white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami sadja in cvetov.',
      en: 'Elegant wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Friulano je osnova najboljših friulskih vinov.',
      en: 'Friulano is the foundation of the finest Friuli wines.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženo kislino.',
      en: 'Medium-bodied wines with balanced acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Ribolla Gialla',
    description: {
      sl: 'Ribolla Gialla je italijanska bela sorta grozdja.',
      en: 'Ribolla Gialla is an Italian white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami sadja in mineralov.',
      en: 'Elegant wines with aromas of fruit and minerals.',
    },
    whyCool: {
      sl: 'Ribolla Gialla je tradicionalna friulska sorta.',
      en: 'Ribolla Gialla is a traditional Friuli variety.',
    },
    character: {
      sl: 'Srednje polna vina z visoko kislino.',
      en: 'Medium-bodied wines with high acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Catarratto',
    description: {
      sl: 'Catarratto je sicilijanska bela sorta grozdja.',
      en: 'Catarratto is a Sicilian white grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami sadja in cvetov.',
      en: 'Medium-bodied wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Catarratto je najbolj razširjena bela sorta na Siciliji.',
      en: 'Catarratto is the most widely planted white variety in Sicily.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženo kislino.',
      en: 'Medium-bodied wines with balanced acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Grillo',
    description: {
      sl: 'Grillo je sicilijanska bela sorta grozdja.',
      en: 'Grillo is a Sicilian white grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami sadja in cvetov.',
      en: 'Medium-bodied wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Grillo je pomembna sestavina marsalskih vinov.',
      en: 'Grillo is an important component of Marsala wines.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženo kislino.',
      en: 'Medium-bodied wines with balanced acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Macabeo',
    description: {
      sl: 'Macabeo je španska bela sorta grozdja.',
      en: 'Macabeo is a Spanish white grape variety.',
    },
    typicalStyle: {
      sl: 'Lahka vina z aromami sadja in cvetov.',
      en: 'Light wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Macabeo je osnova Cava peninih vinov.',
      en: 'Macabeo is the foundation of Cava sparkling wines.',
    },
    character: {
      sl: 'Lahka vina z nizko kislino in osvežilnim okusom.',
      en: 'Light wines with low acidity and refreshing taste.',
    },
    skin: 'white',
  },
  {
    title: 'Parellada',
    description: {
      sl: 'Parellada je španska bela sorta grozdja.',
      en: 'Parellada is a Spanish white grape variety.',
    },
    typicalStyle: {
      sl: 'Lahka vina z aromami sadja in cvetov.',
      en: 'Light wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Parellada je pomembna sestavina Cava vinov.',
      en: 'Parellada is an important component of Cava wines.',
    },
    character: {
      sl: 'Lahka vina z nizko kislino in osvežilnim okusom.',
      en: 'Light wines with low acidity and refreshing taste.',
    },
    skin: 'white',
  },
  {
    title: 'Xarel-lo',
    description: {
      sl: 'Xarel-lo je španska bela sorta grozdja.',
      en: 'Xarel-lo is a Spanish white grape variety.',
    },
    typicalStyle: {
      sl: 'Srednje polna vina z aromami sadja in cvetov.',
      en: 'Medium-bodied wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Xarel-lo je pomembna sestavina Cava vinov.',
      en: 'Xarel-lo is an important component of Cava wines.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženo kislino.',
      en: 'Medium-bodied wines with balanced acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Furmint',
    description: {
      sl: 'Furmint je madžarska bela sorta grozdja.',
      en: 'Furmint is a Hungarian white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami sadja in mineralov.',
      en: 'Elegant wines with aromas of fruit and minerals.',
    },
    whyCool: {
      sl: 'Furmint je osnova Tokaji sladkih vinov.',
      en: 'Furmint is the foundation of Tokaji sweet wines.',
    },
    character: {
      sl: 'Srednje polna vina z visoko kislino.',
      en: 'Medium-bodied wines with high acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Harslevelu',
    description: {
      sl: 'Harslevelu je madžarska bela sorta grozdja.',
      en: 'Harslevelu is a Hungarian white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami sadja in cvetov.',
      en: 'Elegant wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Harslevelu je pomembna sestavina Tokaji vinov.',
      en: 'Harslevelu is an important component of Tokaji wines.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženo kislino.',
      en: 'Medium-bodied wines with balanced acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Sarga Muskotaly',
    description: {
      sl: 'Sarga Muskotaly je madžarska bela sorta grozdja.',
      en: 'Sarga Muskotaly is a Hungarian white grape variety.',
    },
    typicalStyle: {
      sl: 'Aromatična vina z aromami rož in sadja.',
      en: 'Aromatic wines with aromas of roses and fruit.',
    },
    whyCool: {
      sl: 'Sarga Muskotaly je pomembna sestavina Tokaji vinov.',
      en: 'Sarga Muskotaly is an important component of Tokaji wines.',
    },
    character: {
      sl: 'Srednje polna vina z aromatičnim okusom.',
      en: 'Medium-bodied wines with aromatic taste.',
    },
    skin: 'white',
  },
  {
    title: 'Pinela',
    description: {
      sl: 'Pinela je slovenska bela sorta grozdja.',
      en: 'Pinela is a Slovenian white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami sadja in cvetov.',
      en: 'Elegant wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Pinela je tradicionalna vipavska sorta.',
      en: 'Pinela is a traditional Vipava variety.',
    },
    character: {
      sl: 'Srednje polna vina z uravnoteženo kislino.',
      en: 'Medium-bodied wines with balanced acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Zelen',
    description: {
      sl: 'Zelen je slovenska bela sorta grozdja.',
      en: 'Zelen is a Slovenian white grape variety.',
    },
    typicalStyle: {
      sl: 'Elegantna vina z aromami sadja in mineralov.',
      en: 'Elegant wines with aromas of fruit and minerals.',
    },
    whyCool: {
      sl: 'Zelen je tradicionalna vipavska sorta.',
      en: 'Zelen is a traditional Vipava variety.',
    },
    character: {
      sl: 'Srednje polna vina z visoko kislino.',
      en: 'Medium-bodied wines with high acidity.',
    },
    skin: 'white',
  },
  {
    title: 'Cviček',
    description: {
      sl: 'Cviček je slovenska mešanica rdečih in belih sort.',
      en: 'Cviček is a Slovenian blend of red and white varieties.',
    },
    typicalStyle: {
      sl: 'Lahka vina z aromami sadja in cvetov.',
      en: 'Light wines with aromas of fruit and flowers.',
    },
    whyCool: {
      sl: 'Cviček je edinstvena slovenska mešanica.',
      en: 'Cviček is a unique Slovenian blend.',
    },
    character: {
      sl: 'Lahka vina z nizko kislino in osvežilnim okusom.',
      en: 'Light wines with low acidity and refreshing taste.',
    },
    skin: 'white',
  },
]

async function seedGrapeVarieties(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    logger.info('Starting grape varieties seeding...', { task: 'seed-grape-varieties' })

    for (const grapeData of grapeVarietiesData) {
      try {
        // Check if grape variety already exists
        const existingGrape = await payload.find({
          collection: 'grape-varieties',
          where: {
            title: {
              equals: grapeData.title,
            },
          },
        })

        if (existingGrape.docs.length > 0) {
          logger.info(`Grape variety ${grapeData.title} already exists, skipping...`, {
            task: 'seed-grape-varieties',
            grape: grapeData.title,
          })
          continue
        }

        // Prepare grape variety data with Slovenian locale
        const grapePayload = {
          title: grapeData.title,
          description: grapeData.description?.sl || '',
          typicalStyle: grapeData.typicalStyle?.sl || '',
          whyCool: grapeData.whyCool?.sl || '',
          character: grapeData.character?.sl || '',
          skin: grapeData.skin,
          synonyms: grapeData.synonyms?.map((synonym) => ({ title: synonym })) || [],
        }

        // Create the grape variety with Slovenian locale
        const createdGrape = await payload.create({
          collection: 'grape-varieties',
          data: grapePayload,
          locale: 'sl',
        })

        // Update with English locale
        await payload.update({
          collection: 'grape-varieties',
          id: createdGrape.id,
          data: {
            title: grapeData.title,
            description: grapeData.description?.en || '',
            typicalStyle: grapeData.typicalStyle?.en || '',
            whyCool: grapeData.whyCool?.en || '',
            character: grapeData.character?.en || '',
          },
          locale: 'en',
        })

        logger.info(`Created grape variety: ${createdGrape.title}`, {
          task: 'seed-grape-varieties',
          grape: grapeData.title,
        })
      } catch (error) {
        logger.error(`Failed to create grape variety: ${grapeData.title}`, error as Error, {
          task: 'seed-grape-varieties',
          grape: grapeData.title,
        })
      }
    }

    logger.info('Grape varieties seeding completed successfully', { task: 'seed-grape-varieties' })
  } catch (error) {
    logger.error('Failed to seed grape varieties', error as Error, { task: 'seed-grape-varieties' })
    throw error
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedGrapeVarieties()
    .then(() => {
      process.exit(0)
    })
    .catch((error) => {
      console.error('Error seeding grape varieties:', error)
      process.exit(1)
    })
}

export { seedGrapeVarieties }
