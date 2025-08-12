'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { 
  Users, 
  Search, 
  Globe, 
  Heart, 
  MessageCircle,
  Share2,
  Calendar,
  MapPin,
  TrendingUp
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { getDestinationPhoto } from '@/lib/photos'
import { DestinationImage } from '@/components/DestinationImage'

export default function CommunityPage() {
  const [publicTrips, setPublicTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')

  useEffect(() => {
    fetchPublicTrips()
  }, [])

  const fetchPublicTrips = async () => {
    try {
      const response = await api.get('/trips/public')
      setPublicTrips(response.data.data)
    } catch (error) {
      console.error('Failed to fetch public trips:', error)
      toast.error('Failed to load community trips')
    } finally {
      setLoading(false)
    }
  }

  const filteredTrips = publicTrips.filter((trip: any) => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCountry = !selectedCountry || 
                          trip.stops?.some((stop: any) => stop.city?.country === selectedCountry)
    
    return matchesSearch && matchesCountry
  })

  const countries = Array.from(new Set(
    publicTrips.flatMap((trip: any) => 
      trip.stops?.map((stop: any) => stop.city?.country).filter(Boolean) || []
    )
  ))

  const handleLike = async (tripId: string) => {
    try {
      await api.post(`/trips/${tripId}/like`)
      // Refresh trips to update like count
      fetchPublicTrips()
      toast.success('Trip liked!')
    } catch (error) {
      toast.error('Failed to like trip')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading community...</p>
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
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Travel Community</h1>
          <p className="text-xl text-purple-100 mb-8">
            Discover amazing travel plans from fellow adventurers and share your own experiences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Trips</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search trip names or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">{publicTrips.length}</div>
            <div className="text-gray-600">Public Trips</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {publicTrips.reduce((acc: number, trip: any) => acc + (trip._count?.likes || 0), 0)}
            </div>
            <div className="text-gray-600">Total Likes</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {publicTrips.reduce((acc: number, trip: any) => acc + (trip._count?.comments || 0), 0)}
            </div>
            <div className="text-gray-600">Total Comments</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {publicTrips.reduce((acc: number, trip: any) => acc + (trip._count?.stops || 0), 0)}
            </div>
            <div className="text-gray-600">Destinations</div>
          </Card>
        </div>

        {/* Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {filteredTrips.length} Community Trips Found
          </h2>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No community trips found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCountry 
                ? 'Try adjusting your search criteria'
                : 'Be the first to share a public trip!'
              }
            </p>
            <Link href="/trips/create">
              <Button>Create Your First Trip</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip: any) => (
              <Card key={trip.id} className="hover:shadow-md transition-shadow overflow-hidden">
                {/* Trip Photo */}
                <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                  <DestinationImage
                    src={getDestinationPhoto(trip.stops?.[0]?.city?.name || 'default')}
                    alt={`${trip.name} destination`}
                    destinationName={trip.stops?.[0]?.city?.name || 'default'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  <div className="absolute top-2 right-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Public
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{trip.name}</h3>
                    </div>
                  {trip.description && (
                    <p className="text-gray-600 text-sm mb-3">{trip.description}</p>
                  )}
                  
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

                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {trip.stops?.length || 0} destinations
                      {trip.stops?.length > 0 && (
                        <span className="ml-1">
                          ({trip.stops.map((stop: any) => stop.city?.name).filter(Boolean).join(', ')})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {trip._count?.stops || 0} stops
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {trip._count?.activities || 0} activities
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <button
                      onClick={() => handleLike(trip.id)}
                      className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      <span>{trip._count?.likes || 0}</span>
                    </button>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{trip._count?.comments || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link href={`/trips/${trip.id}/public`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
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
