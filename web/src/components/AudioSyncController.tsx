'use client'

import { useEffect, useRef } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface AudioSyncControllerProps {
  audioElement: HTMLAudioElement | null
  sessionStartTime: number
}

/**
 * Synchronizes audio playback across all participants
 * Uses session start time to ensure everyone hears the chant at the same moment
 */
export default function AudioSyncController({
  audioElement,
  sessionStartTime,
}: AudioSyncControllerProps) {
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const { currentSession } = useSessionStore()

  useEffect(() => {
    if (!audioElement || !currentSession) return

    const syncAudio = () => {
      const now = Date.now()
      const sessionElapsed = now - sessionStartTime
      const targetTime = (sessionElapsed / 1000) % audioElement.duration

      // Only sync if difference is significant (> 0.5 seconds)
      if (Math.abs(audioElement.currentTime - targetTime) > 0.5) {
        audioElement.currentTime = targetTime
        console.log('Audio synced to:', targetTime)
      }
    }

    // Sync every 5 seconds
    syncIntervalRef.current = setInterval(syncAudio, 5000)

    // Initial sync
    syncAudio()

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [audioElement, sessionStartTime, currentSession])

  return null // This is a controller component, no UI
}

