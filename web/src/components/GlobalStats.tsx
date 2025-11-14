'use client'

import { useEffect, useState } from 'react'

interface GlobalStats {
  totalSessions: number
  totalParticipants: number
  totalMinutes: number
  peakCoherence: number
}

export default function GlobalStats() {
  const [stats, setStats] = useState<GlobalStats | null>(null)

  useEffect(() => {
    // Simulate global stats - in production, this would come from backend
    setStats({
      totalSessions: 1247,
      totalParticipants: 8934,
      totalMinutes: 18720,
      peakCoherence: 87,
    })
  }, [])

  if (!stats) return null

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-6 border border-purple-500/30">
      <h3 className="text-lg font-semibold mb-4 text-center">Global Impact</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{stats.totalSessions.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Total Sessions</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{stats.totalParticipants.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Participants</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{stats.totalMinutes.toLocaleString()}</div>
          <div className="text-xs text-gray-400 mt-1">Minutes Chanted</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{stats.peakCoherence}%</div>
          <div className="text-xs text-gray-400 mt-1">Peak Coherence</div>
        </div>
      </div>
    </div>
  )
}

