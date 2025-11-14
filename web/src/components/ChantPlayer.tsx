'use client'

import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { getChantById, getChantAudioPath } from '@/lib/chants'
import { useKeyboardShortcuts } from './KeyboardShortcuts'

// Global audio play trigger function
let globalAudioPlayTrigger: (() => Promise<void>) | null = null
export const setGlobalAudioPlayTrigger = (trigger: (() => Promise<void>) | null) => {
  globalAudioPlayTrigger = trigger
}
export const triggerGlobalAudioPlay = async () => {
  if (globalAudioPlayTrigger) {
    await globalAudioPlayTrigger()
  }
}

interface ChantPlayerProps {
  audioTrackId: string
  audioTrackName: string
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onAudioElementReady?: (element: HTMLAudioElement) => void
  autoPlay?: boolean
}

export default function ChantPlayer({
  audioTrackId,
  audioTrackName,
  onTimeUpdate,
  onAudioElementReady,
  autoPlay = false,
}: ChantPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const { setAudioElementRef, currentSession } = useSessionStore()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false)

  // Stop audio when session ends
  useEffect(() => {
    if (!currentSession && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setHasAttemptedAutoplay(false) // Reset autoplay attempt flag for next session
      console.log('🛑 Audio stopped - no active session')
    }
  }, [currentSession])

  // Create a play function that can be called globally
  const playAudio = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !autoPlay || hasAttemptedAutoplay) return
    
    console.log('🎯 Global playAudio called, readyState:', audio.readyState, 'src:', audio.src)
    
    try {
      // Ensure audio is loaded
      if (!audio.src || audio.src === '') {
        console.log('⚠️ Audio src not set, waiting...')
        return
      }

      // Try to play immediately if ready
      if (audio.readyState >= 2) {
        setHasAttemptedAutoplay(true)
        await audio.play()
        setIsPlaying(true)
        console.log('🎉 GLOBAL AUTOPLAY SUCCESSFUL!')
        return
      }

      // Wait for audio to be ready
      const checkReady = () => {
        if (audio.readyState >= 2) {
          setHasAttemptedAutoplay(true)
          audio.play()
            .then(() => {
              setIsPlaying(true)
              console.log('🎉 GLOBAL AUTOPLAY SUCCESSFUL (after wait)!')
            })
            .catch((e: any) => {
              console.error('❌ Global autoplay failed:', e.name, e.message)
              setHasAttemptedAutoplay(false) // Allow retry
            })
        } else {
          // Check again in 100ms
          setTimeout(checkReady, 100)
        }
      }
      
      // Start checking
      setTimeout(checkReady, 100)
      
      // Timeout after 5 seconds
      setTimeout(() => {
        if (!isPlaying) {
          console.warn('⚠️ Autoplay timeout - audio not ready after 5 seconds')
        }
      }, 5000)
    } catch (e: any) {
      console.error('❌ Global autoplay error:', e.name, e.message)
      setHasAttemptedAutoplay(false) // Allow retry
    }
  }, [autoPlay, hasAttemptedAutoplay, isPlaying])

  // Register the play function globally
  useEffect(() => {
    if (autoPlay) {
      setGlobalAudioPlayTrigger(playAudio)
    }
    return () => {
      setGlobalAudioPlayTrigger(null)
    }
  }, [autoPlay, audioTrackId, playAudio])

  // Listen for session_joined event to trigger immediate autoplay
  useEffect(() => {
    const handleSessionJoined = async () => {
      const audio = audioRef.current
      if (!audio || !autoPlay || hasAttemptedAutoplay) return
      
      console.log('🎯 Session joined event received - attempting immediate autoplay')
      
      // Wait a bit for audio to be ready
      const tryPlay = async () => {
        if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          try {
            await audio.play()
            setIsPlaying(true)
            setHasAttemptedAutoplay(true)
            console.log('🎉 IMMEDIATE AUTOPLAY FROM SESSION JOINED EVENT!')
          } catch (e: any) {
            console.log('⚠️ Immediate autoplay from event failed, will retry:', e.message)
            // Retry after a short delay
            setTimeout(async () => {
              try {
                await audio.play()
                setIsPlaying(true)
                setHasAttemptedAutoplay(true)
                console.log('🎉 AUTOPLAY SUCCESSFUL (retry from event)!')
              } catch (e2: any) {
                console.error('❌ Autoplay retry from event failed:', e2.message)
              }
            }, 300)
          }
        } else {
          // Wait for audio to be ready
          setTimeout(tryPlay, 100)
        }
      }
      
      tryPlay()
    }

    window.addEventListener('sync_session_joined', handleSessionJoined)
    return () => {
      window.removeEventListener('sync_session_joined', handleSessionJoined)
    }
  }, [autoPlay, hasAttemptedAutoplay])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Get the actual audio file path
    const chant = getChantById(audioTrackId)
    const audioPath = chant ? getChantAudioPath(chant) : `/audio/${audioTrackId}.mp3`
    
    console.log('🎵 Loading audio:', audioPath)
    
    // Reset and load new audio
    audio.pause()
    audio.src = audioPath
    audio.load()
    setCurrentTime(0)
    setIsPlaying(false)
    setHasAttemptedAutoplay(false)

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      if (onTimeUpdate) {
        onTimeUpdate(audio.currentTime, audio.duration)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
      console.log('✅ Audio metadata loaded, duration:', audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleCanPlay = async () => {
      console.log('✅ Audio can play, readyState:', audio.readyState)
      setAudioElementRef(audio)
      if (onAudioElementReady) {
        onAudioElementReady(audio)
      }
      
      // Also try autoplay here if readyState is good enough
      if (autoPlay && !hasAttemptedAutoplay && audio.readyState >= 3) {
        const userInteracted = localStorage.getItem('sync_user_interacted') === 'true'
        if (userInteracted) {
          try {
            await audio.play()
            setIsPlaying(true)
            setHasAttemptedAutoplay(true)
            console.log('🎉 AUTOPLAY SUCCESSFUL (canplay)!')
          } catch (e: any) {
            console.log('⚠️ Autoplay from canplay blocked, will retry:', e.message)
          }
        }
      }
    }

    const handleCanPlayThrough = async () => {
      console.log('✅✅ Audio can play through, readyState:', audio.readyState)
      
      // Try autoplay when audio is fully ready
      if (autoPlay && !hasAttemptedAutoplay) {
        const userInteracted = localStorage.getItem('sync_user_interacted') === 'true'
        console.log('🎯 Attempting autoplay (canplaythrough) - userInteracted:', userInteracted, 'readyState:', audio.readyState)
        
        if (userInteracted) {
          setHasAttemptedAutoplay(true)
          // Try playing immediately - this should work after user interaction
          try {
            await audio.play()
            setIsPlaying(true)
            console.log('🎉 AUTOPLAY SUCCESSFUL (canplaythrough)!')
          } catch (e: any) {
            console.error('❌ Autoplay failed (canplaythrough):', e.name, e.message)
            setHasAttemptedAutoplay(false) // Allow retry
            // Retry after a short delay
            setTimeout(async () => {
              try {
                if (audio.readyState >= 3) {
                  await audio.play()
                  setIsPlaying(true)
                  setHasAttemptedAutoplay(true)
                  console.log('🎉 AUTOPLAY SUCCESSFUL (canplaythrough retry)!')
                }
              } catch (e2: any) {
                console.error('❌ Autoplay retry also failed:', e2.name, e2.message)
              }
            }, 300)
          }
        } else {
          console.log('⚠️ User has not interacted yet - autoplay will be blocked')
        }
      }
    }

    // Try immediate autoplay if audio is already loaded (for fast connections)
    let immediateTimeout: NodeJS.Timeout | null = null
    const tryImmediateAutoplay = () => {
      if (audio.readyState >= 3 && autoPlay && !hasAttemptedAutoplay) {
        const userInteracted = localStorage.getItem('sync_user_interacted') === 'true'
        if (userInteracted) {
          setHasAttemptedAutoplay(true)
          audio.play()
            .then(() => {
              setIsPlaying(true)
              console.log('🎉 IMMEDIATE AUTOPLAY SUCCESSFUL!')
            })
            .catch((e: any) => {
              console.error('❌ Immediate autoplay failed:', e.name, e.message)
              setHasAttemptedAutoplay(false)
            })
        }
      }
    }

    // Try immediately if ready
    tryImmediateAutoplay()
    
    // Also try after a short delay in case readyState changes
    immediateTimeout = setTimeout(tryImmediateAutoplay, 500)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('canplaythrough', handleCanPlayThrough)

    return () => {
      if (immediateTimeout) clearTimeout(immediateTimeout)
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('canplaythrough', handleCanPlayThrough)
    }
  }, [audioTrackId, onTimeUpdate, onAudioElementReady, autoPlay, hasAttemptedAutoplay])

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        await audio.play()
        setIsPlaying(true)
        setHasAttemptedAutoplay(true)
      }
    } catch (error) {
      console.error('Error toggling playback:', error)
      // If play fails, try loading the audio again
      if (!isPlaying) {
        audio.load()
        try {
          await audio.play()
          setIsPlaying(true)
          setHasAttemptedAutoplay(true)
        } catch (e) {
          console.error('Retry play also failed:', e)
        }
      }
    }
  }, [isPlaying])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }, [])

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
  }, [])

  // Keyboard shortcuts for audio control
  useKeyboardShortcuts([
    {
      key: ' ',
      description: 'Play/pause',
      action: togglePlay,
    },
    {
      key: 'm',
      description: 'Mute/unmute',
      action: () => {
        const audio = audioRef.current
        if (audio) {
          audio.muted = !audio.muted
        }
      },
    },
    {
      key: 'ArrowLeft',
      description: 'Rewind 5 seconds',
      action: () => {
        const audio = audioRef.current
        if (audio) {
          audio.currentTime = Math.max(0, audio.currentTime - 5)
        }
      },
    },
    {
      key: 'ArrowRight',
      description: 'Forward 5 seconds',
      action: () => {
        const audio = audioRef.current
        if (audio) {
          audio.currentTime = Math.min(audio.duration, audio.currentTime + 5)
        }
      },
    },
  ])

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      {autoPlay && !isPlaying && (
        <div className={`mb-4 p-3 rounded-lg text-center ${
          hasAttemptedAutoplay 
            ? 'bg-yellow-900/20 border border-yellow-500/50' 
            : 'bg-blue-900/20 border border-blue-500/50'
        }`}>
          <p className={`text-sm mb-2 ${
            hasAttemptedAutoplay ? 'text-yellow-300' : 'text-blue-300'
          }`}>
            {hasAttemptedAutoplay 
              ? 'Autoplay was blocked. Click play to start chanting'
              : 'Audio loading... Click play when ready'}
          </p>
          <button
            onClick={togglePlay}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-semibold transition-colors"
          >
            ▶️ Start Chanting
          </button>
        </div>
      )}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={togglePlay}
          className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transition-colors"
        >
          {isPlaying ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 4h4v12H6V4zm4 0h4v12h-4V4z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <div className="text-sm text-gray-400 mb-1">Now Chanting</div>
          <div className="text-white font-semibold">{audioTrackName}</div>
        </div>

        <div className="text-sm text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.617a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
        </svg>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
        />
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        autoPlay={false}
        onError={(e) => {
          const chant = getChantById(audioTrackId)
          const audioPath = chant ? getChantAudioPath(chant) : `/audio/${audioTrackId}.mp3`
          console.error(`❌ Audio file error: ${audioPath}`, e)
          console.error('Audio error details:', {
            networkState: e.currentTarget.networkState,
            readyState: e.currentTarget.readyState,
            src: e.currentTarget.src
          })
        }}
        onLoadStart={() => {
          console.log('🔄 Audio load started')
        }}
        onLoadedData={() => {
          console.log('✅ Audio data loaded, readyState:', audioRef.current?.readyState)
          // Try autoplay when data is loaded
          if (autoPlay && !hasAttemptedAutoplay && audioRef.current) {
            const userInteracted = localStorage.getItem('sync_user_interacted') === 'true'
            if (userInteracted && audioRef.current.readyState >= 2) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true)
                  setHasAttemptedAutoplay(true)
                  console.log('🎉 AUTOPLAY SUCCESSFUL (loadeddata)!')
                })
                .catch((e: any) => {
                  console.log('⚠️ Autoplay from loadeddata blocked:', e.message)
                })
            }
          }
        }}
        onPlay={() => {
          console.log('▶️ Audio started playing')
          setIsPlaying(true)
        }}
        onPause={() => {
          console.log('⏸️ Audio paused')
          setIsPlaying(false)
        }}
      />
    </div>
  )
}

