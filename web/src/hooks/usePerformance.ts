'use client'

import { useEffect, useRef } from 'react'

export function usePerformanceMonitor(componentName: string) {
  const renderStartRef = useRef<number>(0)

  useEffect(() => {
    renderStartRef.current = performance.now()
    return () => {
      const renderTime = performance.now() - renderStartRef.current
      if (renderTime > 16) {
        // Log slow renders (> 16ms = 60fps threshold)
        console.warn(`[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms`)
      }
    }
  })
}

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return ((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args)
    }, delay)
  }) as T
}

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastRunRef = useRef<number>(0)

  return ((...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastRunRef.current >= delay) {
      lastRunRef.current = now
      callback(...args)
    }
  }) as T
}

