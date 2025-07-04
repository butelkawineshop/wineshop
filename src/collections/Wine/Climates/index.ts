import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { queueFlatCollectionSync } from '@/hooks/queueFlatCollectionSync'
import { queueFlatWineVariantSync } from '@/hooks/queueFlatWineVariantSync'

export const Climates: CollectionConfig = {
  slug: 'climates',
  admin: {
    useAsTitle: 'title',
    group: 'Wine',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [queueFlatCollectionSync, queueFlatWineVariantSync],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      index: true,
    },
    slugField(),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'climate',
      type: 'select',
      options: [
        { label: 'Desert', value: 'desert' },
        { label: 'Maritime', value: 'maritime' },
        { label: 'Mediterranean', value: 'mediterranean' },
        { label: 'Continental', value: 'continental' },
        { label: 'Alpine', value: 'alpine' },
      ],
      index: true,
    },
    {
      name: 'climateTemperature',
      type: 'select',
      options: [
        { label: 'Cool', value: 'cool' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Warm', value: 'warm' },
        { label: 'Hot', value: 'hot' },
      ],
      index: true,
    },
    {
      name: 'climateConditions',
      type: 'group',
      fields: [
        {
          name: 'diurnalRange',
          type: 'text',
        },
        {
          name: 'humidity',
          type: 'text',
        },
      ],
    },
    {
      name: 'bestRegions',
      type: 'relationship',
      relationTo: 'regions',
      hasMany: true,
    },
    {
      name: 'bestGrapes',
      type: 'relationship',
      relationTo: 'grape-varieties',
      hasMany: true,
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    seoField({
      titleField: 'title',
      descriptionField: 'description',
      imageField: 'media',
      imageSize: 'og',
    }),
  ],
  versions: {
    drafts: true,
  },
}
