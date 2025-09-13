import { useState, useEffect, useRef } from 'react'

export const useCamera = () => {
  const [stream, setStream] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasPermission, setHasPermission] = useState(false)
  const streamRef = useRef(null)

  useEffect(() => {
    // Check browser compatibility first
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.')
      return
    }

    // Check HTTPS requirement (except for localhost)
    if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
      setError('Camera access requires HTTPS. Please access the site over HTTPS.')
      return
    }

    // Check if camera permissions have been granted previously
    checkPermissions()

    // Cleanup on unmount
    return () => {
      stopCamera()
    }
  }, [])

  const checkPermissions = async () => {
    try {
      // Some browsers don't support camera permission query
      if (!navigator.permissions) {
        setHasPermission(false)
        return
      }
      
      const result = await navigator.permissions.query({ name: 'camera' })
      
      if (result.state === 'granted') {
        setHasPermission(true)
        startCamera()
      } else if (result.state === 'denied') {
        setHasPermission(false)
        setError('Camera access denied. Please enable camera permissions in your browser settings.')
      } else {
        setHasPermission(false)
      }
    } catch (err) {
      // Fallback for browsers that don't support permissions query
      console.log('Permissions API not supported, requiring user interaction')
      setHasPermission(false)
    }
  }

  const requestPermissions = async () => {
    try {
      setError(null)
      setIsLoading(true)

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser.')
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Prefer back camera
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        }
      })

      setStream(mediaStream)
      streamRef.current = mediaStream
      setHasPermission(true)
      setIsLoading(false)
      
    } catch (err) {
      setIsLoading(false)
      setHasPermission(false)
      
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please allow camera permissions and try again.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else if (err.name === 'NotSupportedError' || err.message.includes('not supported')) {
        setError('Camera not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.')
      } else {
        setError(`Failed to access camera: ${err.message}`)
      }
      
      console.error('Camera error:', err)
    }
  }

  const startCamera = async () => {
    try {
      setError(null)
      setIsLoading(true)

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser.')
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        }
      })

      setStream(mediaStream)
      streamRef.current = mediaStream
      setIsLoading(false)
      
    } catch (err) {
      setIsLoading(false)
      
      if (err.name === 'NotAllowedError') {
        setHasPermission(false)
        setError('Camera access denied.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else if (err.name === 'NotSupportedError' || err.message.includes('not supported')) {
        setError('Camera not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.')
      } else {
        setError(`Failed to access camera: ${err.message}`)
      }
      
      console.error('Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
      })
      streamRef.current = null
      setStream(null)
    }
  }

  const switchCamera = async () => {
    if (!hasPermission || !streamRef.current) return

    try {
      // Get current facing mode before stopping camera
      const currentFacingMode = streamRef.current?.getVideoTracks()[0]?.getSettings()?.facingMode
      const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment'
      
      stopCamera()
      setIsLoading(true)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: newFacingMode },
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        }
      })

      setStream(mediaStream)
      streamRef.current = mediaStream
      setIsLoading(false)
      
    } catch (err) {
      // If switching fails, try to restart with default camera
      console.error('Camera switch failed:', err)
      startCamera()
    }
  }

  return {
    stream,
    isLoading,
    error,
    hasPermission,
    startCamera,
    stopCamera,
    switchCamera,
    requestPermissions
  }
}