import { forwardRef, memo } from 'react'
import { cn } from '../../utils/classNames'

const Button = memo(forwardRef(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  icon: Icon = null,
  iconPosition = 'left',
  fullWidth = false,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center font-medium transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950
    disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation
    active:scale-95 transform-gpu
  `

  const variants = {
    primary: `
      bg-primary-900 hover:bg-primary-800 text-primary-50 
      shadow-medium hover:shadow-strong focus:ring-primary-600
    `,
    secondary: `
      bg-dark-800 hover:bg-dark-700 text-primary-100 
      border border-dark-600 focus:ring-primary-600
    `,
    ghost: `
      text-primary-200 hover:text-primary-50 hover:bg-dark-800
      focus:ring-primary-600
    `,
    danger: `
      bg-danger hover:bg-red-600 text-white 
      shadow-medium hover:shadow-strong focus:ring-red-500
    `,
    success: `
      bg-success hover:bg-green-600 text-white 
      shadow-medium hover:shadow-strong focus:ring-green-500
    `
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-xl',
    xl: 'px-10 py-5 text-xl rounded-2xl'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }

  const isDisabled = disabled || isLoading

  const content = isLoading ? (
    <>
      <div className={cn('animate-spin rounded-full border-2 border-transparent border-t-current', iconSizes[size])} />
      <span className="ml-2">{loadingText}</span>
    </>
  ) : (
    <>
      {Icon && iconPosition === 'left' && (
        <Icon className={cn(iconSizes[size], children ? 'mr-2' : '')} aria-hidden="true" />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className={cn(iconSizes[size], children ? 'ml-2' : '')} aria-hidden="true" />
      )}
    </>
  )

  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={isLoading}
      {...props}
    >
      {content}
    </button>
  )
}))

Button.displayName = 'Button'

export default Button