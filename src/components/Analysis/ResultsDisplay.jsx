import { useState, useEffect } from 'react'
import HealthScore from './HealthScore'
import IngredientCategories from './IngredientCategories'
import AdviceSection from './AdviceSection'

const ResultsDisplay = ({ data, image, onScanAnother, onRetry }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Animate in results
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">No Results Available</h2>
          <p className="text-primary-300 mb-6">Unable to display analysis results</p>
          <button onClick={onRetry} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-success'
    if (score >= 6) return 'text-warning'
    return 'text-danger'
  }

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Good Choice'
    if (score >= 6) return 'Moderate Risk'
    return 'High Concern'
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-20 pb-8">
      <div className={`transition-all duration-700 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        
        {/* Header with image and score */}
        <div className="px-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-xl overflow-hidden shadow-medium">
              <img 
                src={image?.url} 
                alt="Scanned product"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`text-3xl font-bold ${getScoreColor(data.healthScore)}`}>
                  {data.healthScore}/10
                </span>
                <div className="text-primary-300">Health Score</div>
              </div>
              <div className={`text-sm font-medium ${getScoreColor(data.healthScore)}`}>
                {getScoreLabel(data.healthScore)}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-100">{data.totalIngredients}</div>
              <div className="text-sm text-primary-400">Total Ingredients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-danger">{data.categories.highConcern.length}</div>
              <div className="text-sm text-primary-400">High Concern</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{data.categories.safe.length}</div>
              <div className="text-sm text-primary-400">Safe</div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="px-6 mb-6">
          <div className="flex bg-dark-800 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-primary-300 hover:text-primary-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'ingredients' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-primary-300 hover:text-primary-100'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('advice')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'advice' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-primary-300 hover:text-primary-100'
              }`}
            >
              Advice
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="px-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <HealthScore score={data.healthScore} />
              
              {/* Warnings */}
              {data.warnings && data.warnings.length > 0 && (
                <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="text-danger">⚠️</div>
                    <h3 className="font-semibold text-danger">Health Warnings</h3>
                  </div>
                  <div className="space-y-2">
                    {data.warnings.map((warning, index) => (
                      <div key={index} className="text-sm text-primary-200 flex items-start space-x-2">
                        <div className="text-danger mt-1">•</div>
                        <span>{warning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consumption advice */}
              <div className="bg-info/10 border border-info/20 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="text-info">💡</div>
                  <h3 className="font-semibold text-info">Recommendation</h3>
                </div>
                <p className="text-primary-200">{data.advice}</p>
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <IngredientCategories categories={data.categories} details={data.details} />
          )}

          {activeTab === 'advice' && (
            <AdviceSection advice={data.advice} warnings={data.warnings} />
          )}
        </div>

        {/* Action buttons */}
        <div className="px-6 mt-8 space-y-3">
          <button
            onClick={onScanAnother}
            className="btn-primary w-full"
          >
            📷 Scan Another Label
          </button>
          
          <button
            onClick={onRetry}
            className="btn-ghost w-full"
          >
            🔄 Retry Analysis
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 mt-6 text-center">
          <p className="text-xs text-primary-400">
            Analysis based on current food safety regulations and health research.
            Consult healthcare professionals for specific dietary concerns.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultsDisplay