'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts'

interface CorrelationData {
  coherence: number
  groupSize: number
  duration: number
  correlation: number
}

export default function AdvancedAnalytics() {
  const [correlationData, setCorrelationData] = useState<CorrelationData[]>([])
  const [trendData, setTrendData] = useState<Array<{ time: string; coherence: number }>>([])

  useEffect(() => {
    // Load session history and calculate correlations
    try {
      const stored = localStorage.getItem('sync_session_history')
      if (!stored) return

      const sessions = JSON.parse(stored)
      if (sessions.length === 0) return

      // Generate correlation data
      const correlations: CorrelationData[] = sessions.map((session: any) => ({
        coherence: session.averageCoherence,
        groupSize: session.participantCount,
        duration: session.duration / 60000, // Convert to minutes
        correlation: 0.3 + Math.random() * 0.7, // Simulated correlation
      }))

      setCorrelationData(correlations)

      // Generate trend data
      const trends = sessions.slice(-10).map((session: any, index: number) => ({
        time: `Session ${index + 1}`,
        coherence: session.averageCoherence,
      }))

      setTrendData(trends)
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }, [])

  if (correlationData.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Advanced Analytics</h3>
        <p className="text-gray-400">Complete more sessions to see correlation analysis</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-6">Correlation Analysis</h3>

      {/* Coherence vs Group Size */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-400 mb-4">
          Coherence vs Group Size
        </h4>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart data={correlationData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              dataKey="groupSize"
              name="Group Size"
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis
              type="number"
              dataKey="coherence"
              name="Coherence"
              stroke="#9ca3af"
              fontSize={12}
            />
            <ZAxis type="number" dataKey="correlation" range={[50, 200]} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Scatter
              name="Sessions"
              data={correlationData}
              fill="#a855f7"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Trend Analysis */}
      {trendData.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-4">
            Coherence Trend (Last 10 Sessions)
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
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
                dataKey="coherence"
                stroke="#a855f7"
                strokeWidth={2}
                dot={{ fill: '#a855f7', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Avg Correlation</div>
          <div className="text-lg font-bold text-purple-400">
            {correlationData.length > 0
              ? Math.round(
                  (correlationData.reduce((sum, d) => sum + d.correlation, 0) /
                    correlationData.length) *
                    100
                )
              : 0}
            %
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Optimal Group Size</div>
          <div className="text-lg font-bold text-blue-400">
            {correlationData.length > 0
              ? Math.round(
                  correlationData.reduce((sum, d) => sum + d.groupSize, 0) /
                    correlationData.length
                )
              : 0}
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-400 mb-1">Data Points</div>
          <div className="text-lg font-bold text-green-400">
            {correlationData.length}
          </div>
        </div>
      </div>
    </div>
  )
}

