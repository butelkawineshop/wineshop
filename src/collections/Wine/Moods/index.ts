import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { slugField } from '@/fields/slug'
import { seoField } from '@/fields/seo'
import { queueRelatedWineVariants } from '@/tasks/queueRelatedWineVariants'

const { afterChange, afterDelete } = queueRelatedWineVariants('mood')

export const Moods: CollectionConfig = {
  slug: 'moods',
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
    afterChange: [afterChange],
    afterDelete: [afterDelete],
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
