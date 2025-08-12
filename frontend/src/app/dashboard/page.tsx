'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Plus, 
  Search,
  Globe,
  TrendingUp,
  Users
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { getDestinationPhoto, getRandomPhoto, getRandomGradient } from '@/lib/photos'
import { DestinationImage } from '@/components/DestinationImage'

export default function DashboardPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }
      
      const response = await api.get('/trips/my', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTrips(response.data.data || [])
    } catch (error) {
      console.error('Failed to fetch trips:', error)
      setTrips([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
              <span className="text-gray-700">
                Welcome, {user?.firstName}!
              </span>
              <Link href="/profile">
                <Button variant="outline">
                  Profile
                </Button>
              </Link>
              <Button variant="outline" onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/'
              }}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg overflow-hidden mb-6">
            <DestinationImage
              src={getRandomPhoto()}
              alt="Travel inspiration"
              destinationName="Travel"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative z-10 flex items-center h-full px-8">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">
                  Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-xl text-blue-100">
                  Ready to plan your next adventure? Let's get started!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Trip</h3>
            <p className="text-gray-600 mb-4">Start planning your next adventure</p>
            <Link href="/trips/create">
              <Button className="w-full">Get Started</Button>
            </Link>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Destinations</h3>
            <p className="text-gray-600 mb-4">Discover amazing places to visit</p>
            <Link href="/explore">
              <Button variant="outline" className="w-full">Explore</Button>
            </Link>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
            <p className="text-gray-600 mb-4">Share and discover travel plans</p>
            <Link href="/community">
              <Button variant="outline" className="w-full">Join Community</Button>
            </Link>
          </Card>
        </div>

        {/* Recent Trips */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Trips</h2>
            <Link href="/trips">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {trips.length === 0 ? (
            <Card className="text-center py-12">
              <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips yet</h3>
              <p className="text-gray-600 mb-6">
                Start planning your first adventure by creating a new trip
              </p>
              <Link href="/trips/create">
                <Button>Create Your First Trip</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.slice(0, 6).map((trip: any) => (
                <Card key={trip.id} className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                  {/* Trip Photo */}
                  <div className="relative h-32 bg-gradient-to-br from-blue-400 to-purple-500">
                    <DestinationImage
                      src={getDestinationPhoto(trip.stops?.[0]?.city?.name || 'default')}
                      alt={`${trip.name} destination`}
                      destinationName={trip.stops?.[0]?.city?.name || 'default'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{trip.name}</h3>
                        <p className="text-gray-600 text-sm">{trip.description}</p>
                      </div>
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
                          {trip._count?.stops || trip.stops?.length || 0} stops
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {trip._count?.activities || trip.activities?.length || 0} activities
                        </span>
                      </div>
                      <Link href={`/trips/${trip.id}`}>
                        <Button size="sm" variant="outline">View Details</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary-600">{trips.length}</div>
            <div className="text-gray-600">Total Trips</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {trips.reduce((acc: number, trip: any) => acc + (trip._count?.stops || trip.stops?.length || 0), 0)}
            </div>
            <div className="text-gray-600">Destinations</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {trips.reduce((acc: number, trip: any) => acc + (trip._count?.activities || trip.activities?.length || 0), 0)}
            </div>
            <div className="text-gray-600">Activities</div>
          </Card>
          <Card className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              ${trips.reduce((acc: number, trip: any) => acc + (trip.budget || 0), 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Budget</div>
          </Card>
        </div>
      </main>
    </div>
  )
}
