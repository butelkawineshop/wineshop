import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge CSS classes with Tailwind CSS conflict resolution
 *
 * This function combines clsx for conditional class logic and twMerge for
 * resolving Tailwind CSS class conflicts. It's the recommended way to
 * handle dynamic class names in the project.
 *
 * @param inputs - CSS classes to merge (strings, objects, arrays, or functions)
 * @returns Merged CSS class string with conflicts resolved
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('text-red-500', 'text-blue-500') // Returns 'text-blue-500'
 *
 * // Conditional classes
 * cn('base-class', isActive && 'active-class', isDisabled && 'disabled-class')
 *
 * // With objects
 * cn('base-class', { 'conditional-class': condition })
 *
 * // Complex example
 * cn(
 *   'flex items-center',
 *   variant === 'primary' && 'bg-primary text-white',
 *   variant === 'secondary' && 'bg-secondary text-black',
 *   className // Additional classes from props
 * )
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
