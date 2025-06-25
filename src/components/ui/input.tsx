import React, { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Input component with consistent styling and accessibility
 *
 * @param className - Additional CSS classes
 * @param type - Input type (text, email, password, etc.)
 * @param props - Additional input attributes
 *
 * @example
 * ```tsx
 * <Input type="email" placeholder="Enter your email" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref): React.JSX.Element => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'
