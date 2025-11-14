'use client'

import { useState, useEffect } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface ResearchMetrics {
  totalSessions: number
  totalParticipants: number
  averageGroupCoherence: number
  peakGroupCoherence: number
  coherenceTrend: { date: string; value: number }[]
  participantDistribution: { range: string; count: number }[]
  sessionDuration: { average: number; total: number }
}

export default function ResearchDashboard() {
  const { currentSession } = useSessionStore()
  const [metrics, setMetrics] = useState<ResearchMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | 'all'>('7d')

  useEffect(() => {
    // Simulate research data aggregation
    // In production, this would come from backend/API
    const generateMetrics = (): ResearchMetrics => {
      const history = JSON.parse(localStorage.getItem('sync_session_history') || '[]')
      const filteredHistory = history.filter((h: any) => {
        if (timeframe === 'all') return true
        const sessionDate = new Date(h.date)
        const now = new Date()
        const hours = (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60)
        if (timeframe === '24h') return hours <= 24
        if (timeframe === '7d') return hours <= 168
        if (timeframe === '30d') return hours <= 720
        return true
      })

      const totalSessions = filteredHistory.length
      const totalParticipants = filteredHistory.reduce(
        (sum: number, h: any) => sum + (h.participantCount || 0),
        0
      )
      const averageGroupCoherence =
        totalSessions > 0
          ? filteredHistory.reduce(
              (sum: number, h: any) => sum + (h.averageCoherence || 0),
              0
            ) / totalSessions
          : 0
      const peakGroupCoherence =
        totalSessions > 0
          ? Math.max(...filteredHistory.map((h: any) => h.peakCoherence || 0))
          : 0

      // Generate trend data
      const coherenceTrend = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (6 - i))
        return {
          date: date.toISOString().split('T')[0],
          value: 50 + Math.random() * 30,
        }
      })

      // Participant distribution
      const participantDistribution = [
        { range: '1-5', count: Math.floor(totalSessions * 0.3) },
        { range: '6-10', count: Math.floor(totalSessions * 0.4) },
        { range: '11-20', count: Math.floor(totalSessions * 0.2) },
        { range: '21+', count: Math.floor(totalSessions * 0.1) },
      ]

      const sessionDuration = {
        average:
          totalSessions > 0
            ? filteredHistory.reduce((sum: number, h: any) => sum + (h.duration || 0), 0) /
              totalSessions /
              60000
            : 0,
        total: filteredHistory.reduce((sum: number, h: any) => sum + (h.duration || 0), 0) / 60000,
      }

      return {
        totalSessions,
        totalParticipants,
        averageGroupCoherence,
        peakGroupCoherence,
        coherenceTrend,
        participantDistribution,
        sessionDuration,
      }
    }

    setTimeout(() => {
      setMetrics(generateMetrics())
      setLoading(false)
    }, 500)
  }, [timeframe, currentSession])

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-gray-400">Loading research dashboard...</div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">🔬 Research Dashboard</h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as any)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{metrics.totalSessions}</div>
          <div className="text-sm text-gray-400">Total Sessions</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{metrics.totalParticipants}</div>
          <div className="text-sm text-gray-400">Participants</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">
            {Math.round(metrics.averageGroupCoherence)}%
          </div>
          <div className="text-sm text-gray-400">Avg Coherence</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {Math.round(metrics.peakGroupCoherence)}%
          </div>
          <div className="text-sm text-gray-400">Peak Coherence</div>
        </div>
      </div>

      {/* Coherence Trend Chart */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Coherence Trend</h4>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="flex items-end justify-between h-32 gap-2">
            {metrics.coherenceTrend.map((point, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-purple-600 rounded-t transition-all"
                  style={{
                    height: `${(point.value / 100) * 100}%`,
                    minHeight: '4px',
                  }}
                  title={`${point.date}: ${Math.round(point.value)}%`}
                />
                <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                  {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Participant Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Session Size Distribution</h4>
        <div className="space-y-2">
          {metrics.participantDistribution.map((dist, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-16 text-sm text-gray-400">{dist.range}</div>
              <div className="flex-1 bg-gray-900 rounded-full h-6 relative overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-purple-600 rounded-full transition-all"
                  style={{
                    width: `${(dist.count / metrics.totalSessions) * 100}%`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-semibold">
                  {dist.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Duration Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-lg font-bold text-purple-400">
            {Math.round(metrics.sessionDuration.average)} min
          </div>
          <div className="text-sm text-gray-400">Avg Session Duration</div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-lg font-bold text-blue-400">
            {Math.round(metrics.sessionDuration.total)} min
          </div>
          <div className="text-sm text-gray-400">Total Duration</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Research data is anonymized and aggregated for scientific analysis
      </div>
    </div>
  )
}

