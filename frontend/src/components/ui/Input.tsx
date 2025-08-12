import React from 'react'
import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  helperText?: string
}

export function Input({ 
  className = '', 
  error = false,
  helperText,
  ...props 
}: InputProps) {
  return (
    <div>
      <input
        className={clsx(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors duration-200',
          error
            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
            : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        {...props}
      />
      {helperText && (
        <p className={clsx(
          'mt-1 text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
}
