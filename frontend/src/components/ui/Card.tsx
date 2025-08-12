import React from 'react'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
}

export function Card({ 
  children, 
  variant = 'default',
  className = '', 
  ...props 
}: CardProps) {
  const baseClasses = 'rounded-lg p-6'
  
  const variantClasses = {
    default: 'bg-white shadow-sm border border-gray-200',
    outlined: 'bg-white border border-gray-300',
    elevated: 'bg-white shadow-lg border border-gray-200'
  }

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardHeader({ children, className = '', ...props }: CardHeaderProps) {
  return (
    <div
      className={clsx('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export function CardTitle({ children, className = '', ...props }: CardTitleProps) {
  return (
    <h3
      className={clsx('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return (
    <div
      className={clsx('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}
