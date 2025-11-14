'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface CorrelationEvent {
  timestamp: number
  participants: string[]
  correlationStrength: number
  distance: number // Simulated distance in km
  type: 'spontaneous' | 'intention_based' | 'temporal'
}

export default function NonLocalCorrelation() {
  const { currentSession } = useSessionStore()
  const [events, setEvents] = useState<CorrelationEvent[]>([])
  const [activeCorrelations, setActiveCorrelations] = useState(0)

  useEffect(() => {
    if (!currentSession) return

    // Simulate non-local correlation detection
    // In production, this would analyze patterns that can't be explained by local interactions
    const interval = setInterval(() => {
      const participantCount = currentSession.participantCount || 1
      
      if (participantCount > 1 && Math.random() > 0.7) {
        // Detect a correlation event
        const event: CorrelationEvent = {
          timestamp: Date.now(),
          participants: [`user-${Math.floor(Math.random() * participantCount)}`, `user-${Math.floor(Math.random() * participantCount)}`],
          correlationStrength: 0.6 + Math.random() * 0.4,
          distance: Math.random() * 10000, // 0-10,000 km
          type: ['spontaneous', 'intention_based', 'temporal'][Math.floor(Math.random() * 3)] as any,
        }

        setEvents((prev) => [event, ...prev].slice(0, 10))
        setActiveCorrelations((prev) => prev + 1)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [currentSession])

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'spontaneous':
        return { emoji: '✨', label: 'Spontaneous', color: 'text-purple-400' }
      case 'intention_based':
        return { emoji: '🧠', label: 'Intention-Based', color: 'text-blue-400' }
      case 'temporal':
        return { emoji: '⏰', label: 'Temporal', color: 'text-green-400' }
      default:
        return { emoji: '🔮', label: 'Unknown', color: 'text-gray-400' }
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Non-Local Correlations</h3>
          <p className="text-sm text-gray-400 mt-1">
            Detecting correlations beyond local interactions
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">{activeCorrelations}</div>
          <div className="text-xs text-gray-400">Active</div>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🔮</div>
          <div>Monitoring for non-local correlations...</div>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event, index) => {
            const typeInfo = getTypeInfo(event.type)
            return (
              <div
                key={index}
                className="p-4 rounded-lg border border-gray-700 bg-gray-900/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{typeInfo.emoji}</span>
                    <div>
                      <div className={`text-sm font-semibold ${typeInfo.color}`}>
                        {typeInfo.label} Correlation
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-purple-400">
                      {Math.round(event.correlationStrength * 100)}%
                    </div>
                    <div className="text-xs text-gray-400">Strength</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Distance</div>
                    <div className="text-sm text-white">
                      {event.distance > 1000
                        ? `${(event.distance / 1000).toFixed(1)}k km`
                        : `${Math.round(event.distance)} km`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Participants</div>
                    <div className="text-sm text-white">{event.participants.length}</div>
                  </div>
                </div>

                {/* Correlation strength bar */}
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${event.correlationStrength * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
        <div className="text-xs text-gray-300">
          <strong>Research Note:</strong> Non-local correlations refer to synchronized patterns
          that occur between participants without apparent local causal connection, potentially
          indicating quantum-like entanglement or field effects in group consciousness.
        </div>
      </div>
    </div>
  )
}

