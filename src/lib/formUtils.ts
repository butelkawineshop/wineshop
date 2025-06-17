import { z } from 'zod/v4'
import { parseWithZod } from '@conform-to/zod'
import { useForm } from '@conform-to/react'
import type { SubmissionResult } from '@conform-to/react'
import type { ZodTypeAny } from 'zod'

// Form schemas
export const loginSchema = z.object({
  email: z.email({ error: 'Invalid email address' }),
  password: z.string().min(8, { error: 'Password must be at least 8 characters' }),
}) satisfies z.ZodType<{
  email: string
  password: string
}>

export const registerSchema = z
  .object({
    name: z.string().min(2, { error: 'Name must be at least 2 characters' }),
    email: z.email({ error: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { error: 'Password must be at least 8 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        error:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ['confirmPassword'],
  }) satisfies z.ZodType<{
  name: string
  email: string
  password: string
  confirmPassword: string
}>

export const checkoutSchema = z.strictObject({
  shippingAddress: z.object({
    street: z.string().min(1, { error: 'Street is required' }),
    city: z.string().min(1, { error: 'City is required' }),
    state: z.string().min(1, { error: 'State is required' }),
    zipCode: z.string().min(1, { error: 'ZIP code is required' }),
    country: z.string().min(1, { error: 'Country is required' }),
  }),
  paymentMethod: z.enum(['credit_card', 'paypal']),
  cardDetails: z
    .object({
      number: z.string().min(16, { error: 'Invalid card number' }),
      expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { error: 'Invalid expiry date' }),
      cvc: z.string().min(3, { error: 'Invalid CVC' }),
    })
    .optional(),
}) satisfies z.ZodType<{
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: 'credit_card' | 'paypal'
  cardDetails?: {
    number: string
    expiry: string
    cvc: string
  }
}>

// Helper function to parse form data with Zod schema
export const parseFormData = <T extends ZodTypeAny>(formData: FormData, schema: T) => {
  return parseWithZod(formData, { schema })
}

// Hook to use form with Zod schema
export const useZodForm = <T extends ZodTypeAny>(
  schema: T,
  options?: {
    shouldValidate?: 'onBlur' | 'onInput' | 'onSubmit'
    lastResult?: SubmissionResult<string[]>
  },
) => {
  const [form, fields] = useForm({
    shouldValidate: options?.shouldValidate ?? 'onBlur',
    lastResult: options?.lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
  })

  return { form, fields }
}
