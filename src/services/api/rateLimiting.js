class RateLimiter {
  constructor() {
    this.maxDailyRequests = parseInt(import.meta.env.VITE_MAX_DAILY_REQUESTS) || 1500
    this.storageKey = 'readlabel_api_usage'
    this.resetHour = 0 // Reset at midnight UTC
  }

  getCurrentDate() {
    return new Date().toDateString()
  }

  getUsageData() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      if (!stored) {
        return this.createNewUsageData()
      }

      const data = JSON.parse(stored)
      
      // Check if we need to reset (new day)
      if (data.date !== this.getCurrentDate()) {
        return this.createNewUsageData()
      }

      return data
    } catch (error) {
      console.error('Error reading usage data:', error)
      return this.createNewUsageData()
    }
  }

  createNewUsageData() {
    return {
      date: this.getCurrentDate(),
      requests: 0,
      timestamps: [],
      lastReset: Date.now()
    }
  }

  saveUsageData(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving usage data:', error)
    }
  }

  canMakeRequest() {
    const usage = this.getUsageData()
    
    // Check daily limit
    if (usage.requests >= this.maxDailyRequests) {
      console.warn(`Daily API limit reached: ${usage.requests}/${this.maxDailyRequests}`)
      return false
    }

    // Check for burst protection (max 10 requests per minute)
    const now = Date.now()
    const oneMinuteAgo = now - (60 * 1000)
    const recentRequests = usage.timestamps.filter(timestamp => timestamp > oneMinuteAgo)
    
    if (recentRequests.length >= 10) {
      console.warn('Burst limit reached: 10 requests per minute')
      return false
    }

    return true
  }

  recordRequest() {
    const usage = this.getUsageData()
    const now = Date.now()
    
    // Update counters
    usage.requests++
    usage.timestamps.push(now)
    
    // Keep only recent timestamps (last hour)
    const oneHourAgo = now - (60 * 60 * 1000)
    usage.timestamps = usage.timestamps.filter(timestamp => timestamp > oneHourAgo)
    
    // Save updated usage
    this.saveUsageData(usage)
    
    console.log(`API request recorded. Usage: ${usage.requests}/${this.maxDailyRequests}`)
  }

  getRemainingRequests() {
    const usage = this.getUsageData()
    return Math.max(0, this.maxDailyRequests - usage.requests)
  }

  getRequestCount() {
    const usage = this.getUsageData()
    return usage.requests
  }

  getUsagePercentage() {
    const usage = this.getUsageData()
    return Math.round((usage.requests / this.maxDailyRequests) * 100)
  }

  resetUsage() {
    const newUsage = this.createNewUsageData()
    this.saveUsageData(newUsage)
    console.log('API usage reset')
  }

  getTimeUntilReset() {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    return tomorrow.getTime() - now.getTime()
  }

  getUsageStats() {
    const usage = this.getUsageData()
    return {
      requestsToday: usage.requests,
      maxDailyRequests: this.maxDailyRequests,
      remainingRequests: this.getRemainingRequests(),
      usagePercentage: this.getUsagePercentage(),
      timeUntilReset: this.getTimeUntilReset(),
      canMakeRequest: this.canMakeRequest(),
      lastRequestTime: usage.timestamps[usage.timestamps.length - 1] || null
    }
  }

  // Check if we're approaching limits
  isApproachingLimit(threshold = 0.9) {
    return this.getUsagePercentage() >= (threshold * 100)
  }

  // Get recommended delay between requests (in ms)
  getRecommendedDelay() {
    const usage = this.getUsageData()
    const remaining = this.getRemainingRequests()
    const hoursLeft = this.getTimeUntilReset() / (60 * 60 * 1000)
    
    if (remaining <= 0) {
      return Infinity // No more requests allowed
    }
    
    // If we have plenty of requests left, use minimum delay
    if (remaining > 100) {
      return 2000 // 2 seconds
    }
    
    // If approaching limit, spread remaining requests over remaining time
    const recommendedDelayMs = (hoursLeft * 60 * 60 * 1000) / remaining
    return Math.max(2000, Math.min(300000, recommendedDelayMs)) // Between 2s and 5m
  }

  // Emergency brake - completely disable API for severe abuse
  emergencyStop() {
    const usage = this.getUsageData()
    usage.requests = this.maxDailyRequests + 1000 // Exceed limit significantly
    this.saveUsageData(usage)
    console.error('Emergency stop activated - API disabled for today')
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter()

// Auto-reset at midnight
if (typeof window !== 'undefined') {
  const checkReset = () => {
    const usage = rateLimiter.getUsageData()
    if (usage.date !== rateLimiter.getCurrentDate()) {
      console.log('New day detected, resetting API usage')
      rateLimiter.resetUsage()
    }
  }
  
  // Check every hour
  setInterval(checkReset, 60 * 60 * 1000)
  
  // Check on page load
  checkReset()
}

export default rateLimiter