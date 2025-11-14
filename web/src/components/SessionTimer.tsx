'use client'

import { useEffect, useState } from 'react'

interface SessionTimerProps {
  startTime: number
  duration: number
  onComplete?: () => void
}

export default function SessionTimer({ startTime, duration, onComplete }: SessionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Validate inputs
    if (!startTime || !duration || isNaN(startTime) || isNaN(duration) || duration <= 0) {
      console.warn('SessionTimer: Invalid startTime or duration', { startTime, duration })
      setTimeRemaining(0)
      setProgress(0)
      return
    }

    const updateTimer = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const remaining = Math.max(0, duration - elapsed)
      const progressPercent = Math.min(100, Math.max(0, (elapsed / duration) * 100))

      // Ensure we don't set NaN values
      const remainingSeconds = Math.floor(remaining / 1000)
      if (!isNaN(remainingSeconds) && remainingSeconds >= 0) {
        setTimeRemaining(remainingSeconds)
      }
      if (!isNaN(progressPercent) && progressPercent >= 0 && progressPercent <= 100) {
        setProgress(progressPercent)
      }

      if (remaining <= 0 && onComplete) {
        onComplete()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [startTime, duration, onComplete])

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Session Progress</span>
        <span>{formatTime(timeRemaining)} remaining</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

