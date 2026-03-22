'use client'

import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'danger'
type ButtonSize = 'sm' | 'default' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-green-600 text-bg-elevated hover:bg-green-500 active:bg-green-700 disabled:bg-bg-recessed disabled:text-green-300',
  secondary:
    'bg-bg-surface text-green-600 border border-green-200 hover:bg-bg-elevated active:bg-bg-recessed disabled:bg-bg-recessed disabled:text-green-300',
  ghost:
    'bg-transparent text-green-500 hover:bg-green-50 active:bg-green-100 disabled:text-green-300',
  whatsapp:
    'bg-whatsapp text-white hover:opacity-90 active:opacity-80 disabled:opacity-50',
  danger:
    'bg-danger text-white hover:opacity-90 active:opacity-80 disabled:opacity-50',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm font-medium',
  default: 'h-10 px-4 text-sm font-medium',
  lg: 'h-12 px-5 text-body font-medium',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'default',
      loading = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          inline-flex items-center justify-center gap-2 rounded-md
          transition-all duration-150 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-water-500 focus-visible:ring-offset-1
          select-none whitespace-nowrap
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
