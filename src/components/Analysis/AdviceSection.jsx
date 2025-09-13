const AdviceSection = ({ advice, warnings }) => {
  const getAdviceData = (advice) => {
    const lowercaseAdvice = advice?.toLowerCase() || ''
    
    if (lowercaseAdvice.includes('avoid') || lowercaseAdvice.includes('not recommend')) {
      return {
        emoji: '🚫',
        color: 'text-danger',
        bgColor: 'bg-danger/10',
        borderColor: 'border-danger/20',
        title: 'Avoid This Product',
        actionText: 'Consider finding healthier alternatives'
      }
    } else if (lowercaseAdvice.includes('occasionally') || lowercaseAdvice.includes('moderation')) {
      return {
        emoji: '⚠️',
        color: 'text-warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        title: 'Consume in Moderation',
        actionText: 'Limit consumption frequency'
      }
    } else if (lowercaseAdvice.includes('safe') || lowercaseAdvice.includes('good choice')) {
      return {
        emoji: '✅',
        color: 'text-success',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        title: 'Safe to Consume',
        actionText: 'Enjoy as part of balanced diet'
      }
    } else {
      return {
        emoji: '💡',
        color: 'text-info',
        bgColor: 'bg-info/10',
        borderColor: 'border-info/20',
        title: 'General Advice',
        actionText: 'Consider your dietary needs'
      }
    }
  }

  const adviceData = getAdviceData(advice)

  const healthTips = [
    {
      icon: '🥗',
      title: 'Read Labels',
      description: 'Always check ingredient lists, especially if you have allergies or dietary restrictions.'
    },
    {
      icon: '🏃‍♂️',
      title: 'Balanced Diet',
      description: 'Focus on whole foods and limit processed items when possible.'
    },
    {
      icon: '💧',
      title: 'Stay Hydrated',
      description: 'Many processed foods are high in sodium. Drink plenty of water.'
    },
    {
      icon: '📏',
      title: 'Portion Control',
      description: 'Even safe ingredients can be harmful in large quantities.'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Main Advice Card */}
      <div className={`rounded-xl p-6 border ${adviceData.bgColor} ${adviceData.borderColor}`}>
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{adviceData.emoji}</div>
          <h3 className={`text-xl font-bold mb-2 ${adviceData.color}`}>
            {adviceData.title}
          </h3>
        </div>
        
        <div className="bg-dark-800/50 rounded-lg p-4 mb-4">
          <p className="text-primary-200 leading-relaxed text-center">
            {advice}
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-primary-300">
            {adviceData.actionText}
          </p>
        </div>
      </div>

      {/* Health Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-danger text-xl">⚠️</span>
            <h4 className="font-semibold text-danger">Important Warnings</h4>
          </div>
          <div className="space-y-3">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-1.5 h-1.5 bg-danger rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-primary-200 leading-relaxed">{warning}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Health Tips */}
      <div className="bg-dark-800 rounded-xl p-4">
        <h4 className="font-semibold text-primary-100 mb-4 flex items-center space-x-2">
          <span>💡</span>
          <span>Healthy Eating Tips</span>
        </h4>
        <div className="grid grid-cols-1 gap-4">
          {healthTips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-dark-700 rounded-lg">
              <div className="text-xl flex-shrink-0">{tip.icon}</div>
              <div>
                <h5 className="font-medium text-primary-100 mb-1">{tip.title}</h5>
                <p className="text-sm text-primary-300">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alternative Suggestions */}
      <div className="bg-success/10 border border-success/20 rounded-xl p-4">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-success text-xl">🌱</span>
          <h4 className="font-semibold text-success">Healthier Alternatives</h4>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start space-x-3">
            <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
            <p className="text-primary-200">Look for products with fewer ingredients and recognizable names</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
            <p className="text-primary-200">Choose organic or natural alternatives when available</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
            <p className="text-primary-200">Consider making homemade versions of processed foods</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
            <p className="text-primary-200">Ask your local health food store for recommendations</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-dark-800 rounded-xl p-4 text-center">
        <p className="text-xs text-primary-400 leading-relaxed">
          <strong>Disclaimer:</strong> This analysis is for informational purposes only and should not replace professional medical advice. 
          Consult with healthcare providers for specific dietary concerns or health conditions.
        </p>
      </div>
    </div>
  )
}

export default AdviceSection