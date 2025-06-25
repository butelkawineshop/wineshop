import { Resend } from 'resend'

// Validate required environment variable
if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set')
}

/**
 * Resend email service client for transactional emails
 *
 * This client is used for sending:
 * - Magic link authentication emails
 * - Order confirmation emails
 * - Password reset emails
 * - Marketing emails (with proper consent)
 *
 * @example
 * ```ts
 * import { resend } from '@/lib/integrations/resend'
 *
 * // Send magic link email
 * await resend.emails.send({
 *   from: 'noreply@yourdomain.com',
 *   to: user.email,
 *   subject: 'Sign in to your account',
 *   html: '<p>Click <a href="...">here</a> to sign in</p>'
 * })
 *
 * // Send order confirmation
 * await resend.emails.send({
 *   from: 'orders@yourdomain.com',
 *   to: customer.email,
 *   subject: 'Order Confirmation #12345',
 *   react: OrderConfirmationEmail({ order })
 * })
 * ```
 */
export const resend = new Resend(process.env.RESEND_API_KEY)
