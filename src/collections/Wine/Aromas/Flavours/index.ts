import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { slugField } from '@/fields/slug'

export const Flavours: CollectionConfig = {
  slug: 'flavours',
  admin: {
    useAsTitle: 'title',
    group: 'Wine',
    defaultColumns: ['title', 'category', 'colorGroup', 'slug', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField(),
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Fruit',
          value: 'fruit',
        },
        {
          label: 'Floral',
          value: 'floral',
        },
        {
          label: 'Herbal',
          value: 'herbal',
        },
        {
          label: 'Mineral',
          value: 'mineral',
        },
        {
          label: 'Creamy',
          value: 'creamy',
        },
        {
          label: 'Earth',
          value: 'earth',
        },
        {
          label: 'Wood',
          value: 'wood',
        },
        {
          label: 'Other',
          value: 'other',
        },
      ],
    },
    {
      name: 'colorGroup',
      type: 'select',
      options: [
        {
          label: 'Red',
          value: 'red',
        },
        {
          label: 'Green',
          value: 'green',
        },
        {
          label: 'Yellow',
          value: 'yellow',
        },
        {
          label: 'Orange',
          value: 'orange',
        },
        {
          label: 'Blue',
          value: 'blue',
        },
        {
          label: 'Black',
          value: 'black',
        },
        {
          label: 'White',
          value: 'white',
        },
      ],
      admin: {
        description: 'Color group for fruits and flowers',
      },
    },
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'metaImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  versions: {
    drafts: true,
  },
}
