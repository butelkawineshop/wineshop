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
import React from 'react'
import { EMAIL_CONSTANTS } from '@/constants/email'
import { getEmailTranslation } from '@/utils/emailTranslations'
import type { Locale } from '@/i18n/locales'

interface VerificationEmailProps {
  verificationUrl: string
  locale?: Locale
}

/**
 * VerificationEmail component for email verification
 *
 * @param verificationUrl - The URL for email verification
 * @param locale - The locale for translations (defaults to 'sl')
 * @returns React email template for verification
 *
 * @example
 * ```tsx
 * <VerificationEmail
 *   verificationUrl="https://example.com/verify?token=abc123"
 *   locale="sl"
 * />
 * ```
 */
export const VerificationEmail = ({
  verificationUrl,
  locale = 'sl',
}: VerificationEmailProps): React.JSX.Element => {
  const t = (key: string) => getEmailTranslation(locale, key)

  return (
    <Html>
      <Head />
      <Preview>{t('auth.emailVerification.preview')}</Preview>
      <Tailwind>
        <Body className={`${EMAIL_CONSTANTS.BODY_BACKGROUND} ${EMAIL_CONSTANTS.BODY_FONT}`}>
          <Container
            className={`${EMAIL_CONSTANTS.CONTAINER_MARGIN} ${EMAIL_CONSTANTS.CONTAINER_PADDING}`}
          >
            <Heading
              className={`${EMAIL_CONSTANTS.HEADING_SIZE} ${EMAIL_CONSTANTS.HEADING_FONT_WEIGHT} ${EMAIL_CONSTANTS.HEADING_COLOR} ${EMAIL_CONSTANTS.HEADING_MARGIN}`}
            >
              {t('auth.emailVerification.title')}
            </Heading>
            <Text
              className={`${EMAIL_CONSTANTS.PRIMARY_TEXT_COLOR} ${EMAIL_CONSTANTS.TEXT_MARGIN}`}
            >
              {t('auth.emailVerification.description')}
            </Text>
            <Button
              className={`${EMAIL_CONSTANTS.BUTTON_BACKGROUND} ${EMAIL_CONSTANTS.BUTTON_TEXT_COLOR} ${EMAIL_CONSTANTS.BUTTON_PADDING} ${EMAIL_CONSTANTS.BUTTON_BORDER_RADIUS} ${EMAIL_CONSTANTS.BUTTON_FONT_WEIGHT}`}
              href={verificationUrl}
              aria-label={t('auth.emailVerification.buttonAria')}
            >
              {t('auth.emailVerification.button')}
            </Button>
            <Text
              className={`${EMAIL_CONSTANTS.SECONDARY_TEXT_COLOR} ${EMAIL_CONSTANTS.SECONDARY_TEXT_SIZE} ${EMAIL_CONSTANTS.BUTTON_MARGIN}`}
            >
              {t('auth.emailVerification.ignoreMessage')}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
