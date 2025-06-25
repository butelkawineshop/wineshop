'use client'

import React, { ReactNode, useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { UI_CONSTANTS } from '@/constants/ui'

interface DropdownMenuProps {
  children: ReactNode
  trigger: ReactNode
  className?: string
}

export function DropdownMenu({
  children,
  trigger,
  className,
}: DropdownMenuProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((event: MouseEvent): void => {
    if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    },
    [isOpen],
  )

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleClickOutside, handleKeyDown])

  const handleToggle = useCallback((): void => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + UI_CONSTANTS.DROPDOWN_OFFSET_PX,
        left: rect.left,
        width: rect.width,
      })
    }
    setIsOpen(!isOpen)
  }, [isOpen])

  return (
    <div ref={triggerRef} className={cn('relative', className)}>
      <div
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
      >
        {trigger}
      </div>
      {isOpen &&
        typeof window !== 'undefined' &&
        createPortal(
          <div
            className="fixed bg-background border border-border rounded-md shadow-lg"
            style={{
              top: position.top,
              left: position.left,
              minWidth: Math.max(position.width, UI_CONSTANTS.DROPDOWN_MIN_WIDTH_PX),
              zIndex: UI_CONSTANTS.DROPDOWN_Z_INDEX,
            }}
            role="menu"
            aria-expanded={isOpen}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  )
}

interface DropdownMenuTriggerProps {
  children: ReactNode
  asChild?: boolean
}

export function DropdownMenuTrigger({
  children,
  asChild,
}: DropdownMenuTriggerProps): React.JSX.Element {
  return <>{children}</>
}

interface DropdownMenuContentProps {
  children: ReactNode
  className?: string
}

export function DropdownMenuContent({
  children,
  className,
}: DropdownMenuContentProps): React.JSX.Element {
  return <div className={cn('p-2 bg-background', className)}>{children}</div>
}
