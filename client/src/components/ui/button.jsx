import React from 'react'
import { motion } from 'framer-motion'

const buttonVariants = {
  variants: {
    default: 'bg-accent text-white hover:bg-accent/90 dark:bg-accent dark:text-white',
    outline: 'border border-input bg-background hover:bg-accent/10 dark:border-gray-700',
    ghost: 'hover:bg-accent/10 dark:hover:bg-accent/20',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-white',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    link: 'text-accent underline-offset-4 hover:underline',
  },
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg h-12',
    icon: 'h-10 w-10',
  },
}

export const Button = React.forwardRef(
  ({ className = '', variant = 'default', size = 'md', asMotion = false, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'

    const buttonClass = `${baseStyles} ${buttonVariants.variants[variant] || buttonVariants.variants.default} ${buttonVariants.sizes[size] || buttonVariants.sizes.md} ${className}`

    const Component = asMotion ? motion.button : 'button'

    const motionProps = asMotion
      ? {
          whileHover: { scale: 1.02, transition: { duration: 0.2 } },
          whileTap: { scale: 0.98 },
        }
      : {}

    return (
      <Component ref={ref} className={buttonClass} {...motionProps} {...props} />
    )
  }
)

Button.displayName = 'Button'
