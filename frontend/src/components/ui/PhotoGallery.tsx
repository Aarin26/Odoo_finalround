'use client'

import Image from 'next/image'
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface PhotoGalleryProps {
  photos: string[]
  alt: string
  className?: string
}

export function PhotoGallery({ photos, alt, className = '' }: PhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const openModal = () => setShowModal(true)
  const closeModal = () => setShowModal(false)

  if (photos.length === 0) return null

  return (
    <>
      {/* Thumbnail */}
      <div 
        className={`relative cursor-pointer group ${className}`}
        onClick={openModal}
      >
        <Image
          src={photos[currentPhotoIndex]}
          alt={alt}
          fill
          className="object-cover rounded-lg transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {photos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {currentPhotoIndex + 1} / {photos.length}
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="relative">
              <Image
                src={photos[currentPhotoIndex]}
                alt={alt}
                width={800}
                height={600}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
