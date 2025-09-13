// App Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'ReadLabel',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  isDevelopment: import.meta.env.DEV,
  enableLogs: import.meta.env.VITE_ENABLE_LOGS === 'true'
}

// API Configuration
export const API_CONFIG = {
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY,
  maxDailyRequests: parseInt(import.meta.env.VITE_MAX_DAILY_REQUESTS) || 1500,
  cacheDurationHours: parseInt(import.meta.env.VITE_CACHE_DURATION_HOURS) || 24,
  rateLimitWindow: 60 * 1000, // 1 minute
  rateLimitMaxRequests: 10
}

// Health Scoring
export const HEALTH_SCORES = {
  EXCELLENT: { min: 9, max: 10, label: 'Excellent Choice', color: 'success' },
  GOOD: { min: 7, max: 8, label: 'Good Choice', color: 'success' },
  MODERATE: { min: 5, max: 6, label: 'Moderate Concern', color: 'warning' },
  POOR: { min: 3, max: 4, label: 'Poor Choice', color: 'danger' },
  AVOID: { min: 1, max: 2, label: 'Avoid', color: 'danger' }
}

// Ingredient Categories
export const INGREDIENT_CATEGORIES = {
  SAFE: 'safe',
  MODERATE: 'moderate',
  HIGH_CONCERN: 'highConcern'
}

// Risk Category Colors
export const RISK_COLORS = {
  [INGREDIENT_CATEGORIES.SAFE]: '#00FF88',
  [INGREDIENT_CATEGORIES.MODERATE]: '#FFD700', 
  [INGREDIENT_CATEGORIES.HIGH_CONCERN]: '#FF3B30'
}

// OCR Configuration
export const OCR_CONFIG = {
  confidence: {
    minimum: 60, // Minimum confidence to accept OCR results
    good: 80,    // Good confidence threshold
    excellent: 90 // Excellent confidence threshold
  },
  preprocessing: {
    contrast: 1.2,
    brightness: 1.1,
    noiseReduction: true
  }
}

// Camera Configuration
export const CAMERA_CONFIG = {
  facingMode: 'environment', // Back camera preferred
  width: { ideal: 1920, max: 1920 },
  height: { ideal: 1080, max: 1080 },
  frameRate: { ideal: 30, max: 30 }
}

// Storage Keys
export const STORAGE_KEYS = {
  API_USAGE: 'readlabel_api_usage',
  ANALYSIS_CACHE: 'readlabel_analysis_cache',
  USER_PREFERENCES: 'readlabel_preferences',
  PWA_INSTALL_DISMISSED: 'pwa-install-dismissed'
}

// Cache Configuration
export const CACHE_CONFIG = {
  analysisResults: 24 * 60 * 60 * 1000, // 24 hours
  ocrResults: 7 * 24 * 60 * 60 * 1000,  // 7 days
  ingredientData: 30 * 24 * 60 * 60 * 1000 // 30 days
}

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  loading: 1000
}

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: '(max-width: 767px)',
  tablet: '(min-width: 768px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)'
}

// Error Messages
export const ERROR_MESSAGES = {
  CAMERA_NOT_SUPPORTED: 'Camera is not supported on this device',
  CAMERA_PERMISSION_DENIED: 'Camera permission denied. Please enable camera access.',
  OCR_FAILED: 'Failed to extract text from image. Please try again with better lighting.',
  API_LIMIT_REACHED: 'Daily API limit reached. Using offline analysis.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  ANALYSIS_COMPLETE: 'Analysis completed successfully',
  IMAGE_CAPTURED: 'Image captured successfully',
  OCR_COMPLETE: 'Text extraction completed'
}

// Feature Flags
export const FEATURES = {
  OFFLINE_MODE: true,
  PWA_INSTALL: true,
  ANALYTICS: false, // Disabled for privacy
  SHARE_RESULTS: true,
  EXPORT_RESULTS: false
}

// Default Values
export const DEFAULTS = {
  HEALTH_SCORE: 5,
  ANALYSIS_TIMEOUT: 30000, // 30 seconds
  IMAGE_QUALITY: 0.8,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024 // 5MB
}