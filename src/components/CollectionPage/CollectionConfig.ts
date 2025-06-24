// Constants for common limits
const WINE_LIST_LIMIT = 18
const WINERY_LIST_LIMIT = 18
const REGION_LIST_LIMIT = 18
const WINE_COUNTRY_LIST_LIMIT = 18
const GRAPE_VARIETY_LIST_LIMIT = 18
const STYLE_LIST_LIMIT = 18
const AROMA_LIST_LIMIT = 18
const CLIMATE_LIST_LIMIT = 18
const MOOD_LIST_LIMIT = 18
const DISH_LIST_LIMIT = 18
const TAG_LIST_LIMIT = 18
const TASTING_LIST_LIMIT = 18
const GIFT_CARD_LIST_LIMIT = 18
const MERCH_LIST_LIMIT = 18
const POST_LIST_LIMIT = 18
const PAGE_LIST_LIMIT = 18

export interface FieldConfig {
  name: string
  type: 'text' | 'textarea' | 'relationship' | 'array' | 'select' | 'group' | 'media'
  label?: string
  labelKey?: string
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'wine.fields.description',
      },
      {
        name: 'winery',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wineries' },
        labelKey: 'wine.fields.winery',
      },
      {
        name: 'region',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
        labelKey: 'wine.fields.region',
      },
      {
        name: 'style',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'styles' },
        labelKey: 'wine.fields.style',
      },
      {
        name: 'variants',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'sku' },
        labelKey: 'wine.fields.variants',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'winery.fields.description',
      },
      { name: 'whyCool', type: 'textarea', showInDetail: true, labelKey: 'winery.fields.whyCool' },
      {
        name: 'tags',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title' },
        labelKey: 'winery.fields.tags',
      },
      { name: 'social', type: 'group', showInDetail: true, labelKey: 'winery.fields.social' },
      {
        name: 'relatedWineries',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wineries' },
        labelKey: 'winery.fields.relatedWineries',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'region.fields.description',
      },
      {
        name: 'country',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title' },
        labelKey: 'region.fields.country',
      },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
        labelKey: 'region.fields.wines',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'wineCountry.fields.description',
      },
      {
        name: 'whyCool',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'wineCountry.fields.whyCool',
      },
      {
        name: 'landArea',
        type: 'text',
        showInDetail: true,
        labelKey: 'wineCountry.fields.landArea',
      },
      {
        name: 'wineriesCount',
        type: 'text',
        showInDetail: true,
        labelKey: 'wineCountry.fields.wineriesCount',
      },
      {
        name: 'regions',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
        labelKey: 'wineCountry.fields.regions',
      },
      {
        name: 'bestRegions',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
        labelKey: 'wineCountry.fields.bestRegions',
      },
      {
        name: 'bestGrapes',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'grape-varieties' },
        labelKey: 'wineCountry.fields.bestGrapes',
      },
      {
        name: 'legends',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wineries' },
        labelKey: 'wineCountry.fields.legends',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'grapeVariety.fields.description',
      },
      {
        name: 'typicalStyle',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'grapeVariety.fields.typicalStyle',
      },
      {
        name: 'whyCool',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'grapeVariety.fields.whyCool',
      },
      {
        name: 'character',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'grapeVariety.fields.character',
      },
      { name: 'skin', type: 'select', showInDetail: true, labelKey: 'grapeVariety.fields.skin' },
      {
        name: 'synonyms',
        type: 'array',
        showInDetail: true,
        arrayConfig: { itemType: 'text', displayField: 'title' },
        labelKey: 'grapeVariety.fields.synonyms',
      },
      {
        name: 'distinctiveAromas',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'aromas' },
        labelKey: 'grapeVariety.fields.distinctiveAromas',
      },
      {
        name: 'bestRegions',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
        labelKey: 'grapeVariety.fields.bestRegions',
      },
      {
        name: 'blendingPartners',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'grape-varieties' },
        labelKey: 'grapeVariety.fields.blendingPartners',
      },
      {
        name: 'similarVarieties',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'grape-varieties' },
        labelKey: 'grapeVariety.fields.similarVarieties',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'style.fields.description',
      },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
        labelKey: 'style.fields.wines',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'aroma.fields.description',
      },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
        labelKey: 'aroma.fields.wines',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'climate.fields.description',
      },
      {
        name: 'regions',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
        labelKey: 'climate.fields.regions',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'mood.fields.description',
      },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
        labelKey: 'mood.fields.wines',
      },
    ],
  },

  dishes: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'dish.list.title',
    listDescription: 'dish.list.description',
    listLimit: DISH_LIST_LIMIT,
    sort: 'title',
    depth: 1,
    fields: [
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'dish.fields.description',
      },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
        labelKey: 'dish.fields.wines',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'tag.fields.description',
      },
      {
        name: 'wines',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wines' },
        labelKey: 'tag.fields.wines',
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'tasting.fields.description',
      },
      { name: 'date', type: 'text', showInDetail: true, labelKey: 'tasting.fields.date' },
      { name: 'location', type: 'text', showInDetail: true, labelKey: 'tasting.fields.location' },
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'giftCard.fields.description',
      },
      { name: 'value', type: 'text', showInDetail: true, labelKey: 'giftCard.fields.value' },
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
      {
        name: 'description',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'merch.fields.description',
      },
      { name: 'price', type: 'text', showInDetail: true, labelKey: 'merch.fields.price' },
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
      { name: 'excerpt', type: 'textarea', showInDetail: true, labelKey: 'post.fields.excerpt' },
      { name: 'content', type: 'textarea', showInDetail: true, labelKey: 'post.fields.content' },
      {
        name: 'author',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'name' },
        labelKey: 'post.fields.author',
      },
      {
        name: 'categories',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title' },
        labelKey: 'post.fields.categories',
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
      { name: 'excerpt', type: 'textarea', showInDetail: true, labelKey: 'page.fields.excerpt' },
      { name: 'content', type: 'textarea', showInDetail: true, labelKey: 'page.fields.content' },
    ],
  },
}
