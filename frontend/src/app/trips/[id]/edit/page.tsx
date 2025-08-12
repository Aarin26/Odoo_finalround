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
  Globe,
  Plane,
  Activity,
  Save,
  Plus,
  Trash2
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function EditTripPage() {
  const params = useParams()
  const router = useRouter()
  const tripId = params.id as string
  
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    isPublic: false
  })

  useEffect(() => {
    if (tripId) {
      fetchTrip()
    }
  }, [tripId])

  const fetchTrip = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication required')
        router.push('/login')
        return
      }
      
      const response = await api.get(`/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const tripData = response.data.data
      setTrip(tripData)
      
      // Set form data
      setFormData({
        name: tripData.name || '',
        description: tripData.description || '',
        startDate: tripData.startDate ? new Date(tripData.startDate).toISOString().split('T')[0] : '',
        endDate: tripData.endDate ? new Date(tripData.endDate).toISOString().split('T')[0] : '',
        budget: tripData.budget?.toString() || '',
        isPublic: tripData.isPublic || false
      })
    } catch (error) {
      console.error('Failed to fetch trip:', error)
      toast.error('Failed to load trip details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication required')
        return
      }

      const updateData = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null
      }

      await api.put(`/trips/${tripId}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success('Trip updated successfully!')
      router.push(`/trips/${tripId}`)
    } catch (error: any) {
      console.error('Failed to update trip:', error)
      const errorMessage = error.response?.data?.error?.message || 'Failed to update trip'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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
          <p className="text-gray-600 mb-6">The trip you're looking for doesn't exist.</p>
          <Link href="/trips/my">
            <Button>Back to My Trips</Button>
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
              <Link href={`/trips/${tripId}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Trip
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Trip</h1>
          <p className="text-gray-600">Update your trip details and settings</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Trip Details */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plane className="w-5 h-5" />
                    <span>Trip Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Trip Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter trip name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your trip"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date *
                      </label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                      Budget
                    </label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="Enter budget amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      id="isPublic"
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium text-gray-700">
                      Make this trip public (visible to community)
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trip Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-500">{trip._count?.stops || 0}</div>
                    <p className="text-sm text-gray-600">Destinations</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">{trip._count?.activities || 0}</div>
                    <p className="text-sm text-gray-600">Activities</p>
                  </div>
                  {trip.budget && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">${trip.budget}</div>
                      <p className="text-sm text-gray-600">Current Budget</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Link href={`/trips/${tripId}`}>
                    <Button variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
