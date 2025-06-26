import { COLLECTION_CONSTANTS } from '@/constants/collections'

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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.WINE,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.WINERY,
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
        relationshipConfig: { displayField: 'title', linkTo: 'tags' },
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.REGION,
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
        name: 'climate',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'climates' },
        labelKey: 'region.fields.climate',
      },
      {
        name: 'whyCool',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'region.fields.whyCool',
      },
      {
        name: 'country',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wineCountries' },
        labelKey: 'region.fields.country',
      },
      {
        name: 'neighbours',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
        labelKey: 'region.fields.neighbours',
      },
      {
        name: 'bestGrapes',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'grape-varieties' },
        labelKey: 'region.fields.bestGrapes',
      },
      {
        name: 'legends',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'wineries' },
        labelKey: 'region.fields.legends',
      },
      {
        name: 'priceRange',
        type: 'select',
        showInDetail: true,
        labelKey: 'region.fields.priceRange',
      },
    ],
  },

  wineCountries: {
    titleField: 'title',
    descriptionField: 'description',
    mediaField: 'media',
    listTitle: 'wineCountry.list.title',
    listDescription: 'wineCountry.list.description',
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.WINE_COUNTRY,
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
        name: 'statistics',
        type: 'group',
        showInDetail: true,
        labelKey: 'wineCountry.fields.statistics',
      },
      {
        name: 'whyCool',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'wineCountry.fields.whyCool',
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.GRAPE_VARIETY,
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
        name: 'character',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'grapeVariety.fields.character',
      },
      {
        name: 'whyCool',
        type: 'textarea',
        showInDetail: true,
        labelKey: 'grapeVariety.fields.whyCool',
      },
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.STYLE,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.AROMA,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.CLIMATE,
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
        name: 'climateConditions',
        type: 'group',
        showInDetail: true,
        labelKey: 'climate.fields.climateConditions',
      },
      {
        name: 'bestRegions',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'regions' },
        labelKey: 'climate.fields.bestRegions',
      },
      {
        name: 'bestGrapes',
        type: 'relationship',
        showInDetail: true,
        relationshipConfig: { displayField: 'title', linkTo: 'grape-varieties' },
        labelKey: 'climate.fields.bestGrapes',
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.MOOD,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.DISH,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.TAG,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.TASTING,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.GIFT_CARD,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.MERCH,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.POST,
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
    listLimit: COLLECTION_CONSTANTS.LIST_LIMITS.PAGE,
    sort: 'title',
    depth: 1,
    fields: [
      { name: 'excerpt', type: 'textarea', showInDetail: true, labelKey: 'page.fields.excerpt' },
      { name: 'content', type: 'textarea', showInDetail: true, labelKey: 'page.fields.content' },
    ],
  },
}
