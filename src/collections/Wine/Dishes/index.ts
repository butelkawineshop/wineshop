import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { queueFlatCollectionSync } from '@/hooks/queueFlatCollectionSync'
import { queueFlatWineVariantSync } from '@/hooks/queueFlatWineVariantSync'

export const Dishes: CollectionConfig = {
  slug: 'dishes',
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
