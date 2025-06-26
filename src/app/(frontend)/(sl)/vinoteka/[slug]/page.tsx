import { notFound } from 'next/navigation'
import { getWineVariantData } from '@/lib/wineData'
import { WineDetailServer } from '@/components/wine/WineDetailServer'
import type { Locale } from '@/i18n/locales'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function WineDetailPage({ params }: Props): Promise<React.JSX.Element> {
  const { slug } = await params
  const locale: Locale = 'sl' // Slovenian locale for this route

  // Get all wine variant data server-side
  const { variant, variants, relatedVariants, error } = await getWineVariantData(slug, locale)

  if (error || !variant) {
    return notFound()
  }

  return (
    <WineDetailServer
      variant={variant}
      variants={variants}
      relatedVariants={relatedVariants}
      locale={locale}
    />
  )
}
