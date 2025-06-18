import type { Access, PayloadRequest, Where } from 'payload'
import { isAdmin } from './isAdmin'

/**
 * Creates an access control function that checks if a document is visible based on its status
 * @param options Configuration options for the access control
 */
export const statusAccess = ({
  /**
   * Whether to allow draft access to authenticated users
   * @default false
   */
  allowDraftAccess = false,
  /**
   * Whether to allow scheduled access to authenticated users
   * @default false
   */
  allowScheduledAccess = false,
} = {}): Access => {
  return async ({ req }: { req: PayloadRequest }) => {
    // Admins can see everything
    if (await isAdmin({ req })) {
      return true
    }

    // If user is authenticated and has permission to see drafts/scheduled
    if (req.user) {
      if (allowDraftAccess || allowScheduledAccess) {
        const conditions: Where[] = [
          // Always show published
          {
            _status: {
              equals: 'published',
            },
          },
        ]

        // Show drafts if allowed
        if (allowDraftAccess) {
          conditions.push({
            _status: {
              equals: 'draft',
            },
          })
        }

        // Show scheduled if allowed
        if (allowScheduledAccess) {
          conditions.push({
            and: [
              {
                _status: {
                  equals: 'scheduled',
                },
              },
              {
                scheduledDate: {
                  less_than_equal: new Date().toISOString(),
                },
              },
            ],
          })
        }

        return {
          or: conditions,
        } as Where
      }
    }

    // For non-authenticated users, only show published items
    return {
      _status: {
        equals: 'published',
      },
    } as Where
  }
}
