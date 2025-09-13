import Tesseract from 'tesseract.js'
import { preprocessImage } from './imagePreprocessing.js'

class TesseractService {
  constructor() {
    this.worker = null
    this.isInitialized = false
  }

  async initializeWorker() {
    if (this.isInitialized && this.worker) {
      return this.worker
    }

    try {
      console.log('Initializing Tesseract OCR worker...')
      
      this.worker = await Tesseract.createWorker({
        logger: (m) => {
          if (import.meta.env.DEV) {
            console.log('Tesseract:', m)
          }
        }
      })

      await this.worker.loadLanguage('eng')
      await this.worker.initialize('eng')
      
      // Set parameters for better text recognition
      await this.worker.setParameters({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,()%/-: ',
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
      })

      this.isInitialized = true
      console.log('Tesseract OCR worker initialized successfully')
      return this.worker

    } catch (error) {
      console.error('Failed to initialize Tesseract worker:', error)
      throw new Error('OCR initialization failed')
    }
  }

  async extractText(imageInput) {
    try {
      // Ensure worker is initialized
      await this.initializeWorker()

      // Preprocess the image for better OCR accuracy
      const processedImage = await preprocessImage(imageInput)

      console.log('Starting OCR text extraction...')
      
      const { data } = await this.worker.recognize(processedImage)
      
      // Clean and validate extracted text
      const cleanText = this.cleanExtractedText(data.text)
      
      if (!cleanText || cleanText.length < 5) {
        throw new Error('Could not extract readable text from the image. Please ensure the label is clearly visible and well-lit.')
      }

      console.log('OCR extraction completed:', cleanText.substring(0, 100) + '...')
      return cleanText

    } catch (error) {
      console.error('OCR extraction failed:', error)
      throw error
    }
  }

  cleanExtractedText(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      return ''
    }

    return rawText
      // Remove multiple whitespaces and newlines
      .replace(/\s+/g, ' ')
      // Remove special characters that aren't relevant to ingredients
      .replace(/[^\w\s.,()%\-:]/g, '')
      // Trim whitespace
      .trim()
      // Remove very short words that are likely OCR errors
      .split(' ')
      .filter(word => word.length > 1 || ['(', ')', ',', '.'].includes(word))
      .join(' ')
  }

  async terminateWorker() {
    if (this.worker) {
      try {
        await this.worker.terminate()
        this.worker = null
        this.isInitialized = false
        console.log('Tesseract worker terminated')
      } catch (error) {
        console.error('Error terminating Tesseract worker:', error)
      }
    }
  }

  // Get OCR confidence score
  async getConfidenceScore(imageInput) {
    try {
      await this.initializeWorker()
      const { data } = await this.worker.recognize(imageInput)
      return data.confidence || 0
    } catch (error) {
      console.error('Error getting confidence score:', error)
      return 0
    }
  }
}

// Create singleton instance
const tesseractService = new TesseractService()

// Cleanup worker when page unloads
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    tesseractService.terminateWorker()
  })
}

export default tesseractService