const HealthScore = ({ score }) => {
  const getScoreData = (score) => {
    if (score >= 8) {
      return {
        color: 'text-success',
        bgColor: 'bg-success/20',
        borderColor: 'border-success/30',
        label: 'Excellent Choice',
        description: 'This product has mostly natural, safe ingredients with minimal health concerns.',
        emoji: '✅'
      }
    } else if (score >= 6) {
      return {
        color: 'text-warning',
        bgColor: 'bg-warning/20',
        borderColor: 'border-warning/30',
        label: 'Moderate Concern',
        description: 'Contains some ingredients that may pose health risks. Consider consuming in moderation.',
        emoji: '⚠️'
      }
    } else {
      return {
        color: 'text-danger',
        bgColor: 'bg-danger/20',
        borderColor: 'border-danger/30',
        label: 'High Concern',
        description: 'Contains multiple concerning ingredients. Consider avoiding or finding alternatives.',
        emoji: '🚫'
      }
    }
  }

  const scoreData = getScoreData(score)
  const percentage = (score / 10) * 100

  return (
    <div className={`rounded-xl p-6 border ${scoreData.bgColor} ${scoreData.borderColor}`}>
      {/* Score circle */}
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-dark-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className={scoreData.color}
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.827} 282.7`}
              style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
            />
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-3xl font-bold ${scoreData.color}`}>
                {score}
              </div>
              <div className="text-sm text-primary-400">out of 10</div>
            </div>
          </div>
        </div>
      </div>

      {/* Score label and emoji */}
      <div className="text-center mb-4">
        <div className="text-3xl mb-2">{scoreData.emoji}</div>
        <h3 className={`text-xl font-bold mb-2 ${scoreData.color}`}>
          {scoreData.label}
        </h3>
        <p className="text-primary-300 leading-relaxed">
          {scoreData.description}
        </p>
      </div>

      {/* Score breakdown bars */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-primary-400">Ingredient Safety</span>
          <span className="text-primary-200">{Math.min(score + 1, 10)}/10</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-success to-warning h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min((score + 1) * 10, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-primary-400">Processing Level</span>
          <span className="text-primary-200">{Math.max(score - 1, 1)}/10</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-warning to-danger h-2 rounded-full transition-all duration-1000"
            style={{ width: `${Math.max((score - 1) * 10, 10)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-primary-400">Overall Health Impact</span>
          <span className="text-primary-200">{score}/10</span>
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              score >= 8 ? 'bg-success' : score >= 6 ? 'bg-warning' : 'bg-danger'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default HealthScore