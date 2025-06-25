'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/Icon'
import { useTranslation } from '@/hooks/useTranslation'

interface ResetFilterButtonProps {
  onReset: () => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ResetFilterButton({
  onReset,
  variant = 'ghost',
  size = 'sm',
  className = '',
}: ResetFilterButtonProps): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <Button
      onClick={onReset}
      variant={variant}
      size={size}
      className={`flex items-center gap-1 text-muted-foreground hover:text-foreground ${className}`}
    >
      <Icon name="close" className="w-3 h-3" variant="color" />
      <span className="text-xs">{t('common.reset')}</span>
    </Button>
  )
}
