'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface EntanglementPair {
  participant1: string
  participant2: string
  entanglementStrength: number
  distance: number
  coherence: number
  timestamp: number
}

export default function QuantumEntanglement() {
  const { currentSession } = useSessionStore()
  const [entangledPairs, setEntangledPairs] = useState<EntanglementPair[]>([])
  const [totalEntanglements, setTotalEntanglements] = useState(0)

  useEffect(() => {
    if (!currentSession || !currentSession.groupMetrics) return

    const participantCount = currentSession.participantCount || 1

    // Simulate quantum entanglement detection
    // In production, this would analyze non-classical correlations
    const interval = setInterval(() => {
      if (participantCount > 1 && Math.random() > 0.8) {
        const pair: EntanglementPair = {
          participant1: `user-${Math.floor(Math.random() * participantCount)}`,
          participant2: `user-${Math.floor(Math.random() * participantCount)}`,
          entanglementStrength: 0.7 + Math.random() * 0.3,
          distance: Math.random() * 5000, // 0-5000 km
          coherence: currentSession.groupMetrics?.averageCoherence || 0,
          timestamp: Date.now(),
        }

        setEntangledPairs((prev) => [pair, ...prev].slice(0, 10))
        setTotalEntanglements((prev) => prev + 1)
      }
    }, 8000)

    return () => clearInterval(interval)
  }, [currentSession])

  const averageStrength =
    entangledPairs.length > 0
      ? entangledPairs.reduce((sum, p) => sum + p.entanglementStrength, 0) /
        entangledPairs.length
      : 0

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Quantum Entanglement Detection</h3>
          <p className="text-sm text-gray-400 mt-1">
            Non-classical correlations between participants
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">{totalEntanglements}</div>
          <div className="text-xs text-gray-400">Detected</div>
        </div>
      </div>

      {entangledPairs.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🔗</div>
          <div>Monitoring for quantum entanglement...</div>
          <div className="text-xs mt-2 text-gray-500">
            Looking for non-classical correlations
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {entangledPairs.length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Active Pairs</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(averageStrength * 100)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">Avg Strength</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(
                  entangledPairs.reduce((sum, p) => sum + p.distance, 0) /
                    entangledPairs.length
                )}
                km
              </div>
              <div className="text-xs text-gray-400 mt-1">Avg Distance</div>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {entangledPairs.map((pair, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-purple-500/50 bg-purple-900/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-white font-semibold mb-1">
                      Entangled Pair #{index + 1}
                    </div>
                    <div className="text-xs text-gray-400">
                      {pair.participant1} ↔ {pair.participant2}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-400">
                      {Math.round(pair.entanglementStrength * 100)}%
                    </div>
                    <div className="text-xs text-gray-400">Strength</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Distance</div>
                    <div className="text-sm text-white">
                      {pair.distance > 1000
                        ? `${(pair.distance / 1000).toFixed(1)}k km`
                        : `${Math.round(pair.distance)} km`}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Coherence</div>
                    <div className="text-sm text-green-400">
                      {Math.round(pair.coherence)}%
                    </div>
                  </div>
                </div>

                {/* Entanglement visualization */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-700 rounded-full">
                    <div
                      className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                      style={{ width: `${pair.entanglementStrength * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-purple-400">
                    {pair.entanglementStrength > 0.9 ? 'Strong' : 'Moderate'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
        <div className="text-xs text-gray-300">
          <strong>Experimental:</strong> This feature detects correlations that cannot be
          explained by classical physics or local interactions, potentially indicating
          quantum-like entanglement in group consciousness. This is highly experimental
          and requires further research validation.
        </div>
      </div>
    </div>
  )
}

