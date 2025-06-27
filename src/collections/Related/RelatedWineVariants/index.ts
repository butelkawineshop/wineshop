import type { CollectionConfig } from 'payload'

export const RelatedWineVariants: CollectionConfig = {
  slug: 'related-wine-variants',
  admin: {
    useAsTitle: 'variantId',
    group: 'Wine',
    // Hide from admin since it's auto-generated
    defaultColumns: ['variantId', 'relatedCount', 'lastComputed', '_status'],
  },
  access: {
    create: () => true,
    delete: () => true,
    read: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'variantId',
      type: 'number',
      required: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Reference to the flat wine variant',
      },
    },
    {
      name: 'relatedVariants',
      type: 'array',
      admin: {
        readOnly: true,
        description: 'Pre-computed related wine variants with intelligent scoring',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Same Winery', value: 'winery' },
            { label: 'Related Winery', value: 'relatedWinery' },
            { label: 'Same Region', value: 'region' },
            { label: 'Related Region', value: 'relatedRegion' },
            { label: 'Same Grape Variety', value: 'grapeVariety' },
            { label: 'Similar Price', value: 'price' },
            { label: 'Same Style', value: 'style' },
          ],
          admin: { description: 'Type of relationship' },
        },
        {
          name: 'score',
          type: 'number',
          min: 1,
          max: 10,
          required: true,
          admin: { description: 'Relevance score (1-10)' },
        },
        {
          name: 'reason',
          type: 'text',
          admin: { description: 'Human-readable reason for the relationship' },
        },
        {
          name: 'relatedVariant',
          type: 'relationship',
          relationTo: 'flat-wine-variants',
          required: true,
          admin: { description: 'Complete related variant data for wine cards' },
        },
      ],
    },
    {
      name: 'relatedCount',
      type: 'number',
      index: true, // Add index for sorting/filtering
      admin: {
        readOnly: true,
        description: 'Total number of related variants',
      },
    },
    {
      name: 'lastComputed',
      type: 'date',
      index: true, // Add index for sorting/filtering
      admin: {
        readOnly: true,
        description: 'When the related wines were last computed',
      },
    },
    {
      name: 'computationVersion',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Version of the computation logic used',
      },
    },
  ],
  versions: {
    drafts: true,
  },
  // Add database indexes for better performance
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Ensure variantId is always a number for consistent indexing
        if (data.variantId && typeof data.variantId === 'string') {
          data.variantId = parseInt(data.variantId, 10)
        }
        // Auto-publish related wines records
        data._status = 'published'
        return data
      },
    ],
  },
}
