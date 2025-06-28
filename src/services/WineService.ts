import { db } from '../lib/db'

export interface FlatWineVariant {
  id: string
  originalVariant: number
  wineID: string
  wineryID: string
  regionID: string
  countryID: string
  styleID: string
  sku: string
  wineTitle: string
  wineryTitle: string
  wineryCode: string
  regionTitle: string
  countryTitle: string
  countryTitleEn: string
  styleTitle: string
  styleTitleEn: string
  styleIconKey: string
  styleSlug: string
  size: string
  vintage: string
  price: number
  stockOnHand: number
  canBackorder: boolean
  maxBackorderQuantity: number
  servingTemp: string
  decanting: boolean
  tastingProfile: string
  description: string
  descriptionEn: string
  tastingNotesDry: number
  tastingNotesRipe: number
  tastingNotesCreamy: number
  tastingNotesOaky: number
  tastingNotesComplex: number
  tastingNotesLight: number
  tastingNotesSmooth: number
  tastingNotesYouthful: number
  tastingNotesEnergetic: number
  tastingNotesAlcohol: number
  primaryImageUrl: string
  slug: string
  syncedAt: string
  isPublished: boolean
  updatedAt: string
  createdAt: string
  _status: string
}

export interface RelatedWineGroup {
  type: string
  title: string
  variants: FlatWineVariant[]
}

export class WineService {
  /**
   * Convert snake_case database fields to camelCase
   */
  private static mapSnakeToCamel(obj: any): any {
    const mapped: any = {}
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      mapped[camelKey] = value
    }
    return mapped
  }

  /**
   * Get flat wine variants for a specific wine
   */
  static async getFlatWineVariants(wineId: string): Promise<FlatWineVariant[]> {
    const query = `
      SELECT id, original_variant_id, wine_i_d, winery_i_d, region_i_d, country_i_d, style_i_d,
        sku, wine_title, winery_title, winery_code, region_title, country_title, country_title_en,
        style_title, style_title_en, style_icon_key, style_slug, size, vintage, price, stock_on_hand,
        can_backorder, max_backorder_quantity, serving_temp, decanting, tasting_profile,
        description, description_en, tasting_notes_dry, tasting_notes_ripe, tasting_notes_creamy,
        tasting_notes_oaky, tasting_notes_complex, tasting_notes_light, tasting_notes_smooth,
        tasting_notes_youthful, tasting_notes_energetic, tasting_notes_alcohol,
        primary_image_url, slug, is_published, _status
      FROM flat_wine_variants 
      WHERE wine_i_d = $1 AND is_published = true
      ORDER BY vintage DESC
    `

    const result = await db.query(query, [wineId])
    return result.rows.map((row) => this.mapSnakeToCamel(row))
  }

  /**
   * Get related wine variants for a specific wine, grouped by type
   */
  static async getRelatedWineVariants(wineId: string): Promise<RelatedWineGroup[]> {
    const query = `
      WITH wine_variants AS (
        SELECT id FROM flat_wine_variants WHERE wine_i_d = $1 AND is_published = true
      )
      SELECT 
        fwv.id, fwv.original_variant_id, fwv.wine_i_d, fwv.winery_i_d, fwv.region_i_d, fwv.country_i_d, fwv.style_i_d,
        fwv.sku, fwv.wine_title, fwv.winery_title, fwv.winery_code, fwv.region_title, fwv.country_title, fwv.country_title_en,
        fwv.style_title, fwv.style_title_en, fwv.style_icon_key, fwv.style_slug, fwv.size, fwv.vintage, fwv.price, fwv.stock_on_hand,
        fwv.can_backorder, fwv.max_backorder_quantity, fwv.serving_temp, fwv.decanting, fwv.tasting_profile,
        fwv.description, fwv.description_en, fwv.tasting_notes_dry, fwv.tasting_notes_ripe, fwv.tasting_notes_creamy,
        fwv.tasting_notes_oaky, fwv.tasting_notes_complex, fwv.tasting_notes_light, fwv.tasting_notes_smooth,
        fwv.tasting_notes_youthful, fwv.tasting_notes_energetic, fwv.tasting_notes_alcohol,
        fwv.primary_image_url, fwv.slug, fwv.is_published, fwv._status,
        rwvr.type, rwvr.score, rwvr.reason
      FROM related_wine_variants rwv
      INNER JOIN related_wine_variants_related_variants rwvr ON rwv.id = rwvr._parent_id
      INNER JOIN flat_wine_variants fwv ON rwvr.related_variant_id = fwv.id
      INNER JOIN wine_variants wv ON rwv.variant_id = wv.id
      WHERE fwv.is_published = true
      ORDER BY rwvr.score DESC, rwvr._order ASC
    `

    const result = await db.query(query, [wineId])

    // Group by type and map to camelCase
    const groupedByType = new Map<string, FlatWineVariant[]>()

    result.rows.forEach((row) => {
      const type = row.type || 'related'
      const mappedVariant = this.mapSnakeToCamel(row)

      if (!groupedByType.has(type)) {
        groupedByType.set(type, [])
      }
      groupedByType.get(type)!.push(mappedVariant)
    })

    // Convert to the expected format
    const relatedGroups: RelatedWineGroup[] = []

    groupedByType.forEach((variants, type) => {
      // Limit to 5 variants per group
      const limitedVariants = variants.slice(0, 5)

      relatedGroups.push({
        type,
        title: this.getTypeTitle(type),
        variants: limitedVariants,
      })
    })

    return relatedGroups
  }

  /**
   * Get title for relationship type
   */
  private static getTypeTitle(type: string): string {
    switch (type) {
      case 'winery':
      case 'relatedWinery':
        return 'Brothers & Sisters'
      case 'region':
      case 'relatedRegion':
        return 'Neighbours'
      case 'grapeVariety':
        return 'Cousins'
      case 'price':
        return 'Budget Buds'
      case 'style':
        return 'Similar Style'
      default:
        return 'Related Wines'
    }
  }

  /**
   * Get both flat and related wine variants for a wine
   */
  static async getWineVariants(wineId: string) {
    const [flatVariants, relatedVariants] = await Promise.all([
      this.getFlatWineVariants(wineId),
      this.getRelatedWineVariants(wineId),
    ])

    return {
      flatVariants,
      relatedVariants,
    }
  }
}
