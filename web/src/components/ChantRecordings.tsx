'use client'

import { useState, useEffect } from 'react'
import { AVAILABLE_CHANTS } from '@/lib/chants'

interface Recording {
  id: string
  chantId: string
  fileName: string
  duration: number
  uploadedAt: number
  size: number
}

export default function ChantRecordings() {
  const [recordings, setRecordings] = useState<Recording[]>([])

  useEffect(() => {
    // Load recordings from available chants with audio files
    const availableRecordings: Recording[] = AVAILABLE_CHANTS.filter((chant) => chant.filename)
      .map((chant) => ({
        id: chant.id,
        chantId: chant.id,
        fileName: chant.filename!,
        duration: chant.duration,
        uploadedAt: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Random time in last week
        size: Math.floor(Math.random() * 10000000) + 1000000, // 1-10 MB
      }))
    setRecordings(availableRecordings)
  }, [])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Chant Recordings</h2>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold">
          Upload New Recording
        </button>
      </div>

      {recordings.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <div className="text-4xl mb-4">🎵</div>
          <p className="text-gray-400 mb-2">No recordings uploaded yet</p>
          <p className="text-sm text-gray-500">Upload your chant recordings to use them in sessions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recordings.map((recording) => {
            const chant = AVAILABLE_CHANTS.find((c) => c.id === recording.chantId)
            return (
              <div
                key={recording.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {chant?.name || recording.fileName}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">{chant?.description}</p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>📁 {recording.fileName}</span>
                      <span>⏱️ {formatDuration(recording.duration)}</span>
                      <span>💾 {formatFileSize(recording.size)}</span>
                    </div>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                    Available
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-semibold">
                    Play
                  </button>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm">
                    Use in Session
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

