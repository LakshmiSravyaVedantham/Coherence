'use client'

import { useState, useEffect, useRef } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface SessionRecording {
  sessionId: string
  startTime: number
  endTime?: number
  data: Array<{
    timestamp: number
    personalCoherence: number
    groupCoherence: number
    heartRate: number
  }>
}

export default function SessionRecorder() {
  const { currentSession, personalCoherence, heartRate } = useSessionStore()
  const [isRecording, setIsRecording] = useState(false)
  const [recording, setRecording] = useState<SessionRecording | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isRecording && currentSession) {
      // Record data every 5 seconds
      intervalRef.current = setInterval(() => {
        setRecording((prev) => {
          if (!prev || !currentSession || !currentSession.groupMetrics) return prev

          return {
            ...prev,
            data: [
              ...prev.data,
              {
                timestamp: Date.now(),
                personalCoherence,
                groupCoherence: currentSession.groupMetrics.averageCoherence || 0,
                heartRate,
              },
            ],
          }
        })
      }, 5000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording, currentSession, personalCoherence, heartRate])

  const startRecording = () => {
    if (!currentSession) return

    const newRecording: SessionRecording = {
      sessionId: currentSession.sessionId,
      startTime: Date.now(),
      data: [],
    }

    setRecording(newRecording)
    setIsRecording(true)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (recording) {
      const completedRecording = {
        ...recording,
        endTime: Date.now(),
      }

      // Save to localStorage
      try {
        const stored = localStorage.getItem('sync_recordings') || '[]'
        const recordings = JSON.parse(stored)
        recordings.push(completedRecording)
        localStorage.setItem('sync_recordings', JSON.stringify(recordings))
      } catch (error) {
        console.error('Error saving recording:', error)
      }

      setRecording(null)
    }
  }

  const downloadRecording = () => {
    if (!recording) return

    const dataStr = JSON.stringify(recording, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `session-recording-${recording.sessionId}-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (!currentSession) return null

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold text-white">Session Recording</h4>
          <p className="text-xs text-gray-400 mt-1">
            Record your session data for later analysis
          </p>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-400">Recording</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-semibold transition-colors"
          >
            Start Recording
          </button>
        ) : (
          <>
            <button
              onClick={stopRecording}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm font-semibold transition-colors"
            >
              Stop Recording
            </button>
            {recording && recording.data.length > 0 && (
              <button
                onClick={downloadRecording}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-semibold transition-colors"
              >
                Download
              </button>
            )}
          </>
        )}
      </div>

      {recording && recording.data.length > 0 && (
        <div className="mt-3 text-xs text-gray-400">
          Recorded {recording.data.length} data points
        </div>
      )}
    </div>
  )
}

