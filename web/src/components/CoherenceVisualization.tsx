'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ParticipantIndicators from './ParticipantIndicators'

interface CoherenceVisualizationProps {
  personalCoherence: number
  groupCoherence: number
  coherencePhase: 'low' | 'medium' | 'high'
}

export default function CoherenceVisualization({
  personalCoherence,
  groupCoherence,
  coherencePhase,
}: CoherenceVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationPhase = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const maxRadius = Math.min(canvas.width, canvas.height) / 2 - 20

      // Base radius scales with group coherence
      const baseRadius = maxRadius * (0.3 + (groupCoherence / 100) * 0.7)

      // Color based on coherence phase
      const colors = {
        low: '#ef4444',
        medium: '#eab308',
        high: '#22c55e',
      }
      const color = colors[coherencePhase]

      // Draw concentric circles (Flower of Life pattern)
      const circleCount = 7
      for (let i = 0; i < circleCount; i++) {
        const radius = baseRadius * (i / (circleCount - 1))
        const alpha = 0.3 + (groupCoherence / 100) * 0.7

        ctx.strokeStyle = color + Math.floor(alpha * 255).toString(16).padStart(2, '0')
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw interlocking circles
      const interlockRadius = baseRadius / 3
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 3) {
        const x = centerX + Math.cos(angle + animationPhase) * interlockRadius
        const y = centerY + Math.sin(angle + animationPhase) * interlockRadius

        ctx.strokeStyle = '#ffffff' + '80'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(x, y, interlockRadius, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Draw personal coherence indicator (pulsing dot)
      const personalAngle = (animationPhase * 2) % (Math.PI * 2)
      const personalRadius = baseRadius * 0.8
      const personalX = centerX + Math.cos(personalAngle) * personalRadius
      const personalY = centerY + Math.sin(personalAngle) * personalRadius

      const personalColor =
        personalCoherence < 40
          ? '#ef4444'
          : personalCoherence < 60
          ? '#eab308'
          : '#22c55e'

      ctx.fillStyle = personalColor
      ctx.beginPath()
      ctx.arc(
        personalX,
        personalY,
        8 + Math.sin(animationPhase * 4) * 3,
        0,
        Math.PI * 2
      )
      ctx.fill()

      animationPhase += 0.02
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [groupCoherence, coherencePhase, personalCoherence])

  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto">
      <canvas
        ref={canvasRef}
        className="w-full h-full coherence-mandala"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0.9) 100%)' }}
      />
      <ParticipantIndicators />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-md">
        <PersonalCoherenceWave coherence={personalCoherence} />
      </div>
    </div>
  )
}

function PersonalCoherenceWave({ coherence }: { coherence: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = 60
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let animationPhase = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const midY = canvas.height / 2
      const amplitude = canvas.height * 0.3 * (coherence / 100)
      const frequency = 3.0

      const color =
        coherence < 40 ? '#ef4444' : coherence < 60 ? '#eab308' : '#22c55e'

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x++) {
        const normalizedX = x / canvas.width
        const y =
          midY +
          Math.sin(normalizedX * frequency * Math.PI * 2 + animationPhase) *
            amplitude
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()

      animationPhase += 0.05
      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [coherence])

  return <canvas ref={canvasRef} className="w-full h-[60px]" />
}

