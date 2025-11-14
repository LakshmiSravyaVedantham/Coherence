'use client'

import { useEffect, useRef } from 'react'
import p5 from 'p5'

interface AnimatedPatternProps {
  width?: number
  height?: number
  className?: string
}

export default function AnimatedPattern({
  width = 400,
  height = 400,
  className = '',
}: AnimatedPatternProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5InstanceRef = useRef<p5 | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sketch = (p: p5) => {
      let t = 0
      let m = width / 2
      let img: p5.Image | null = null

      p.setup = () => {
        p.createCanvas(width, width)
        p.background(9)
        p.stroke(255, 46)
        p.translate(m, m)
      }

      p.draw = () => {
        p.clear()
        m = width / 2

        for (let i = 20000; i >= 0; i--) {
          if (i > 6) {
            const k = (i % 25) - 12
            const e = i / 800
            const mag = p.sqrt(k * k + e * e)
            const d = 7 * p.cos(mag / 3 + t / 2)
            const x = k * 4 + d * k * p.sin(d + e / 9 + t) + m
            const y = e * 2 - d * 9 - d * 9 * p.cos(d + t) + m
            p.point(x, y)
          } else if (i === 6) {
            img = p.get()
          } else {
            p.rotate(p.PI / 3)
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
    }

    p5InstanceRef.current = new p5(sketch, containerRef.current)

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove()
        p5InstanceRef.current = null
      }
    }
  }, [width, height])

  return <div ref={containerRef} className={className} />
}
