'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface ParticipantIndicator {
  userId: string
  coherence: number
  coherencePhase: 'low' | 'medium' | 'high'
  position: { x: number; y: number }
}

export default function ParticipantIndicators() {
  const { currentSession } = useSessionStore()
  const [indicators, setIndicators] = useState<ParticipantIndicator[]>([])

  useEffect(() => {
    if (!currentSession?.groupMetrics) return

    // Simulate participant positions in a circle
    // In production, this would come from real-time participant data
    const participantCount = currentSession.groupMetrics.participantCount || 0
    const newIndicators: ParticipantIndicator[] = []

    for (let i = 0; i < Math.min(participantCount, 20); i++) {
      // Arrange in a circle
      const angle = (i / Math.max(participantCount, 1)) * Math.PI * 2
      const radius = 0.7
      const x = 50 + Math.cos(angle) * radius * 30
      const y = 50 + Math.sin(angle) * radius * 30

      // Simulate coherence (in production, this would be real data)
      const coherence = (currentSession.groupMetrics?.averageCoherence || 0) + (Math.random() - 0.5) * 20
      const phase: 'low' | 'medium' | 'high' =
        coherence < 40 ? 'low' : coherence < 60 ? 'medium' : 'high'

      newIndicators.push({
        userId: `user-${i}`,
        coherence,
        coherencePhase: phase,
        position: { x, y },
      })
    }

    setIndicators(newIndicators)
  }, [currentSession?.groupMetrics])

  if (indicators.length === 0) return null

  const getColor = (phase: 'low' | 'medium' | 'high') => {
    switch (phase) {
      case 'low':
        return '#ef4444'
      case 'medium':
        return '#eab308'
      case 'high':
        return '#22c55e'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      {indicators.map((indicator, index) => (
        <div
          key={indicator.userId}
          className="absolute transition-all duration-1000"
          style={{
            left: `${indicator.position.x}%`,
            top: `${indicator.position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{
              backgroundColor: getColor(indicator.coherencePhase),
              boxShadow: `0 0 10px ${getColor(indicator.coherencePhase)}`,
            }}
            title={`Coherence: ${Math.round(indicator.coherence)}%`}
          />
        </div>
      ))}
    </div>
  )
}

