import { useState, useEffect } from 'react'

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://')
      setIsInstalled(isStandalone)
    }

    checkIfInstalled()

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      setIsInstallable(true)
      
      // Show install prompt after a delay (better UX)
      setTimeout(() => {
        if (!isInstalled && !localStorage.getItem('pwa-install-dismissed')) {
          setShowInstallPrompt(true)
        }
      }, 5000)
    }

    // Listen for successful app installation
    const handleAppInstalled = () => {
      console.log('PWA was installed')
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled])

  const installApp = async () => {
    if (!deferredPrompt) {
      return false
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt()
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt')
        setShowInstallPrompt(false)
        
        // Hide the install prompt element
        const installPrompt = document.getElementById('install-prompt')
        if (installPrompt) {
          installPrompt.classList.add('hidden')
        }
        
        return true
      } else {
        console.log('User dismissed the install prompt')
        dismissInstall()
        return false
      }
    } catch (error) {
      console.error('Error during app installation:', error)
      return false
    } finally {
      // Clear the deferredPrompt for next time
      setDeferredPrompt(null)
    }
  }

  const dismissInstall = () => {
    setShowInstallPrompt(false)
    
    // Hide the install prompt element
    const installPrompt = document.getElementById('install-prompt')
    if (installPrompt) {
      installPrompt.classList.add('hidden')
    }
    
    // Remember user dismissed the prompt
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed')
    }, 7 * 24 * 60 * 60 * 1000)
  }

  const resetInstallPrompt = () => {
    localStorage.removeItem('pwa-install-dismissed')
    if (isInstallable && !isInstalled) {
      setShowInstallPrompt(true)
    }
  }

  // Check if the app can be installed
  const canInstall = isInstallable && !isInstalled && deferredPrompt

  return {
    showInstallPrompt,
    isInstallable,
    isInstalled,
    canInstall,
    installApp,
    dismissInstall,
    resetInstallPrompt
  }
}