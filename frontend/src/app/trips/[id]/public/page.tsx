'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { 
  ArrowLeft,
  Calendar,
  MapPin,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Globe,
  Plane,
  Activity
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { getDestinationPhoto } from '@/lib/photos'
import { DestinationImage } from '@/components/DestinationImage'

export default function PublicTripPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id as string
  
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (tripId) {
      fetchTrip()
    }
  }, [tripId])

  const fetchTrip = async () => {
    try {
      const response = await api.get(`/trips/${tripId}/public`)
      setTrip(response.data.data)
    } catch (error) {
      console.error('Failed to fetch trip:', error)
      toast.error('Failed to load trip details')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    try {
      await api.post(`/trips/${tripId}/like`)
      fetchTrip() // Refresh to update like count
      toast.success('Trip liked!')
    } catch (error) {
      toast.error('Failed to like trip')
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    
    setSubmitting(true)
    try {
      await api.post(`/trips/${tripId}/comment`, { content: comment })
      setComment('')
      fetchTrip() // Refresh to show new comment
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trip...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h1>
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist or is private.</p>
          <Link href="/community">
            <Button>Back to Community</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Globe className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-bold text-gradient">GlobeTrotter</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/community">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trip Header */}
        <div className="mb-8">
          <div className="relative h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden mb-6">
            <DestinationImage
              src={getDestinationPhoto(trip.stops?.[0]?.city?.name || 'default')}
              alt={`${trip.name} destination`}
              destinationName={trip.stops?.[0]?.city?.name || 'default'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10 flex items-center h-full px-8">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{trip.name}</h1>
                <p className="text-xl text-blue-100">{trip.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plane className="w-5 h-5" />
                  <span>Trip Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-medium">
                        {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {trip.budget && (
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Budget</p>
                        <p className="font-medium">${trip.budget}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Destinations */}
            {trip.stops && trip.stops.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5" />
                    <span>Destinations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trip.stops.map((stop: any, index: number) => (
                      <div key={stop.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{stop.city?.name}</p>
                          <p className="text-sm text-gray-600">{stop.city?.country}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activities */}
            {trip.activities && trip.activities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Activities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trip.activities.map((activity: any) => (
                      <div key={activity.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{activity.name}</h4>
                          <span className="text-sm text-gray-600">{activity.type}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{activity.location}</span>
                          {activity.cost && <span>${activity.cost}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Comments ({trip._count?.comments || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Add Comment */}
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <Button 
                      onClick={handleComment} 
                      disabled={submitting || !comment.trim()}
                    >
                      {submitting ? 'Posting...' : 'Post'}
                    </Button>
                  </div>

                  {/* Comments List */}
                  {trip.comments && trip.comments.length > 0 ? (
                    <div className="space-y-3">
                      {trip.comments.map((comment: any) => (
                        <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{comment.user?.firstName} {comment.user?.lastName}</p>
                            <span className="text-sm text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{trip._count?.likes || 0}</div>
                  <p className="text-sm text-gray-600">Likes</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{trip._count?.comments || 0}</div>
                  <p className="text-sm text-gray-600">Comments</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{trip._count?.stops || 0}</div>
                  <p className="text-sm text-gray-600">Destinations</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{trip._count?.activities || 0}</div>
                  <p className="text-sm text-gray-600">Activities</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleLike} 
                  variant="outline" 
                  className="w-full"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Like Trip
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Trip
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
