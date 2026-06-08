import React from 'react'

export const Input = React.forwardRef(({ className = '', ...props }, ref) => (
  <input
    ref={ref}
    className={`flex min-h-11 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base placeholder-gray-400 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-500 ${className}`}
    {...props}
  />
))
Input.displayName = 'Input'
