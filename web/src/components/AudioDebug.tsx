'use client'

import { useState, useEffect } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { getChantById, getChantAudioPath } from '@/lib/chants'

export default function AudioDebug() {
  const { currentSession, audioElementRef } = useSessionStore()
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    if (!audioElementRef || !currentSession) return

    const updateDebugInfo = () => {
      const audio = audioElementRef
      const chant = getChantById(currentSession.audioTrack?.id || '')
      const audioPath = chant ? getChantAudioPath(chant) : `/audio/${currentSession.audioTrack?.id}.mp3`

      setDebugInfo({
        audioElement: !!audio,
        src: audio?.src || 'not set',
        expectedPath: audioPath,
        readyState: audio?.readyState ?? 'N/A',
        readyStateText: audio
          ? ['HAVE_NOTHING', 'HAVE_METADATA', 'HAVE_CURRENT_DATA', 'HAVE_FUTURE_DATA', 'HAVE_ENOUGH_DATA'][
              audio.readyState
            ] || 'UNKNOWN'
          : 'N/A',
        networkState: audio?.networkState ?? 'N/A',
        networkStateText: audio
          ? ['EMPTY', 'IDLE', 'LOADING', 'NO_SOURCE'][audio.networkState] || 'UNKNOWN'
          : 'N/A',
        paused: audio?.paused ?? 'N/A',
        muted: audio?.muted ?? 'N/A',
        volume: audio?.volume ?? 'N/A',
        currentTime: audio?.currentTime ?? 'N/A',
        duration: audio?.duration ?? 'N/A',
        userInteracted: localStorage.getItem('sync_user_interacted') === 'true',
        autoPlay: true,
      })
    }

    updateDebugInfo()
    const interval = setInterval(updateDebugInfo, 1000)

    return () => clearInterval(interval)
  }, [audioElementRef, currentSession])

  if (!debugInfo || !currentSession) return null

  return (
    <div className="bg-gray-900 rounded-lg p-4 border border-yellow-500/50 text-xs">
      <h4 className="text-yellow-400 font-semibold mb-2">🔍 Audio Debug Info</h4>
      <div className="space-y-1 text-gray-300 font-mono">
        <div>Audio Element: {debugInfo.audioElement ? '✅' : '❌'}</div>
        <div>Expected Path: {debugInfo.expectedPath}</div>
        <div>Actual Src: {debugInfo.src}</div>
        <div>Ready State: {debugInfo.readyState} ({debugInfo.readyStateText})</div>
        <div>Network State: {debugInfo.networkState} ({debugInfo.networkStateText})</div>
        <div>Paused: {String(debugInfo.paused)}</div>
        <div>Muted: {String(debugInfo.muted)}</div>
        <div>Volume: {debugInfo.volume}</div>
        <div>Current Time: {debugInfo.currentTime.toFixed(2)}s</div>
        <div>Duration: {isNaN(debugInfo.duration) ? 'N/A' : debugInfo.duration.toFixed(2) + 's'}</div>
        <div>User Interacted: {debugInfo.userInteracted ? '✅' : '❌'}</div>
        <div>AutoPlay: {debugInfo.autoPlay ? '✅' : '❌'}</div>
      </div>
      <button
        onClick={async () => {
          if (audioElementRef) {
            try {
              await audioElementRef.play()
              console.log('✅ Manual play successful')
            } catch (e: any) {
              console.error('❌ Manual play failed:', e)
              alert(`Play failed: ${e.message}\n\nThis is likely a browser autoplay restriction.`)
            }
          }
        }}
        className="mt-3 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-white text-xs"
      >
        ▶️ Force Play
      </button>
    </div>
  )
}

