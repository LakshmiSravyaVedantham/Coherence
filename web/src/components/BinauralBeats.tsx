'use client'

import { useEffect, useRef, useState } from 'react'

interface BinauralBeatsProps {
  baseFrequency: number // Base frequency in Hz
  beatFrequency: number // Beat frequency (delta: 0.5-4, theta: 4-8, alpha: 8-13, beta: 13-30)
  enabled: boolean
  volume?: number
}

export default function BinauralBeats({
  baseFrequency,
  beatFrequency,
  enabled,
  volume = 0.3,
}: BinauralBeatsProps) {
  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const gainNodesRef = useRef<GainNode[]>([])

  useEffect(() => {
    if (!enabled) {
      // Stop all oscillators
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop()
        } catch (e) {
          // Already stopped
        }
      })
      oscillatorsRef.current = []
      gainNodesRef.current = []
      return
    }

    // Initialize AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current

    // Create left and right oscillators
    const leftOsc = ctx.createOscillator()
    const rightOsc = ctx.createOscillator()
    const leftGain = ctx.createGain()
    const rightGain = ctx.createGain()
    const masterGain = ctx.createGain()

    // Set frequencies for binaural beats
    // Left ear: base frequency
    // Right ear: base frequency + beat frequency
    leftOsc.frequency.value = baseFrequency
    rightOsc.frequency.value = baseFrequency + beatFrequency

    // Set oscillator type to sine wave for smooth beats
    leftOsc.type = 'sine'
    rightOsc.type = 'sine'

    // Connect to gain nodes
    leftOsc.connect(leftGain)
    rightOsc.connect(rightGain)

    // Pan left and right
    const leftPanner = ctx.createStereoPanner()
    const rightPanner = ctx.createStereoPanner()
    leftPanner.pan.value = -1 // Full left
    rightPanner.pan.value = 1 // Full right

    leftGain.connect(leftPanner)
    rightGain.connect(rightPanner)

    leftPanner.connect(masterGain)
    rightPanner.connect(masterGain)

    // Set volume
    masterGain.gain.value = volume
    masterGain.connect(ctx.destination)

    // Start oscillators
    leftOsc.start()
    rightOsc.start()

    // Store references
    oscillatorsRef.current = [leftOsc, rightOsc]
    gainNodesRef.current = [leftGain, rightGain, masterGain]

    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop()
        } catch (e) {
          // Already stopped
        }
      })
      oscillatorsRef.current = []
      gainNodesRef.current = []
    }
  }, [enabled, baseFrequency, beatFrequency, volume])

  return null // This is a controller component, no UI
}

