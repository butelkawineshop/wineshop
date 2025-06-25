import React, { ReactNode, useCallback } from 'react'
import { Icon } from '@/components/Icon'
import { cn } from '@/lib/utils'

interface AccordionProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
  icon?: string
  className?: string
}

const ACCORDION_CONSTANTS = {
  ICON_SIZE: 'w-5 h-5',
  ICON_GAP: 'gap-2',
  PADDING: 'px-4 py-3',
  CONTENT_PADDING: 'px-4 py-4',
} as const

export function Accordion({
  title,
  isOpen,
  onToggle,
  children,
  icon,
  className,
}: AccordionProps): React.JSX.Element {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): void => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onToggle()
      }
    },
    [onToggle],
  )

  const accordionId = React.useId()
  const contentId = `${accordionId}-content`

  return (
    <div className={cn('border border-border rounded-lg overflow-visible', className)}>
      <button
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        className={`w-full ${ACCORDION_CONSTANTS.PADDING} flex items-center group justify-between hover:bg-primary hover:text-black cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
        aria-expanded={isOpen}
        aria-controls={contentId}
        aria-label={title}
        tabIndex={0}
      >
        <div className={`icon-container flex items-center ${ACCORDION_CONSTANTS.ICON_GAP}`}>
          {icon && <Icon name={icon} className={ACCORDION_CONSTANTS.ICON_SIZE} variant="color" />}
          <h2 className="font-semibold">{title}</h2>
        </div>
        <Icon
          name="chevron-left"
          className={cn(
            `${ACCORDION_CONSTANTS.ICON_SIZE} transition-transform duration-200 ease-in-out`,
            isOpen && 'rotate-[-90deg]',
          )}
          aria-hidden="true"
        />
      </button>
      <div
        id={contentId}
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        )}
        role="region"
        aria-labelledby={`${accordionId}-button`}
      >
        <div className="overflow-hidden">
          <div className={`${ACCORDION_CONSTANTS.CONTENT_PADDING} text-left`}>{children}</div>
        </div>
      </div>
    </div>
  )
}
