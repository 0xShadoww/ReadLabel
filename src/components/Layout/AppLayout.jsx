import { useEffect, useState } from 'react'
import Header from '../UI/Header'

const AppLayout = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Check if running in standalone PWA mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        window.navigator.standalone ||
                        document.referrer.includes('android-app://')

    setIsFullscreen(isStandalone)

    // Handle viewport changes for mobile devices
    const handleResize = () => {
      // Update CSS custom property for viewport height
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark-950 text-primary-50 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-primary-950/20 -z-10" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-900/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-800/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Header - hidden in camera mode for better UX */}
      <Header isFullscreen={isFullscreen} />

      {/* Main content area */}
      <main className="relative">
        <div 
          className="min-h-screen safe-area-top safe-area-bottom"
          style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
        >
          {children}
        </div>
      </main>

      {/* Status bar overlay for PWA */}
      {isFullscreen && (
        <div className="fixed top-0 left-0 right-0 h-safe-area-top bg-dark-950/80 backdrop-blur-sm z-50" />
      )}
    </div>
  )
}

export default AppLayout