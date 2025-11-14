'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface AnalyticsData {
  totalSessions: number
  totalTime: number // in minutes
  averageCoherence: number
  peakCoherence: number
  coherenceTrend: Array<{ date: string; coherence: number }>
  sessionsByDay: Array<{ date: string; count: number }>
}

export default function PersonalAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const calculateAnalytics = () => {
      try {
        const stored = localStorage.getItem('sync_session_history')
        if (!stored) {
          setLoading(false)
          return
        }

        const sessions = JSON.parse(stored)
        if (sessions.length === 0) {
          setLoading(false)
          return
        }

        const totalSessions = sessions.length
        const totalTime = sessions.reduce((sum: number, s: any) => sum + s.duration, 0) / 60
        const averageCoherence =
          sessions.reduce((sum: number, s: any) => sum + s.averageCoherence, 0) / totalSessions
        const peakCoherence = Math.max(...sessions.map((s: any) => s.peakCoherence))

        // Group by date for trend
        const dateMap = new Map<string, number[]>()
        sessions.forEach((s: any) => {
          const date = new Date(s.date).toLocaleDateString()
          if (!dateMap.has(date)) {
            dateMap.set(date, [])
          }
          dateMap.get(date)!.push(s.averageCoherence)
        })

        const coherenceTrend = Array.from(dateMap.entries())
          .map(([date, values]) => ({
            date,
            coherence: values.reduce((a, b) => a + b, 0) / values.length,
          }))
          .slice(-7) // Last 7 days

        const sessionsByDay = Array.from(dateMap.entries()).map(([date, values]) => ({
          date,
          count: values.length,
        }))

        setAnalytics({
          totalSessions,
          totalTime,
          averageCoherence,
          peakCoherence,
          coherenceTrend,
          sessionsByDay,
        })
      } catch (error) {
        console.error('Error calculating analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    calculateAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-gray-400">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Personal Analytics</h3>
        <p className="text-gray-400">Complete sessions to see your analytics</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-6">Your Progress</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{analytics.totalSessions}</div>
          <div className="text-sm text-gray-400">Total Sessions</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{Math.round(analytics.totalTime)}</div>
          <div className="text-sm text-gray-400">Minutes Chanted</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {Math.round(analytics.averageCoherence)}%
          </div>
          <div className="text-sm text-gray-400">Avg Coherence</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {Math.round(analytics.peakCoherence)}%
          </div>
          <div className="text-sm text-gray-400">Peak Coherence</div>
        </div>
      </div>

      {/* Coherence Trend Chart */}
      {analytics.coherenceTrend.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">Coherence Trend (Last 7 Days)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={analytics.coherenceTrend}>
              <defs>
                <linearGradient id="coherenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="coherence"
                stroke="#a855f7"
                fillOpacity={1}
                fill="url(#coherenceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

