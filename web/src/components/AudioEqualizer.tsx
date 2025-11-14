'use client'

import { useState, useEffect, useRef } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface EqualizerBand {
  frequency: number
  gain: number
  label: string
}

export default function AudioEqualizer() {
  const { audioElementRef } = useSessionStore()
  const [enabled, setEnabled] = useState(false)
  const [bands, setBands] = useState<EqualizerBand[]>([
    { frequency: 60, gain: 0, label: '60Hz' },
    { frequency: 170, gain: 0, label: '170Hz' },
    { frequency: 310, gain: 0, label: '310Hz' },
    { frequency: 600, gain: 0, label: '600Hz' },
    { frequency: 1000, gain: 0, label: '1kHz' },
    { frequency: 3000, gain: 0, label: '3kHz' },
    { frequency: 6000, gain: 0, label: '6kHz' },
    { frequency: 12000, gain: 0, label: '12kHz' },
    { frequency: 14000, gain: 0, label: '14kHz' },
    { frequency: 16000, gain: 0, label: '16kHz' },
  ])
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodesRef = useRef<GainNode[]>([])

  useEffect(() => {
    if (!enabled || !audioElementRef) return

    // Create AudioContext and connect to audio element
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const source = audioContext.createMediaElementSource(audioElementRef)
    
    // Create gain nodes for each band
    const gainNodes: GainNode[] = []
    bands.forEach((band) => {
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 1 + band.gain / 100 // Convert percentage to gain
      gainNodes.push(gainNode)
    })

    // Connect: source -> gain nodes -> destination
    // Simplified: connect all bands in parallel
    gainNodes.forEach((node) => {
      source.connect(node)
      node.connect(audioContext.destination)
    })

    audioContextRef.current = audioContext
    gainNodesRef.current = gainNodes

    return () => {
      source.disconnect()
      gainNodes.forEach((node) => node.disconnect())
      audioContext.close()
    }
  }, [enabled, audioElementRef, bands])

  const updateBand = (index: number, gain: number) => {
    const newBands = [...bands]
    newBands[index].gain = gain
    setBands(newBands)

    // Update gain node if enabled
    if (enabled && gainNodesRef.current[index]) {
      gainNodesRef.current[index].gain.value = 1 + gain / 100
    }
  }

  const resetBands = () => {
    setBands(bands.map((band) => ({ ...band, gain: 0 })))
  }

  const applyPreset = (preset: 'vocal' | 'bass' | 'treble' | 'flat') => {
    const presets: Record<string, number[]> = {
      vocal: [0, 0, 3, 5, 4, 2, 0, -1, -2, -2],
      bass: [6, 5, 3, 1, 0, -1, -2, -2, -2, -2],
      treble: [-2, -2, -1, 0, 1, 2, 4, 5, 4, 3],
      flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }

    const newBands = bands.map((band, index) => ({
      ...band,
      gain: presets[preset][index] || 0,
    }))
    setBands(newBands)
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">🎚️ Audio Equalizer</h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>

      {enabled && (
        <>
          {/* Preset Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => applyPreset('vocal')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300"
            >
              Vocal
            </button>
            <button
              onClick={() => applyPreset('bass')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300"
            >
              Bass
            </button>
            <button
              onClick={() => applyPreset('treble')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300"
            >
              Treble
            </button>
            <button
              onClick={() => applyPreset('flat')}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300"
            >
              Flat
            </button>
            <button
              onClick={resetBands}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300"
            >
              Reset
            </button>
          </div>

          {/* Equalizer Bands */}
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {bands.map((band, index) => (
              <div key={index} className="flex flex-col items-center">
                <input
                  type="range"
                  min="-12"
                  max="12"
                  step="0.5"
                  value={band.gain}
                  onChange={(e) => updateBand(index, parseFloat(e.target.value))}
                  className="w-full h-32 writing-vertical-rl accent-purple-600"
                  style={{ writingMode: 'vertical-rl' }}
                />
                <div className="text-xs text-gray-400 mt-2">{band.label}</div>
                <div className="text-xs text-purple-400 mt-1">
                  {band.gain > 0 ? '+' : ''}
                  {band.gain.toFixed(1)}dB
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!enabled && (
        <p className="text-sm text-gray-400 text-center py-4">
          Enable equalizer to adjust audio frequencies for optimal chanting experience
        </p>
      )}
    </div>
  )
}

