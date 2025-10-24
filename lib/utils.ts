import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx for conditional classes with tailwind-merge to handle conflicts
 *
 * @param inputs - Class names or conditional class objects
 * @returns Merged class string with Tailwind conflicts resolved
 *
 * @example
 * cn('px-2 py-1', condition && 'bg-blue-500')
 * cn('px-2', 'px-4') // Returns 'px-4' (last wins)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
