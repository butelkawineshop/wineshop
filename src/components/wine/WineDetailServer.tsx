import { WineDetailClient } from './WineDetailClient'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

interface WineDetailServerProps {
  variant: FlatWineVariant
  variants: FlatWineVariant[]
  allVariants?: FlatWineVariant[]
  locale: Locale
}

export function WineDetailServer({
  variant,
  variants,
  allVariants = [],
  locale,
}: WineDetailServerProps): React.JSX.Element {
  return (
    <ErrorBoundary>
      <WineDetailClient
        variant={variant}
        variants={variants}
        allVariants={allVariants}
        locale={locale}
      />
    </ErrorBoundary>
  )
}
