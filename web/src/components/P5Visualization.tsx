'use client'

import { useEffect, useRef, useState } from 'react'
import { useSessionStore } from '@/store/sessionStore'

interface P5VisualizationProps {
  className?: string
}

export default function P5Visualization({ className = '' }: P5VisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<any>(null)
  const [p5Loaded, setP5Loaded] = useState(false)
  const { currentSession, personalCoherence } = useSessionStore()

  // Dynamically load p5.js only on client side
  useEffect(() => {
    if (typeof window === 'undefined' || p5Loaded) return

    import('p5').then((p5Module) => {
      const p5 = p5Module.default
      setP5Loaded(true)

      if (containerRef.current && !p5InstanceRef.current) {
        const sketch = (p: any) => {
          let t = 0
          let img: any = null
          const w = 400
          const m = w / 2

          p.setup = () => {
            p.createCanvas(w, w)
          }

          p.draw = () => {
            // Get coherence values for color adjustment
            const groupCoherenceValue = currentSession?.groupMetrics?.averageCoherence || 0
            const personalCoherenceValue = personalCoherence || 0
            const avgCoherence = (groupCoherenceValue + personalCoherenceValue) / 2

            // Adjust color based on coherence (purple/blue spectrum)
            const colorIntensity = Math.min(avgCoherence / 100, 1)
            const color = [
              Math.floor(100 + colorIntensity * 155), // R: 100-255
              Math.floor(50 + colorIntensity * 100), // G: 50-150
              Math.floor(200 + colorIntensity * 55), // B: 200-255
            ]
            const alpha = 18 + Math.floor((avgCoherence / 100) * 28) // 18-46 alpha based on coherence

            // Exact visualization code as provided
            p.clear()
            t += p.PI / 240

            for (let i = 20000; i >= 0; i--) {
              if (i > 14) {
                const k = (i % 50) - 25
                const e = i / 1100
                const mag = p.sqrt(k * k + e * e)
                const d = 5 * p.cos(mag - t + (i % 2))

                // Use coherence-based color instead of stroke(w,46)
                p.stroke(color[0], color[1], color[2], alpha)

                const x = k + (k * d / 6) * p.sin(d + e / 3 + t) + m
                const y = 90 + e * d - (e / d) * 2 * p.cos(d + t) + m
                p.point(x, y)
              } else if (i !== 14) {
                p.rotate(p.PI / 7)
                if (img) {
                  p.image(img, -m, -m)
                } else {
                  img = p.get()
                  p.background(9)
                  p.translate(m, m)
                }
              }
            }
          }
        }

        p5InstanceRef.current = new p5(sketch, containerRef.current)
      }
    }).catch((error) => {
      console.error('Failed to load p5.js:', error)
    })
  }, [p5Loaded, currentSession, personalCoherence])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }
  }, [])

  if (!p5Loaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-900 rounded-lg`}>
        <div className="text-gray-400 text-sm">Loading visualization...</div>
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}
