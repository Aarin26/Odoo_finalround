// Photos configuration for destinations - using real photo URLs
export const destinationPhotos: Record<string, string> = {
  'Paris': 'https://images.unsplash.com/photo-1502602898535-0c2d26c04614?w=800&h=600&fit=crop',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop',
  'Santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop',
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
  'Rome': 'https://images.unsplash.com/photo-1552832230-cb7e7a9dbaa5?w=800&h=600&fit=crop',
  'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=600&fit=crop',
  'Amsterdam': 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&h=600&fit=crop',
  'Bangkok': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&h=600&fit=crop',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
  'Seoul': 'https://images.unsplash.com/photo-1538485399081-7c8cebd5c6e8?w=800&h=600&fit=crop',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
  'Cape Town': 'https://images.unsplash.com/photo-1521295121782-fa034db5f3c8?w=800&h=600&fit=crop',
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=600&fit=crop',
  'Reykjavik': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
}

// Fallback gradient colors for each destination
export const destinationGradients: Record<string, string> = {
  'Paris': 'from-blue-400 to-purple-500',
  'Tokyo': 'from-pink-400 to-red-500',
  'Bali': 'from-green-400 to-teal-500',
  'New York': 'from-blue-500 to-indigo-600',
  'Santorini': 'from-cyan-400 to-blue-500',
  'London': 'from-gray-400 to-blue-500',
  'Rome': 'from-orange-400 to-red-500',
  'Barcelona': 'from-yellow-400 to-orange-500',
  'Amsterdam': 'from-orange-400 to-red-500',
  'Bangkok': 'from-purple-400 to-pink-500',
  'Singapore': 'from-red-400 to-orange-500',
  'Seoul': 'from-blue-400 to-purple-500',
  'Dubai': 'from-yellow-400 to-orange-500',
  'Cape Town': 'from-green-400 to-blue-500',
  'Sydney': 'from-blue-400 to-cyan-500',
  'Reykjavik': 'from-blue-400 to-purple-500'
}

// Default photo for destinations without specific images
export const defaultPhoto = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'

// Default gradient for destinations without specific gradients
export const defaultGradient = 'from-blue-400 to-purple-500'

// Get photo for a destination
export const getDestinationPhoto = (destinationName: string): string => {
  return destinationPhotos[destinationName] || defaultPhoto
}

// Get fallback gradient for a destination
export const getDestinationGradient = (destinationName: string): string => {
  return destinationGradients[destinationName] || defaultGradient
}

// Get random photo for variety
export const getRandomPhoto = (): string => {
  const photos = Object.values(destinationPhotos)
  return photos[Math.floor(Math.random() * photos.length)]
}

// Get random gradient for variety
export const getRandomGradient = (): string => {
  const gradients = Object.values(destinationGradients)
  return gradients[Math.floor(Math.random() * gradients.length)]
}
