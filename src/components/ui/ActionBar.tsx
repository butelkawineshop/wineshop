'use client'

import { Icon } from '../Icon'
import { useTranslation } from '@/hooks/useTranslation'

interface ActionBarProps {
  children: React.ReactNode
  email?: string
  phone?: string
  className?: string
}

export function ActionBar({ children, email, phone, className = '' }: ActionBarProps) {
  const { t } = useTranslation()

  return (
    <div className={`bg-card border-y md:border border-border md:rounded-lg p-6 ${className}`}>
      {/* Action Area */}
      <div className="mb-6">{children}</div>

      {/* Contact Links */}
      {(email || phone) && (
        <div className="grid grid-cols-2 items-center justify-between">
          {email && (
            <div className="flex flex-col items-center">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t('common.contact.emailLabel', { email })}
              >
                <Icon name="email" variant="color" width={20} height={20} />
                <span>{email}</span>
              </a>
              <span className="text-xs text-foreground/60 mt-1">
                {t('common.contact.emailLabel')}
              </span>
            </div>
          )}
          {phone && (
            <div className="flex flex-col items-center">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t('common.contact.phoneLabel', { phone })}
              >
                <Icon name="phone" variant="color" width={20} height={20} />
                <span>{phone}</span>
              </a>
              <span className="text-xs text-foreground/60 mt-1">
                {t('common.contact.phoneLabel')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
