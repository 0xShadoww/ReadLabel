import { useState, useCallback } from 'react'
import geminiService from '../services/ai/geminiService.js'

export const useAnalysis = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const analyzeIngredients = useCallback(async (ingredientText) => {
    setIsLoading(true)
    setError(null)

    try {
      const results = await geminiService.analyzeIngredients(ingredientText)
      setIsLoading(false)
      return results
      
    } catch (err) {
      setIsLoading(false)
      setError(err.message || 'Failed to analyze ingredients')
      throw err
    }
  }, [])

  // Get usage statistics for display
  const getUsageStats = useCallback(() => {
    return geminiService.getUsageStats()
  }, [])

  return {
    analyzeIngredients,
    getUsageStats,
    isLoading,
    error
  }
}
