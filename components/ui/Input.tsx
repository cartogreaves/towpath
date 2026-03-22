'use client'

import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  large?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, large = false, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-label text-green-600 font-medium"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full bg-bg-surface text-green-700 font-sans text-body
            border rounded-md placeholder:text-green-300
            transition-all duration-150
            focus:outline-none focus:border-water-500
            focus:ring-[3px] focus:ring-water-500/15
            ${error ? 'border-danger' : 'border-green-200'}
            ${large ? 'h-12 px-4' : 'h-10 px-3'}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="text-sm text-danger">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
