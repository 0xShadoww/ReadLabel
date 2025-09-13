import { useRef, useEffect } from 'react'

const ImageCapture = ({ stream, onCapture, isCapturing }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isCapturing) return

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw current video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const imageUrl = URL.createObjectURL(blob)
            onCapture({
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
    } catch (error) {
      console.error('Error capturing image:', error)
    }
  }

  if (!stream) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-primary-200">Initializing camera...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Video stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }} // Mirror the video
      />

      {/* Capture button overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className="w-20 h-20 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:opacity-50 rounded-full flex items-center justify-center text-white shadow-strong transition-all duration-200 touch-manipulation active:scale-95"
        >
          {isCapturing ? (
            <div className="spinner border-white border-t-transparent w-8 h-8" />
          ) : (
            <div className="w-8 h-8 bg-white rounded-full" />
          )}
        </button>
      </div>
    </div>
  )
}

export default ImageCapture