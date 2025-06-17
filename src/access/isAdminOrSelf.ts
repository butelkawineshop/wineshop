import { Access } from 'payload'

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (!user) return false
  return user.collection === 'users' || user.id === id
}
