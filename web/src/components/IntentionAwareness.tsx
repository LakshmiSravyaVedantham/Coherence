'use client'

import { useSessionStore } from '@/store/sessionStore'
import { useState, useEffect } from 'react'

export default function IntentionAwareness() {
  const { currentSession } = useSessionStore()
  const [intentionCounts, setIntentionCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    // Simulate intention awareness
    // In production, this would come from backend
    if (currentSession) {
      const counts: Record<string, number> = {
        spiritual_awakening: Math.floor(Math.random() * 5) + 1,
        inner_peace: Math.floor(Math.random() * 8) + 2,
        healing: Math.floor(Math.random() * 6) + 1,
        gratitude: Math.floor(Math.random() * 4) + 1,
        protection: Math.floor(Math.random() * 3) + 1,
        wisdom: Math.floor(Math.random() * 2) + 1,
        devotion: Math.floor(Math.random() * 5) + 1,
      }
      setIntentionCounts(counts)
    }
  }, [currentSession])

  const intentionNames: Record<string, string> = {
    spiritual_awakening: 'Spiritual Awakening',
    inner_peace: 'Inner Peace',
    healing: 'Healing',
    gratitude: 'Gratitude',
    protection: 'Protection',
    wisdom: 'Wisdom',
    devotion: 'Devotion',
  }

  const topIntentions = Object.entries(intentionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  if (topIntentions.length === 0) return null

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <h4 className="text-sm font-semibold text-gray-400 mb-3">Shared Intentions in This Session</h4>
      <div className="space-y-2">
        {topIntentions.map(([intention, count]) => (
          <div key={intention} className="flex items-center justify-between">
            <span className="text-white text-sm">{intentionNames[intention] || intention}</span>
            <span className="text-purple-400 font-semibold">{count} people</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-3 text-center">
        You're not alone in your intention
      </div>
    </div>
  )
}

