import 'dotenv/config'
import { getPayload } from 'payload'
import { logger } from '../../src/lib/logger'
import payloadConfig from '../../src/payload.config'

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
  {
    title: 'Chardonnay',
    description: {
      sl: 'Opis za Chardonnay (SL).',
      en: 'Description for Chardonnay (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Chardonnay (SL).',
      en: 'Typical style for Chardonnay (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Chardonnay kul (SL).',
      en: 'Why Chardonnay is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Chardonnay (SL).',
      en: 'Character of Chardonnay (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Secret Blend',
    description: {
      sl: 'Opis za Secret Blend (SL).',
      en: 'Description for Secret Blend (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Secret Blend (SL).',
      en: 'Typical style for Secret Blend (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Secret Blend kul (SL).',
      en: 'Why Secret Blend is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Secret Blend (SL).',
      en: 'Character of Secret Blend (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Carricante',
    description: {
      sl: 'Opis za Carricante (SL).',
      en: 'Description for Carricante (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Carricante (SL).',
      en: 'Typical style for Carricante (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Carricante kul (SL).',
      en: 'Why Carricante is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Carricante (SL).',
      en: 'Character of Carricante (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Ribolla Gialla',
    description: {
      sl: 'Opis za Ribolla Gialla (SL).',
      en: 'Description for Ribolla Gialla (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Ribolla Gialla (SL).',
      en: 'Typical style for Ribolla Gialla (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Ribolla Gialla kul (SL).',
      en: 'Why Ribolla Gialla is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Ribolla Gialla (SL).',
      en: 'Character of Ribolla Gialla (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Friulano',
    description: {
      sl: 'Opis za Friulano (SL).',
      en: 'Description for Friulano (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Friulano (SL).',
      en: 'Typical style for Friulano (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Friulano kul (SL).',
      en: 'Why Friulano is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Friulano (SL).',
      en: 'Character of Friulano (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Malvasia',
    description: {
      sl: 'Opis za Malvasia (SL).',
      en: 'Description for Malvasia (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Malvasia (SL).',
      en: 'Typical style for Malvasia (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Malvasia kul (SL).',
      en: 'Why Malvasia is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Malvasia (SL).',
      en: 'Character of Malvasia (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Welschriesling',
    description: {
      sl: 'Opis za Welschriesling (SL).',
      en: 'Description for Welschriesling (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Welschriesling (SL).',
      en: 'Typical style for Welschriesling (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Welschriesling kul (SL).',
      en: 'Why Welschriesling is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Welschriesling (SL).',
      en: 'Character of Welschriesling (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Sauvignon Blanc',
    description: {
      sl: 'Opis za Sauvignon Blanc (SL).',
      en: 'Description for Sauvignon Blanc (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Sauvignon Blanc (SL).',
      en: 'Typical style for Sauvignon Blanc (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Sauvignon Blanc kul (SL).',
      en: 'Why Sauvignon Blanc is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Sauvignon Blanc (SL).',
      en: 'Character of Sauvignon Blanc (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Riesling',
    description: {
      sl: 'Opis za Riesling (SL).',
      en: 'Description for Riesling (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Riesling (SL).',
      en: 'Typical style for Riesling (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Riesling kul (SL).',
      en: 'Why Riesling is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Riesling (SL).',
      en: 'Character of Riesling (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Vitovska Grganja',
    description: {
      sl: 'Opis za Vitovska Grganja (SL).',
      en: 'Description for Vitovska Grganja (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Vitovska Grganja (SL).',
      en: 'Typical style for Vitovska Grganja (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Vitovska Grganja kul (SL).',
      en: 'Why Vitovska Grganja is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Vitovska Grganja (SL).',
      en: 'Character of Vitovska Grganja (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Furmint',
    description: {
      sl: 'Opis za Furmint (SL).',
      en: 'Description for Furmint (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Furmint (SL).',
      en: 'Typical style for Furmint (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Furmint kul (SL).',
      en: 'Why Furmint is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Furmint (SL).',
      en: 'Character of Furmint (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Picolit',
    description: {
      sl: 'Opis za Picolit (SL).',
      en: 'Description for Picolit (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Picolit (SL).',
      en: 'Typical style for Picolit (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Picolit kul (SL).',
      en: 'Why Picolit is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Picolit (SL).',
      en: 'Character of Picolit (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Cortese',
    description: {
      sl: 'Opis za Cortese (SL).',
      en: 'Description for Cortese (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Cortese (SL).',
      en: 'Typical style for Cortese (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Cortese kul (SL).',
      en: 'Why Cortese is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Cortese (SL).',
      en: 'Character of Cortese (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Arneis',
    description: {
      sl: 'Opis za Arneis (SL).',
      en: 'Description for Arneis (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Arneis (SL).',
      en: 'Typical style for Arneis (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Arneis kul (SL).',
      en: 'Why Arneis is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Arneis (SL).',
      en: 'Character of Arneis (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Pinot Blanc',
    description: {
      sl: 'Opis za Pinot Blanc (SL).',
      en: 'Description for Pinot Blanc (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Pinot Blanc (SL).',
      en: 'Typical style for Pinot Blanc (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Pinot Blanc kul (SL).',
      en: 'Why Pinot Blanc is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Pinot Blanc (SL).',
      en: 'Character of Pinot Blanc (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Garganega',
    description: {
      sl: 'Opis za Garganega (SL).',
      en: 'Description for Garganega (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Garganega (SL).',
      en: 'Typical style for Garganega (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Garganega kul (SL).',
      en: 'Why Garganega is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Garganega (SL).',
      en: 'Character of Garganega (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Vermentino',
    description: {
      sl: 'Opis za Vermentino (SL).',
      en: 'Description for Vermentino (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Vermentino (SL).',
      en: 'Typical style for Vermentino (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Vermentino kul (SL).',
      en: 'Why Vermentino is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Vermentino (SL).',
      en: 'Character of Vermentino (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Pinot Noir',
    description: {
      sl: 'Opis za Pinot Noir (SL).',
      en: 'Description for Pinot Noir (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Pinot Noir (SL).',
      en: 'Typical style for Pinot Noir (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Pinot Noir kul (SL).',
      en: 'Why Pinot Noir is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Pinot Noir (SL).',
      en: 'Character of Pinot Noir (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Pinot Meunier',
    description: {
      sl: 'Opis za Pinot Meunier (SL).',
      en: 'Description for Pinot Meunier (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Pinot Meunier (SL).',
      en: 'Typical style for Pinot Meunier (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Pinot Meunier kul (SL).',
      en: 'Why Pinot Meunier is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Pinot Meunier (SL).',
      en: 'Character of Pinot Meunier (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Glera',
    description: {
      sl: 'Opis za Glera (SL).',
      en: 'Description for Glera (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Glera (SL).',
      en: 'Typical style for Glera (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Glera kul (SL).',
      en: 'Why Glera is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Glera (SL).',
      en: 'Character of Glera (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Cabernet Sauvignon',
    description: {
      sl: 'Opis za Cabernet Sauvignon (SL).',
      en: 'Description for Cabernet Sauvignon (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Cabernet Sauvignon (SL).',
      en: 'Typical style for Cabernet Sauvignon (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Cabernet Sauvignon kul (SL).',
      en: 'Why Cabernet Sauvignon is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Cabernet Sauvignon (SL).',
      en: 'Character of Cabernet Sauvignon (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Cabernet Franc',
    description: {
      sl: 'Opis za Cabernet Franc (SL).',
      en: 'Description for Cabernet Franc (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Cabernet Franc (SL).',
      en: 'Typical style for Cabernet Franc (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Cabernet Franc kul (SL).',
      en: 'Why Cabernet Franc is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Cabernet Franc (SL).',
      en: 'Character of Cabernet Franc (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Merlot',
    description: {
      sl: 'Opis za Merlot (SL).',
      en: 'Description for Merlot (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Merlot (SL).',
      en: 'Typical style for Merlot (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Merlot kul (SL).',
      en: 'Why Merlot is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Merlot (SL).',
      en: 'Character of Merlot (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Petit Verdot',
    description: {
      sl: 'Opis za Petit Verdot (SL).',
      en: 'Description for Petit Verdot (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Petit Verdot (SL).',
      en: 'Typical style for Petit Verdot (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Petit Verdot kul (SL).',
      en: 'Why Petit Verdot is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Petit Verdot (SL).',
      en: 'Character of Petit Verdot (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Tempranillo',
    description: {
      sl: 'Opis za Tempranillo (SL).',
      en: 'Description for Tempranillo (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Tempranillo (SL).',
      en: 'Typical style for Tempranillo (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Tempranillo kul (SL).',
      en: 'Why Tempranillo is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Tempranillo (SL).',
      en: 'Character of Tempranillo (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Mourvedre',
    description: {
      sl: 'Opis za Mourvedre (SL).',
      en: 'Description for Mourvedre (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Mourvedre (SL).',
      en: 'Typical style for Mourvedre (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Mourvedre kul (SL).',
      en: 'Why Mourvedre is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Mourvedre (SL).',
      en: 'Character of Mourvedre (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Grenache',
    description: {
      sl: 'Opis za Grenache (SL).',
      en: 'Description for Grenache (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Grenache (SL).',
      en: 'Typical style for Grenache (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Grenache kul (SL).',
      en: 'Why Grenache is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Grenache (SL).',
      en: 'Character of Grenache (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Syrah',
    description: {
      sl: 'Opis za Syrah (SL).',
      en: 'Description for Syrah (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Syrah (SL).',
      en: 'Typical style for Syrah (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Syrah kul (SL).',
      en: 'Why Syrah is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Syrah (SL).',
      en: 'Character of Syrah (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Cinsault',
    description: {
      sl: 'Opis za Cinsault (SL).',
      en: 'Description for Cinsault (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Cinsault (SL).',
      en: 'Typical style for Cinsault (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Cinsault kul (SL).',
      en: 'Why Cinsault is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Cinsault (SL).',
      en: 'Character of Cinsault (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Sangiovese',
    description: {
      sl: 'Opis za Sangiovese (SL).',
      en: 'Description for Sangiovese (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Sangiovese (SL).',
      en: 'Typical style for Sangiovese (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Sangiovese kul (SL).',
      en: 'Why Sangiovese is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Sangiovese (SL).',
      en: 'Character of Sangiovese (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Nebbiolo',
    description: {
      sl: 'Opis za Nebbiolo (SL).',
      en: 'Description for Nebbiolo (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Nebbiolo (SL).',
      en: 'Typical style for Nebbiolo (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Nebbiolo kul (SL).',
      en: 'Why Nebbiolo is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Nebbiolo (SL).',
      en: 'Character of Nebbiolo (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Barbera',
    description: {
      sl: 'Opis za Barbera (SL).',
      en: 'Description for Barbera (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Barbera (SL).',
      en: 'Typical style for Barbera (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Barbera kul (SL).',
      en: 'Why Barbera is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Barbera (SL).',
      en: 'Character of Barbera (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Refosco',
    description: {
      sl: 'Opis za Refosco (SL).',
      en: 'Description for Refosco (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Refosco (SL).',
      en: 'Typical style for Refosco (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Refosco kul (SL).',
      en: 'Why Refosco is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Refosco (SL).',
      en: 'Character of Refosco (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Schioppettino',
    description: {
      sl: 'Opis za Schioppettino (SL).',
      en: 'Description for Schioppettino (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Schioppettino (SL).',
      en: 'Typical style for Schioppettino (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Schioppettino kul (SL).',
      en: 'Why Schioppettino is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Schioppettino (SL).',
      en: 'Character of Schioppettino (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Blaufrankisch',
    description: {
      sl: 'Opis za Blaufrankisch (SL).',
      en: 'Description for Blaufrankisch (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Blaufrankisch (SL).',
      en: 'Typical style for Blaufrankisch (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Blaufrankisch kul (SL).',
      en: 'Why Blaufrankisch is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Blaufrankisch (SL).',
      en: 'Character of Blaufrankisch (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Marsanne',
    description: {
      sl: 'Opis za Marsanne (SL).',
      en: 'Description for Marsanne (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Marsanne (SL).',
      en: 'Typical style for Marsanne (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Marsanne kul (SL).',
      en: 'Why Marsanne is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Marsanne (SL).',
      en: 'Character of Marsanne (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Rousanne',
    description: {
      sl: 'Opis za Rousanne (SL).',
      en: 'Description for Rousanne (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Rousanne (SL).',
      en: 'Typical style for Rousanne (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Rousanne kul (SL).',
      en: 'Why Rousanne is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Rousanne (SL).',
      en: 'Character of Rousanne (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Gewurztraminer',
    description: {
      sl: 'Opis za Gewurztraminer (SL).',
      en: 'Description for Gewurztraminer (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Gewurztraminer (SL).',
      en: 'Typical style for Gewurztraminer (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Gewurztraminer kul (SL).',
      en: 'Why Gewurztraminer is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Gewurztraminer (SL).',
      en: 'Character of Gewurztraminer (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Žametna Črnina',
    description: {
      sl: 'Opis za Žametna Črnina (SL).',
      en: 'Description for Žametna Črnina (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Žametna Črnina (SL).',
      en: 'Typical style for Žametna Črnina (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Žametna Črnina kul (SL).',
      en: 'Why Žametna Črnina is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Žametna Črnina (SL).',
      en: 'Character of Žametna Črnina (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Kraljevina',
    description: {
      sl: 'Opis za Kraljevina (SL).',
      en: 'Description for Kraljevina (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Kraljevina (SL).',
      en: 'Typical style for Kraljevina (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Kraljevina kul (SL).',
      en: 'Why Kraljevina is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Kraljevina (SL).',
      en: 'Character of Kraljevina (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Gruner Veltliner',
    description: {
      sl: 'Opis za Gruner Veltliner (SL).',
      en: 'Description for Gruner Veltliner (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Gruner Veltliner (SL).',
      en: 'Typical style for Gruner Veltliner (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Gruner Veltliner kul (SL).',
      en: 'Why Gruner Veltliner is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Gruner Veltliner (SL).',
      en: 'Character of Gruner Veltliner (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Pinot Gris',
    description: {
      sl: 'Opis za Pinot Gris (SL).',
      en: 'Description for Pinot Gris (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Pinot Gris (SL).',
      en: 'Typical style for Pinot Gris (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Pinot Gris kul (SL).',
      en: 'Why Pinot Gris is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Pinot Gris (SL).',
      en: 'Character of Pinot Gris (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Aligote',
    description: {
      sl: 'Opis za Aligote (SL).',
      en: 'Description for Aligote (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Aligote (SL).',
      en: 'Typical style for Aligote (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Aligote kul (SL).',
      en: 'Why Aligote is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Aligote (SL).',
      en: 'Character of Aligote (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Zelen',
    description: {
      sl: 'Opis za Zelen (SL).',
      en: 'Description for Zelen (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Zelen (SL).',
      en: 'Typical style for Zelen (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Zelen kul (SL).',
      en: 'Why Zelen is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Zelen (SL).',
      en: 'Character of Zelen (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Muscat of Alexandria',
    description: {
      sl: 'Opis za Muscat of Alexandria (SL).',
      en: 'Description for Muscat of Alexandria (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Muscat of Alexandria (SL).',
      en: 'Typical style for Muscat of Alexandria (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Muscat of Alexandria kul (SL).',
      en: 'Why Muscat of Alexandria is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Muscat of Alexandria (SL).',
      en: 'Character of Muscat of Alexandria (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Cipro',
    description: {
      sl: 'Opis za Cipro (SL).',
      en: 'Description for Cipro (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Cipro (SL).',
      en: 'Typical style for Cipro (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Cipro kul (SL).',
      en: 'Why Cipro is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Cipro (SL).',
      en: 'Character of Cipro (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Corvina',
    description: {
      sl: 'Opis za Corvina (SL).',
      en: 'Description for Corvina (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Corvina (SL).',
      en: 'Typical style for Corvina (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Corvina kul (SL).',
      en: 'Why Corvina is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Corvina (SL).',
      en: 'Character of Corvina (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Croatina',
    description: {
      sl: 'Opis za Croatina (SL).',
      en: 'Description for Croatina (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Croatina (SL).',
      en: 'Typical style for Croatina (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Croatina kul (SL).',
      en: 'Why Croatina is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Croatina (SL).',
      en: 'Character of Croatina (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Gamay',
    description: {
      sl: 'Opis za Gamay (SL).',
      en: 'Description for Gamay (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Gamay (SL).',
      en: 'Typical style for Gamay (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Gamay kul (SL).',
      en: 'Why Gamay is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Gamay (SL).',
      en: 'Character of Gamay (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Klarnica',
    description: {
      sl: 'Opis za Klarnica (SL).',
      en: 'Description for Klarnica (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Klarnica (SL).',
      en: 'Typical style for Klarnica (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Klarnica kul (SL).',
      en: 'Why Klarnica is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Klarnica (SL).',
      en: 'Character of Klarnica (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Malbec',
    description: {
      sl: 'Opis za Malbec (SL).',
      en: 'Description for Malbec (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Malbec (SL).',
      en: 'Typical style for Malbec (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Malbec kul (SL).',
      en: 'Why Malbec is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Malbec (SL).',
      en: 'Character of Malbec (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Marselan',
    description: {
      sl: 'Opis za Marselan (SL).',
      en: 'Description for Marselan (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Marselan (SL).',
      en: 'Typical style for Marselan (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Marselan kul (SL).',
      en: 'Why Marselan is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Marselan (SL).',
      en: 'Character of Marselan (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Molinara',
    description: {
      sl: 'Opis za Molinara (SL).',
      en: 'Description for Molinara (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Molinara (SL).',
      en: 'Typical style for Molinara (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Molinara kul (SL).',
      en: 'Why Molinara is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Molinara (SL).',
      en: 'Character of Molinara (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Moscato Giallo',
    description: {
      sl: 'Opis za Moscato Giallo (SL).',
      en: 'Description for Moscato Giallo (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Moscato Giallo (SL).',
      en: 'Typical style for Moscato Giallo (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Moscato Giallo kul (SL).',
      en: 'Why Moscato Giallo is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Moscato Giallo (SL).',
      en: 'Character of Moscato Giallo (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Nerello Mascalese',
    description: {
      sl: 'Opis za Nerello Mascalese (SL).',
      en: 'Description for Nerello Mascalese (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Nerello Mascalese (SL).',
      en: 'Typical style for Nerello Mascalese (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Nerello Mascalese kul (SL).',
      en: 'Why Nerello Mascalese is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Nerello Mascalese (SL).',
      en: 'Character of Nerello Mascalese (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Parellada',
    description: {
      sl: 'Opis za Parellada (SL).',
      en: 'Description for Parellada (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Parellada (SL).',
      en: 'Typical style for Parellada (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Parellada kul (SL).',
      en: 'Why Parellada is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Parellada (SL).',
      en: 'Character of Parellada (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Pinela',
    description: {
      sl: 'Opis za Pinela (SL).',
      en: 'Description for Pinela (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Pinela (SL).',
      en: 'Typical style for Pinela (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Pinela kul (SL).',
      en: 'Why Pinela is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Pinela (SL).',
      en: 'Character of Pinela (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Rondinella',
    description: {
      sl: 'Opis za Rondinella (SL).',
      en: 'Description for Rondinella (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Rondinella (SL).',
      en: 'Typical style for Rondinella (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Rondinella kul (SL).',
      en: 'Why Rondinella is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Rondinella (SL).',
      en: 'Character of Rondinella (EN).',
    },
    skin: 'red',
    synonyms: [],
  },
  {
    title: 'Sumol',
    description: {
      sl: 'Opis za Sumol (SL).',
      en: 'Description for Sumol (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Sumol (SL).',
      en: 'Typical style for Sumol (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Sumol kul (SL).',
      en: 'Why Sumol is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Sumol (SL).',
      en: 'Character of Sumol (EN).',
    },
    skin: 'white',
    synonyms: [],
  },
  {
    title: 'Xarel-lo',
    description: {
      sl: 'Opis za Xarel-lo (SL).',
      en: 'Description for Xarel-lo (EN).',
    },
    typicalStyle: {
      sl: 'Tipičen stil za Xarel-lo (SL).',
      en: 'Typical style for Xarel-lo (EN).',
    },
    whyCool: {
      sl: 'Zakaj je Xarel-lo kul (SL).',
      en: 'Why Xarel-lo is cool (EN).',
    },
    character: {
      sl: 'Značilnosti Xarel-lo (SL).',
      en: 'Character of Xarel-lo (EN).',
    },
    skin: 'white',
    synonyms: [],
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
