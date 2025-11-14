'use client'

import { useState } from 'react'
import { AVAILABLE_CHANTS, Chant } from '@/lib/chants'

interface ChantSelectorProps {
  onSelect: (chant: Chant) => void
  onCancel: () => void
  currentChantId?: string
}

export default function ChantSelector({ onSelect, onCancel, currentChantId }: ChantSelectorProps) {
  const [selectedChant, setSelectedChant] = useState<Chant | null>(
    currentChantId ? AVAILABLE_CHANTS.find((c) => c.id === currentChantId) || null : null
  )

  const traditionEmojis = {
    hindu: '🕉️',
    buddhist: '☸️',
    christian: '✝️',
    secular: '🌍',
    universal: '✨',
  }

  const handleSelect = () => {
    if (selectedChant) {
      onSelect(selectedChant)
    }
  }

  // Group chants by tradition
  const chantsByTradition = AVAILABLE_CHANTS.reduce((acc, chant) => {
    if (!acc[chant.tradition]) {
      acc[chant.tradition] = []
    }
    acc[chant.tradition].push(chant)
    return acc
  }, {} as Record<string, Chant[]>)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full border border-purple-500 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2 text-center">Choose Your Chant</h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Select a chant to join the session with
        </p>

        <div className="space-y-6">
          {Object.entries(chantsByTradition).map(([tradition, chants]) => (
            <div key={tradition}>
              <h3 className="text-lg font-semibold text-purple-300 mb-3 capitalize flex items-center gap-2">
                <span>{traditionEmojis[tradition as keyof typeof traditionEmojis]}</span>
                {tradition} Chants
              </h3>
              <div className="space-y-2">
                {chants.map((chant) => (
                  <button
                    key={chant.id}
                    onClick={() => setSelectedChant(chant)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedChant?.id === chant.id
                        ? 'border-purple-500 bg-purple-900 bg-opacity-30'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-white font-semibold">{chant.name}</div>
                          {chant.filename && (
                            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                              Available
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-400 mb-2">{chant.description}</div>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>{chant.frequency} Hz</span>
                          {chant.bpm && <span>{chant.bpm} BPM</span>}
                          <span>{Math.floor(chant.duration / 60)} min</span>
                        </div>
                      </div>
                      {selectedChant?.id === chant.id && (
                        <span className="text-purple-400 text-xl ml-4">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedChant}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
          >
            Select Chant
          </button>
        </div>
      </div>
    </div>
  )
}

