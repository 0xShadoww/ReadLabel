import { useState, useRef, useEffect, memo, useCallback } from 'react'
import { useCamera } from '../../hooks/useCamera'
import ImageCapture from './ImageCapture'
import CameraPermissions from './CameraPermissions'

const CameraInterface = memo(({ onImageCapture, onBack }) => {
  const { 
    stream, 
    isLoading, 
    error, 
    hasPermission, 
    startCamera, 
    stopCamera,
    requestPermissions
  } = useCamera()

  const [isCapturing, setIsCapturing] = useState(false)
  const [showGuide, setShowGuide] = useState(true)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Hide guide after a few seconds
    const timer = setTimeout(() => {
      setShowGuide(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const handleCapture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Apply horizontal flip to match the video preview
      context.save()
      context.scale(-1, 1)
      context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
      context.restore()

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob)
            onImageCapture({
              blob,
              url: imageUrl,
              width: canvas.width,
              height: canvas.height
            })
          }
        },
        'image/jpeg',
        0.8
      )
    } catch (err) {
      console.error('Error capturing image:', err)
    } finally {
      setIsCapturing(false)
    }
  }, [onImageCapture])

  const handleRetry = useCallback(() => {
    startCamera()
  }, [startCamera])

  // Show permission request if needed
  if (!hasPermission) {
    return (
      <CameraPermissions 
        onRequestPermissions={requestPermissions}
        onBack={onBack}
        error={error}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera view */}
      <div className="relative w-full h-full">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror the video
          />
        ) : isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-dark-900">
            <div className="text-center">
              <div className="spinner mb-4" />
              <p className="text-primary-200">Starting camera...</p>
            </div>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center bg-dark-900">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📷</div>
              <h3 className="text-xl font-bold mb-2">Camera Error</h3>
              <p className="text-primary-300 mb-4">{error}</p>
              <button onClick={handleRetry} className="btn-primary">
                Try Again
              </button>
            </div>
          </div>
        ) : null}

        {/* Camera overlay */}
        <div className="absolute inset-0 camera-overlay pointer-events-none">
          {/* Viewfinder frame */}
          <div className="absolute inset-x-8 top-1/2 transform -translate-y-1/2 aspect-[4/3] max-h-80">
            <div className="w-full h-full camera-viewfinder rounded-2xl relative">
              {/* Corner guides */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary-400" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary-400" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary-400" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary-400" />
              
              {/* Scanning line animation */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="w-full h-0.5 bg-primary-400 scan-line opacity-60" />
              </div>

              {/* Center crosshair */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary-400 rounded-full opacity-30" />
              </div>
            </div>
          </div>
        </div>

        {/* Guide overlay */}
        {showGuide && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            <div className="text-center p-6 max-w-sm">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="text-lg font-bold mb-2">Position the ingredient label</h3>
              <p className="text-primary-300 text-sm">
                Make sure the text is clear and well-lit within the frame
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={onBack}
              className="w-12 h-12 bg-dark-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-100 hover:bg-dark-700/80 transition-colors touch-manipulation"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Capture button */}
            <button
              onClick={handleCapture}
              disabled={isCapturing || !stream}
              className="w-20 h-20 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:opacity-50 rounded-full flex items-center justify-center text-white shadow-strong transition-all duration-200 touch-manipulation active:scale-95"
            >
              {isCapturing ? (
                <div className="spinner border-white border-t-transparent w-8 h-8" />
              ) : (
                <div className="w-8 h-8 bg-white rounded-full" />
              )}
            </button>

            {/* Flash/settings placeholder */}
            <div className="w-12 h-12" />
          </div>

          {/* Instructions */}
          <div className="text-center mt-4">
            <p className="text-primary-300 text-sm">
              Tap the button to capture the ingredient label
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

CameraInterface.displayName = 'CameraInterface'

export default CameraInterface
