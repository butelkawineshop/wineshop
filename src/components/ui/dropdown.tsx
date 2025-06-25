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

interface DropdownMenuTriggerProps {
  children: ReactNode
}

interface DropdownMenuContentProps {
  children: ReactNode
  className?: string
}

/**
 * Dropdown menu component with portal positioning and keyboard navigation
 *
 * @param children - Dropdown menu content
 * @param trigger - Element that triggers the dropdown
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <DropdownMenu trigger={<Button>Open Menu</Button>}>
 *   <DropdownMenuContent>
 *     <div>Menu Item 1</div>
 *     <div>Menu Item 2</div>
 *   </DropdownMenuContent>
 * </DropdownMenu>
 * ```
 */
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
            onMouseDown={(e) => e.stopPropagation()}
          >
            {children}
          </div>,
          document.body,
        )}
    </div>
  )
}

/**
 * Dropdown menu trigger component
 *
 * @param children - Trigger content
 *
 * @example
 * ```tsx
 * <DropdownMenuTrigger>
 *   <Button>Open Menu</Button>
 * </DropdownMenuTrigger>
 * ```
 */
export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps): React.JSX.Element {
  return <>{children}</>
}

/**
 * Dropdown menu content wrapper component
 *
 * @param children - Menu content
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <DropdownMenuContent className="p-2">
 *   <div>Menu Item 1</div>
 *   <div>Menu Item 2</div>
 * </DropdownMenuContent>
 * ```
 */
export function DropdownMenuContent({
  children,
  className,
}: DropdownMenuContentProps): React.JSX.Element {
  return <div className={cn('p-2 bg-background', className)}>{children}</div>
}

DropdownMenu.displayName = 'DropdownMenu'
DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'
DropdownMenuContent.displayName = 'DropdownMenuContent'
