'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface IntentionResonance {
  intention: string
  participantCount: number
  averageCoherence: number
  resonanceStrength: number
  trend: 'increasing' | 'stable' | 'decreasing'
}

export default function IntentionResonance() {
  const { currentSession } = useSessionStore()
  const [resonances, setResonances] = useState<IntentionResonance[]>([])

  useEffect(() => {
    if (!currentSession) return

    // Simulate intention resonance analysis
    // In production, this would analyze coherence patterns by intention
    const intentions = [
      'spiritual_awakening',
      'inner_peace',
      'healing',
      'gratitude',
      'protection',
      'wisdom',
      'devotion',
    ]

    const intentionNames: Record<string, string> = {
      spiritual_awakening: 'Spiritual Awakening',
      inner_peace: 'Inner Peace',
      healing: 'Healing',
      gratitude: 'Gratitude',
      protection: 'Protection',
      wisdom: 'Wisdom',
      devotion: 'Devotion',
    }

    const resonances: IntentionResonance[] = intentions.map((intention) => {
      const participantCount = Math.floor(Math.random() * 10) + 1
      const averageCoherence = 40 + Math.random() * 40
      const resonanceStrength = 0.3 + Math.random() * 0.7
      const trends: ('increasing' | 'stable' | 'decreasing')[] = [
        'increasing',
        'stable',
        'decreasing',
      ]
      const trend = trends[Math.floor(Math.random() * trends.length)]

      return {
        intention: intentionNames[intention] || intention,
        participantCount,
        averageCoherence,
        resonanceStrength,
        trend,
      }
    })

    // Sort by resonance strength
    resonances.sort((a, b) => b.resonanceStrength - a.resonanceStrength)
    setResonances(resonances)
  }, [currentSession])

  if (resonances.length === 0) return null

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '📈'
      case 'decreasing':
        return '📉'
      default:
        return '➡️'
    }
  }

  const getResonanceColor = (strength: number) => {
    if (strength >= 0.7) return 'text-green-400'
    if (strength >= 0.5) return 'text-blue-400'
    if (strength >= 0.3) return 'text-yellow-400'
    return 'text-gray-400'
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-2">Intention Resonance</h3>
      <p className="text-sm text-gray-400 mb-4">
        How different intentions affect group coherence
      </p>

      <div className="space-y-3">
        {resonances.slice(0, 5).map((resonance, index) => (
          <div
            key={resonance.intention}
            className="p-4 rounded-lg border border-gray-700 bg-gray-900/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-white font-semibold">{resonance.intention}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {resonance.participantCount} participants
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${getResonanceColor(resonance.resonanceStrength)}`}>
                  {Math.round(resonance.resonanceStrength * 100)}%
                </div>
                <div className="text-xs text-gray-400">Resonance</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">Avg Coherence</div>
                <div className="text-sm font-semibold text-purple-400">
                  {Math.round(resonance.averageCoherence)}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Trend</div>
                <div className="text-sm font-semibold text-blue-400 flex items-center gap-1">
                  {getTrendIcon(resonance.trend)}
                  <span className="capitalize">{resonance.trend}</span>
                </div>
              </div>
            </div>

            {/* Resonance strength bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  resonance.resonanceStrength >= 0.7
                    ? 'bg-gradient-to-r from-green-500 to-green-400'
                    : resonance.resonanceStrength >= 0.5
                    ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                }`}
                style={{ width: `${resonance.resonanceStrength * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
        <div className="text-xs text-gray-300">
          <strong>Resonance Strength</strong> measures how effectively an intention
          contributes to group coherence. Higher resonance indicates stronger
          collective alignment with that intention.
        </div>
      </div>
    </div>
  )
}

