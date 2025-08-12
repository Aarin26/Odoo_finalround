'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Star, MessageCircle, Search, Send, User, Calendar, ThumbsUp, Globe, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface Review {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
  }
}

interface Trip {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  budget?: number
  isPublic: boolean
  user: {
    id: string
    firstName: string
    lastName: string
  }
  _count: {
    stops: number
    activities: number
  }
}

export default function ReviewsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newReview, setNewReview] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPublicTrips()
  }, [])

  const fetchPublicTrips = async () => {
    try {
      const response = await api.get('/trips/public')
      
      if (response.data?.data) {
        setTrips(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch public trips:', error)
      toast.error('Failed to load public trips')
    } finally {
      setLoading(false)
    }
  }

  const fetchTripReviews = async (tripId: string) => {
    setReviewsLoading(true)
    try {
      const response = await api.get(`/trips/${tripId}/reviews`)
      
      if (response.data?.data) {
        setReviews(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
      toast.error('Failed to load reviews')
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleTripSelect = (trip: Trip) => {
    setSelectedTrip(trip)
    fetchTripReviews(trip.id)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedTrip || !newReview.trim()) {
      toast.error('Please select a trip and write a review')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login to submit a review')
      return
    }

    setSubmitting(true)
    try {
      const response = await api.post('/reviews', {
        tripId: selectedTrip.id,
        content: newReview.trim()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data?.data) {
        setReviews(prev => [response.data.data.review, ...prev])
        setNewReview('')
        toast.success('Review submitted successfully!')
      }
    } catch (error: any) {
      console.error('Failed to submit review:', error)
      const errorMessage = error.response?.data?.error?.message || 'Failed to submit review'
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredTrips = trips.filter(trip =>
    trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading public trips...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gradient">GlobeTrotter</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Trip Reviews</h1>
            <p className="text-gray-600">Discover and review amazing travel experiences from the community</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Public Trips */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2" />
                  Public Trips
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search trips..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Trips List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredTrips.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No public trips found</p>
                  ) : (
                    filteredTrips.map(trip => (
                      <div
                        key={trip.id}
                        onClick={() => handleTripSelect(trip)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedTrip?.id === trip.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{trip.name}</h4>
                          <span className="text-xs text-gray-500">
                            {calculateDuration(trip.startDate, trip.endDate)} days
                          </span>
                        </div>
                        
                        {trip.description && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {trip.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {trip.user.firstName} {trip.user.lastName}
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{trip._count?.stops || trip.stops?.length || 0} stops</span>
                            <span>•</span>
                            <span>{trip._count?.activities || trip.activities?.length || 0} activities</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reviews Section */}
          <div>
            {selectedTrip ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-6 w-6 mr-2" />
                    Reviews for {selectedTrip.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Trip Info */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">{selectedTrip.name}</h4>
                    {selectedTrip.description && (
                      <p className="text-sm text-gray-600 mb-2">{selectedTrip.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(selectedTrip.startDate)} - {formatDate(selectedTrip.endDate)}
                      </div>
                      {selectedTrip.budget && (
                        <div className="flex items-center">
                          <span className="mr-1">$</span>
                          {selectedTrip.budget.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Review */}
                  <form onSubmit={handleSubmitReview} className="mb-6">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Write a Review
                      </label>
                      <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Share your thoughts about this trip..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting || !newReview.trim()}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>

                  {/* Reviews List */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">
                      Reviews ({reviews.length})
                    </h5>
                    
                    {reviewsLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading reviews...</p>
                      </div>
                    ) : reviews.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this trip!</p>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {reviews.map(review => (
                          <div key={review.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <span className="font-medium text-gray-900">
                                  {review.user.firstName} {review.user.lastName}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm">{review.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a Trip</h3>
                  <p className="text-gray-500">
                    Choose a public trip from the left to view and submit reviews
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}
