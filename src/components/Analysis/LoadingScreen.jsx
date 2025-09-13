import { useState, useEffect } from 'react'
import { useOCR } from '../../hooks/useOCR'
import { useAnalysis } from '../../hooks/useAnalysis'

const LoadingScreen = ({ image, onAnalysisComplete, onAnalysisError, onBack }) => {
  const [stage, setStage] = useState('processing')
  const [progress, setProgress] = useState(0)
  const [extractedText, setExtractedText] = useState('')

  const {
    extractText,
    isLoading: ocrLoading,
    error: ocrError
  } = useOCR()

  const {
    analyzeIngredients,
    isLoading: analysisLoading,
    error: analysisError
  } = useAnalysis()

  useEffect(() => {
    if (image) {
      processImage()
    }
  }, [image])

  const processImage = async () => {
    try {
      // Stage 1: OCR Processing
      setStage('ocr')
      setProgress(10)

      const text = await extractText(image.blob)
      setExtractedText(text)
      setProgress(50)

      if (!text || text.trim().length < 10) {
        throw new Error('Could not extract readable text from the image. Please try capturing the label again with better lighting.')
      }

      // Stage 2: AI Analysis
      setStage('analysis')
      setProgress(60)

      const results = await analyzeIngredients(text)
      setProgress(90)

      // Stage 3: Complete
      setStage('complete')
      setProgress(100)

      setTimeout(() => {
        onAnalysisComplete(results)
      }, 500)

    } catch (error) {
      console.error('Analysis error:', error)
      onAnalysisError(error.message || 'Failed to analyze ingredients')
    }
  }

  const getStageInfo = () => {
    switch (stage) {
      case 'processing':
        return {
          title: 'Processing Image...',
          description: 'Preparing image for analysis',
          emoji: '📸'
        }
      case 'ocr':
        return {
          title: 'Reading Ingredients...',
          description: 'Extracting text from ingredient label',
          emoji: '🔍'
        }
      case 'analysis':
        return {
          title: 'Analyzing Health Impact...',
          description: 'AI is evaluating ingredient safety',
          emoji: '🧠'
        }
      case 'complete':
        return {
          title: 'Analysis Complete!',
          description: 'Preparing your health report',
          emoji: '✅'
        }
      default:
        return {
          title: 'Processing...',
          description: 'Please wait',
          emoji: '⏳'
        }
    }
  }

  const stageInfo = getStageInfo()

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Captured image preview */}
        <div className="mb-8 relative">
          <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden shadow-medium">
            <img 
              src={image?.url} 
              alt="Captured label"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Loading ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-dark-700 border-t-primary-500 rounded-full animate-spin" />
          </div>
        </div>

        {/* Stage information */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">{stageInfo.emoji}</div>
          <h2 className="text-2xl font-bold mb-2">{stageInfo.title}</h2>
          <p className="text-primary-300">{stageInfo.description}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-primary-400 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary-600 to-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stage indicators */}
        <div className="flex justify-between mb-8">
          <div className={`flex flex-col items-center text-xs ${
            ['processing', 'ocr', 'analysis', 'complete'].includes(stage) ? 'text-primary-500' : 'text-primary-600'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              ['processing', 'ocr', 'analysis', 'complete'].includes(stage) ? 'bg-primary-500 text-white' : 'bg-dark-700'
            }`}>
              📸
            </div>
            <span>Process</span>
          </div>

          <div className={`flex flex-col items-center text-xs ${
            ['ocr', 'analysis', 'complete'].includes(stage) ? 'text-primary-500' : 'text-primary-600'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              ['ocr', 'analysis', 'complete'].includes(stage) ? 'bg-primary-500 text-white' : 'bg-dark-700'
            }`}>
              🔍
            </div>
            <span>Extract</span>
          </div>

          <div className={`flex flex-col items-center text-xs ${
            ['analysis', 'complete'].includes(stage) ? 'text-primary-500' : 'text-primary-600'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              ['analysis', 'complete'].includes(stage) ? 'bg-primary-500 text-white' : 'bg-dark-700'
            }`}>
              🧠
            </div>
            <span>Analyze</span>
          </div>

          <div className={`flex flex-col items-center text-xs ${
            stage === 'complete' ? 'text-success' : 'text-primary-600'
          }`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
              stage === 'complete' ? 'bg-success text-white' : 'bg-dark-700'
            }`}>
              ✅
            </div>
            <span>Complete</span>
          </div>
        </div>

        {/* Extracted text preview (for debugging) */}
        {extractedText && import.meta.env.DEV && (
          <div className="bg-dark-800 rounded-lg p-3 mb-4">
            <div className="text-xs text-primary-400 mb-1">Extracted Text:</div>
            <div className="text-sm text-primary-200 max-h-20 overflow-y-auto">
              {extractedText.substring(0, 200)}
              {extractedText.length > 200 && '...'}
            </div>
          </div>
        )}

        {/* Cancel button */}
        <button
          onClick={onBack}
          className="btn-ghost w-full"
        >
          Cancel
        </button>

        {/* Fun facts while waiting */}
        <div className="text-center mt-6">
          <p className="text-xs text-primary-400">
            💡 Did you know? ReadLabel can identify over 500 food additives and preservatives!
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen