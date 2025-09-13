import { useState, useRef, useEffect } from 'react'

const CameraTest = () => {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef(null)

  const testCamera = async () => {
    try {
      setError(null)
      setIsLoading(true)
      
      console.log('Testing camera access...')
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia not supported in this browser')
      }

      console.log('getUserMedia is supported')
      
      // Simple camera request
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true
      })
      
      console.log('Camera access granted:', mediaStream)
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
    } catch (err) {
      console.error('Camera test error:', err)
      setError(`Camera Error: ${err.name} - ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Camera Test</h2>
      
      <div className="space-y-4">
        <button
          onClick={testCamera}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Camera'}
        </button>

        {stream && (
          <button
            onClick={stopCamera}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Stop Camera
          </button>
        )}

        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {stream && (
          <div className="border rounded">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p><strong>Protocol:</strong> {window.location.protocol}</p>
          <p><strong>Host:</strong> {window.location.hostname}</p>
          <p><strong>getUserMedia Support:</strong> {navigator.mediaDevices ? 'Yes' : 'No'}</p>
          <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        </div>
      </div>
    </div>
  )
}

export default CameraTest