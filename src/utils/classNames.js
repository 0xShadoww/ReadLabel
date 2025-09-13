import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names with clsx and merges Tailwind classes with tailwind-merge
 * @param {...any} inputs - Class names, objects, arrays, etc.
 * @returns {string} - Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Creates conditional class names based on state
 * @param {string} base - Base class names
 * @param {Object} conditions - Object with condition keys and class values
 * @returns {string} - Conditional class names
 */
export function conditionalClasses(base = '', conditions = {}) {
  const conditionalClasses = Object.entries(conditions)
    .filter(([condition]) => condition)
    .map(([_, classes]) => classes)
    .join(' ')

  return cn(base, conditionalClasses)
}

/**
 * Creates variant-based class names
 * @param {Object} variants - Object with variant definitions
 * @param {string} defaultVariant - Default variant key
 * @param {string} selectedVariant - Selected variant key
 * @returns {string} - Variant class names
 */
export function variantClasses(variants = {}, defaultVariant = 'default', selectedVariant = defaultVariant) {
  const variant = variants[selectedVariant] || variants[defaultVariant] || ''
  return cn(variant)
}

/**
 * Focus ring utility for consistent focus styles
 * @param {string} color - Focus ring color (default: 'primary-600')
 * @returns {string} - Focus ring classes
 */
export function focusRing(color = 'primary-600') {
  return `focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950 focus:ring-${color}`
}

/**
 * Animation utilities
 */
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  scaleIn: 'animate-scale-in',
  spin: 'animate-spin',
  pulse: 'animate-pulse',
  bounce: 'animate-bounce-gentle'
}

/**
 * Shadow utilities
 */
export const shadows = {
  soft: 'shadow-soft',
  medium: 'shadow-medium',
  strong: 'shadow-strong'
}

/**
 * Responsive utilities
 */
export function responsive(base = '', sm = '', md = '', lg = '', xl = '') {
  return cn(
    base,
    sm && `sm:${sm}`,
    md && `md:${md}`,
    lg && `lg:${lg}`,
    xl && `xl:${xl}`
  )
}