'use client'

import React from 'react'
import { Icon } from '@/components/Icon'
import type { FlatWineVariant } from '@/payload-types'
import { useTranslation } from '@/hooks/useTranslation'
import { WINE_CONSTANTS } from '@/constants/wine'
import { CollectionLink } from '@/components/ui/CollectionLink'
import type { Locale } from '@/i18n/locales'

interface WineTitleBarProps {
  variant: FlatWineVariant
  locale: Locale
}

export function WineTitleBar({ variant, locale }: WineTitleBarProps): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <div className="flex w-full py-2 px-2 gap-2 items-center justify-start text-sm relative z-10 bg-background rounded-t-lg">
      <div className="interactive rounded-full group border border-foreground/40 bg-gradient-to-br from-background to-foreground/5 p-1">
        <CollectionLink collection="styles" slug={variant.styleSlug || 'red'} locale={locale}>
          <Icon
            name={variant.styleIconKey || 'red'}
            variant="color"
            width={WINE_CONSTANTS.TITLE_ICON_SIZE}
            height={WINE_CONSTANTS.TITLE_ICON_SIZE}
            className="w-10 h-10 flex"
          />
        </CollectionLink>
      </div>

      <div className="flex flex-col w-full">
        <CollectionLink
          collection="wines"
          slug={variant.slug || String(variant.id)}
          locale={locale}
          className="block"
        >
          <h3 className="line-clamp-2 text-left text-lg md:text-sm font-accent lowercase transition-all hover:scale-110 transform-gpu origin-left">
            {variant.wineTitle || t('wine.unknownWine')}
          </h3>
        </CollectionLink>

        <div className="flex flex-row gap-1 justify-between w-full text-base md:text-xs text-foreground/90">
          <CollectionLink
            collection="wineries"
            slug={
              locale === 'en'
                ? variant.winerySlugEn || variant.winerySlug || ''
                : variant.winerySlug || ''
            }
            locale={locale}
            className="interactive-text transition-colors"
          >
            <p>{variant.wineryTitle || t('wine.unknownWinery')}</p>
          </CollectionLink>
          <p>
            {variant.size}ml - {variant.vintage}
          </p>
        </div>
      </div>
    </div>
  )
}
