import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'
import { Tailwind } from '@react-email/tailwind'

interface VerificationEmailProps {
  verificationUrl: string
}

export const VerificationEmail = ({ verificationUrl }: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email address</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-8 px-4">
          <Heading className="text-2xl font-bold text-gray-900 mb-4">
            Verify your email address
          </Heading>
          <Text className="text-gray-600 mb-4">
            Please click the button below to verify your email address:
          </Text>
          <Button
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium"
            href={verificationUrl}
          >
            Verify Email
          </Button>
          <Text className="text-gray-500 text-sm mt-4">
            If you didn&apos;t request this email, you can safely ignore it.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)
