import type { Access, Where } from 'payload'
import { isAdmin } from './isAdmin'

/**
 * Access control for Orders collection
 * - Admins can do everything
 * - Customers can read their own orders
 * - Customers can update/delete their own orders if status is 'pending'
 * - Guest users can access orders via session ID
 */
export const orderAccess = (): Access => {
  return ({ req, id }) => {
    // Allow admins to do everything
    if (isAdmin({ req })) return true

    // For non-admin users
    if (req.user) {
      // Allow customers to read their own orders
      if (id === req.user.id) {
        // Allow updates and deletes only if order is pending
        return {
          or: [{ status: { equals: 'pending' } }, { id: { equals: id } }],
        } as Where
      }
    }

    // For guest users (via session)
    return {
      or: [{ status: { equals: 'pending' } }, { sessionId: { exists: true } }],
    } as Where
  }
}
