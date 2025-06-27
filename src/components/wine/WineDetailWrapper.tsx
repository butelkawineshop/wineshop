import { FlatWineVariantService } from '@/services/FlatWineVariantService'
import { useWineVariantData } from '@/hooks/useWineVariantData'
import { WineDetail } from './WineDetail'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import type { FlatWineVariant } from '@/payload-types'
import type { Locale } from '@/i18n/locales'

interface WineDetailWrapperProps {
  slug: string
  locale: Locale
  initialData?: FlatWineVariant
}

export function WineDetailWrapper({
  slug,
  locale,
  initialData,
}: WineDetailWrapperProps): React.JSX.Element {
  const { variant, variants, allVariants, selectedVariant, isLoading, error, selectVariant } =
    useWineVariantData({
      slug,
      locale,
      initialData,
    })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !variant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-accent mb-4">Wine Not Found</h1>
          <p className="text-foreground/60">{error || 'The requested wine could not be found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <WineDetail
        variant={variant}
        variants={variants}
        allVariants={allVariants}
        selectedVariant={selectedVariant}
        onVariantSelect={selectVariant}
        locale={locale}
      />
    </ErrorBoundary>
  )
}
