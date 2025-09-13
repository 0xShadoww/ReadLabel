import { useState, useEffect } from 'react'

const Header = ({ isFullscreen = false }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Hide header when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${isFullscreen ? 'pt-safe-area-top' : ''}
      `}
    >
      <div className="bg-dark-900/80 backdrop-blur-md border-b border-dark-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-primary-50">
                  ReadLabel
                </h1>
                <p className="text-xs text-primary-400 -mt-1">
                  AI-Powered Food Analysis
                </p>
              </div>
            </div>

            {/* Status indicator */}
            <div className="flex items-center space-x-2">
              {navigator.onLine ? (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-xs text-primary-400">Online</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-warning rounded-full" />
                  <span className="text-xs text-primary-400">Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header