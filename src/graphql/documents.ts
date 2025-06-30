// GraphQL Documents for use with graphql-request
// These are the actual GraphQL query strings with fragments inlined

// Fragment definitions
const FlatCollectionFieldsFragment = `
fragment FlatCollectionFields on FlatCollection {
  id
  originalID
  collectionType
  originalSlug
  title
  slug
  description
  titleEn
  slugEn
  descriptionEn
  whyCool
  whyCoolEn
  typicalStyle
  typicalStyleEn
  character
  characterEn
  iconKey
  wineryCode
  priceRange
  skin
  climate
  climateTemperature
  category
  colorGroup
  adjective { id title titleEn slug slugEn }
  flavour { id title titleEn slug slugEn category colorGroup }
  country { id title titleEn slug slugEn }
  climateData { id title titleEn slug slugEn }
  statistics { landArea wineriesCount }
  climateConditions { diurnalRange humidity }
  social { instagram website }
  synonyms { title titleEn }
  bestGrapes { id title titleEn slug slugEn }
  bestRegions { id title titleEn slug slugEn }
  legends { id title titleEn slug slugEn wineryCode }
  neighbours { id title titleEn slug slugEn }
  relatedWineries { id title titleEn slug slugEn wineryCode }
  distinctiveAromas { id title titleEn slug slugEn }
  blendingPartners { id title titleEn slug slugEn }
  similarVarieties { id title titleEn slug slugEn }
  tags { id title titleEn slug slugEn }
  media { id alt url thumbnailURL }
  seo { title titleEn description descriptionEn image }
  syncedAt
  isPublished
}
`

const FlatWineVariantFieldsFragment = `
fragment FlatWineVariantFields on FlatWineVariant {
  id
  slug
  sku
  wineID
  wineTitle
  wineryID
  wineryTitle
  wineryCode
  winerySlug
  regionID
  regionTitle
  regionSlug
  countryID
  countryTitle
  countrySlug
  styleID
  styleTitle
  styleIconKey
  styleSlug
  size
  vintage
  price
  stockOnHand
  canBackorder
  maxBackorderQuantity
  servingTemp
  decanting
  tastingProfile
  description
  descriptionEn
  primaryImageUrl
  isPublished
  syncedAt
  originalVariant { id slug }
  relatedWineries { id }
  relatedRegions { id }
  wineryTags {
    title
    titleEn
    id
    slug
    slugEn
  }
  tastingNotes {
    dry
    ripe
    creamy
    oaky
    complex
    light
    smooth
    youthful
    energetic
    alcohol
  }
  aromas { id title slug }
  tags { id title slug }
  moods { id title slug }
  grapeVarieties { id title slug percentage }
  climates { id title slug }
  dishes { id title slug }
}
`

const RelatedWineVariantFieldsFragment = `
fragment RelatedWineVariantFields on RelatedWineVariant {
  id
  variantId
  relatedCount
  lastComputed
  computationVersion
  relatedVariants {
    type
    score
    reason
    relatedVariant {
      ... on FlatWineVariant {
        id
        slug
        wineTitle
        vintage
        size
        price
        stockOnHand
        primaryImageUrl
        wineryTitle
        regionTitle
        countryTitle
        styleTitle
        styleIconKey
        styleSlug
        originalVariant { id slug }
      }
    }
  }
}
`

export const GetFlatCollectionDocument = `
${FlatCollectionFieldsFragment}

query GetFlatCollection($slug: String!, $locale: LocaleInputType!) {
  FlatCollections(where: { slug: { equals: $slug } }, limit: 1, locale: $locale) {
    docs {
      ...FlatCollectionFields
    }
  }
}
`

export const GetFlatCollectionsDocument = `
${FlatCollectionFieldsFragment}

query GetFlatCollections($collectionType: FlatCollection_collectionType_Input!, $locale: LocaleInputType!, $limit: Int = 18, $page: Int = 1) {
  FlatCollections(where: { collectionType: { equals: $collectionType } }, limit: $limit, page: $page, locale: $locale) {
    docs {
      ...FlatCollectionFields
    }
    totalDocs
    totalPages
    page
    hasNextPage
    hasPrevPage
  }
}
`

export const GetFlatWineVariantDocument = `
${FlatWineVariantFieldsFragment}

query GetFlatWineVariant($slug: String!, $locale: LocaleInputType!) {
  FlatWineVariants(where: { slug: { equals: $slug } }, limit: 1, locale: $locale) {
    docs {
      ...FlatWineVariantFields
    }
  }
}
`

export const GetFlatWineVariantsDocument = `
${FlatWineVariantFieldsFragment}

query GetFlatWineVariants($wineTitle: String!, $locale: LocaleInputType!) {
  FlatWineVariants(where: { wineTitle: { equals: $wineTitle } }, sort: "vintage", locale: $locale) {
    docs {
      ...FlatWineVariantFields
    }
  }
}
`

export const GetWineVariantDocument = `
query GetWineVariant($slug: String!, $locale: LocaleInputType!) {
  WineVariants(where: { slug: { equals: $slug } }, limit: 1, locale: $locale) {
    docs {
      id
      slug
      sku
      wine {
        id
        title
        slug
        description
        titleEn
        slugEn
        descriptionEn
        winery {
          id
          title
          slug
          titleEn
          slugEn
        }
        region {
          id
          title
          slug
          titleEn
          slugEn
        }
        country {
          id
          title
          slug
          titleEn
          slugEn
        }
        style {
          id
          title
          slug
          titleEn
          slugEn
        }
      }
      size
      vintage
      price
      stockOnHand
      canBackorder
      maxBackorderQuantity
      servingTemp
      decanting
      tastingProfile
      description
      descriptionEn
      primaryImage {
        id
        alt
        url
        thumbnailURL
      }
      isPublished
    }
  }
}
`

export const GetWineVariantsDocument = `
query GetWineVariants($wineTitle: String!, $locale: LocaleInputType!) {
  WineVariants(where: { wine: { title: { equals: $wineTitle } } }, sort: "vintage", locale: $locale) {
    docs {
      id
      slug
      sku
      wine {
        id
        title
        slug
        description
        titleEn
        slugEn
        descriptionEn
        winery {
          id
          title
          slug
          titleEn
          slugEn
        }
        region {
          id
          title
          slug
          titleEn
          slugEn
        }
        country {
          id
          title
          slug
          titleEn
          slugEn
        }
        style {
          id
          title
          slug
          titleEn
          slugEn
        }
      }
      size
      vintage
      price
      stockOnHand
      canBackorder
      maxBackorderQuantity
      servingTemp
      decanting
      tastingProfile
      description
      descriptionEn
      primaryImage {
        id
        alt
        url
        thumbnailURL
      }
      isPublished
    }
  }
}
`

export const WineDetailDocument = `
query WineDetail($slug: String!, $locale: LocaleInputType!) {
  WineVariants(where: { slug: { equals: $slug } }, limit: 1, locale: $locale) {
    docs {
      id
      slug
      sku
      wine {
        id
        title
        slug
        description
        titleEn
        slugEn
        descriptionEn
        winery {
          id
          title
          slug
          titleEn
          slugEn
        }
        region {
          id
          title
          slug
          titleEn
          slugEn
        }
        country {
          id
          title
          slug
          titleEn
          slugEn
        }
        style {
          id
          title
          slug
          titleEn
          slugEn
        }
      }
      size
      vintage
      price
      stockOnHand
      canBackorder
      maxBackorderQuantity
      servingTemp
      decanting
      tastingProfile
      description
      descriptionEn
      primaryImage {
        id
        alt
        url
        thumbnailURL
      }
      isPublished
    }
  }
}
`

export const GetRelatedWineVariantsDocument = `
${RelatedWineVariantFieldsFragment}

query GetRelatedWineVariants($variantId: String!, $locale: LocaleInputType!) {
  RelatedWineVariants(where: { variantId: { equals: $variantId } }, limit: 1, locale: $locale) {
    docs {
      ...RelatedWineVariantFields
    }
  }
}
`
