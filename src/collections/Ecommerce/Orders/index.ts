import type { CollectionConfig } from 'payload'
import { orderAccess } from '@/access/orderAccess'
import { pdfField } from '@/fields/pdf'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Ecommerce',
    defaultColumns: ['orderNumber', 'customer', 'status', 'total', 'createdAt'],
  },
  access: {
    create: () => true,
    read: orderAccess(),
    update: orderAccess(),
    delete: orderAccess(),
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (!value) {
              // Generate order number: ORD-YYYYMMDD-XXXXX
              const date = new Date()
              const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
              const random = Math.floor(Math.random() * 100000)
                .toString()
                .padStart(5, '0')
              return `ORD-${dateStr}-${random}`
            }
            return value
          },
        ],
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: false,
      admin: {
        description: 'Customer who placed the order (optional for guest checkouts)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      required: false,
      admin: {
        description: 'Session ID for guest checkouts',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Processing',
          value: 'processing',
        },
        {
          label: 'Shipped',
          value: 'shipped',
        },
        {
          label: 'Delivered',
          value: 'delivered',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'variant',
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
          name: 'price',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'reservation',
          type: 'relationship',
          relationTo: 'stock-reservations',
          required: true,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shipping',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'tax',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'address1',
          type: 'text',
          required: true,
        },
        {
          name: 'address2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      required: true,
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
        {
          name: 'address1',
          type: 'text',
          required: true,
        },
        {
          name: 'address2',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'postalCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Credit Card',
          value: 'credit_card',
        },
        {
          label: 'PayPal',
          value: 'paypal',
        },
        {
          label: 'Bank Transfer',
          value: 'bank_transfer',
        },
        {
          label: 'Pay in Store',
          value: 'pay_in_store',
        },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Paid',
          value: 'paid',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
        {
          label: 'Refunded',
          value: 'refunded',
        },
      ],
    },
    {
      name: 'paymentIntentId',
      type: 'text',
      admin: {
        readOnly: true,
        condition: (data) => {
          return data?.paymentMethod === 'credit_card'
        },
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'trackingNumber',
      type: 'text',
      admin: {
        condition: (data) => {
          return data?.status === 'shipped'
        },
      },
    },
    pdfField({
      required: false,
      admin: {
        description: 'Upload order invoice or other related PDF documents',
      },
    }),
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Calculate totals if not provided
        if (!data.total && data.items) {
          const subtotal = data.items.reduce(
            (sum: number, item: { price: number; quantity: number }) =>
              sum + item.price * item.quantity,
            0,
          )
          data.subtotal = subtotal
          data.total = subtotal + (data.shipping || 0) + (data.tax || 0)
        }
        return data
      },
    ],
  },
}
