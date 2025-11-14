'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface SyncPair {
  userId1: string
  userId2: string
  correlation: number
  phaseSync: number
  coherenceDiff: number
}

export default function PairwiseSyncAnalysis() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [syncPairs, setSyncPairs] = useState<SyncPair[]>([])
  const [selectedPair, setSelectedPair] = useState<SyncPair | null>(null)

  useEffect(() => {
    if (!currentSession) return

    // Simulate pairwise synchronization analysis
    // In production, this would come from backend ML analysis
    const participantCount = currentSession.participantCount || 1
    const pairs: SyncPair[] = []

    // Generate pairs (simplified - in production would be actual user pairs)
    for (let i = 0; i < Math.min(participantCount - 1, 10); i++) {
      const correlation = 0.3 + Math.random() * 0.7 // 0.3 to 1.0
      const phaseSync = 0.4 + Math.random() * 0.6 // 0.4 to 1.0
      const coherenceDiff = (Math.random() - 0.5) * 20 // -10 to +10

      pairs.push({
        userId1: `user-${i}`,
        userId2: `user-${i + 1}`,
        correlation,
        phaseSync,
        coherenceDiff,
      })
    }

    // Sort by correlation (highest first)
    pairs.sort((a, b) => b.correlation - a.correlation)
    setSyncPairs(pairs)
  }, [currentSession, personalCoherence])

  if (syncPairs.length === 0) return null

  const getSyncStrength = (correlation: number) => {
    if (correlation >= 0.8) return { label: 'Very Strong', color: 'text-green-400' }
    if (correlation >= 0.6) return { label: 'Strong', color: 'text-blue-400' }
    if (correlation >= 0.4) return { label: 'Moderate', color: 'text-yellow-400' }
    return { label: 'Weak', color: 'text-gray-400' }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Pairwise Synchronization</h3>
      <p className="text-sm text-gray-400 mb-4">
        Analysis of synchronization between participants
      </p>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {syncPairs.map((pair, index) => {
          const syncInfo = getSyncStrength(pair.correlation)
          return (
            <div
              key={`${pair.userId1}-${pair.userId2}`}
              onClick={() => setSelectedPair(pair)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedPair?.userId1 === pair.userId1
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-sm text-white">
                      Pair {index + 1}
                    </div>
                    <div className="text-xs text-gray-400">
                      {pair.userId1} ↔ {pair.userId2}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${syncInfo.color}`}>
                  {syncInfo.label}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Correlation</div>
                  <div className="text-sm font-semibold text-purple-400">
                    {Math.round(pair.correlation * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Phase Sync</div>
                  <div className="text-sm font-semibold text-blue-400">
                    {Math.round(pair.phaseSync * 100)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Coherence Diff</div>
                  <div className={`text-sm font-semibold ${
                    Math.abs(pair.coherenceDiff) < 5 ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {pair.coherenceDiff > 0 ? '+' : ''}{Math.round(pair.coherenceDiff)}%
                  </div>
                </div>
              </div>

              {/* Correlation bar */}
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${pair.correlation * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {selectedPair && (
        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-purple-500">
          <h4 className="text-sm font-semibold mb-2">Detailed Analysis</h4>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Correlation: {Math.round(selectedPair.correlation * 100)}% - Measures how closely heart rhythms align</div>
            <div>Phase Sync: {Math.round(selectedPair.phaseSync * 100)}% - Measures temporal alignment</div>
            <div>Coherence Difference: {Math.round(selectedPair.coherenceDiff)}% - Difference in coherence levels</div>
          </div>
        </div>
      )}
    </div>
  )
}

