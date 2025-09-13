import { ERROR_MESSAGES } from './constants.js'

/**
 * Custom error classes for different types of errors
 */
export class CameraError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'CameraError'
    this.code = code
  }
}

export class OCRError extends Error {
  constructor(message, confidence = 0) {
    super(message)
    this.name = 'OCRError'
    this.confidence = confidence
  }
}

export class APIError extends Error {
  constructor(message, status = 0, rateLimit = false) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.rateLimit = rateLimit
  }
}

export class AnalysisError extends Error {
  constructor(message, stage = 'unknown') {
    super(message)
    this.name = 'AnalysisError'
    this.stage = stage
  }
}

/**
 * Error handler utility functions
 */
export const errorHandler = {
  /**
   * Handle camera-related errors
   */
  handleCameraError(error) {
    console.error('Camera Error:', error)
    
    if (error.name === 'NotAllowedError') {
      return new CameraError(ERROR_MESSAGES.CAMERA_PERMISSION_DENIED, 'PERMISSION_DENIED')
    }
    
    if (error.name === 'NotFoundError') {
      return new CameraError('No camera found on this device', 'NO_CAMERA')
    }
    
    if (error.name === 'NotSupportedError') {
      return new CameraError(ERROR_MESSAGES.CAMERA_NOT_SUPPORTED, 'NOT_SUPPORTED')
    }
    
    return new CameraError('Camera access failed. Please try again.', 'UNKNOWN')
  },

  /**
   * Handle OCR-related errors
   */
  handleOCRError(error, confidence = 0) {
    console.error('OCR Error:', error)
    
    if (confidence < 60) {
      return new OCRError(
        'Text extraction confidence too low. Please ensure the label is clearly visible and well-lit.',
        confidence
      )
    }
    
    if (error.message?.includes('Worker')) {
      return new OCRError('OCR service initialization failed. Please refresh and try again.')
    }
    
    return new OCRError(ERROR_MESSAGES.OCR_FAILED, confidence)
  },

  /**
   * Handle API-related errors
   */
  handleAPIError(error) {
    console.error('API Error:', error)
    
    // Rate limiting errors
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return new APIError(ERROR_MESSAGES.API_LIMIT_REACHED, 429, true)
    }
    
    // Network errors
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      return new APIError(ERROR_MESSAGES.NETWORK_ERROR, 0)
    }
    
    // Authentication errors
    if (error.message?.includes('API key') || error.message?.includes('auth')) {
      return new APIError('Invalid API key. Please check configuration.', 401)
    }
    
    return new APIError('API request failed. Please try again.', 500)
  },

  /**
   * Handle analysis workflow errors
   */
  handleAnalysisError(error, stage = 'unknown') {
    console.error('Analysis Error:', error, 'at stage:', stage)
    
    if (error instanceof CameraError) {
      return error
    }
    
    if (error instanceof OCRError) {
      return error
    }
    
    if (error instanceof APIError) {
      return error
    }
    
    return new AnalysisError(`Analysis failed at ${stage}: ${error.message}`, stage)
  },

  /**
   * Get user-friendly error message
   */
  getUserMessage(error) {
    if (error instanceof CameraError) {
      return error.message
    }
    
    if (error instanceof OCRError) {
      return error.message
    }
    
    if (error instanceof APIError) {
      if (error.rateLimit) {
        return 'Daily limit reached. Analysis will continue offline.'
      }
      return error.message
    }
    
    if (error instanceof AnalysisError) {
      return error.message
    }
    
    return ERROR_MESSAGES.GENERIC_ERROR
  },

  /**
   * Check if error is recoverable
   */
  isRecoverable(error) {
    if (error instanceof CameraError) {
      return error.code !== 'NOT_SUPPORTED'
    }
    
    if (error instanceof OCRError) {
      return true // OCR errors are usually recoverable with better input
    }
    
    if (error instanceof APIError) {
      return !error.rateLimit // Rate limit errors require waiting
    }
    
    return true
  },

  /**
   * Get suggested action for error
   */
  getSuggestedAction(error) {
    if (error instanceof CameraError) {
      switch (error.code) {
        case 'PERMISSION_DENIED':
          return 'Please allow camera access in your browser settings.'
        case 'NO_CAMERA':
          return 'Please connect a camera or use a device with camera support.'
        case 'NOT_SUPPORTED':
          return 'Please use a modern browser that supports camera access.'
        default:
          return 'Please check your camera connection and try again.'
      }
    }
    
    if (error instanceof OCRError) {
      if (error.confidence > 0 && error.confidence < 60) {
        return 'Try improving lighting or moving closer to the label.'
      }
      return 'Ensure the ingredient label is clearly visible and try again.'
    }
    
    if (error instanceof APIError) {
      if (error.rateLimit) {
        return 'Analysis will continue offline until tomorrow.'
      }
      if (error.status === 0) {
        return 'Check your internet connection and try again.'
      }
      return 'Please try again in a moment.'
    }
    
    return 'Please try again or refresh the page.'
  }
}

/**
 * Logging utility for errors
 */
export const errorLogger = {
  log(error, context = {}) {
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    }
    
    // In development, log to console
    if (import.meta.env.DEV) {
      console.group('🔴 Error Log')
      console.error('Error:', error)
      console.log('Context:', context)
      console.groupEnd()
    }
    
    // In production, you might want to send to error reporting service
    // errorReportingService.report(errorData)
  },

  logAPIUsage(endpoint, success, responseTime) {
    if (import.meta.env.DEV) {
      console.log(`📊 API Usage: ${endpoint} - ${success ? '✅' : '❌'} - ${responseTime}ms`)
    }
  }
}

/**
 * Retry utility for failed operations
 */
export const retryHandler = {
  async retry(operation, maxRetries = 3, delay = 1000) {
    let lastError
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error
        
        // Don't retry certain types of errors
        if (error instanceof CameraError && error.code === 'PERMISSION_DENIED') {
          throw error
        }
        
        if (error instanceof APIError && error.rateLimit) {
          throw error
        }
        
        if (attempt === maxRetries) {
          break
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
    
    throw lastError
  }
}

export default {
  CameraError,
  OCRError,
  APIError,
  AnalysisError,
  errorHandler,
  errorLogger,
  retryHandler
}