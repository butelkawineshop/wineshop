'use client'

import React from 'react'
import Link from 'next/link'
import { IconColor } from '@/components/IconColor'
import type { FlatWineVariant } from '@/payload-types'
import { useTranslation } from '@/hooks/useTranslation'

interface WineTitleBarProps {
  variant: FlatWineVariant
  locale: string
}

export function WineTitleBar({ variant, locale }: WineTitleBarProps): React.JSX.Element {
  const { t } = useTranslation()
  const wineUrl = `/${locale}/wine/${variant.slug || variant.id}`

  return (
    <div className="flex w-full py-2 px-2 gap-2 items-center justify-start text-sm relative z-10 bg-background rounded-t-lg">
      <div className="interactive rounded-full group border border-foreground/40 bg-gradient-to-br from-background to-foreground/5 p-1">
        <Link href={wineUrl}>
          <IconColor name="red" theme="color" className="w-10 h-10 flex" />
        </Link>
      </div>

      <div className="flex flex-col w-full">
        <Link href={wineUrl} className="interactive-text">
          <h3 className="line-clamp-2 text-left text-lg md:text-sm font-accent lowercase transition-colors">
            {variant.wineTitle || t('wine.unknownWine')}
          </h3>
        </Link>

        <div className="flex flex-row gap-1 justify-between w-full text-base md:text-xs text-foreground/90">
          <p className="interactive-text transition-colors">
            {variant.wineryTitle || t('wine.unknownWinery')}
          </p>
          <p>
            {variant.size}ml - {variant.vintage}
          </p>
        </div>
      </div>
    </div>
  )
}
