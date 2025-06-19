'use client'

import React from 'react'
import Image from 'next/image'

interface LogoProps {
  theme: 'light' | 'dark'
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ theme, className }) => {
  const logoSrc =
    theme === 'light' ? '/images/Logo-CircleWhite.svg' : '/images/Logo-CircleBlack.svg'
  return <Image src={logoSrc} alt="Logo" className={className} width={128} height={128} />
}
