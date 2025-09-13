/**
 * Image preprocessing utilities to improve OCR accuracy
 */

export async function preprocessImage(imageInput) {
  return new Promise((resolve, reject) => {
    try {
      // If it's already a canvas or image element, return as-is
      if (imageInput instanceof HTMLCanvasElement || imageInput instanceof HTMLImageElement) {
        resolve(imageInput)
        return
      }

      // If it's a blob, convert to image
      if (imageInput instanceof Blob) {
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        img.onload = () => {
          // Set canvas dimensions
          canvas.width = img.width
          canvas.height = img.height

          // Draw image to canvas
          ctx.drawImage(img, 0, 0)

          // Apply image enhancements
          const processedCanvas = enhanceImageForOCR(canvas, ctx)
          
          resolve(processedCanvas)
        }

        img.onerror = () => {
          reject(new Error('Failed to load image for preprocessing'))
        }

        img.src = URL.createObjectURL(imageInput)
        return
      }

      // If it's a data URL or regular URL
      if (typeof imageInput === 'string') {
        const img = new Image()
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0)
          
          const processedCanvas = enhanceImageForOCR(canvas, ctx)
          resolve(processedCanvas)
        }

        img.onerror = () => {
          reject(new Error('Failed to load image from URL'))
        }

        img.src = imageInput
        return
      }

      // Fallback: return input as-is
      resolve(imageInput)

    } catch (error) {
      reject(error)
    }
  })
}

function enhanceImageForOCR(canvas, ctx) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  // Apply image enhancements
  enhanceContrast(data)
  reduceNoise(data, canvas.width, canvas.height)
  
  // Put processed image data back to canvas
  ctx.putImageData(imageData, 0, 0)
  
  return canvas
}

function enhanceContrast(data) {
  const factor = 1.2 // Contrast enhancement factor
  
  for (let i = 0; i < data.length; i += 4) {
    // Apply contrast enhancement to RGB channels
    data[i] = Math.min(255, Math.max(0, (data[i] - 128) * factor + 128))     // Red
    data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * factor + 128)) // Green
    data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * factor + 128)) // Blue
    // Alpha channel (data[i + 3]) remains unchanged
  }
}

function reduceNoise(data, width, height) {
  // Simple noise reduction using a basic smoothing filter
  const tempData = new Uint8ClampedArray(data)
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const index = (y * width + x) * 4
      
      // Apply 3x3 smoothing kernel to RGB channels
      for (let c = 0; c < 3; c++) {
        let sum = 0
        let count = 0
        
        // Sample 3x3 neighborhood
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const neighborIndex = ((y + dy) * width + (x + dx)) * 4 + c
            sum += tempData[neighborIndex]
            count++
          }
        }
        
        // Apply subtle smoothing (only if the change is small)
        const average = sum / count
        const current = tempData[index + c]
        const difference = Math.abs(average - current)
        
        if (difference < 30) { // Only smooth small differences
          data[index + c] = Math.round(current * 0.7 + average * 0.3)
        }
      }
    }
  }
}

export function convertToGrayscale(canvas) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    // Convert to grayscale using luminance formula
    const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2])
    data[i] = gray     // Red
    data[i + 1] = gray // Green
    data[i + 2] = gray // Blue
    // Alpha remains unchanged
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

export function adjustBrightness(canvas, brightness = 1.1) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * brightness)     // Red
    data[i + 1] = Math.min(255, data[i + 1] * brightness) // Green
    data[i + 2] = Math.min(255, data[i + 2] * brightness) // Blue
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}