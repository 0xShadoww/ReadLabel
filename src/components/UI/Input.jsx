import { forwardRef, memo, useState, useId } from 'react'
import { cn } from '../../utils/classNames'

const Input = memo(forwardRef(({
  className = '',
  type = 'text',
  size = 'md',
  variant = 'default',
  label = '',
  placeholder = '',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  leftIcon: LeftIcon = null,
  rightIcon: RightIcon = null,
  prefix = '',
  suffix = '',
  maxLength = null,
  showCount = false,
  onClear = null,
  clearable = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const inputId = useId()

  const baseStyles = `
    w-full transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-950
    disabled:opacity-50 disabled:cursor-not-allowed
    placeholder:text-primary-400
  `

  const variants = {
    default: `
      bg-dark-800 border border-dark-600 text-primary-100
      focus:border-primary-600 focus:ring-primary-600
      hover:border-dark-500
    `,
    filled: `
      bg-dark-700 border-0 text-primary-100
      focus:bg-dark-800 focus:ring-primary-600
    `,
    outlined: `
      bg-transparent border-2 border-dark-600 text-primary-100
      focus:border-primary-600 focus:ring-primary-600
      hover:border-dark-500
    `,
    ghost: `
      bg-transparent border-0 border-b-2 border-dark-600 text-primary-100
      focus:border-primary-600 focus:ring-0 rounded-none
    `
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-3 text-base rounded-xl',
    lg: 'px-6 py-4 text-lg rounded-xl'
  }

  const errorStyles = error ? 
    'border-danger focus:border-danger focus:ring-danger' : 
    ''

  const hasLeftElement = LeftIcon || prefix
  const hasRightElement = RightIcon || suffix || clearable || type === 'password'

  const leftPadding = hasLeftElement ? {
    sm: 'pl-10',
    md: 'pl-12',
    lg: 'pl-14'
  }[size] : ''

  const rightPadding = hasRightElement ? {
    sm: 'pr-10',
    md: 'pr-12',
    lg: 'pr-14'
  }[size] : ''

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const handleClear = () => {
    if (onClear) onClear()
    if (ref?.current) {
      ref.current.value = ''
      ref.current.focus()
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium',
            error ? 'text-danger' : 'text-primary-200',
            required && "after:content-['*'] after:ml-1 after:text-danger"
          )}
        >
          {label}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left icon/prefix */}
        {hasLeftElement && (
          <div className={cn(
            'absolute left-0 top-0 bottom-0 flex items-center',
            size === 'sm' ? 'pl-3' : size === 'md' ? 'pl-4' : 'pl-6'
          )}>
            {LeftIcon && (
              <LeftIcon className={cn(iconSizes[size], 'text-primary-400')} aria-hidden="true" />
            )}
            {prefix && (
              <span className="text-primary-400 text-sm font-medium">
                {prefix}
              </span>
            )}
          </div>
        )}

        {/* Input element */}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          required={required}
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            leftPadding,
            rightPadding,
            errorStyles,
            isFocused && 'ring-2',
            className
          )}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          aria-describedby={
            cn(
              error && `${inputId}-error`,
              helperText && `${inputId}-helper`
            ) || undefined
          }
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        />

        {/* Right elements */}
        {hasRightElement && (
          <div className={cn(
            'absolute right-0 top-0 bottom-0 flex items-center space-x-2',
            size === 'sm' ? 'pr-3' : size === 'md' ? 'pr-4' : 'pr-6'
          )}>
            {/* Clear button */}
            {clearable && props.value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-primary-400 hover:text-primary-200 transition-colors"
                aria-label="Clear input"
              >
                <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Password toggle */}
            {type === 'password' && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-primary-400 hover:text-primary-200 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className={iconSizes[size]} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            )}

            {/* Right icon */}
            {RightIcon && (
              <RightIcon className={cn(iconSizes[size], 'text-primary-400')} aria-hidden="true" />
            )}

            {/* Suffix */}
            {suffix && (
              <span className="text-primary-400 text-sm font-medium">
                {suffix}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Helper text/error message/character count */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {error && (
            <p id={`${inputId}-error`} className="text-sm text-danger flex items-center">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p id={`${inputId}-helper`} className="text-sm text-primary-400">
              {helperText}
            </p>
          )}
        </div>

        {/* Character count */}
        {showCount && maxLength && (
          <span className="text-xs text-primary-400 ml-2 flex-shrink-0">
            {(props.value || '').length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  )
}))

Input.displayName = 'Input'

export default Input