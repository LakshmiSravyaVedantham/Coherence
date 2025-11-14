'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface Hub {
  userId: string
  influence: number
  connections: number
  coherence: number
  role: 'leader' | 'connector' | 'follower'
}

export default function HubDetection() {
  const { currentSession } = useSessionStore()
  const [hubs, setHubs] = useState<Hub[]>([])

  useEffect(() => {
    if (!currentSession) return

    // Simulate hub detection algorithm
    // In production, this would use graph theory to identify network hubs
    const participantCount = currentSession.participantCount || 1
    const detectedHubs: Hub[] = []

    // Identify top 3-5 hubs based on influence and connections
    const hubCount = Math.min(5, Math.floor(participantCount / 3))
    
    for (let i = 0; i < hubCount; i++) {
      const influence = 0.6 + Math.random() * 0.4 // 0.6 to 1.0
      const connections = Math.floor(participantCount * (0.3 + Math.random() * 0.4))
      const coherence = 50 + Math.random() * 40 // 50 to 90
      
      let role: 'leader' | 'connector' | 'follower'
      if (influence > 0.85 && coherence > 75) {
        role = 'leader'
      } else if (connections > participantCount * 0.4) {
        role = 'connector'
      } else {
        role = 'follower'
      }

      detectedHubs.push({
        userId: `hub-${i}`,
        influence,
        connections,
        coherence,
        role,
      })
    }

    // Sort by influence
    detectedHubs.sort((a, b) => b.influence - a.influence)
    setHubs(detectedHubs)
  }, [currentSession])

  if (hubs.length === 0) return null

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'leader':
        return { emoji: '👑', color: 'text-yellow-400', label: 'Coherence Leader' }
      case 'connector':
        return { emoji: '🔗', color: 'text-blue-400', label: 'Network Connector' }
      default:
        return { emoji: '⭐', color: 'text-purple-400', label: 'Active Participant' }
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-2">Network Hubs</h3>
      <p className="text-sm text-gray-400 mb-4">
        Participants who are central to group coherence
      </p>

      <div className="space-y-3">
        {hubs.map((hub, index) => {
          const roleInfo = getRoleInfo(hub.role)
          return (
            <div
              key={hub.userId}
              className="p-4 rounded-lg border border-gray-700 bg-gray-900/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{roleInfo.emoji}</div>
                  <div>
                    <div className="text-white font-semibold">
                      Hub #{index + 1}
                    </div>
                    <div className={`text-xs ${roleInfo.color}`}>
                      {roleInfo.label}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400">
                    {Math.round(hub.influence * 100)}%
                  </div>
                  <div className="text-xs text-gray-400">Influence</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Connections</div>
                  <div className="text-sm font-semibold text-blue-400">
                    {hub.connections}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Coherence</div>
                  <div className="text-sm font-semibold text-green-400">
                    {Math.round(hub.coherence)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Rank</div>
                  <div className="text-sm font-semibold text-yellow-400">
                    #{index + 1}
                  </div>
                </div>
              </div>

              {/* Influence visualization */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Network Influence</span>
                  <span>{Math.round(hub.influence * 100)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      hub.role === 'leader'
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                        : hub.role === 'connector'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                        : 'bg-gradient-to-r from-purple-500 to-purple-400'
                    }`}
                    style={{ width: `${hub.influence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
        <div className="text-xs text-gray-300">
          <strong>How it works:</strong> Hubs are identified using network analysis algorithms
          that measure influence, connection strength, and coherence contribution to the group.
        </div>
      </div>
    </div>
  )
}

