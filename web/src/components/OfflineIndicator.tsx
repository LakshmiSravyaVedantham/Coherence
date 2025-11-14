'use client'

import { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      if (wasOffline) {
        // Show reconnection message
        setTimeout(() => setWasOffline(false), 3000)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
      setWasOffline(true)
    }

    // Check initial state
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [wasOffline])

  if (isOnline && !wasOffline) return null

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all ${
        isOnline
          ? 'bg-green-600 text-white'
          : 'bg-red-600 text-white animate-pulse'
      }`}
    >
      <div className="flex items-center gap-2">
        {isOnline ? (
          <>
            <span>✓</span>
            <span>Back online</span>
          </>
        ) : (
          <>
            <span>⚠️</span>
            <span>You're offline. Some features may be limited.</span>
          </>
        )}
      </div>
    </div>
  )
}

