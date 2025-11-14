'use client'

import { useState } from 'react'
import BinauralBeats from './BinauralBeats'

interface AudioEnhancementsProps {
  chantFrequency: number
}

const BEAT_FREQUENCIES = {
  delta: { range: '0.5-4 Hz', value: 2, description: 'Deep sleep, healing' },
  theta: { range: '4-8 Hz', value: 6, description: 'Deep meditation, creativity' },
  alpha: { range: '8-13 Hz', value: 10.5, description: 'Relaxation, focus' },
  beta: { range: '13-30 Hz', value: 20, description: 'Active thinking, alertness' },
}

export default function AudioEnhancements({ chantFrequency }: AudioEnhancementsProps) {
  const [binauralEnabled, setBinauralEnabled] = useState(false)
  const [selectedBeat, setSelectedBeat] = useState<keyof typeof BEAT_FREQUENCIES>('alpha')
  const [volume, setVolume] = useState(0.3)

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Audio Enhancements</h3>

      {/* Binaural Beats */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-white font-semibold mb-1">Binaural Beats</div>
            <div className="text-xs text-gray-400">
              Enhance your experience with brainwave entrainment
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={binauralEnabled}
              onChange={(e) => setBinauralEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {binauralEnabled && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Brainwave Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(BEAT_FREQUENCIES).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedBeat(key as keyof typeof BEAT_FREQUENCIES)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      selectedBeat === key
                        ? 'border-purple-500 bg-purple-900/30'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-white font-semibold capitalize mb-1">{key}</div>
                    <div className="text-xs text-gray-400">{info.range}</div>
                    <div className="text-xs text-purple-400 mt-1">{info.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Volume: {Math.round(volume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Binaural Beats Audio Controller */}
      <BinauralBeats
        baseFrequency={chantFrequency}
        beatFrequency={BEAT_FREQUENCIES[selectedBeat].value}
        enabled={binauralEnabled}
        volume={volume}
      />

      <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
        <div className="text-xs text-gray-300">
          <strong>How it works:</strong> Binaural beats create a frequency difference between
          your left and right ears, which your brain processes as a beat frequency. This can
          help entrain your brainwaves to desired states (meditation, focus, relaxation).
        </div>
      </div>
    </div>
  )
}

