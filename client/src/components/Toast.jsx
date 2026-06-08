import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '../context/ToastContext'

const toastStyles = {
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-800 dark:text-green-200',
    icon: '✓',
    iconColor: 'text-green-600',
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-800 dark:text-red-200',
    icon: '✕',
    iconColor: 'text-red-600',
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-800 dark:text-blue-200',
    icon: 'ℹ',
    iconColor: 'text-blue-600',
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-800 dark:text-yellow-200',
    icon: '!',
    iconColor: 'text-yellow-600',
  },
  default: {
    bg: 'bg-gray-50 dark:bg-gray-900',
    border: 'border-gray-200 dark:border-gray-800',
    text: 'text-gray-800 dark:text-gray-200',
    icon: '•',
    iconColor: 'text-gray-600',
  },
}

const toastVariants = {
  initial: { opacity: 0, y: -50, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

const Toast = ({ id, message, type = 'default', onClose }) => {
  const style = toastStyles[type] || toastStyles.default

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`${style.bg} ${style.border} ${style.text} border rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg max-w-md`}
      role="status"
      aria-live="polite"
    >
      <span className={`${style.iconColor} font-bold text-lg flex-shrink-0`}>
        {style.icon}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className={`${style.iconColor} hover:opacity-70 flex-shrink-0`}
        aria-label="Close notification"
      >
        ✕
      </button>
    </motion.div>
  )
}

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={removeToast}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
