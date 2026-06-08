import React from 'react'

const badgeVariants = {
  variants: {
    default:
      'border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-white',
    primary: 'bg-accent text-white dark:bg-accent/80',
    secondary: 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white',
    success: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100',
    error: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
    info: 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100',
  },
  sizes: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  },
}

export const Badge = React.forwardRef(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex items-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${badgeVariants.variants[variant] || badgeVariants.variants.default} ${badgeVariants.sizes[size] || badgeVariants.sizes.md} ${className}`}
      {...props}
    />
  )
)

Badge.displayName = 'Badge'
