'use client'

import { ComponentType, Suspense, lazy } from 'react'

interface LazyLoaderProps {
  fallback?: React.ReactNode
}

const defaultFallback = (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
  </div>
)

export function createLazyComponent<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback: React.ReactNode = defaultFallback
) {
  const LazyComponent = lazy(importFunc)

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

export default function LazyLoader({ fallback = defaultFallback }: LazyLoaderProps) {
  return <>{fallback}</>
}

