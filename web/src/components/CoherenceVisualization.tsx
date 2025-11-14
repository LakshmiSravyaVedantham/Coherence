'use client'

import { useEffect, useRef } from 'react'
import p5 from 'p5'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<p5 | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sketch = (p: p5) => {
      let t = 0
      let w = 400
      let m = 200
      let img: p5.Image | null = null

      p.setup = () => {
        const container = containerRef.current
        if (!container) return
        
        const size = Math.min(container.offsetWidth, container.offsetHeight) || 400
        w = size
        m = w / 2
        p.createCanvas(w, w)
        p.background(9)
        p.stroke(255, 46)
        p.translate(m, m)
      }

      p.draw = () => {
        p.clear()
        m = w / 2

        // Adjust stroke color based on coherence
        const colors = {
          low: [239, 68, 68],    // red
          medium: [234, 179, 8], // yellow
          high: [34, 197, 94],    // green
        }
        const color = colors[coherencePhase]
        const alpha = 18 + Math.floor((groupCoherence / 100) * 28) // 18-46 alpha based on coherence
        p.stroke(color[0], color[1], color[2], alpha)

        for (let i = 20000; i >= 0; i--) {
          if (i > 14) {
            const k = (i % 50) - 25
            const e = i / 1100
            const mag = p.sqrt(k * k + e * e)
            const d = 5 * p.cos(mag - t + (i % 2))
            const x = k + (k * d / 6) * p.sin(d + e / 3 + t) + m
            const y = 90 + e * d - (e / d) * 2 * p.cos(d + t) + m
            p.point(x, y)
          } else if (i === 14) {
            img = p.get()
          } else {
            p.rotate(p.PI / 7)
            if (img) {
              p.image(img, -m, -m)
            }
          }
        }

        if (img) {
          p.stroke(255, 46)
          p.background(9)
          p.translate(m, m)
        }

        t += p.PI / 240
      }

      p.windowResized = () => {
        const container = containerRef.current
        if (!container) return
        
        const size = Math.min(container.offsetWidth, container.offsetHeight) || 400
        w = size
        m = w / 2
        p.resizeCanvas(w, w)
      }
    }

    p5InstanceRef.current = new p5(sketch, containerRef.current)

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }
  }, [groupCoherence, coherencePhase, personalCoherence])

  return (
    <div className="relative w-full aspect-square max-w-2xl mx-auto">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <div className="text-sm text-purple-300 font-semibold mb-1">Chant Coherence Visualization</div>
        <div className="text-xs text-gray-400">Collective harmony through synchronized chanting</div>
      </div>
      <div
        ref={containerRef}
        className="w-full h-full"
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

