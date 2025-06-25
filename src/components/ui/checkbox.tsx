import React, { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
}

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
