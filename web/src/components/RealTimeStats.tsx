'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

export default function RealTimeStats() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [stats, setStats] = useState({
    timeInCoherence: 0,
    coherenceStreak: 0,
    peakReached: false,
  })

  useEffect(() => {
    if (!currentSession) return

    const interval = setInterval(() => {
      setStats((prev) => {
        const inCoherence = personalCoherence >= 50
        return {
          timeInCoherence: inCoherence ? prev.timeInCoherence + 1 : prev.timeInCoherence,
          coherenceStreak: inCoherence ? prev.coherenceStreak + 1 : 0,
          peakReached: personalCoherence >= 80 || prev.peakReached,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [currentSession, personalCoherence])

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
        <div className="text-2xl font-bold text-green-400">{stats.timeInCoherence}s</div>
        <div className="text-xs text-gray-400 mt-1">Time in Coherence</div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
        <div className="text-2xl font-bold text-purple-400">{stats.coherenceStreak}s</div>
        <div className="text-xs text-gray-400 mt-1">Current Streak</div>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
        <div className="text-2xl font-bold text-yellow-400">
          {stats.peakReached ? '✓' : '—'}
        </div>
        <div className="text-xs text-gray-400 mt-1">Peak Reached</div>
      </div>
    </div>
  )
}

