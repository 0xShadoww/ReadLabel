import { useState, useCallback } from 'react'
import tesseractService from '../services/ocr/tesseractService.js'

export const useOCR = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const extractText = useCallback(async (imageBlob) => {
    setIsLoading(true)
    setError(null)

    try {
      const extractedText = await tesseractService.extractText(imageBlob)
      setIsLoading(false)
      return extractedText
      
    } catch (err) {
      setIsLoading(false)
      setError(err.message || 'Failed to extract text from image')
      throw err
    }
  }, [])

  return {
    extractText,
    isLoading,
    error
  }
}
