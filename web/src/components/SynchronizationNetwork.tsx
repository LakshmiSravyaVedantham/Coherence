'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface SyncPair {
  userId: string
  syncStrength: number
  correlation: number
}

export default function SynchronizationNetwork() {
  const { currentSession } = useSessionStore()
  const [syncPairs, setSyncPairs] = useState<SyncPair[]>([])

  useEffect(() => {
    if (!currentSession) return

    // Simulate synchronization pairs
    // In production, this would come from backend analysis
    const participantCount = currentSession.participantCount
    const pairs: SyncPair[] = []

    // Generate simulated sync data
    for (let i = 0; i < Math.min(participantCount, 10); i++) {
      pairs.push({
        userId: `user-${i}`,
        syncStrength: 0.3 + Math.random() * 0.7, // 0.3 to 1.0
        correlation: -0.5 + Math.random() * 1.5, // -0.5 to 1.0
      })
    }

    setSyncPairs(pairs)
  }, [currentSession])

  if (syncPairs.length === 0) return null

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Synchronization Network</h3>
      <div className="space-y-2">
        {syncPairs.slice(0, 5).map((pair, index) => (
          <div key={pair.userId} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-sm text-gray-400">Connection {index + 1}</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${pair.syncStrength * 100}%` }}
                />
              </div>
            </div>
            <div className="text-sm text-purple-400 font-semibold">
              {Math.round(pair.syncStrength * 100)}%
            </div>
          </div>
        ))}
        {syncPairs.length > 5 && (
          <div className="text-xs text-gray-500 text-center mt-2">
            +{syncPairs.length - 5} more connections
          </div>
        )}
      </div>
    </div>
  )
}

