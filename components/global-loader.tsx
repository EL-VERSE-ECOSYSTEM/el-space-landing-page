'use client'

import React, { useState, useEffect } from 'react'
import { ELLoader } from './ui/el-loader'

interface GlobalLoaderProps {
  isVisible: boolean
  duration?: number // in seconds (2-5)
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ 
  isVisible, 
  duration = 3 
}) => {
  const [show, setShow] = useState(isVisible)

  useEffect(() => {
    setShow(isVisible)
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false)
      }, duration * 1000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  if (!show) return null

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate900/30 to-slate-950 backdrop-blur-md z-[9999] flex items-center justify-center animate-in fade-in duration-300"
    >
      <div className="flex flex-col items-center justify-center w-full h-full animate-in zoom-in-50 duration-300">
        {/* New EL Animated Loader */}
        <ELLoader />

        {/* Progress bar */}
        <div className="mt-8 w-48 h-1 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-slate-500 via-slate500 to-slate500 rounded-full"
            style={{
              animation: `progress ${duration}s ease-in-out forwards`,
            }}
          />
        </div>
        <style>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    </div>
  )
}

// Hook for managing loader state
export const useGlobalLoader = (initialDuration = 3) => {
  const [isLoading, setIsLoading] = useState(false)
  const [duration, setDuration] = useState(
    Math.max(2, Math.min(5, initialDuration))
  )

  const show = (customDuration?: number) => {
    if (customDuration) {
      setDuration(Math.max(2, Math.min(5, customDuration)))
    }
    setIsLoading(true)
  }

  const hide = () => {
    setIsLoading(false)
  }

  return { isLoading, show, hide, duration }
}
