import { memo, useEffect, useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../utils/classNames'

const Modal = memo(({
  isOpen = false,
  onClose,
  children,
  title = '',
  description = '',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
  className = '',
  overlayClassName = '',
  contentClassName = '',
  header = null,
  footer = null,
  initialFocus = null,
  restoreFocus = true,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)
  const closeButtonRef = useRef(null)

  // Size configurations
  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    full: 'max-w-full'
  }

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape && isOpen) {
      onClose?.()
    }
  }, [closeOnEscape, isOpen, onClose])

  // Handle overlay click
  const handleOverlayClick = useCallback((e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose?.()
    }
  }, [closeOnOverlayClick, onClose])

  // Focus management
  const manageFocus = useCallback(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      const firstFocusable = focusableElements?.[0]
      const targetElement = initialFocus?.current || closeButtonRef.current || firstFocusable

      // Small delay to ensure modal is rendered
      setTimeout(() => {
        targetElement?.focus()
      }, 50)
    } else if (restoreFocus && previousFocusRef.current) {
      previousFocusRef.current.focus()
    }
  }, [isOpen, initialFocus, restoreFocus])

  // Trap focus within modal
  const handleTabKey = useCallback((e) => {
    if (e.key !== 'Tab' || !modalRef.current) return

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }, [])

  // Effects
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('keydown', handleTabKey)
      
      if (preventScroll) {
        document.body.style.overflow = 'hidden'
      }

      manageFocus()
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTabKey)
      
      if (preventScroll) {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, handleEscape, handleTabKey, preventScroll, manageFocus])

  if (!isOpen) return null

  const modal = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'animate-fade-in',
        overlayClassName
      )}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy || (title ? 'modal-title' : undefined)}
      aria-describedby={ariaDescribedBy || (description ? 'modal-description' : undefined)}
      {...props}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

      {/* Modal content */}
      <div
        ref={modalRef}
        className={cn(
          'relative bg-dark-800 rounded-2xl shadow-strong border border-dark-700',
          'max-h-[90vh] overflow-hidden flex flex-col',
          'animate-scale-in transform-gpu',
          'w-full',
          sizeClasses[size],
          contentClassName,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(header || title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <div className="flex-1 min-w-0">
              {header || (
                <div>
                  {title && (
                    <h2 
                      id="modal-title"
                      className="text-xl font-semibold text-primary-50 truncate"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p 
                      id="modal-description"
                      className="mt-1 text-sm text-primary-300 line-clamp-2"
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {showCloseButton && (
              <button
                ref={closeButtonRef}
                onClick={onClose}
                className={cn(
                  'ml-4 flex-shrink-0 w-8 h-8 rounded-lg',
                  'text-primary-400 hover:text-primary-200 hover:bg-dark-700',
                  'focus:outline-none focus:ring-2 focus:ring-primary-600',
                  'transition-colors duration-200'
                )}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 m-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-dark-700 p-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  )

  // Render in portal
  return createPortal(modal, document.body)
})

Modal.displayName = 'Modal'

// Modal hook for easier usage
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), [])

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    setIsOpen
  }
}

export default Modal