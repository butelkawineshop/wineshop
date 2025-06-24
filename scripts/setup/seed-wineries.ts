import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../src/lib/logger'
import payloadConfig from '../src/payload.config'

interface WineryData {
  title: string
  wineryCode: string
  description?: {
    sl: string
    en: string
  }
  whyCool?: {
    sl: string
    en: string
  }
  social?: {
    instagram?: string
    website?: string
  }
}

const wineriesData: WineryData[] = [
  // Final batch of wineries to add
  {
    title: 'Tonin',
    wineryCode: 'TONI',
    description: {
      sl: 'Tonin je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Tonin is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Tonin prideluje tradicionalne vina z osebnim pristopom.',
      en: 'Tonin produces traditional wines with a personal approach.',
    },
  },
  {
    title: 'Torremilanos',
    wineryCode: 'TORR',
    description: {
      sl: 'Torremilanos je španska vinogradniška hiša iz Ribera del Duero.',
      en: 'Torremilanos is a Spanish wine house from Ribera del Duero.',
    },
    whyCool: {
      sl: 'Torremilanos je znan po svojih elegantnih Tempranillo vinih iz Ribera del Duero.',
      en: 'Torremilanos is known for its elegant Tempranillo wines from Ribera del Duero.',
    },
  },
  {
    title: 'Tua Rita',
    wineryCode: 'TUAR',
    description: {
      sl: 'Tua Rita je italijanska vinogradniška hiša iz Toskane.',
      en: 'Tua Rita is an Italian wine house from Tuscany.',
    },
    whyCool: {
      sl: 'Tua Rita je znana po svojih Super Tuscan vinih in Redigaffi.',
      en: 'Tua Rita is known for its Super Tuscan wines and Redigaffi.',
    },
  },
  {
    title: 'Vilij Bržan',
    wineryCode: 'VILI',
    description: {
      sl: 'Vilij Bržan je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Vilij Bržan is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Vilij Bržan prideluje elegantne vina iz najboljših vinogradov Brda.',
      en: 'Vilij Bržan produces elegant wines from the finest Brda vineyards.',
    },
  },
  {
    title: 'Villa Fabiani',
    wineryCode: 'VILL',
    description: {
      sl: 'Villa Fabiani je italijanska vinogradniška hiša iz Toskane.',
      en: 'Villa Fabiani is an Italian wine house from Tuscany.',
    },
    whyCool: {
      sl: 'Villa Fabiani prideluje elegantne toskanske vina z tradicijo.',
      en: 'Villa Fabiani produces elegant Tuscan wines with tradition.',
    },
  },
  {
    title: 'Vincent Girardin',
    wineryCode: 'VINC',
    description: {
      sl: 'Vincent Girardin je francoska vinogradniška hiša iz Burgundije.',
      en: 'Vincent Girardin is a French wine house from Burgundy.',
    },
    whyCool: {
      sl: 'Vincent Girardin prideluje elegantne burgundske vina z minimalnimi posegi.',
      en: 'Vincent Girardin produces elegant Burgundy wines with minimal intervention.',
    },
  },
  {
    title: 'Zaro',
    wineryCode: 'ZARO',
    description: {
      sl: 'Zaro je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Zaro is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Zaro prideluje tradicionalne vina z modernimi metodami.',
      en: 'Zaro produces traditional wines with modern methods.',
    },
  },
  {
    title: 'Zidarich',
    wineryCode: 'ZIDA',
    description: {
      sl: 'Zidarich je slovenska vinogradniška hiša iz Istre.',
      en: 'Zidarich is a Slovenian wine house from Istria.',
    },
    whyCool: {
      sl: 'Zidarich je znan po svojih naravnih vinih in minimalnih posegih.',
      en: 'Zidarich is known for its natural wines and minimal intervention.',
    },
  },
  {
    title: 'Čarga',
    wineryCode: 'CARG',
    description: {
      sl: 'Čarga je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Čarga is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Čarga prideluje vina z osebnim pristopom in skrbjo za kakovost.',
      en: 'Čarga produces wines with a personal approach and care for quality.',
    },
  },
  {
    title: 'Čotar',
    wineryCode: 'COTA',
    description: {
      sl: 'Čotar je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Čotar is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Čotar je znan po svojih elegantnih vinih in dolgoletni tradiciji.',
      en: 'Čotar is known for its elegant wines and long tradition.',
    },
  },
  {
    title: 'Štoka',
    wineryCode: 'STOK',
    description: {
      sl: 'Štoka je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Štoka is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Štoka prideluje tradicionalne vina z osebnim pristopom.',
      en: 'Štoka produces traditional wines with a personal approach.',
    },
  },
  {
    title: 'Šuklje',
    wineryCode: 'SUKL',
    description: {
      sl: 'Šuklje je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Šuklje is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Šuklje prideluje vina z osebnim pristopom in skrbjo za kakovost.',
      en: 'Šuklje produces wines with a personal approach and care for quality.',
    },
  },

  // Even more wineries to add
  {
    title: 'Pieropan',
    wineryCode: 'PIER',
    description: {
      sl: 'Pieropan je italijanska vinogradniška hiša iz Veneta, znana po svojih Soave vinih.',
      en: 'Pieropan is an Italian wine house from Veneto, known for its Soave wines.',
    },
    whyCool: {
      sl: 'Pieropan je pionir v pridelavi visokokakovostnih Soave vinov.',
      en: 'Pieropan is a pioneer in producing high-quality Soave wines.',
    },
  },
  {
    title: 'Plahuta',
    wineryCode: 'PLAH',
    description: {
      sl: 'Plahuta je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Plahuta is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Plahuta prideluje tradicionalne vina z osebnim pristopom.',
      en: 'Plahuta produces traditional wines with a personal approach.',
    },
  },
  {
    title: 'Rodica',
    wineryCode: 'RODI',
    description: {
      sl: 'Rodica je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Rodica is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Rodica prideluje elegantne vina iz najboljših vinogradov Brda.',
      en: 'Rodica produces elegant wines from the finest Brda vineyards.',
    },
  },
  {
    title: 'Rojac',
    wineryCode: 'ROJA',
    description: {
      sl: 'Rojac je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Rojac is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Rojac prideluje tradicionalne vina z modernimi metodami.',
      en: 'Rojac produces traditional wines with modern methods.',
    },
  },
  {
    title: 'Ruinart',
    wineryCode: 'RUIN',
    description: {
      sl: 'Ruinart je francoska vinogradniška hiša, znana po šampanjcu.',
      en: 'Ruinart is a French wine house known for champagne.',
    },
    whyCool: {
      sl: 'Ruinart je najstarejša hiša za šampanjec na svetu, ustanovljena leta 1729.',
      en: 'Ruinart is the oldest champagne house in the world, founded in 1729.',
    },
  },
  {
    title: 'San Roman',
    wineryCode: 'SANR',
    description: {
      sl: 'San Roman je španska vinogradniška hiša iz Toro regije.',
      en: 'San Roman is a Spanish wine house from the Toro region.',
    },
    whyCool: {
      sl: 'San Roman je znan po svojih močnih Tempranillo vinih iz Toro.',
      en: 'San Roman is known for its powerful Tempranillo wines from Toro.',
    },
  },
  {
    title: 'Santomas',
    wineryCode: 'SANT',
    description: {
      sl: 'Santomas je slovenska vinogradniška hiša iz Istre.',
      en: 'Santomas is a Slovenian wine house from Istria.',
    },
    whyCool: {
      sl: 'Santomas prideluje elegantne vina iz mediteranskega podnebja Istre.',
      en: 'Santomas produces elegant wines from the Mediterranean climate of Istria.',
    },
  },
  {
    title: 'Sinefinis',
    wineryCode: 'SINE',
    description: {
      sl: 'Sinefinis je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Sinefinis is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Sinefinis prideluje vina z osebnim pristopom in skrbjo za kakovost.',
      en: 'Sinefinis produces wines with a personal approach and care for quality.',
    },
  },
  {
    title: 'Sturm',
    wineryCode: 'STUR',
    description: {
      sl: 'Sturm je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Sturm is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Sturm prideluje tradicionalne vina z modernimi metodami.',
      en: 'Sturm produces traditional wines with modern methods.',
    },
  },
  {
    title: 'Sutor',
    wineryCode: 'SUTO',
    description: {
      sl: 'Sutor je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Sutor is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Sutor prideluje elegantne vina iz najboljših vinogradov Brda.',
      en: 'Sutor produces elegant wines from the finest Brda vineyards.',
    },
  },
  {
    title: 'Sveti Martin',
    wineryCode: 'SVET',
    description: {
      sl: 'Sveti Martin je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Sveti Martin is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Sveti Martin prideluje tradicionalne vina z osebnim pristopom.',
      en: 'Sveti Martin produces traditional wines with a personal approach.',
    },
  },
  {
    title: 'Thomas Morey',
    wineryCode: 'THOM',
    description: {
      sl: 'Thomas Morey je francoska vinogradniška hiša iz Burgundije.',
      en: 'Thomas Morey is a French wine house from Burgundy.',
    },
    whyCool: {
      sl: 'Thomas Morey prideluje elegantne burgundske vina z minimalnimi posegi.',
      en: 'Thomas Morey produces elegant Burgundy wines with minimal intervention.',
    },
  },
  {
    title: 'Tilia',
    wineryCode: 'TILI',
    description: {
      sl: 'Tilia je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Tilia is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Tilia prideluje vina z osebnim pristopom in skrbjo za kakovost.',
      en: 'Tilia produces wines with a personal approach and care for quality.',
    },
  },

  // More wineries to add
  {
    title: 'John Duval',
    wineryCode: 'JOHN',
    description: {
      sl: 'John Duval je avstralska vinogradniška hiša iz Barossa Valley.',
      en: 'John Duval is an Australian wine house from Barossa Valley.',
    },
    whyCool: {
      sl: 'John Duval je bivši glavni vinar pri Penfolds in prideluje elegantne Shiraz vina.',
      en: 'John Duval is former chief winemaker at Penfolds and produces elegant Shiraz wines.',
    },
  },
  {
    title: 'Kalos',
    wineryCode: 'KALO',
    description: {
      sl: 'Kalos je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Kalos is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Kalos prideluje vina z osebnim pristopom in skrbjo za kakovost.',
      en: 'Kalos produces wines with a personal approach and care for quality.',
    },
  },
  {
    title: 'Kendall-Jackson',
    wineryCode: 'KEND',
    description: {
      sl: 'Kendall-Jackson je ameriška vinogradniška hiša iz Kalifornije.',
      en: 'Kendall-Jackson is an American wine house from California.',
    },
    whyCool: {
      sl: 'Kendall-Jackson je znan po svojih Chardonnay vinih in pristopu k terroir.',
      en: 'Kendall-Jackson is known for its Chardonnay wines and terroir approach.',
    },
  },
  {
    title: 'Klenart',
    wineryCode: 'KLEN',
    description: {
      sl: 'Klenart je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Klenart is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Klenart prideluje elegantne vina iz najboljših vinogradov Brda.',
      en: 'Klenart produces elegant wines from the finest Brda vineyards.',
    },
  },
  {
    title: 'Kmetija Mlečnik',
    wineryCode: 'KMET',
    description: {
      sl: 'Kmetija Mlečnik je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Kmetija Mlečnik is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Kmetija Mlečnik je znana po svojih biodinamičnih metodah in naravnih vinih.',
      en: 'Kmetija Mlečnik is known for its biodynamic methods and natural wines.',
    },
  },
  {
    title: 'Korenika-Moškon',
    wineryCode: 'KORE',
    description: {
      sl: 'Korenika-Moškon je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Korenika-Moškon is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Korenika-Moškon prideluje tradicionalne vina z modernimi metodami.',
      en: 'Korenika-Moškon produces traditional wines with modern methods.',
    },
  },
  {
    title: 'Kristian Keber',
    wineryCode: 'KRIS',
    description: {
      sl: 'Kristian Keber je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Kristian Keber is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Kristian Keber je znan po svojih elegantnih belih vinih in skrbni pridelavi.',
      en: 'Kristian Keber is known for its elegant white wines and careful production.',
    },
  },
  {
    title: 'La Chablisienne',
    wineryCode: 'LACH',
    description: {
      sl: 'La Chablisienne je francoska vinogradniška hiša iz Chablis.',
      en: 'La Chablisienne is a French wine house from Chablis.',
    },
    whyCool: {
      sl: 'La Chablisienne je največja vinogradniška hiša v Chablis regiji.',
      en: 'La Chablisienne is the largest wine house in the Chablis region.',
    },
  },
  {
    title: 'La Vigna Di Sarah',
    wineryCode: 'LAVI',
    description: {
      sl: 'La Vigna Di Sarah je italijanska vinogradniška hiša iz Toskane.',
      en: 'La Vigna Di Sarah is an Italian wine house from Tuscany.',
    },
    whyCool: {
      sl: 'La Vigna Di Sarah prideluje elegantne toskanske vina z osebnim pristopom.',
      en: 'La Vigna Di Sarah produces elegant Tuscan wines with a personal approach.',
    },
  },
  {
    title: 'Livon',
    wineryCode: 'LIVO',
    description: {
      sl: 'Livon je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Livon is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Livon je znan po svojih elegantnih vinih in dolgoletni tradiciji.',
      en: 'Livon is known for its elegant wines and long tradition.',
    },
  },
  {
    title: 'M.Chapoutier',
    wineryCode: 'MCHA',
    description: {
      sl: 'M.Chapoutier je francoska vinogradniška hiša iz Rhône Valley.',
      en: 'M.Chapoutier is a French wine house from Rhône Valley.',
    },
    whyCool: {
      sl: 'M.Chapoutier je znan po svojih biodinamičnih metodah in Hermitage vinih.',
      en: 'M.Chapoutier is known for its biodynamic methods and Hermitage wines.',
    },
  },
  {
    title: 'Mansus',
    wineryCode: 'MANS',
    description: {
      sl: 'Mansus je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Mansus is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Mansus prideluje tradicionalne vina z modernimi metodami.',
      en: 'Mansus produces traditional wines with modern methods.',
    },
  },
  {
    title: 'Marko Sirk',
    wineryCode: 'MARK',
    description: {
      sl: 'Marko Sirk je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Marko Sirk is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Marko Sirk je znan po svojih naravnih vinih in minimalnih posegih.',
      en: 'Marko Sirk is known for its natural wines and minimal intervention.',
    },
  },
  {
    title: 'Marof',
    wineryCode: 'MARO',
    description: {
      sl: 'Marof je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Marof is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Marof prideluje vina z osebnim pristopom in skrbjo za kakovost.',
      en: 'Marof produces wines with a personal approach and care for quality.',
    },
  },
  {
    title: 'Marques De Murieta',
    wineryCode: 'MARQ',
    description: {
      sl: 'Marques De Murieta je španska vinogradniška hiša iz Rioje.',
      en: 'Marques De Murieta is a Spanish wine house from Rioja.',
    },
    whyCool: {
      sl: 'Marques De Murieta je ena najstarejših vinogradniških hiš v Rioji.',
      en: 'Marques De Murieta is one of the oldest wine houses in Rioja.',
    },
  },
  {
    title: 'Massolino',
    wineryCode: 'MASS',
    description: {
      sl: 'Massolino je italijanska vinogradniška hiša iz Piemonta.',
      en: 'Massolino is an Italian wine house from Piedmont.',
    },
    whyCool: {
      sl: "Massolino je znan po svojih Barolo vinih iz Serralunga d'Alba.",
      en: "Massolino is known for its Barolo wines from Serralunga d'Alba.",
    },
  },
  {
    title: 'Medot',
    wineryCode: 'MEDO',
    description: {
      sl: 'Medot je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Medot is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Medot prideluje tradicionalne vina z modernimi metodami.',
      en: 'Medot produces traditional wines with modern methods.',
    },
  },
  {
    title: 'Michele Chiarlo',
    wineryCode: 'MICH',
    description: {
      sl: 'Michele Chiarlo je italijanska vinogradniška hiša iz Piemonta.',
      en: 'Michele Chiarlo is an Italian wine house from Piedmont.',
    },
    whyCool: {
      sl: 'Michele Chiarlo je znan po svojih Barolo in Barbaresco vinih.',
      en: 'Michele Chiarlo is known for its Barolo and Barbaresco wines.',
    },
  },
  {
    title: 'Montemoro',
    wineryCode: 'MONT',
    description: {
      sl: 'Montemoro je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Montemoro is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Montemoro prideluje vina z osebnim pristopom in skrbjo za kakovost.',
      en: 'Montemoro produces wines with a personal approach and care for quality.',
    },
  },
  {
    title: 'Montis',
    wineryCode: 'MONI',
    description: {
      sl: 'Montis je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Montis is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Montis prideluje elegantne vina iz najboljših vinogradov Brda.',
      en: 'Montis produces elegant wines from the finest Brda vineyards.',
    },
  },
  {
    title: 'Nicolas Rossignol',
    wineryCode: 'NICO',
    description: {
      sl: 'Nicolas Rossignol je francoska vinogradniška hiša iz Burgundije.',
      en: 'Nicolas Rossignol is a French wine house from Burgundy.',
    },
    whyCool: {
      sl: 'Nicolas Rossignol prideluje elegantne burgundske vina z minimalnimi posegi.',
      en: 'Nicolas Rossignol produces elegant Burgundy wines with minimal intervention.',
    },
  },
  {
    title: 'Ogier',
    wineryCode: 'OGIE',
    description: {
      sl: 'Ogier je francoska vinogradniška hiša iz Rhône Valley.',
      en: 'Ogier is a French wine house from Rhône Valley.',
    },
    whyCool: {
      sl: 'Ogier je znan po svojih Châteauneuf-du-Pape vinih.',
      en: 'Ogier is known for its Châteauneuf-du-Pape wines.',
    },
  },
  {
    title: 'Oremus',
    wineryCode: 'OREM',
    description: {
      sl: 'Oremus je madžarska vinogradniška hiša, znana po svojih Tokaji vinih.',
      en: 'Oremus is a Hungarian wine house known for its Tokaji wines.',
    },
    whyCool: {
      sl: 'Oremus prideluje najboljše Tokaji vino na svetu.',
      en: 'Oremus produces the finest Tokaji wine in the world.',
    },
  },
  {
    title: 'Ornellaia',
    wineryCode: 'ORNE',
    description: {
      sl: 'Ornellaia je italijanska vinogradniška hiša iz Toskane.',
      en: 'Ornellaia is an Italian wine house from Tuscany.',
    },
    whyCool: {
      sl: 'Ornellaia je ena najprestižnejših Super Tuscan vinogradniških hiš.',
      en: 'Ornellaia is one of the most prestigious Super Tuscan wine houses.',
    },
  },
  {
    title: 'Pasji Rep',
    wineryCode: 'PASJ',
    description: {
      sl: 'Pasji Rep je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Pasji Rep is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Pasji Rep prideluje tradicionalne vina z osebnim pristopom.',
      en: 'Pasji Rep produces traditional wines with a personal approach.',
    },
  },
  {
    title: 'Pichler-Krutzler',
    wineryCode: 'PICH',
    description: {
      sl: 'Pichler-Krutzler je avstrijska vinogradniška hiša iz Wachau.',
      en: 'Pichler-Krutzler is an Austrian wine house from Wachau.',
    },
    whyCool: {
      sl: 'Pichler-Krutzler prideluje elegantne Riesling vina iz Wachau.',
      en: 'Pichler-Krutzler produces elegant Riesling wines from Wachau.',
    },
  },

  // Additional wineries to add
  {
    title: 'Chateau Pech Latt',
    wineryCode: 'CPEC',
    description: {
      sl: 'Chateau Pech Latt je francoska vinogradniška hiša iz Languedoc regije.',
      en: 'Chateau Pech Latt is a French wine house from the Languedoc region.',
    },
    whyCool: {
      sl: 'Chateau Pech Latt prideluje elegantne vina iz južne Francije z modernimi metodami.',
      en: 'Chateau Pech Latt produces elegant wines from southern France with modern methods.',
    },
  },
  {
    title: 'Chateau Phelan-Segur',
    wineryCode: 'CPHE',
    description: {
      sl: 'Chateau Phelan-Segur je francoska vinogradniška hiša iz Bordeaux.',
      en: 'Chateau Phelan-Segur is a French wine house from Bordeaux.',
    },
    whyCool: {
      sl: 'Chateau Phelan-Segur je znan po svojih elegantnih bordojskih vinih iz Saint-Estephe.',
      en: 'Chateau Phelan-Segur is known for its elegant Bordeaux wines from Saint-Estephe.',
    },
  },
  {
    title: 'Clarendelle',
    wineryCode: 'CLAR',
    description: {
      sl: 'Clarendelle je francoska vinogradniška hiša, znana po svojih bordojskih vinih.',
      en: 'Clarendelle is a French wine house known for its Bordeaux wines.',
    },
    whyCool: {
      sl: 'Clarendelle je projekt družine Clarence Dillon, lastnikov Château Haut-Brion.',
      en: 'Clarendelle is a project of the Clarence Dillon family, owners of Château Haut-Brion.',
    },
  },
  {
    title: 'Colnar',
    wineryCode: 'COLN',
    description: {
      sl: 'Colnar je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Colnar is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Colnar prideluje tradicionalne vina z osebnim pristopom in skrbjo za kakovost.',
      en: 'Colnar produces traditional wines with a personal approach and care for quality.',
    },
  },
  {
    title: 'Dandelion',
    wineryCode: 'DAND',
    description: {
      sl: 'Dandelion je avstralska vinogradniška hiša iz Barossa Valley.',
      en: 'Dandelion is an Australian wine house from Barossa Valley.',
    },
    whyCool: {
      sl: 'Dandelion je znan po svojih Shiraz vinih in tradicionalnih metodah pridelave.',
      en: 'Dandelion is known for its Shiraz wines and traditional production methods.',
    },
  },
  {
    title: 'David Duband',
    wineryCode: 'DAVI',
    description: {
      sl: 'David Duband je francoska vinogradniška hiša iz Burgundije.',
      en: 'David Duband is a French wine house from Burgundy.',
    },
    whyCool: {
      sl: 'David Duband prideluje elegantne burgundske vina z minimalnimi posegi.',
      en: 'David Duband produces elegant Burgundy wines with minimal intervention.',
    },
  },
  {
    title: 'Dolfo',
    wineryCode: 'DOLF',
    description: {
      sl: 'Dolfo je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Dolfo is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Dolfo prideluje tradicionalne vina z modernimi metodami in skrbjo za terroir.',
      en: 'Dolfo produces traditional wines with modern methods and care for terroir.',
    },
  },
  {
    title: 'Domaine Ruet',
    wineryCode: 'DRUE',
    description: {
      sl: 'Domaine Ruet je francoska vinogradniška hiša iz Burgundije.',
      en: 'Domaine Ruet is a French wine house from Burgundy.',
    },
    whyCool: {
      sl: 'Domaine Ruet je znan po svojih elegantnih Chardonnay vinih iz Chablis.',
      en: 'Domaine Ruet is known for its elegant Chardonnay wines from Chablis.',
    },
  },
  {
    title: 'Domaine Sparr',
    wineryCode: 'DSPA',
    description: {
      sl: 'Domaine Sparr je francoska vinogradniška hiša iz Alzacije.',
      en: 'Domaine Sparr is a French wine house from Alsace.',
    },
    whyCool: {
      sl: 'Domaine Sparr prideluje elegantne alzaške vina z dolgoletno tradicijo.',
      en: 'Domaine Sparr produces elegant Alsace wines with a long tradition.',
    },
  },
  {
    title: 'Domaines Ott',
    wineryCode: 'DOTT',
    description: {
      sl: 'Domaines Ott je francoska vinogradniška hiša iz Provence.',
      en: 'Domaines Ott is a French wine house from Provence.',
    },
    whyCool: {
      sl: 'Domaines Ott je znan po svojih elegantnih rosé vinih iz Provence.',
      en: 'Domaines Ott is known for its elegant rosé wines from Provence.',
    },
  },
  {
    title: 'E.Guigal',
    wineryCode: 'EGUI',
    description: {
      sl: 'E.Guigal je francoska vinogradniška hiša iz Rhône Valley.',
      en: 'E.Guigal is a French wine house from Rhône Valley.',
    },
    whyCool: {
      sl: 'E.Guigal je ena najprestižnejših hiš za Côte-Rôtie in Condrieu vina.',
      en: 'E.Guigal is one of the most prestigious houses for Côte-Rôtie and Condrieu wines.',
    },
  },
  {
    title: 'Edi Keber',
    wineryCode: 'EDIK',
    description: {
      sl: 'Edi Keber je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Edi Keber is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Edi Keber je znan po svojih elegantnih belih vinih in skrbni pridelavi.',
      en: 'Edi Keber is known for its elegant white wines and careful production.',
    },
  },
  {
    title: 'Elena Walch',
    wineryCode: 'ELEW',
    description: {
      sl: 'Elena Walch je italijanska vinogradniška hiša iz Južne Tirolske.',
      en: 'Elena Walch is an Italian wine house from South Tyrol.',
    },
    whyCool: {
      sl: 'Elena Walch je pionirka v modernem pristopu k vinarstvu v Južni Tirolski.',
      en: 'Elena Walch is a pioneer in modern winemaking approach in South Tyrol.',
    },
  },
  {
    title: 'Familija',
    wineryCode: 'FAMI',
    description: {
      sl: 'Familija je slovenska vinogradniška hiša z družinsko tradicijo.',
      en: 'Familija is a Slovenian wine house with family tradition.',
    },
    whyCool: {
      sl: 'Familija prideluje vina z osebnim pristopom in skrbjo za družinske vrednote.',
      en: 'Familija produces wines with a personal approach and care for family values.',
    },
  },
  {
    title: 'Ferdinand',
    wineryCode: 'FERD',
    description: {
      sl: 'Ferdinand je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Ferdinand is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Ferdinand prideluje tradicionalne vina z modernimi metodami.',
      en: 'Ferdinand produces traditional wines with modern methods.',
    },
  },
  {
    title: 'Fontodi',
    wineryCode: 'FONT',
    description: {
      sl: 'Fontodi je italijanska vinogradniška hiša iz Toskane.',
      en: 'Fontodi is an Italian wine house from Tuscany.',
    },
    whyCool: {
      sl: 'Fontodi je znan po svojih Chianti Classico vinih in biodinamičnih metodah.',
      en: 'Fontodi is known for its Chianti Classico wines and biodynamic methods.',
    },
  },
  {
    title: 'Francois Mikulski',
    wineryCode: 'FRAM',
    description: {
      sl: 'Francois Mikulski je francoska vinogradniška hiša iz Burgundije.',
      en: 'Francois Mikulski is a French wine house from Burgundy.',
    },
    whyCool: {
      sl: 'Francois Mikulski prideluje elegantne burgundske vina z minimalnimi posegi.',
      en: 'Francois Mikulski produces elegant Burgundy wines with minimal intervention.',
    },
  },
  {
    title: 'Frešer',
    wineryCode: 'FRES',
    description: {
      sl: 'Frešer je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Frešer is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Frešer prideluje tradicionalne vina z osebnim pristopom.',
      en: 'Frešer produces traditional wines with a personal approach.',
    },
  },
  {
    title: 'Gašper',
    wineryCode: 'GASP',
    description: {
      sl: 'Gašper je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Gašper is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Gašper prideluje vina z osebnim pristopom in skrbjo za kakovost.',
      en: 'Gašper produces wines with a personal approach and care for quality.',
    },
  },
  {
    title: 'Gradisciutta',
    wineryCode: 'GRAD',
    description: {
      sl: 'Gradisciutta je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Gradisciutta is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Gradisciutta je znana po svojih elegantnih belih vinih iz Brda.',
      en: 'Gradisciutta is known for its elegant white wines from Brda.',
    },
  },
  {
    title: 'Gross',
    wineryCode: 'GROS',
    description: {
      sl: 'Gross je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Gross is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Gross prideluje tradicionalne vina z modernimi metodami.',
      en: 'Gross produces traditional wines with modern methods.',
    },
  },
  {
    title: 'Jakončič',
    wineryCode: 'JAKO',
    description: {
      sl: 'Jakončič je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Jakončič is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Jakončič je znan po svojih elegantnih vinih in dolgoletni tradiciji.',
      en: 'Jakončič is known for its elegant wines and long tradition.',
    },
  },

  // New wineries to add
  {
    title: 'Aldo Conterno',
    wineryCode: 'ALDO',
    description: {
      sl: 'Aldo Conterno je prestižna piemontska vinogradniška hiša, znana po svojih Barolo vinih.',
      en: 'Aldo Conterno is a prestigious Piedmont wine house known for its Barolo wines.',
    },
    whyCool: {
      sl: 'Aldo Conterno prideluje elegantne in kompleksne Barolo vina iz najboljših vinogradov.',
      en: 'Aldo Conterno produces elegant and complex Barolo wines from the finest vineyards.',
    },
  },
  {
    title: 'Altos Las Hormigas',
    wineryCode: 'ALTO',
    description: {
      sl: 'Altos Las Hormigas je argentinska vinogradniška hiša, specializirana za Malbec.',
      en: 'Altos Las Hormigas is an Argentine wine house specializing in Malbec.',
    },
    whyCool: {
      sl: 'Altos Las Hormigas je pionir v pridelavi visokokakovostnih Malbec vinov v Argentini.',
      en: 'Altos Las Hormigas is a pioneer in producing high-quality Malbec wines in Argentina.',
    },
  },
  {
    title: 'Bailly Lapierre',
    wineryCode: 'BAIL',
    description: {
      sl: 'Bailly Lapierre je francoska vinogradniška hiša, znana po svojih peninih vinih.',
      en: 'Bailly Lapierre is a French wine house known for its sparkling wines.',
    },
    whyCool: {
      sl: 'Bailly Lapierre prideluje elegantne penine vina z tradicionalnimi metodami.',
      en: 'Bailly Lapierre produces elegant sparkling wines using traditional methods.',
    },
  },
  {
    title: 'Banfi',
    wineryCode: 'BANF',
    description: {
      sl: 'Banfi je italijanska vinogradniška hiša, znana po svojih Brunello di Montalcino vinih.',
      en: 'Banfi is an Italian wine house known for its Brunello di Montalcino wines.',
    },
    whyCool: {
      sl: 'Banfi je ena največjih in najprestižnejših vinogradniških hiš v Toskani.',
      en: 'Banfi is one of the largest and most prestigious wine houses in Tuscany.',
    },
  },
  {
    title: 'Batič',
    wineryCode: 'BATI',
    description: {
      sl: 'Batič je slovenska vinogradniška hiša iz Vipavske doline.',
      en: 'Batič is a Slovenian wine house from the Vipava Valley.',
    },
    whyCool: {
      sl: 'Batič je znan po svojih biodinamičnih metodah in edinstvenih vinih.',
      en: 'Batič is known for its biodynamic methods and unique wines.',
    },
  },
  {
    title: 'Bjana',
    wineryCode: 'BJAN',
    description: {
      sl: 'Bjana je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Bjana is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Bjana prideluje tradicionalne vina z modernimi metodami.',
      en: 'Bjana produces traditional wines with modern methods.',
    },
  },
  {
    title: 'Blažič',
    wineryCode: 'BLAZ',
    description: {
      sl: 'Blažič je slovenska vinogradniška hiša iz Dolenjske.',
      en: 'Blažič is a Slovenian wine house from Dolenjska.',
    },
    whyCool: {
      sl: 'Blažič je znan po svojih Cviček vinih in tradicionalnih metodah.',
      en: 'Blažič is known for its Cviček wines and traditional methods.',
    },
  },
  {
    title: 'Brič',
    wineryCode: 'BRIC',
    description: {
      sl: 'Brič je slovenska vinogradniška hiša iz Goriških Brd.',
      en: 'Brič is a Slovenian wine house from Goriška Brda.',
    },
    whyCool: {
      sl: 'Brič prideluje elegantne vina iz najboljših vinogradov Brda.',
      en: 'Brič produces elegant wines from the finest Brda vineyards.',
    },
  },
  {
    title: 'Burja',
    wineryCode: 'BURJ',
    description: {
      sl: 'Burja je slovenska vinogradniška hiša iz Vipavske doline.',
      en: 'Burja is a Slovenian wine house from the Vipava Valley.',
    },
    whyCool: {
      sl: 'Burja je znana po svojih naravnih vinih in minimalnih posegih.',
      en: 'Burja is known for its natural wines and minimal intervention.',
    },
  },
  {
    title: 'Butul',
    wineryCode: 'BUTU',
    description: {
      sl: 'Butul je slovenska vinogradniška hiša z dolgoletno tradicijo.',
      en: 'Butul is a Slovenian wine house with a long tradition.',
    },
    whyCool: {
      sl: 'Butul prideluje tradicionalne vina z osebnim pristopom.',
      en: 'Butul produces traditional wines with a personal approach.',
    },
  },
  {
    title: 'Cambria',
    wineryCode: 'CAMB',
    description: {
      sl: 'Cambria je ameriška vinogradniška hiša iz Kalifornije.',
      en: 'Cambria is an American wine house from California.',
    },
    whyCool: {
      sl: 'Cambria je znana po svojih Chardonnay in Pinot Noir vinih.',
      en: 'Cambria is known for its Chardonnay and Pinot Noir wines.',
    },
  },
  {
    title: 'Campo Di Sasso',
    wineryCode: 'CAMP',
    description: {
      sl: 'Campo Di Sasso je italijanska vinogradniška hiša iz Toskane.',
      en: 'Campo Di Sasso is an Italian wine house from Tuscany.',
    },
    whyCool: {
      sl: 'Campo Di Sasso prideluje moderne toskanske vina z tradicijo.',
      en: 'Campo Di Sasso produces modern Tuscan wines with tradition.',
    },
  },
  {
    title: 'Can Sumoi',
    wineryCode: 'CANS',
    description: {
      sl: 'Can Sumoi je španska vinogradniška hiša iz Katalonije.',
      en: 'Can Sumoi is a Spanish wine house from Catalonia.',
    },
    whyCool: {
      sl: 'Can Sumoi je znana po svojih peninih vinih in naravnih metodah.',
      en: 'Can Sumoi is known for its sparkling wines and natural methods.',
    },
  },
  {
    title: 'Castelfeder',
    wineryCode: 'CAST',
    description: {
      sl: 'Castelfeder je italijanska vinogradniška hiša iz Južne Tirolske.',
      en: 'Castelfeder is an Italian wine house from South Tyrol.',
    },
    whyCool: {
      sl: 'Castelfeder prideluje elegantne belo vino v alpskem okolju.',
      en: 'Castelfeder produces elegant white wines in an alpine environment.',
    },
  },
  {
    title: 'Charles Heidsieck',
    wineryCode: 'CHAR',
    description: {
      sl: 'Charles Heidsieck je francoska vinogradniška hiša, znana po šampanjcu.',
      en: 'Charles Heidsieck is a French wine house known for champagne.',
    },
    whyCool: {
      sl: 'Charles Heidsieck je ena najprestižnejših hiš za šampanjec v Franciji.',
      en: 'Charles Heidsieck is one of the most prestigious champagne houses in France.',
    },
  },
  {
    title: 'Chateau Des Jacques',
    wineryCode: 'CDJA',
    description: {
      sl: 'Chateau Des Jacques je francoska vinogradniška hiša iz Burgundije.',
      en: 'Chateau Des Jacques is a French wine house from Burgundy.',
    },
    whyCool: {
      sl: 'Chateau Des Jacques prideluje elegantne burgundske vina.',
      en: 'Chateau Des Jacques produces elegant Burgundy wines.',
    },
  },
  {
    title: 'Chateau Du Tertre',
    wineryCode: 'CDUT',
    description: {
      sl: 'Chateau Du Tertre je francoska vinogradniška hiša iz Bordeaux.',
      en: 'Chateau Du Tertre is a French wine house from Bordeaux.',
    },
    whyCool: {
      sl: 'Chateau Du Tertre je peti cru iz klasifikacije iz leta 1855.',
      en: 'Chateau Du Tertre is a fifth growth from the 1855 classification.',
    },
  },
  {
    title: 'Chateau Lassegue',
    wineryCode: 'CLAS',
    description: {
      sl: 'Chateau Lassegue je francoska vinogradniška hiša iz Bordeaux.',
      en: 'Chateau Lassegue is a French wine house from Bordeaux.',
    },
    whyCool: {
      sl: 'Chateau Lassegue prideluje elegantne bordojske vina.',
      en: 'Chateau Lassegue produces elegant Bordeaux wines.',
    },
  },
  {
    title: 'Chateau Le Pey',
    wineryCode: 'CLEP',
    description: {
      sl: 'Chateau Le Pey je francoska vinogradniška hiša iz Bordeaux.',
      en: 'Chateau Le Pey is a French wine house from Bordeaux.',
    },
    whyCool: {
      sl: 'Chateau Le Pey je znan po svojih elegantnih bordojskih vinih.',
      en: 'Chateau Le Pey is known for its elegant Bordeaux wines.',
    },
  },
  {
    title: "Chateau Patache D'Aux",
    wineryCode: 'CPDA',
    description: {
      sl: "Chateau Patache D'Aux je francoska vinogradniška hiša iz Bordeaux.",
      en: "Chateau Patache D'Aux is a French wine house from Bordeaux.",
    },
    whyCool: {
      sl: "Chateau Patache D'Aux prideluje tradicionalne bordojske vina.",
      en: "Chateau Patache D'Aux produces traditional Bordeaux wines.",
    },
  },

  // Slovenia - Primorska
  {
    title: 'Movia',
    wineryCode: 'MOVI',
    description: {
      sl: 'Movia je ena najprestižnejših slovenskih vinogradniških hiš z dolgoletno tradicijo in edinstvenim pristopom k vinarstvu.',
      en: 'Movia is one of the most prestigious Slovenian wine houses with a long tradition and unique approach to winemaking.',
    },
    whyCool: {
      sl: 'Movia je znana po svojih biodinamičnih metodah in edinstvenih vinih, ki odražajo terroir Brda regije.',
      en: 'Movia is known for its biodynamic methods and unique wines that reflect the terroir of the Brda region.',
    },
    social: {
      instagram: '@moviawines',
      website: 'https://www.movia.si',
    },
  },
  {
    title: 'Edi Simčič',
    wineryCode: 'EDIS',
    description: {
      sl: 'Edi Simčič je družinska vinogradniška hiša z dolgoletno tradicijo pridelave najboljših vin iz Goriških Brd.',
      en: 'Edi Simčič is a family wine house with a long tradition of producing the finest wines from Goriška Brda.',
    },
    whyCool: {
      sl: 'Edi Simčič je znan po svojih elegantnih in kompleksnih vinih, ki odražajo edinstvenost Brda terroirja.',
      en: 'Edi Simčič is known for its elegant and complex wines that reflect the uniqueness of the Brda terroir.',
    },
    social: {
      instagram: '@edisimcic',
      website: 'https://www.edisimcic.si',
    },
  },

  // Italy - Tuscany
  {
    title: 'Tenuta San Guido',
    wineryCode: 'SANG',
    description: {
      sl: 'Tenuta San Guido je dom Sassicaia, enega najboljših vin na svetu in pionirja Super Tuscans.',
      en: 'Tenuta San Guido is home to Sassicaia, one of the finest wines in the world and a pioneer of Super Tuscans.',
    },
    whyCool: {
      sl: 'Sassicaia je revolucioniralo italijansko vinarstvo in postavilo nove standarde za kakovost.',
      en: 'Sassicaia revolutionized Italian winemaking and set new standards for quality.',
    },
    social: {
      instagram: '@tenutaguido',
      website: 'https://www.tenutasanguido.com',
    },
  },

  // Italy - Piedmont
  {
    title: 'Gaja',
    wineryCode: 'GAJA',
    description: {
      sl: 'Gaja je ena najprestižnejših vinogradniških hiš v Piemontu, znana po svojih Barolo vinih.',
      en: 'Gaja is one of the most prestigious wine houses in Piedmont, known for its Barolo wines.',
    },
    whyCool: {
      sl: 'Gaja je revolucioniralo piemontsko vinarstvo z inovativnimi metodami in najvišjo kakovostjo.',
      en: 'Gaja revolutionized Piedmont winemaking with innovative methods and the highest quality.',
    },
    social: {
      instagram: '@gajawines',
      website: 'https://www.gaja.com',
    },
  },

  // Spain - Rioja
  {
    title: 'Bodegas Vega Sicilia',
    wineryCode: 'VEGA',
    description: {
      sl: 'Vega Sicilia je najprestižnejša španska vinogradniška hiša, znana po svojih dolgoletnih vinih.',
      en: 'Vega Sicilia is the most prestigious Spanish wine house, known for its long-aged wines.',
    },
    whyCool: {
      sl: 'Vega Sicilia je postavila standarde za španska vina z dolgoletnim starjenjem in najvišjo kakovostjo.',
      en: 'Vega Sicilia set the standards for Spanish wines with long aging and the highest quality.',
    },
    social: {
      instagram: '@vegasicilia',
      website: 'https://www.vega-sicilia.com',
    },
  },
]

async function seedWineries(): Promise<void> {
  try {
    const payload = await getPayload({ config: payloadConfig })

    logger.info('Starting wineries seeding...', { task: 'seed-wineries' })

    for (const wineryData of wineriesData) {
      try {
        // Check if winery already exists
        const existingWinery = await payload.find({
          collection: 'wineries',
          where: {
            title: {
              equals: wineryData.title,
            },
          },
        })

        if (existingWinery.docs.length > 0) {
          logger.info(`Winery ${wineryData.title} already exists, skipping...`, {
            task: 'seed-wineries',
            winery: wineryData.title,
          })
          continue
        }

        logger.info(`Creating winery: ${wineryData.title}`, {
          task: 'seed-wineries',
          winery: wineryData.title,
        })

        // Prepare payload
        const payloadData = {
          title: wineryData.title, // Title is not localized
          wineryCode: wineryData.wineryCode,
          description: wineryData.description?.sl || '',
          whyCool: wineryData.whyCool?.sl || '',
          social: wineryData.social ?? {},
        }
        console.log('Creating winery with payload:', payloadData)

        // Create the winery with Slovenian locale
        const createdWinery = await payload.create({
          collection: 'wineries',
          data: payloadData,
          locale: 'sl',
        })

        logger.info(`Created winery with Slovenian locale: ${createdWinery.title}`, {
          task: 'seed-wineries',
          winery: wineryData.title,
        })

        // Update with English locale for localized fields
        await payload.update({
          collection: 'wineries',
          id: createdWinery.id,
          data: {
            description: wineryData.description?.en || '',
            whyCool: wineryData.whyCool?.en || '',
          },
          locale: 'en',
        })

        logger.info(`Updated winery with English locale: ${createdWinery.title}`, {
          task: 'seed-wineries',
          winery: wineryData.title,
        })
      } catch (error) {
        logger.error(
          `Failed to create winery: ${wineryData.title} - ${(error as Error).message}\n${(error as Error).stack}`,
          error as Error,
          {
            task: 'seed-wineries',
            winery: wineryData.title,
          },
        )
        // Don't throw here, continue with next winery
      }
    }

    logger.info('Wineries seeding completed successfully', { task: 'seed-wineries' })
  } catch (error) {
    logger.error('Failed to seed wineries', error as Error, { task: 'seed-wineries' })
    throw error
  }
}

console.log('Starting wineries seeding script...')

// Always run the seeding function
seedWineries()
  .then(() => {
    logger.info('Seeding completed', { task: 'seed-wineries' })
    process.exit(0)
  })
  .catch((error) => {
    logger.error('Seeding failed', error as Error, { task: 'seed-wineries' })
    process.exit(1)
  })

// (async () => {
//   try {
//     console.log('Connecting to Payload...')
//     const payload = await getPayload({ config: payloadConfig })
//     console.log('Connected to Payload!')

//     // Minimal test: create one simple winery
//     const testWinery = {
//       title: 'Test Winery',
//       wineryCode: 'TEST',
//       description: 'Test description',
//       whyCool: 'Test whyCool',
//     }
//     console.log('Creating test winery...')
//     const created = await payload.create({
//       collection: 'wineries',
//       data: testWinery,
//       locale: 'sl',
//     })
//     console.log('Created test winery:', created)
//     process.exit(0)
//   } catch (err) {
//     console.error('Top-level error:', err)
//     process.exit(1)
//   }
// })()

export { seedWineries }
