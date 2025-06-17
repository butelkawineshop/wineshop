import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

// Generic validation middleware
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map((err: z.ZodIssue) => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(error)
    }
  }
}

// Example schemas
export const productSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    price: z.number().positive(),
    stock: z.number().int().min(0),
    category: z.string().min(1),
    images: z.array(z.string().url()).optional(),
  }),
})

export const orderSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    ),
    shippingAddress: z.object({
      street: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      zipCode: z.string().min(1),
      country: z.string().min(1),
    }),
    paymentMethod: z.enum(['credit_card', 'paypal']),
  }),
})

export const userSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      }),
    name: z.string().min(1),
    role: z.enum(['user', 'admin']).default('user'),
  }),
})
