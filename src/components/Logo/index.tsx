'use client'

import React from 'react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import { ICON_CONSTANTS } from '@/constants/ui'

interface LogoProps {
  theme: 'light' | 'dark'
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ theme, className }): React.JSX.Element => {
  const { t } = useTranslation()
  const logoSrc =
    theme === 'light' ? '/images/Logo-CircleWhite.svg' : '/images/Logo-CircleBlack.svg'

  return (
    <Image
      src={logoSrc}
      alt={t('common.logo')}
      className={className}
      width={ICON_CONSTANTS.LOGO_SIZE}
      height={ICON_CONSTANTS.LOGO_SIZE}
    />
  )
}
