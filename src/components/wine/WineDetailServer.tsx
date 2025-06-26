import { WineDetailClient } from './WineDetailClient'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'
import type { RelatedWineVariant } from '@/lib/wineData'

interface WineDetailServerProps {
  variant: FlatWineVariant
  variants: FlatWineVariant[]
  relatedVariants: RelatedWineVariant[]
  locale: Locale
}

export function WineDetailServer({
  variant,
  variants,
  relatedVariants,
  locale,
}: WineDetailServerProps): React.JSX.Element {
  return (
    <ErrorBoundary>
      <WineDetailClient
        variant={variant}
        variants={variants}
        relatedVariants={relatedVariants}
        locale={locale}
      />
    </ErrorBoundary>
  )
}
