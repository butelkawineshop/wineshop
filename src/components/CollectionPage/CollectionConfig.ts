// Constants for common limits
const WINE_LIST_LIMIT = 24
const WINERY_LIST_LIMIT = 20
const REGION_LIST_LIMIT = 20
const WINE_COUNTRY_LIST_LIMIT = 20
const GRAPE_VARIETY_LIST_LIMIT = 30
const STYLE_LIST_LIMIT = 20
const AROMA_LIST_LIMIT = 30
const CLIMATE_LIST_LIMIT = 20
const MOOD_LIST_LIMIT = 20
const FOOD_LIST_LIMIT = 30
const TAG_LIST_LIMIT = 20
const TASTING_LIST_LIMIT = 10
const GIFT_CARD_LIST_LIMIT = 10
const MERCH_LIST_LIMIT = 20
const POST_LIST_LIMIT = 12
const PAGE_LIST_LIMIT = 20

export interface FieldConfig {
  name: string
  type: 'text' | 'textarea' | 'relationship' | 'array' | 'select' | 'group' | 'media'
  label?: string
  renderAs?: 'card' | 'list' | 'grid' | 'table'
  showInList?: boolean
  showInDetail?: boolean
  maxLength?: number
  relationshipConfig?: {
    displayField: string
    linkTo?: string
  }
  arrayConfig?: {
    itemType: 'text' | 'relationship'
    displayField?: string
  }
}

export interface CollectionDisplayConfig {
  titleField: string
  subtitleField?: string
  descriptionField?: string
  mediaField?: string
  listTitle: string // i18n key
  listDescription: string // i18n key
  listLimit?: number
  sort?: string
  depth?: number
  fields: FieldConfig[]
}

export const CollectionConfig: Record<string, CollectionDisplayConfig> = {
  wines: {
    titleField: 'title',
    subtitleField: 'winery.title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'wine.list.title',
    listDescription: 'wine.list.description',
    listLimit: WINE_LIST_LIMIT,
    sort: '-createdAt',
    depth: 2,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      {
        name: 'winery',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wineries' },
      },
      {
        name: 'region',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
      },
      {
        name: 'style',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'styles' },
      },
      {
        name: 'variants',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'sku' },
      },
    ],
  },

  wineries: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'winery.list.title',
    listDescription: 'winery.list.description',
    listLimit: WINERY_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      { name: 'whyCool', type: 'textarea', showInDetail: true },
      { name: 'wineryCode', type: 'text', showInDetail: true },
      {
        name: 'tags',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title' },
      },
      { name: 'social', type: 'group', showInDetail: true },
      {
        name: 'relatedWineries',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wineries' },
      },
    ],
  },

  regions: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'region.list.title',
    listDescription: 'region.list.description',
    listLimit: REGION_LIST_LIMIT,
    sort: 'title',
    depth: 2,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      {
        name: 'country',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title' },
      },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
      },
    ],
  },

  wineCountries: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'wineCountry.list.title',
    listDescription: 'wineCountry.list.description',
    listLimit: WINE_COUNTRY_LIST_LIMIT,
    sort: 'title',
    depth: 2,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      { name: 'whyCool', type: 'textarea', showInDetail: true },
      { name: 'landArea', type: 'text', showInDetail: true },
      { name: 'wineriesCount', type: 'text', showInDetail: true },
      {
        name: 'regions',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
      },
      {
        name: 'bestRegions',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
      },
      {
        name: 'bestGrapes',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'grape-varieties' },
      },
      {
        name: 'legends',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wineries' },
      },
    ],
  },

  'grape-varieties': {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'grapeVariety.list.title',
    listDescription: 'grapeVariety.list.description',
    listLimit: GRAPE_VARIETY_LIST_LIMIT,
    sort: 'title',
    depth: 2,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      { name: 'typicalStyle', type: 'textarea', showInDetail: true },
      { name: 'whyCool', type: 'textarea', showInDetail: true },
      { name: 'character', type: 'textarea', showInDetail: true },
      { name: 'skin', type: 'select', showInDetail: true },
      {
        name: 'synonyms',
        type: 'array',
        showInDetail: true,
        arrayConfig: { itemType: 'text', displayField: 'title' },
      },
      {
        name: 'distinctiveAromas',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'aromas' },
      },
      {
        name: 'bestRegions',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
      },
      {
        name: 'blendingPartners',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'grape-varieties' },
      },
      {
        name: 'similarVarieties',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'grape-varieties' },
      },
    ],
  },

  styles: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'style.list.title',
    listDescription: 'style.list.description',
    listLimit: STYLE_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
      },
    ],
  },

  aromas: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'aroma.list.title',
    listDescription: 'aroma.list.description',
    listLimit: AROMA_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
      },
    ],
  },

  climates: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'climate.list.title',
    listDescription: 'climate.list.description',
    listLimit: CLIMATE_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      {
        name: 'regions',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
      },
    ],
  },

  moods: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'mood.list.title',
    listDescription: 'mood.list.description',
    listLimit: MOOD_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
      },
    ],
  },

  foods: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'food.list.title',
    listDescription: 'food.list.description',
    listLimit: FOOD_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
      },
    ],
  },

  tags: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'tag.list.title',
    listDescription: 'tag.list.description',
    listLimit: TAG_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
      },
    ],
  },

  tastings: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'tasting.list.title',
    listDescription: 'tasting.list.description',
    listLimit: TASTING_LIST_LIMIT,
    sort: '-date',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      { name: 'date', type: 'text', showInDetail: true },
      { name: 'location', type: 'text', showInDetail: true },
    ],
  },

  'gift-cards': {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'giftCard.list.title',
    listDescription: 'giftCard.list.description',
    listLimit: GIFT_CARD_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      { name: 'value', type: 'text', showInDetail: true },
    ],
  },

  merch: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'merch.list.title',
    listDescription: 'merch.list.description',
    listLimit: MERCH_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'description', type: 'textarea', showInDetail: true },
      { name: 'price', type: 'text', showInDetail: true },
    ],
  },

  posts: {
    titleField: 'title',
    descriptionField: 'excerpt',
    mediaField: 'featuredImage',
    listTitle: 'post.list.title',
    listDescription: 'post.list.description',
    listLimit: POST_LIST_LIMIT,
    sort: '-publishedAt',
    depth: 1,
    fields: [
      { name: 'excerpt', type: 'textarea', showInDetail: true },
      { name: 'content', type: 'textarea', showInDetail: true },
      {
        name: 'author',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'name' },
      },
      {
        name: 'categories',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title' },
      },
    ],
  },

  pages: {
    titleField: 'title',
    descriptionField: 'excerpt',
    mediaField: 'featuredImage',
    listTitle: 'page.list.title',
    listDescription: 'page.list.description',
    listLimit: PAGE_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'excerpt', type: 'textarea', showInDetail: true },
      { name: 'content', type: 'textarea', showInDetail: true },
    ],
  },
}
