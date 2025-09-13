import { useState } from 'react'

const IngredientCategories = ({ categories, details }) => {
  const [expandedIngredient, setExpandedIngredient] = useState(null)

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'safe': return '✅'
      case 'moderate': return '⚠️'
      case 'highConcern': return '🚫'
      default: return '❓'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'safe': return 'text-success'
      case 'moderate': return 'text-warning'
      case 'highConcern': return 'text-danger'
      default: return 'text-primary-400'
    }
  }

  const getCategoryBg = (category) => {
    switch (category) {
      case 'safe': return 'bg-success/10 border-success/20'
      case 'moderate': return 'bg-warning/10 border-warning/20'
      case 'highConcern': return 'bg-danger/10 border-danger/20'
      default: return 'bg-primary/10 border-primary/20'
    }
  }

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'safe': return 'Safe Ingredients'
      case 'moderate': return 'Moderate Concern'
      case 'highConcern': return 'High Concern'
      default: return 'Unknown'
    }
  }

  const handleIngredientClick = (ingredient) => {
    setExpandedIngredient(expandedIngredient === ingredient ? null : ingredient)
  }

  const renderIngredientList = (ingredientList, category) => {
    if (!ingredientList || ingredientList.length === 0) {
      return (
        <p className="text-primary-400 text-sm italic">
          No ingredients in this category
        </p>
      )
    }

    return (
      <div className="space-y-2">
        {ingredientList.map((ingredient, index) => {
          const hasDetails = details && details[ingredient]
          const isExpanded = expandedIngredient === ingredient

          return (
            <div key={index} className="group">
              <div
                className={`
                  p-3 rounded-lg transition-colors cursor-pointer
                  ${hasDetails 
                    ? 'hover:bg-dark-700 border border-dark-600 hover:border-dark-500' 
                    : 'bg-dark-800'
                  }
                `}
                onClick={() => hasDetails && handleIngredientClick(ingredient)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{getCategoryIcon(category)}</span>
                    <span className="text-primary-100">{ingredient}</span>
                  </div>
                  
                  {hasDetails && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-primary-400">Details</span>
                      <svg 
                        className={`w-4 h-4 text-primary-400 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Expanded details */}
                {hasDetails && isExpanded && (
                  <div className="mt-3 pt-3 border-t border-dark-600">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-primary-400">Risk Level:</span>
                        <span className={`text-xs font-medium capitalize ${
                          details[ingredient].risk === 'high' ? 'text-danger' :
                          details[ingredient].risk === 'moderate' ? 'text-warning' :
                          'text-success'
                        }`}>
                          {details[ingredient].risk}
                        </span>
                      </div>
                      <p className="text-sm text-primary-300 leading-relaxed">
                        {details[ingredient].description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* High Concern Ingredients */}
      <div className={`rounded-xl p-4 border ${getCategoryBg('highConcern')}`}>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl">{getCategoryIcon('highConcern')}</span>
          <div>
            <h3 className={`font-semibold ${getCategoryColor('highConcern')}`}>
              {getCategoryTitle('highConcern')}
            </h3>
            <p className="text-xs text-primary-400">
              {categories.highConcern?.length || 0} ingredients
            </p>
          </div>
        </div>
        {renderIngredientList(categories.highConcern, 'highConcern')}
      </div>

      {/* Moderate Concern Ingredients */}
      <div className={`rounded-xl p-4 border ${getCategoryBg('moderate')}`}>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl">{getCategoryIcon('moderate')}</span>
          <div>
            <h3 className={`font-semibold ${getCategoryColor('moderate')}`}>
              {getCategoryTitle('moderate')}
            </h3>
            <p className="text-xs text-primary-400">
              {categories.moderate?.length || 0} ingredients
            </p>
          </div>
        </div>
        {renderIngredientList(categories.moderate, 'moderate')}
      </div>

      {/* Safe Ingredients */}
      <div className={`rounded-xl p-4 border ${getCategoryBg('safe')}`}>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl">{getCategoryIcon('safe')}</span>
          <div>
            <h3 className={`font-semibold ${getCategoryColor('safe')}`}>
              {getCategoryTitle('safe')}
            </h3>
            <p className="text-xs text-primary-400">
              {categories.safe?.length || 0} ingredients
            </p>
          </div>
        </div>
        {renderIngredientList(categories.safe, 'safe')}
      </div>

      {/* Summary */}
      <div className="bg-dark-800 rounded-xl p-4">
        <h4 className="font-semibold text-primary-100 mb-3">Category Summary</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${getCategoryColor('safe')}`}>
              {categories.safe?.length || 0}
            </div>
            <div className="text-xs text-primary-400">Safe</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${getCategoryColor('moderate')}`}>
              {categories.moderate?.length || 0}
            </div>
            <div className="text-xs text-primary-400">Moderate</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${getCategoryColor('highConcern')}`}>
              {categories.highConcern?.length || 0}
            </div>
            <div className="text-xs text-primary-400">High Risk</div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-primary-400">
          Tap ingredients with details to learn more about health impacts
        </p>
      </div>
    </div>
  )
}

export default IngredientCategories