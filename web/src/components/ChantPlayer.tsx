'use client'

import { useEffect, useRef, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { getChantById, getChantAudioPath } from '@/lib/chants'

interface ChantPlayerProps {
  audioTrackId: string
  audioTrackName: string
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onAudioElementReady?: (element: HTMLAudioElement) => void
}

export default function ChantPlayer({
  audioTrackId,
  audioTrackName,
  onTimeUpdate,
  onAudioElementReady,
}: ChantPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    // Get the actual audio file path
    const chant = getChantById(audioTrackId)
    const audioPath = chant ? getChantAudioPath(chant) : `/audio/${audioTrackId}.mp3`
    
    // Reset and load new audio
    audio.pause()
    audio.src = audioPath
    audio.load()
    setCurrentTime(0)
    setIsPlaying(false)

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      if (onTimeUpdate) {
        onTimeUpdate(audio.currentTime, audio.duration)
      }
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTime(0)
    }

    const handleCanPlay = () => {
      // Audio is ready to play
      console.log('Audio loaded:', audioPath)
      if (onAudioElementReady) {
        onAudioElementReady(audio)
      }
    }

    // Notify parent when audio element is ready
    if (audio.readyState >= 2) {
      // HAVE_CURRENT_DATA or higher
      if (onAudioElementReady) {
        onAudioElementReady(audio)
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('canplay', handleCanPlay)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('canplay', handleCanPlay)
    }
  }, [audioTrackId, onTimeUpdate])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newVolume = parseFloat(e.target.value)
    audio.volume = newVolume
    setVolume(newVolume)
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
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
        preload="metadata"
        onError={(e) => {
          const chant = getChantById(audioTrackId)
          const audioPath = chant ? getChantAudioPath(chant) : `/audio/${audioTrackId}.mp3`
          console.warn(`Audio file not found: ${audioPath}`)
          // Try alternative formats if filename-based path fails
          if (chant?.filename) {
            const audio = e.currentTarget
            const formats = ['wav', 'm4a', 'ogg']
            let formatIndex = 0
            
            const tryNextFormat = () => {
              if (formatIndex < formats.length) {
                const baseName = chant.filename!.replace(/\.(mp3|wav|m4a|ogg)$/i, '')
                audio.src = `/audio/${encodeURIComponent(baseName)}.${formats[formatIndex]}`
                formatIndex++
              } else {
                console.error('No audio file found in any format')
              }
            }
            
            tryNextFormat()
          }
        }}
      />
    </div>
  )
}

