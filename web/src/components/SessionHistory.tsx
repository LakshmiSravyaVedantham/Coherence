'use client'

import { useEffect, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface SessionRecord {
  sessionId: string
  date: string
  duration: number
  peakCoherence: number
  averageCoherence: number
  participantCount: number
  chantName: string
  intention?: string
}

export default function SessionHistory() {
  const [sessions, setSessions] = useState<SessionRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load session history from localStorage
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem('sync_session_history')
        if (stored) {
          setSessions(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Error loading session history:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="text-gray-400">Loading session history...</div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-xl font-semibold mb-4">Session History</h3>
        <p className="text-gray-400">No sessions yet. Join a chanting session to get started!</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">Your Session History</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sessions.map((session, index) => (
          <div
            key={session.sessionId || index}
            className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-white font-semibold">{session.chantName}</div>
                <div className="text-sm text-gray-400">
                  {new Date(session.date).toLocaleDateString()} • {Math.floor(session.duration / 60)} min
                </div>
              </div>
              <div className="text-right">
                <div className="text-purple-400 font-semibold">
                  {Math.round(session.peakCoherence)}%
                </div>
                <div className="text-xs text-gray-500">Peak Coherence</div>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-500 mt-2">
              <span>Avg: {Math.round(session.averageCoherence)}%</span>
              <span>•</span>
              <span>{session.participantCount} participants</span>
              {session.intention && (
                <>
                  <span>•</span>
                  <span className="text-purple-400">{session.intention}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

