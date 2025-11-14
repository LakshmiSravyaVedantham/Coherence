'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getSocket, disconnectSocket } from '@/lib/socket'
import { useSessionStore } from '@/store/sessionStore'
import { SessionInfo } from '@/store/sessionStore'

interface SessionContextType {
  joinSession: (intention?: { category: string; note?: string }, chantId?: string) => void
  leaveSession: () => void
  updateCoherence: (coherence: number) => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const {
    setCurrentSession,
    setIsConnected,
    updateGroupMetrics,
    setPersonalCoherence,
  } = useSessionStore()
  const [socket, setSocket] = useState<any>(null)
  const [userId] = useState(() => {
    // Generate or retrieve user ID
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('sync_user_id')
      if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem('sync_user_id', id)
      }
      return id
    }
    return crypto.randomUUID()
  })

  useEffect(() => {
    const sock = getSocket(userId)

    sock.on('connect', () => {
      setIsConnected(true)
    })

    sock.on('disconnect', () => {
      setIsConnected(false)
    })

    sock.on('session_joined', (data: SessionInfo) => {
      setCurrentSession({
        sessionId: data.sessionId,
        startedAt: data.startedAt,
        duration: data.duration,
        currentPhase: data.currentPhase,
        participantCount: data.participantCount,
        groupMetrics: data.groupMetrics,
        audioTrack: data.audioTrack || {
          id: 'om-chant-432hz',
          name: 'Om Chant - 432 Hz Tuning',
          duration: data.duration,
        },
      })

      // Store session start for history
      const sessionStart = {
        sessionId: data.sessionId,
        startedAt: data.startedAt,
        audioTrack: data.audioTrack || {
          id: 'om-chant-432hz',
          name: 'Om Chant - 432 Hz Tuning',
          duration: data.duration,
        },
      }
      localStorage.setItem('sync_current_session', JSON.stringify(sessionStart))
      
      // Mark that user has interacted - this allows autoplay
      localStorage.setItem('sync_user_interacted', 'true')
      
      // Dispatch custom event to trigger autoplay immediately
      // This happens right after user clicks "Join Session", so autoplay should work
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sync_session_joined', { 
          detail: { audioTrack: data.audioTrack } 
        }))
      }
    })

    sock.on('group_metrics_update', (data: { groupMetrics: SessionInfo['groupMetrics'] }) => {
      updateGroupMetrics(data.groupMetrics)
    })

    sock.on('participant_update', (data: { participantCount: number }) => {
      setCurrentSession((prev) =>
        prev ? { ...prev, participantCount: data.participantCount } : null
      )
    })

    setSocket(sock)

    return () => {
      disconnectSocket()
    }
  }, [userId, setIsConnected, setCurrentSession, updateGroupMetrics])

  const joinSession = (intention?: { category: string; note?: string }, chantId?: string) => {
    if (socket) {
      socket.emit('join_session', { intention, chantId })
    }
  }

  const leaveSession = () => {
    if (socket) {
      socket.emit('leave_session')
      setCurrentSession(null)
    }
  }

  const updateCoherence = (coherence: number) => {
    setPersonalCoherence(coherence)
    if (socket) {
      socket.emit('update_coherence', { coherence })
    }
  }

  return (
    <SessionContext.Provider value={{ joinSession, leaveSession, updateCoherence }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}

