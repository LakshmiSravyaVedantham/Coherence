'use client'

import { useSessionStore } from '@/store/sessionStore'
import { useEffect, useState } from 'react'

export default function CoherenceComparison() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [comparison, setComparison] = useState<{
    better: number
    similar: number
    below: number
  } | null>(null)

  useEffect(() => {
    if (!currentSession || !currentSession.groupMetrics) return

    // Simulate comparison data
    // In production, this would come from backend
    const total = currentSession.participantCount || 1
    const avg = currentSession.groupMetrics.averageCoherence || 0
    const diff = personalCoherence - avg

    let better = 0
    let similar = 0
    let below = 0

    if (diff > 10) {
      better = Math.floor(total * 0.2)
      similar = Math.floor(total * 0.3)
      below = total - better - similar
    } else if (diff < -10) {
      below = Math.floor(total * 0.2)
      similar = Math.floor(total * 0.3)
      better = total - below - similar
    } else {
      similar = Math.floor(total * 0.5)
      better = Math.floor((total - similar) / 2)
      below = total - similar - better
    }

    setComparison({ better, similar, below })
  }, [currentSession, personalCoherence])

  if (!comparison) return null

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h4 className="text-sm font-semibold text-gray-400 mb-3">Your Position</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Higher coherence</span>
          <span className="text-green-400 font-semibold">{comparison.better}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Similar to you</span>
          <span className="text-purple-400 font-semibold">{comparison.similar}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Lower coherence</span>
          <span className="text-blue-400 font-semibold">{comparison.below}</span>
        </div>
      </div>
    </div>
  )
}

