'use client'

import { useEffect, useRef } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import p5 from 'p5'

interface P5VisualizationProps {
  className?: string
}

export default function P5Visualization({ className = '' }: P5VisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<p5 | null>(null)
  const { currentSession, personalCoherence } = useSessionStore()
  const groupCoherence = currentSession?.groupMetrics?.averageCoherence || 0

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

        // Get coherence values
        const groupCoherenceValue = currentSession?.groupMetrics?.averageCoherence || 0
        const personalCoherenceValue = personalCoherence || 0
        const avgCoherence = (groupCoherenceValue + personalCoherenceValue) / 2

        // Adjust stroke color based on coherence
        const colors = {
          low: [239, 68, 68],    // red
          medium: [234, 179, 8], // yellow
          high: [34, 197, 94],    // green
        }
        
        let color: number[]
        if (avgCoherence < 40) {
          color = colors.low
        } else if (avgCoherence < 60) {
          color = colors.medium
        } else {
          color = colors.high
        }
        
        const alpha = 18 + Math.floor((avgCoherence / 100) * 28) // 18-46 alpha based on coherence
        p.stroke(color[0], color[1], color[2], alpha)

        // Animated pattern - similar to the code you provided
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

        // Speed up animation based on coherence
        const speedMultiplier = 1 + (avgCoherence / 100) * 0.5
        t += (p.PI / 240) * speedMultiplier
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
  }, [currentSession, personalCoherence, groupCoherence])

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0.9) 100%)' }}
    />
  )
}

