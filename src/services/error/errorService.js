import { Analytics } from '@vercel/analytics/react'

/**
 * Advanced error logging and reporting service
 */
class ErrorService {
  constructor() {
    this.isDev = import.meta.env.DEV
    this.errorQueue = []
    this.maxQueueSize = 50
    this.isOnline = navigator.onLine
    
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      this.flushErrorQueue()
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  /**
   * Log an error with context
   * @param {Error|string} error - The error to log
   * @param {Object} context - Additional context
   * @param {string} severity - Error severity level
   */
  logError(error, context = {}, severity = 'error') {
    const errorData = this.formatError(error, context, severity)
    
    // Always log to console in development
    if (this.isDev) {
      this.logToConsole(errorData)
    }
    
    // Store error locally
    this.storeErrorLocally(errorData)
    
    // Send to analytics if online
    if (this.isOnline) {
      this.sendToAnalytics(errorData)
    } else {
      this.queueError(errorData)
    }
    
    return errorData.id
  }

  /**
   * Format error data with consistent structure
   * @param {Error|string} error - The error
   * @param {Object} context - Additional context
   * @param {string} severity - Error severity
   * @returns {Object} Formatted error data
   */
  formatError(error, context, severity) {
    const timestamp = new Date().toISOString()
    const id = this.generateErrorId()
    
    const baseError = {
      id,
      timestamp,
      severity,
      url: window.location.href,
      userAgent: navigator.userAgent,
      context: {
        ...context,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        platform: navigator.platform,
        online: navigator.onLine
      }
    }
    
    if (error instanceof Error) {
      return {
        ...baseError,
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: 'exception'
      }
    }
    
    if (typeof error === 'string') {
      return {
        ...baseError,
        message: error,
        type: 'message'
      }
    }
    
    return {
      ...baseError,
      message: 'Unknown error',
      data: error,
      type: 'unknown'
    }
  }

  /**
   * Generate unique error ID
   * @returns {string} Unique error ID
   */
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Log error to console with formatting
   * @param {Object} errorData - Formatted error data
   */
  logToConsole(errorData) {
    const { severity, name, message, stack, context } = errorData
    
    const style = {
      error: 'color: #ff4444; font-weight: bold;',
      warn: 'color: #ffaa00; font-weight: bold;',
      info: 'color: #44aaff; font-weight: bold;'
    }
    
    console.group(`%c[${severity.toUpperCase()}] ${name || 'Error'}`, style[severity] || style.error)
    console.error('Message:', message)
    
    if (stack) {
      console.error('Stack:', stack)
    }
    
    if (Object.keys(context).length > 0) {
      console.error('Context:', context)
    }
    
    console.groupEnd()
  }

  /**
   * Store error locally for offline access
   * @param {Object} errorData - Formatted error data
   */
  storeErrorLocally(errorData) {
    try {
      const existingErrors = this.getStoredErrors()
      const updatedErrors = [...existingErrors, errorData].slice(-20) // Keep only last 20 errors
      
      localStorage.setItem('readlabel_errors', JSON.stringify(updatedErrors))
    } catch (error) {
      // Storage might be full or unavailable
      if (this.isDev) {
        console.warn('Failed to store error locally:', error)
      }
    }
  }

  /**
   * Get stored errors from localStorage
   * @returns {Array} Array of stored errors
   */
  getStoredErrors() {
    try {
      const stored = localStorage.getItem('readlabel_errors')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * Clear stored errors
   */
  clearStoredErrors() {
    try {
      localStorage.removeItem('readlabel_errors')
    } catch (error) {
      if (this.isDev) {
        console.warn('Failed to clear stored errors:', error)
      }
    }
  }

  /**
   * Send error to analytics service
   * @param {Object} errorData - Formatted error data
   */
  sendToAnalytics(errorData) {
    try {
      // Send custom event to Vercel Analytics
      if (window.va) {
        window.va('track', 'Error', {
          error_id: errorData.id,
          error_type: errorData.type,
          error_name: errorData.name || 'Unknown',
          error_message: errorData.message.substring(0, 100), // Limit message length
          severity: errorData.severity,
          url: errorData.url
        })
      }
    } catch (error) {
      if (this.isDev) {
        console.warn('Failed to send error to analytics:', error)
      }
    }
  }

  /**
   * Queue error for later sending when online
   * @param {Object} errorData - Formatted error data
   */
  queueError(errorData) {
    if (this.errorQueue.length >= this.maxQueueSize) {
      this.errorQueue.shift() // Remove oldest error
    }
    this.errorQueue.push(errorData)
  }

  /**
   * Flush queued errors when back online
   */
  flushErrorQueue() {
    if (this.errorQueue.length > 0) {
      const errors = [...this.errorQueue]
      this.errorQueue = []
      
      errors.forEach(error => this.sendToAnalytics(error))
    }
  }

  /**
   * Capture unhandled promise rejections
   */
  captureUnhandledRejections() {
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(event.reason, {
        type: 'unhandled_promise_rejection',
        promise: event.promise?.toString()
      }, 'error')
    })
  }

  /**
   * Capture global errors
   */
  captureGlobalErrors() {
    window.addEventListener('error', (event) => {
      this.logError(event.error || event.message, {
        type: 'global_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, 'error')
    })
  }

  /**
   * Initialize error capturing
   */
  initialize() {
    this.captureUnhandledRejections()
    this.captureGlobalErrors()
    
    if (this.isDev) {
      console.log('ErrorService initialized')
    }
  }

  /**
   * Create error report for user support
   * @returns {Object} Error report data
   */
  createErrorReport() {
    const errors = this.getStoredErrors()
    const recentErrors = errors.slice(-5) // Last 5 errors
    
    return {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errors: recentErrors.map(error => ({
        id: error.id,
        timestamp: error.timestamp,
        message: error.message,
        severity: error.severity,
        type: error.type
      }))
    }
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const errors = this.getStoredErrors()
    const now = Date.now()
    const oneHourAgo = now - (60 * 60 * 1000)
    const oneDayAgo = now - (24 * 60 * 60 * 1000)
    
    const recentErrors = errors.filter(error => 
      new Date(error.timestamp).getTime() > oneHourAgo
    )
    
    const dailyErrors = errors.filter(error => 
      new Date(error.timestamp).getTime() > oneDayAgo
    )
    
    const severityCounts = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1
      return acc
    }, {})
    
    return {
      totalErrors: errors.length,
      recentErrors: recentErrors.length,
      dailyErrors: dailyErrors.length,
      severityCounts,
      hasErrors: errors.length > 0
    }
  }
}

// Create singleton instance
export const errorService = new ErrorService()

// Initialize automatically
errorService.initialize()

export default errorService