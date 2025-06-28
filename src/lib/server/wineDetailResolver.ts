import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInt,
  GraphQLFloat,
} from 'graphql'
import { WineService } from '../../services/WineService'
import { db } from '../../lib/db'
import type { Locale } from '../../i18n/locales'

/**
 * Custom GraphQL resolver for wineDetail query
 * Fetches a wine variant, all its variants, and related variants in a single call
 * Follows project conventions for type safety and error handling
 */
export function createWineDetailResolver() {
  return (graphQL: any, context: any) => {
    // Get existing types from collections
    const FlatWineVariantType = context.collections['flat-wine-variants']?.graphQL?.type

    // Create custom RelatedWineVariant type for the response
    const CustomRelatedWineVariantType = new GraphQLObjectType({
      name: 'CustomRelatedWineVariant',
      fields: {
        type: { type: GraphQLString },
        title: { type: GraphQLString },
        variants: { type: new GraphQLList(FlatWineVariantType) },
      },
    })

    const WineDetailResultType = new GraphQLObjectType({
      name: 'WineDetailResult',
      fields: {
        variant: { type: FlatWineVariantType },
        variants: { type: new GraphQLList(FlatWineVariantType) },
        relatedVariants: { type: new GraphQLList(CustomRelatedWineVariantType) },
        error: { type: GraphQLString },
      },
    })

    return {
      wineDetail: {
        type: WineDetailResultType,
        args: {
          slug: { type: new GraphQLNonNull(GraphQLString) },
          locale: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: async (parent: unknown, args: { slug: string; locale: string }, _context: any) => {
          try {
            // 1. Find the wineId from the slug
            const slugQuery = `SELECT wine_i_d FROM flat_wine_variants WHERE slug = $1 LIMIT 1`

            const slugResult = await db.query(slugQuery, [args.slug])

            if (!slugResult.rows.length) {
              return { error: 'Wine not found', variant: null, variants: [], relatedVariants: [] }
            }
            const wineId = slugResult.rows[0].wine_i_d

            // 2. Get the variants using the new WineService
            const { flatVariants, relatedVariants } = await WineService.getWineVariants(wineId)

            // 3. Return in the expected structure
            const result = {
              variant: flatVariants[0] || null, // pick the first as the main variant
              variants: flatVariants,
              relatedVariants: relatedVariants,
              error: null,
            }

            return result
          } catch (error) {
            console.error('wineDetail resolver: Error occurred:', error)
            return {
              error: error instanceof Error ? error.message : 'Unknown error occurred',
              variant: null,
              variants: [],
              relatedVariants: [],
            }
          }
        },
        description:
          'Fetches a wine variant, all its variants, and related variants in a single call.',
      },
    }
  }
}
