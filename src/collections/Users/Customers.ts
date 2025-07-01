import { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'
import type { CollectionSlug } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  auth: {
    tokenExpiration: 7200, // 2 hours
    verify: true,
    maxLoginAttempts: 5,
    lockTime: 600, // 10 minutes
    useAPIKey: true,
    depth: 0,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  admin: {
    useAsTitle: 'email',
    group: 'Users',
  },
  access: {
    read: () => true,
    create: () => true,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'kgbSubscriptions',
      type: 'relationship',
      relationTo: 'kgb-subscriptions' as CollectionSlug,
      hasMany: true,
      admin: { description: 'All KGB subscriptions for this customer.' },
    },
    {
      name: 'stripeCustomerId',
      type: 'text',
      admin: { description: 'Stripe customer ID for this user.' },
    },
  ],
}
