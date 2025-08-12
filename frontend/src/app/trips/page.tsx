'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  TrendingUp,
  Globe
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function TripsPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const response = await api.get('/trips')
      setTrips(response.data.data)
    } catch (error) {
      console.error('Failed to fetch trips:', error)
      toast.error('Failed to load trips')
    } finally {
      setLoading(false)
    }
  }

  const filteredTrips = trips.filter((trip: any) => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'all') return matchesSearch
    if (filter === 'public' && trip.isPublic) return matchesSearch
    if (filter === 'private' && !trip.isPublic) return matchesSearch
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading trips...</p>
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
              <Globe className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gradient">GlobeTrotter</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600">Manage and organize your travel plans</p>
          </div>
          <Link href="/trips/create">
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              Create New Trip
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search trips..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Trips</option>
                <option value="public">Public Trips</option>
                <option value="private">Private Trips</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start planning your first adventure by creating a new trip'
              }
            </p>
            <Link href="/trips/create">
              <Button>Create Your First Trip</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip: any) => (
              <Card key={trip.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{trip.name}</h3>
                    <p className="text-gray-600 text-sm">{trip.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    trip.isPublic 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {trip.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </div>
                  {trip.budget && (
                    <div className="flex items-center text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Budget: ${trip.budget}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {trip._count?.stops || 0} stops
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {trip._count?.activities || 0} activities
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/trips/${trip.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    <Link href={`/trips/${trip.id}/edit`}>
                      <Button size="sm" variant="outline">Edit</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
