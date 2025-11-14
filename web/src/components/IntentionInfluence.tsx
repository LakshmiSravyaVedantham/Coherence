'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface InfluenceExperiment {
  intention: string
  baselineCoherence: number
  influencedCoherence: number
  influenceStrength: number
  participantCount: number
  timestamp: number
}

export default function IntentionInfluence() {
  const { currentSession } = useSessionStore()
  const [experiments, setExperiments] = useState<InfluenceExperiment[]>([])
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!currentSession || !isRunning) return

    const interval = setInterval(() => {
      // Simulate intention influence experiment
      const intentions = [
        'spiritual_awakening',
        'healing',
        'inner_peace',
        'gratitude',
      ]

      const intention = intentions[Math.floor(Math.random() * intentions.length)]
      const baselineCoherence = 40 + Math.random() * 30
      const influenceStrength = 0.1 + Math.random() * 0.3
      const influencedCoherence = baselineCoherence * (1 + influenceStrength)

      const experiment: InfluenceExperiment = {
        intention,
        baselineCoherence,
        influencedCoherence,
        influenceStrength,
        participantCount: currentSession.participantCount || 1,
        timestamp: Date.now(),
      }

      setExperiments((prev) => [...prev, experiment].slice(-20))
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [currentSession, isRunning])

  const chartData = experiments.map((exp, index) => ({
    time: index,
    baseline: exp.baselineCoherence,
    influenced: exp.influencedCoherence,
    difference: exp.influencedCoherence - exp.baselineCoherence,
  }))

  const averageInfluence =
    experiments.length > 0
      ? experiments.reduce((sum, exp) => sum + exp.influenceStrength, 0) /
        experiments.length
      : 0

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Intention Influence Experiment</h3>
          <p className="text-sm text-gray-400 mt-1">
            Measuring how intentions affect group coherence
          </p>
        </div>
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRunning ? 'Stop' : 'Start'} Experiment
        </button>
      </div>

      {isRunning && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {experiments.length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Experiments</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {Math.round(averageInfluence * 100)}%
              </div>
              <div className="text-xs text-gray-400 mt-1">Avg Influence</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {currentSession?.participantCount || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Participants</div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-400 mb-3">
                Coherence Comparison
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#6b7280"
                    strokeWidth={2}
                    dot={false}
                    name="Baseline"
                  />
                  <Line
                    type="monotone"
                    dataKey="influenced"
                    stroke="#a855f7"
                    strokeWidth={2}
                    dot={false}
                    name="With Intention"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {experiments.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {experiments.slice(-5).reverse().map((exp, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-700 bg-gray-900/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-white capitalize">
                        {exp.intention.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {exp.participantCount} participants
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-green-400">
                        +{Math.round(exp.influenceStrength * 100)}%
                      </div>
                      <div className="text-xs text-gray-400">
                        {Math.round(exp.baselineCoherence)} →{' '}
                        {Math.round(exp.influencedCoherence)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!isRunning && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">🧪</div>
          <div>Click "Start Experiment" to begin measuring intention influence</div>
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
        <div className="text-xs text-gray-300">
          <strong>Methodology:</strong> This experiment compares baseline coherence
          with coherence when specific intentions are set, measuring the potential
          influence of focused intention on group dynamics.
        </div>
      </div>
    </div>
  )
}

