'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

interface ToastProps {
  toast: ToastData
  onDismiss: (id: string) => void
}

const variantStyles: Record<ToastVariant, { bg: string; icon: React.ReactNode; iconBg: string }> = {
  success: {
    bg: 'bg-white border-green-200',
    iconBg: 'bg-green-100',
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
  },
  error: {
    bg: 'bg-white border-red-200',
    iconBg: 'bg-red-100',
    icon: <XCircle className="h-5 w-5 text-red-600" />,
  },
  warning: {
    bg: 'bg-white border-yellow-200',
    iconBg: 'bg-yellow-100',
    icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
  },
  info: {
    bg: 'bg-white border-blue-200',
    iconBg: 'bg-blue-100',
    icon: <Info className="h-5 w-5 text-blue-600" />,
  },
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const styles = variantStyles[toast.variant]
  const duration = toast.duration ?? 3000

  useEffect(() => {
    // Trigger enter animation
    const enterTimeout = setTimeout(() => setIsVisible(true), 10)

    // Auto dismiss
    const dismissTimeout = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => onDismiss(toast.id), 300)
    }, duration)

    return () => {
      clearTimeout(enterTimeout)
      clearTimeout(dismissTimeout)
    }
  }, [toast.id, duration, onDismiss])

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-sm w-full
        transform transition-all duration-300 ease-out
        ${styles.bg}
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
    >
      <div className={`flex-shrink-0 p-1.5 rounded-full ${styles.iconBg}`}>
        {styles.icon}
      </div>
      <p className="flex-1 text-sm font-medium text-gray-900">{toast.message}</p>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
