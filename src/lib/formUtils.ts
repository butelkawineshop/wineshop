import { z } from 'zod/v4'
import { useForm, type UseFormReturn, type FieldValues, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

// TODO: Move repeated error messages to a constants or i18n file for localization as per conventions.

// Form schemas
export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
}) satisfies z.ZodType<{
  email: string
  password: string
}>

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }) satisfies z.ZodType<{
  name: string
  email: string
  password: string
  confirmPassword: string
}>

export const checkoutSchema = z.strictObject({
  shippingAddress: z.object({
    street: z.string().min(1, { message: 'Street is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
    zipCode: z.string().min(1, { message: 'ZIP code is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
  }),
  paymentMethod: z.enum(['credit_card', 'paypal']),
  cardDetails: z
    .object({
      number: z.string().min(16, { message: 'Invalid card number' }),
      expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: 'Invalid expiry date' }),
      cvc: z.string().min(3, { message: 'Invalid CVC' }),
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

/**
 * Hook to use form with Zod schema validation
 * @param schema - Zod schema for form validation
 * @param options - React Hook Form options
 * @returns Form instance with validation
 */
export const useZodForm = <T extends FieldValues>(
  schema: z.ZodSchema<T>,
  options?: {
    mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all'
    defaultValues?: Partial<T>
  },
): UseFormReturn<T> => {
  return useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    mode: options?.mode ?? 'onBlur',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    defaultValues: options?.defaultValues as any,
  })
}

/**
 * Type-safe form field error helper
 * @param form - React Hook Form instance
 * @param field - Field path
 * @returns Error message for the field
 */
export const getFieldError = <T extends FieldValues>(
  form: UseFormReturn<T>,
  field: Path<T>,
): string | undefined => {
  const error = form.formState.errors[field]
  return error?.message as string | undefined
}

/**
 * Type-safe form field value helper
 * @param form - React Hook Form instance
 * @param field - Field path
 * @returns Current value of the field
 */
export const getFieldValue = <T extends FieldValues>(
  form: UseFormReturn<T>,
  field: Path<T>,
): unknown => {
  return form.watch(field)
}
