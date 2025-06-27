import { WineDetailWrapper } from '@/components/wine/WineDetailWrapper'
import type { Locale } from '@/i18n/locales'

interface Props {
  params: Promise<{
    slug: string
  }>
}

export default async function WineDetailPage({ params }: Props): Promise<React.JSX.Element> {
  const { slug } = await params
  const locale: Locale = 'sl' // Slovenian locale for this route

  return <WineDetailWrapper slug={slug} locale={locale} />
}
