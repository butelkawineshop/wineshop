import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { z } from 'zod'

// Define error types
class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthError'
  }
}

// Validation schema
const credentialsSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: 'customer'
    }
    accessToken?: string
  }

  interface User {
    id: string
    email: string
    role: 'customer'
    token: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    role: 'customer'
    accessToken?: string
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const result = credentialsSchema.safeParse(credentials)
          if (!result.success) {
            throw new AuthError('Invalid credentials format')
          }

          const payload = await getPayload({
            config: payloadConfig,
          })

          const { user: customer, token } = await payload.login({
            collection: 'customers',
            data: {
              email: result.data.email,
              password: result.data.password,
            },
          })

          if (!customer || !token) {
            throw new AuthError('Invalid email or password')
          }

          return {
            id: String(customer.id),
            email: customer.email,
            role: 'customer',
            token,
          }
        } catch (error) {
          if (error instanceof AuthError) {
            throw error
          }
          // Log internal errors but don't expose them
          console.error('Authentication error:', error)
          throw new AuthError('Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
        session.user.role = token.role
        session.accessToken = token.accessToken
      }
      return session
    },
  },
}
