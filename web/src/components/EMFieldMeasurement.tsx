'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface EMFieldData {
  timestamp: number
  strength: number // in microtesla
  frequency: number // in Hz
  coherence: number
  direction: { x: number; y: number; z: number }
}

export default function EMFieldMeasurement() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [fieldData, setFieldData] = useState<EMFieldData[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    if (!currentSession || !isMonitoring) return

    const interval = setInterval(() => {
      // Simulate EM field measurements
      // In production, this would use magnetometer data
      const baseStrength = 0.5 + personalCoherence / 200 // 0.5-1.0 microtesla
      const frequency = 7.83 + (Math.random() - 0.5) * 0.1 // Schumann resonance ~7.83 Hz

      const data: EMFieldData = {
        timestamp: Date.now(),
        strength: baseStrength + (Math.random() - 0.5) * 0.1,
        frequency,
        coherence: personalCoherence,
        direction: {
          x: Math.sin(Date.now() / 1000) * 0.1,
          y: Math.cos(Date.now() / 1000) * 0.1,
          z: Math.sin(Date.now() / 2000) * 0.1,
        },
      }

      setFieldData((prev) => [...prev, data].slice(-50))
    }, 2000)

    return () => clearInterval(interval)
  }, [currentSession, personalCoherence, isMonitoring])

  const currentField = fieldData.length > 0 ? fieldData[fieldData.length - 1] : null
  const averageStrength =
    fieldData.length > 0
      ? fieldData.reduce((sum, d) => sum + d.strength, 0) / fieldData.length
      : 0

  const isSchumannResonance = currentField
    ? Math.abs(currentField.frequency - 7.83) < 0.5
    : false

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">EM Field Measurement</h3>
          <p className="text-sm text-gray-400 mt-1">
            Monitoring electromagnetic field patterns
          </p>
        </div>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            isMonitoring
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {isMonitoring ? 'Monitoring' : 'Start Monitoring'}
        </button>
      </div>

      {isMonitoring ? (
        <>
          {currentField && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Field Strength</div>
                <div className="text-2xl font-bold text-blue-400">
                  {currentField.strength.toFixed(3)} μT
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Avg: {averageStrength.toFixed(3)} μT
                </div>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-400 mb-1">Frequency</div>
                <div className="text-2xl font-bold text-purple-400">
                  {currentField.frequency.toFixed(2)} Hz
                </div>
                {isSchumannResonance && (
                  <div className="text-xs text-green-400 mt-1">
                    ⚡ Schumann Resonance
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3D Field Visualization */}
          {currentField && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">
                Field Direction
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(currentField.direction).map(([axis, value]) => (
                    <div key={axis} className="text-center">
                      <div className="text-xs text-gray-400 mb-2 uppercase">{axis}</div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.abs(value) * 500}%`,
                            marginLeft: value < 0 ? 'auto' : '0',
                            marginRight: value < 0 ? '0' : 'auto',
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        {value > 0 ? '+' : ''}{value.toFixed(3)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Field Strength Over Time */}
          {fieldData.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3">
                Field Strength Trend
              </h4>
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-end gap-1 h-20">
                  {fieldData.slice(-20).map((data, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-purple-500 rounded-t transition-all"
                      style={{
                        height: `${(data.strength / 1.0) * 100}%`,
                        minHeight: '2px',
                      }}
                      title={`${data.strength.toFixed(3)} μT`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">⚡</div>
          <div>Start monitoring to measure EM field patterns</div>
          <div className="text-xs mt-2 text-gray-500">
            Detecting Schumann resonance and coherence-related field changes
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-500/30">
        <div className="text-xs text-gray-300">
          <strong>Research Focus:</strong> Measuring electromagnetic field patterns
          around participants to detect potential field effects related to group
          coherence. The Schumann resonance (~7.83 Hz) is the Earth's natural frequency.
        </div>
      </div>
    </div>
  )
}

