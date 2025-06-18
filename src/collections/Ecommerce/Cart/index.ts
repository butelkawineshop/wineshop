import { CollectionConfig, Field } from 'payload'
import { isAdmin } from '@/access/isAdmin'

// Cart item schema that will be used in both active and saved carts
const cartItemFields: Field[] = [
  {
    name: 'wineVariant',
    type: 'relationship',
    relationTo: 'wine-variants',
    required: true,
  },
  {
    name: 'quantity',
    type: 'number',
    required: true,
    min: 1,
  },
  {
    name: 'addedAt',
    type: 'date',
    required: true,
    defaultValue: () => new Date(),
  },
]

// Active cart collection - for both guest and logged-in users
export const ActiveCarts: CollectionConfig = {
  slug: 'active-carts',
  admin: {
    useAsTitle: 'id',
    group: 'Ecommerce',
    defaultColumns: ['id', 'user', 'items', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'customers',
      // Optional - for guest carts this will be null
    },
    {
      name: 'sessionId',
      type: 'text',
      // For guest carts
    },
    {
      name: 'items',
      type: 'array',
      fields: cartItemFields,
    },
    {
      name: 'updatedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
  ],
}

// Saved carts collection - only for logged-in users
export const SavedCarts: CollectionConfig = {
  slug: 'saved-carts',
  admin: {
    useAsTitle: 'name',
    group: 'Ecommerce',
    defaultColumns: ['name', 'user', 'items', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: cartItemFields,
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'updatedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
  ],
}

// Shared carts collection - for sharing carts with others
export const SharedCarts: CollectionConfig = {
  slug: 'shared-carts',
  admin: {
    useAsTitle: 'shareId',
    group: 'Ecommerce',
    defaultColumns: ['shareId', 'items', 'createdAt', 'expiresAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'shareId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: cartItemFields,
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      // Default to 7 days from creation
      defaultValue: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  ],
}

export const CartCollections = [ActiveCarts, SavedCarts, SharedCarts]
