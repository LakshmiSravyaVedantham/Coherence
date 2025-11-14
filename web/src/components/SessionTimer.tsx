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
    const updateTimer = () => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, duration - elapsed)
      const progressPercent = Math.min(100, (elapsed / duration) * 100)

      setTimeRemaining(Math.floor(remaining / 1000))
      setProgress(progressPercent)

      if (remaining <= 0 && onComplete) {
        onComplete()
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [startTime, duration, onComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
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

