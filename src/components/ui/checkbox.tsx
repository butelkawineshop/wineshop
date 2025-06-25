import React, { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
}

/**
 * Checkbox component with proper accessibility and styling
 *
 * @param id - Unique identifier for the checkbox
 * @param className - Additional CSS classes
 * @param props - Additional input attributes
 *
 * @example
 * ```tsx
 * <Checkbox id="terms" onChange={handleChange} />
 * <label htmlFor="terms">I agree to the terms</label>
 * ```
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, ...props }, ref): React.JSX.Element => {
    return (
      <input
        type="checkbox"
        id={id}
        className={cn(
          'h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Checkbox.displayName = 'Checkbox'
