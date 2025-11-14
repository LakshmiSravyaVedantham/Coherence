'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface EEGData {
  timestamp: number
  alpha: number // 8-13 Hz
  beta: number // 13-30 Hz
  theta: number // 4-8 Hz
  delta: number // 0.5-4 Hz
  gamma: number // 30-100 Hz
}

export default function EEGIntegration() {
  const { currentSession, personalCoherence } = useSessionStore()
  const [eegData, setEegData] = useState<EEGData[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!currentSession || !isConnected) return

    // Simulate EEG data collection
    const interval = setInterval(() => {
      // Simulate brainwave patterns based on coherence
      const baseAlpha = personalCoherence > 60 ? 0.4 : 0.2
      const baseTheta = personalCoherence > 60 ? 0.3 : 0.15
      const baseBeta = personalCoherence > 60 ? 0.15 : 0.3

      const data: EEGData = {
        timestamp: Date.now(),
        alpha: baseAlpha + (Math.random() - 0.5) * 0.1,
        beta: baseBeta + (Math.random() - 0.5) * 0.1,
        theta: baseTheta + (Math.random() - 0.5) * 0.1,
        delta: 0.1 + (Math.random() - 0.5) * 0.05,
        gamma: 0.05 + (Math.random() - 0.5) * 0.02,
      }

      setEegData((prev) => [...prev, data].slice(-30))
    }, 1000)

    return () => clearInterval(interval)
  }, [currentSession, personalCoherence, isConnected])

  const chartData = eegData.map((data, index) => ({
    time: index,
    alpha: data.alpha * 100,
    beta: data.beta * 100,
    theta: data.theta * 100,
    delta: data.delta * 100,
  }))

  const currentState = eegData.length > 0 ? eegData[eegData.length - 1] : null
  const dominantWave =
    currentState
      ? Object.entries({
          alpha: currentState.alpha,
          beta: currentState.beta,
          theta: currentState.theta,
          delta: currentState.delta,
        }).sort(([, a], [, b]) => b - a)[0][0]
      : null

  const getStateInfo = (wave: string) => {
    switch (wave) {
      case 'alpha':
        return { label: 'Relaxed Focus', emoji: '🧘', color: 'text-blue-400' }
      case 'theta':
        return { label: 'Deep Meditation', emoji: '🕉️', color: 'text-purple-400' }
      case 'beta':
        return { label: 'Active Thinking', emoji: '💭', color: 'text-yellow-400' }
      case 'delta':
        return { label: 'Deep Sleep', emoji: '😴', color: 'text-gray-400' }
      default:
        return { label: 'Unknown', emoji: '❓', color: 'text-gray-400' }
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">EEG Brainwave Monitoring</h3>
          <p className="text-sm text-gray-400 mt-1">
            Real-time brainwave analysis (simulated)
          </p>
        </div>
        <button
          onClick={() => setIsConnected(!isConnected)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            isConnected
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          {isConnected ? 'Connected' : 'Connect Device'}
        </button>
      </div>

      {isConnected ? (
        <>
          {currentState && dominantWave && (
            <div className="mb-6">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">
                      {getStateInfo(dominantWave).emoji}
                    </div>
                    <div>
                      <div className={`text-lg font-semibold ${getStateInfo(dominantWave).color}`}>
                        {getStateInfo(dominantWave).label}
                      </div>
                      <div className="text-xs text-gray-400">
                        Dominant: {dominantWave.toUpperCase()} wave
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {Object.entries({
                    delta: currentState.delta,
                    theta: currentState.theta,
                    alpha: currentState.alpha,
                    beta: currentState.beta,
                    gamma: currentState.gamma,
                  }).map(([wave, value]) => (
                    <div key={wave} className="text-center">
                      <div className="text-xs text-gray-400 mb-1 uppercase">{wave}</div>
                      <div className="text-sm font-semibold text-purple-400">
                        {Math.round(value * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">
                Brainwave Activity
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="alphaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="thetaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="alpha"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#alphaGradient)"
                    name="Alpha (8-13 Hz)"
                  />
                  <Area
                    type="monotone"
                    dataKey="theta"
                    stroke="#a855f7"
                    fillOpacity={1}
                    fill="url(#thetaGradient)"
                    name="Theta (4-8 Hz)"
                  />
                  <Area
                    type="monotone"
                    dataKey="beta"
                    stroke="#eab308"
                    fillOpacity={0.3}
                    name="Beta (13-30 Hz)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🧠</div>
          <div>Connect an EEG device to monitor brainwave activity</div>
          <div className="text-xs mt-2 text-gray-500">
            Compatible with: Muse, OpenBCI, NeuroSky, and other BCI devices
          </div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
        <div className="text-xs text-gray-300">
          <strong>Note:</strong> This is a simulation. In production, this would connect to
          real EEG/BCI devices via Web Bluetooth API or device SDKs to provide actual
          brainwave monitoring during sessions.
        </div>
      </div>
    </div>
  )
}

