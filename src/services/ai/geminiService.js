import { GoogleGenerativeAI } from '@google/generative-ai'
import { promptTemplates } from './promptTemplates.js'
import { rateLimiter } from '../api/rateLimiting.js'
import { ingredientDatabase } from '../database/ingredientDatabase.js'

class GeminiService {
  constructor() {
    this.genAI = null
    this.model = null
    this.initialized = false
    this.requestCount = 0
    this.lastRequestTime = 0
    this.minRequestInterval = 2000 // 2 seconds between requests for free tier
  }

  async initialize() {
    if (this.initialized) return

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('Gemini API key not found. The app will use offline mode.')
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey)
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' })
      this.initialized = true
      console.log('Gemini AI service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error)
      throw error
    }
  }

  async analyzeIngredients(ingredientText) {
    try {
      // Check rate limits first
      if (!rateLimiter.canMakeRequest()) {
        console.warn('Rate limit exceeded, using offline analysis')
        return await this.fallbackAnalysis(ingredientText)
      }

      // Initialize if needed
      await this.initialize()

      // Respect minimum interval between requests
      await this.enforceRateLimit()

      // Prepare the prompt
      const prompt = promptTemplates.ingredientAnalysis(ingredientText)

      console.log('Sending request to Gemini AI...')
      
      // Make the API request
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Update rate limiting
      rateLimiter.recordRequest()
      this.requestCount++
      this.lastRequestTime = Date.now()

      // Parse and validate the response
      const analysisResult = await this.parseGeminiResponse(text, ingredientText)
      
      console.log('Gemini AI analysis completed successfully')
      return analysisResult

    } catch (error) {
      console.error('Gemini API error:', error)
      
      // Handle specific error cases
      if (error.message?.includes('quota') || error.message?.includes('limit')) {
        console.warn('API quota exceeded, using offline analysis')
        return await this.fallbackAnalysis(ingredientText)
      }
      
      // For other errors, try fallback
      console.warn('API error, attempting offline analysis')
      return await this.fallbackAnalysis(ingredientText)
    }
  }

  async enforceRateLimit() {
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  async parseGeminiResponse(responseText, originalText) {
    try {
      // Try to parse as JSON first
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return this.validateAndCleanResponse(parsed)
      }

      // If no JSON found, create structured response from text
      return await this.parseTextResponse(responseText, originalText)

    } catch (error) {
      console.warn('Failed to parse Gemini response, using fallback:', error)
      return await this.fallbackAnalysis(originalText)
    }
  }

  async parseTextResponse(responseText, originalText) {
    // Extract health score
    const scoreMatch = responseText.match(/(?:health\s*score|score)[:\s]*(\d+(?:\.\d+)?)/i)
    const healthScore = scoreMatch ? Math.round(parseFloat(scoreMatch[1])) : 5

    // Extract ingredients and categorize them
    const ingredients = this.extractIngredients(originalText)
    const categories = await this.categorizeIngredients(ingredients)

    // Extract advice
    const advice = this.extractAdvice(responseText) || this.generateAdviceFromScore(healthScore)

    // Extract warnings
    const warnings = this.extractWarnings(responseText)

    return {
      healthScore: Math.max(1, Math.min(10, healthScore)),
      totalIngredients: ingredients.length,
      categories,
      advice,
      warnings,
      details: await this.getIngredientDetails(categories.highConcern.concat(categories.moderate)),
      source: 'gemini-ai'
    }
  }

  extractIngredients(text) {
    // Common patterns for ingredient lists
    const patterns = [
      /ingredients[:\s]*(.*?)(?:\.|$|nutritional|contains|allergen)/i,
      /contains[:\s]*(.*?)(?:\.|$|nutritional|allergen)/i
    ]

    let ingredientText = text
    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        ingredientText = match[1]
        break
      }
    }

    return ingredientText
      .split(/[,;]/)
      .map(ingredient => ingredient.trim())
      .filter(ingredient => ingredient.length > 2)
      .slice(0, 20) // Limit to 20 ingredients max
  }

  async categorizeIngredients(ingredients) {
    const categories = { safe: [], moderate: [], highConcern: [] }
    
    for (const ingredient of ingredients) {
      const category = await ingredientDatabase.getIngredientRisk(ingredient)
      categories[category].push(ingredient)
    }

    return categories
  }

  extractAdvice(text) {
    const advicePatterns = [
      /advice[:\s]*([^.!?]*[.!?])/i,
      /recommend[:\s]*([^.!?]*[.!?])/i,
      /consumption[:\s]*([^.!?]*[.!?])/i
    ]

    for (const pattern of advicePatterns) {
      const match = text.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }

    return null
  }

  extractWarnings(text) {
    const warnings = []
    const warningPatterns = [
      /warning[:\s]*([^.!?]*[.!?])/gi,
      /caution[:\s]*([^.!?]*[.!?])/gi,
      /avoid[:\s]*([^.!?]*[.!?])/gi
    ]

    for (const pattern of warningPatterns) {
      const matches = text.matchAll(pattern)
      for (const match of matches) {
        if (match[1]) {
          warnings.push(match[1].trim())
        }
      }
    }

    return warnings
  }

  generateAdviceFromScore(score) {
    if (score >= 8) return 'This product appears to be a healthy choice with mostly natural ingredients.'
    if (score >= 6) return 'Consume in moderation. Some ingredients may pose health concerns.'
    return 'Consider avoiding this product or finding healthier alternatives.'
  }

  async getIngredientDetails(concernIngredients) {
    const details = {}
    
    for (const ingredient of concernIngredients) {
      const info = await ingredientDatabase.getIngredientInfo(ingredient)
      if (info) {
        details[ingredient] = {
          risk: info.category || 'moderate',
          description: info.description || 'No additional information available'
        }
      }
    }

    return details
  }

  validateAndCleanResponse(response) {
    return {
      healthScore: Math.max(1, Math.min(10, parseInt(response.healthScore) || 5)),
      totalIngredients: parseInt(response.totalIngredients) || 0,
      categories: {
        safe: Array.isArray(response.categories?.safe) ? response.categories.safe : [],
        moderate: Array.isArray(response.categories?.moderate) ? response.categories.moderate : [],
        highConcern: Array.isArray(response.categories?.highConcern) ? response.categories.highConcern : []
      },
      advice: typeof response.advice === 'string' ? response.advice : 'No specific advice available',
      warnings: Array.isArray(response.warnings) ? response.warnings : [],
      details: typeof response.details === 'object' ? response.details : {},
      source: 'gemini-ai'
    }
  }

  async fallbackAnalysis(ingredientText) {
    console.log('Using offline ingredient analysis')
    
    const ingredients = this.extractIngredients(ingredientText)
    const categories = await this.categorizeIngredients(ingredients)
    
    // Calculate health score based on categories
    const totalIngredients = ingredients.length
    const highConcernCount = categories.highConcern.length
    const moderateCount = categories.moderate.length
    const safeCount = categories.safe.length
    
    let healthScore = 10
    healthScore -= (highConcernCount * 2) // -2 points per high concern
    healthScore -= (moderateCount * 1)    // -1 point per moderate concern
    healthScore = Math.max(1, Math.min(10, healthScore))

    return {
      healthScore,
      totalIngredients,
      categories,
      advice: this.generateAdviceFromScore(healthScore),
      warnings: await this.generateWarningsFromCategories(categories.highConcern),
      details: await this.getIngredientDetails(categories.highConcern.concat(categories.moderate)),
      source: 'offline-database'
    }
  }

  async generateWarningsFromCategories(highConcernIngredients) {
    const warnings = []
    
    for (const ingredient of highConcernIngredients) {
      const info = await ingredientDatabase.getIngredientInfo(ingredient)
      if (info && info.warning) {
        warnings.push(info.warning)
      }
    }

    // Generic warnings if none found
    if (warnings.length === 0 && highConcernIngredients.length > 0) {
      warnings.push('Contains ingredients that may pose health risks when consumed regularly')
    }

    return warnings
  }

  getRemainingRequests() {
    return rateLimiter.getRemainingRequests()
  }

  getUsageStats() {
    return {
      requestsToday: rateLimiter.getRequestCount(),
      remainingRequests: this.getRemainingRequests(),
      canMakeRequest: rateLimiter.canMakeRequest()
    }
  }
}

// Create singleton instance
const geminiService = new GeminiService()

export default geminiService