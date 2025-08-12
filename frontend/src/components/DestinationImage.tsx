'use client'

import NextImage from 'next/image'
import { useState } from 'react'
import { getDestinationGradient } from '@/lib/photos'

interface DestinationImageProps {
  src: string
  alt: string
  destinationName?: string
  className?: string
  fill?: boolean
  sizes?: string
  width?: number
  height?: number
}

export function DestinationImage({ 
  src, 
  alt, 
  destinationName = 'default',
  className = '',
  fill = false,
  sizes,
  width,
  height
}: DestinationImageProps) {
  const [imageError, setImageError] = useState(false)
  const gradient = getDestinationGradient(destinationName)

  if (imageError) {
    // Show gradient fallback when image fails to load
    return (
      <div 
        className={`bg-gradient-to-br ${gradient} ${className}`}
        style={{ minHeight: fill ? '100%' : height ? `${height}px` : '200px' }}
      >
        <div className="flex items-center justify-center h-full text-white font-semibold text-lg">
          {destinationName !== 'default' ? destinationName : 'Destination'}
        </div>
      </div>
    )
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  )
}
