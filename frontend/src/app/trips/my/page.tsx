'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Calendar, MapPin, DollarSign, Clock, Search, Plus, Edit, Eye, Globe, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface Activity {
  id: string
  name: string
  description?: string
  type: string
  cost?: number
  location?: string
  startTime?: string
  endTime?: string
}

interface Trip {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  budget?: number
  isPublic: boolean
  createdAt: string
  activities: Activity[]
  stops: any[]
  _count?: {
    stops: number
    activities: number
  }
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchMyTrips()
  }, [])

  const fetchMyTrips = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }

      const response = await api.get('/trips/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data?.data) {
        setTrips(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error)
    } finally {
      setLoading(false)
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

  const getActivityTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'sightseeing':
        return '🏛️'
      case 'food':
        return '🍽️'
      case 'transport':
        return '🚗'
      case 'shopping':
        return '🛍️'
      case 'entertainment':
        return '🎭'
      case 'outdoor':
        return '🏃'
      default:
        return '📍'
    }
  }

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterType === 'all') return matchesSearch
    if (filterType === 'upcoming') {
      return matchesSearch && new Date(trip.startDate) > new Date()
    }
    if (filterType === 'ongoing') {
      const now = new Date()
      return matchesSearch && new Date(trip.startDate) <= now && new Date(trip.endDate) >= now
    }
    if (filterType === 'completed') {
      return matchesSearch && new Date(trip.endDate) < new Date()
    }
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your trips...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
            <p className="text-gray-600">Manage and view all your travel adventures</p>
          </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
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
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Trips</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>

          <Link
            href="/trips/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Trip
          </Link>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start planning your next adventure!'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <Link
                href="/trips/create"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Trip
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg text-gray-900">{trip.name}</CardTitle>
                    <div className="flex gap-2">
                      <Link
                        href={`/trips/${trip.id}`}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View trip"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/trips/${trip.id}/edit`}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit trip"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  {trip.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{trip.description}</p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Trip Details */}
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{calculateDuration(trip.startDate, trip.endDate)} days</span>
                    </div>
                    
                    {trip.budget && (
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>${trip.budget.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Activities Preview */}
                  {trip.activities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Activities</h4>
                      <div className="space-y-1">
                        {trip.activities.slice(0, 3).map((activity) => (
                          <div key={activity.id} className="flex items-center text-xs text-gray-600">
                            <span className="mr-2">{getActivityTypeIcon(activity.type)}</span>
                            <span className="truncate">{activity.name}</span>
                            {activity.cost && (
                              <span className="ml-auto text-gray-500">${activity.cost}</span>
                            )}
                          </div>
                        ))}
                        {trip.activities.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{trip.activities.length - 3} more activities
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Trip Status */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        new Date(trip.startDate) > new Date()
                          ? 'bg-blue-100 text-blue-800'
                          : new Date(trip.endDate) < new Date()
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {new Date(trip.startDate) > new Date()
                          ? 'Upcoming'
                          : new Date(trip.endDate) < new Date()
                          ? 'Completed'
                          : 'Ongoing'
                        }
                      </span>
                      
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        trip.isPublic ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
