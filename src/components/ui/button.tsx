import React, { ReactNode, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Button component with multiple variants and sizes
 *
 * @param children - Button content
 * @param variant - Visual variant of the button (default, outline, ghost)
 * @param size - Size of the button (sm, md, lg)
 * @param className - Additional CSS classes
 * @param props - Additional button attributes
 *
 * @example
 * ```tsx
 * <Button variant="default" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * ```
 */
export function Button({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: ButtonProps): React.JSX.Element {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90 transition-colors',
    outline:
      'border border-input bg-background hover:scale-110 transition-all duration-300 transform-gpu',
    ghost: 'hover:scale-110 transition-all duration-300 transform-gpu',
  }

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-8',
  }

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  )
}

Button.displayName = 'Button'
