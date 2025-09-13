import { forwardRef, memo } from 'react'
import { cn } from '../../utils/classNames'

const Card = memo(forwardRef(({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  radius = 'xl',
  shadow = 'soft',
  hover = false,
  interactive = false,
  header = null,
  footer = null,
  ...props
}, ref) => {
  const baseStyles = `
    bg-dark-800/80 backdrop-blur-sm border border-dark-700
    transition-all duration-200
  `

  const variants = {
    default: '',
    elevated: 'bg-dark-800 border-dark-600',
    outlined: 'bg-transparent border-2 border-dark-600',
    glass: 'bg-dark-800/40 backdrop-blur-md border-dark-700/50',
    gradient: 'bg-gradient-to-br from-dark-800 via-dark-800 to-dark-700 border-dark-600'
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const radiuses = {
    none: '',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-2xl',
    full: 'rounded-full'
  }

  const shadows = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    strong: 'shadow-strong'
  }

  const hoverStyles = hover ? 'hover:shadow-medium hover:-translate-y-1' : ''
  const interactiveStyles = interactive ? 
    'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 focus:ring-offset-dark-950' : 
    ''

  const cardContent = (
    <>
      {header && (
        <div className="border-b border-dark-700 pb-4 mb-6">
          {header}
        </div>
      )}
      
      <div className={cn('flex-1', !padding && 'p-0')}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-dark-700 pt-4 mt-6">
          {footer}
        </div>
      )}
    </>
  )

  const CardComponent = interactive ? 'button' : 'div'

  return (
    <CardComponent
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        padding && paddings[padding],
        radiuses[radius],
        shadows[shadow],
        hoverStyles,
        interactiveStyles,
        className
      )}
      {...props}
    >
      {cardContent}
    </CardComponent>
  )
}))

Card.displayName = 'Card'

// Card sub-components
export const CardHeader = memo(({ children, className = '' }) => (
  <div className={cn('flex items-center justify-between', className)}>
    {children}
  </div>
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = memo(({ children, className = '', as: Component = 'h3' }) => (
  <Component className={cn('text-lg font-semibold text-primary-50', className)}>
    {children}
  </Component>
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = memo(({ children, className = '' }) => (
  <p className={cn('text-sm text-primary-300', className)}>
    {children}
  </p>
))
CardDescription.displayName = 'CardDescription'

export const CardContent = memo(({ children, className = '' }) => (
  <div className={cn('', className)}>
    {children}
  </div>
))
CardContent.displayName = 'CardContent'

export const CardFooter = memo(({ children, className = '' }) => (
  <div className={cn('flex items-center justify-end space-x-2', className)}>
    {children}
  </div>
))
CardFooter.displayName = 'CardFooter'

export default Card