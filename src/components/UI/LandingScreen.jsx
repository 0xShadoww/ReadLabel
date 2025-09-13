import { useEffect, useState } from 'react'

const LandingScreen = ({ onScanStart }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-8">
      <div className={`max-w-md w-full text-center transform transition-all duration-1000 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}>
        
        {/* Hero Icon */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center shadow-strong relative overflow-hidden">
            <div className="text-5xl">🔍</div>
            
            {/* Animated ring */}
            <div className="absolute inset-0 rounded-3xl border-2 border-primary-400 animate-ping opacity-20" />
            <div className="absolute inset-2 rounded-2xl border border-primary-300/30" />
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl font-display font-bold mb-4 leading-tight">
          <span className="gradient-text">Know what goes</span>
          <br />
          <span className="text-primary-100">in your body</span>
        </h1>

        {/* Description */}
        <p className="text-lg text-primary-300 mb-8 leading-relaxed">
          Scan ingredient labels with AI-powered analysis to make informed food choices for better health.
        </p>

        {/* Features list */}
        <div className="space-y-4 mb-10 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-success rounded-full" />
            </div>
            <span className="text-primary-200">Instant ingredient analysis</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-info/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-info rounded-full" />
            </div>
            <span className="text-primary-200">Health risk assessment</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-warning rounded-full" />
            </div>
            <span className="text-primary-200">Personalized consumption advice</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full" />
            </div>
            <span className="text-primary-200">Works offline</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onScanStart}
          className="btn-primary w-full text-lg py-4 relative overflow-hidden group touch-manipulation"
        >
          <span className="relative z-10 flex items-center justify-center space-x-2">
            <span>📷</span>
            <span>Scan Label</span>
          </span>
          
          {/* Button shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000" />
        </button>

        {/* Footer text */}
        <p className="text-sm text-primary-400 mt-6">
          Powered by Google Gemini AI • Privacy-first • No data stored
        </p>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-8 w-2 h-2 bg-primary-500/30 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-12 w-1 h-1 bg-success/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-16 w-1.5 h-1.5 bg-warning/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute bottom-1/4 right-8 w-1 h-1 bg-info/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.5s' }} />
      </div>
    </div>
  )
}

export default LandingScreen