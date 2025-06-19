'use client'

import React from 'react'

interface LogoProps {
  theme: 'light' | 'dark'
  className?: string
}

export const Logo: React.FC<LogoProps> = ({ theme, className }) => {
  const logoSrc =
    theme === 'light' ? '/images/Logo-CircleWhite.svg' : '/images/Logo-CircleBlack.svg'
  return <img src={logoSrc} alt="Logo" className={className} />
}
