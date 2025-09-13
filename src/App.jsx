import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppLayout from './components/Layout/AppLayout'
import LandingScreen from './components/UI/LandingScreen'
import CameraInterface from './components/Camera/CameraInterface'
import LoadingScreen from './components/Analysis/LoadingScreen'
import ResultsDisplay from './components/Analysis/ResultsDisplay'
import ErrorBoundary from './components/UI/ErrorBoundary'
import CameraTest from './components/CameraTest'
import { usePWAInstall } from './hooks/usePWAInstall'

// Application states
const STATES = {
  LANDING: 'landing',
  CAMERA: 'camera',
  ANALYZING: 'analyzing',
  RESULTS: 'results',
  ERROR: 'error'
}

function App() {
  const [appState, setAppState] = useState(STATES.LANDING)
  const [analysisData, setAnalysisData] = useState(null)
  const [error, setError] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  
  // PWA install functionality
  const { showInstallPrompt, installApp, dismissInstall } = usePWAInstall()

  // Handle app state transitions
  const handleScanStart = () => {
    setAppState(STATES.CAMERA)
    setError(null)
  }

  const handleImageCapture = (imageData) => {
    setCapturedImage(imageData)
    setAppState(STATES.ANALYZING)
    // Analysis will be triggered in LoadingScreen component
  }

  const handleAnalysisComplete = (results) => {
    setAnalysisData(results)
    setAppState(STATES.RESULTS)
  }

  const handleAnalysisError = (errorMessage) => {
    setError(errorMessage)
    setAppState(STATES.ERROR)
  }

  const handleRetry = () => {
    setAppState(STATES.CAMERA)
    setError(null)
    setAnalysisData(null)
    setCapturedImage(null)
  }

  const handleStartOver = () => {
    setAppState(STATES.LANDING)
    setError(null)
    setAnalysisData(null)
    setCapturedImage(null)
  }

  // Handle PWA install prompt
  useEffect(() => {
    const handleInstallClick = () => {
      installApp()
    }

    const handleDismissClick = () => {
      dismissInstall()
    }

    const installAcceptBtn = document.getElementById('install-accept')
    const installDismissBtn = document.getElementById('install-dismiss')
    const installPrompt = document.getElementById('install-prompt')

    if (showInstallPrompt && installPrompt) {
      installPrompt.classList.remove('hidden')
    }

    if (installAcceptBtn) {
      installAcceptBtn.addEventListener('click', handleInstallClick)
    }

    if (installDismissBtn) {
      installDismissBtn.addEventListener('click', handleDismissClick)
    }

    return () => {
      if (installAcceptBtn) {
        installAcceptBtn.removeEventListener('click', handleInstallClick)
      }
      if (installDismissBtn) {
        installDismissBtn.removeEventListener('click', handleDismissClick)
      }
    }
  }, [showInstallPrompt, installApp, dismissInstall])

  // Render current screen based on app state
  const renderScreen = () => {
    // Temporary: Show camera test for debugging
    if (window.location.search.includes('test=camera')) {
      return <CameraTest />
    }
    
    switch (appState) {
      case STATES.LANDING:
        return <LandingScreen onScanStart={handleScanStart} />
        
      case STATES.CAMERA:
        return (
          <CameraInterface 
            onImageCapture={handleImageCapture}
            onBack={handleStartOver}
          />
        )
        
      case STATES.ANALYZING:
        return (
          <LoadingScreen 
            image={capturedImage}
            onAnalysisComplete={handleAnalysisComplete}
            onAnalysisError={handleAnalysisError}
            onBack={handleRetry}
          />
        )
        
      case STATES.RESULTS:
        return (
          <ResultsDisplay 
            data={analysisData}
            image={capturedImage}
            onScanAnother={handleStartOver}
            onRetry={handleRetry}
          />
        )
        
      case STATES.ERROR:
        return (
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
              <p className="text-primary-300 mb-6">{error}</p>
              <div className="space-y-3">
                <button 
                  onClick={handleRetry}
                  className="btn-primary w-full"
                >
                  Try Again
                </button>
                <button 
                  onClick={handleStartOver}
                  className="btn-ghost w-full"
                >
                  Start Over
                </button>
              </div>
            </div>
          </div>
        )
        
      default:
        return <LandingScreen onScanStart={handleScanStart} />
    }
  }

  return (
    <ErrorBoundary>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="*" element={renderScreen()} />
          </Routes>
        </AppLayout>
      </Router>
    </ErrorBoundary>
  )
}

export default App