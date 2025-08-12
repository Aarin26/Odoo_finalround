'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Globe, ArrowLeft, Calendar, DollarSign, Plus, Trash2, Clock, MapPin, Tag } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface Activity {
  name: string
  description: string
  type: string
  location: string
  startTime: string
  endTime: string
  cost: string
}

interface ItineraryDay {
  day: number
  date: string
  activities: Activity[]
}



export default function CreateTripPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    isPublic: false
  })
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()



  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const addItineraryDay = () => {
    const duration = calculateDuration()
    if (duration === 0) {
      toast.error('Please set start and end dates first')
      return
    }

    const newDay: ItineraryDay = {
      day: itinerary.length + 1,
      date: new Date(formData.startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }),
      activities: []
    }
    setItinerary([...itinerary, newDay])
  }

  const removeItineraryDay = (dayIndex: number) => {
    setItinerary(itinerary.filter((_, index) => index !== dayIndex))
  }

  const addActivity = (dayIndex: number) => {
    const newActivity: Activity = {
      name: '',
      description: '',
      type: '',
      location: '',
      startTime: '',
      endTime: '',
      cost: ''
    }
    
    const updatedItinerary = [...itinerary]
    updatedItinerary[dayIndex].activities.push(newActivity)
    setItinerary(updatedItinerary)
  }

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const updatedItinerary = [...itinerary]
    updatedItinerary[dayIndex].activities.splice(activityIndex, 1)
    setItinerary(updatedItinerary)
  }

  const updateItineraryDay = (dayIndex: number, field: keyof ItineraryDay, value: any) => {
    const updatedItinerary = [...itinerary]
    updatedItinerary[dayIndex] = { ...updatedItinerary[dayIndex], [field]: value }
    setItinerary(updatedItinerary)
  }

  const updateActivity = (dayIndex: number, activityIndex: number, field: keyof Activity, value: string) => {
    const updatedItinerary = [...itinerary]
    updatedItinerary[dayIndex].activities[activityIndex] = {
      ...updatedItinerary[dayIndex].activities[activityIndex],
      [field]: value
    }
    setItinerary(updatedItinerary)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please login to create a trip')
        return
      }

      const response = await api.post('/trips', {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        itinerary
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      toast.success('Trip created successfully!')
      router.push('/trips/my')
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Failed to create trip')
    } finally {
      setLoading(false)
    }
  }

  const activityTypes = [
    'Sightseeing', 'Food', 'Transport', 'Shopping', 'Entertainment', 'Outdoor', 'Cultural', 'Relaxation'
  ]

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
            <Link href="/trips">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Trips
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Trip</h1>
          <p className="text-gray-600">Start planning your next adventure with detailed day-wise itinerary</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Trip Information */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Trip Details</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., European Adventure 2024"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Describe your trip..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                        className="pl-10"
                        min={formData.startDate}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                    Budget (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="budget"
                      type="number"
                      placeholder="0.00"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      min="0"
                      step="0.01"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="isPublic"
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
                    Make this trip public (visible to other users)
                  </label>
                </div>
              </div>
            </div>
          </Card>





          {/* Itinerary Planning */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Day-wise Itinerary</h2>
                <Button
                  type="button"
                  onClick={addItineraryDay}
                  disabled={!formData.startDate || !formData.endDate}
                  className="flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </Button>
              </div>

              {itinerary.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No itinerary days added yet.</p>
                  <p className="text-sm">Set your start and end dates, then add days to plan your activities.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {itinerary.map((day, dayIndex) => (
                    <div key={dayIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Day {day.day} - {day.date}
                        </h3>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItineraryDay(dayIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove Day
                        </Button>
                      </div>

                      {/* Activities for this day */}
                      <div className="space-y-4">
                        {day.activities.map((activity, activityIndex) => (
                          <div key={activityIndex} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">Activity {activityIndex + 1}</h4>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeActivity(dayIndex, activityIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Activity Name *
                                </label>
                                <Input
                                  type="text"
                                  placeholder="e.g., Visit Eiffel Tower"
                                  value={activity.name}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'name', e.target.value)}
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Type *
                                </label>
                                <select
                                  value={activity.type}
                                  onChange={(e) => updateActivity(dayIndex, activityIndex, 'type', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  required
                                >
                                  <option value="">Select type</option>
                                  {activityTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Location
                                </label>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="text"
                                    placeholder="e.g., Paris, France"
                                    value={activity.location}
                                    onChange={(e) => updateActivity(dayIndex, activityIndex, 'location', e.target.value)}
                                    className="pl-10"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Cost
                                </label>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={activity.cost}
                                    onChange={(e) => updateActivity(dayIndex, activityIndex, 'cost', e.target.value)}
                                    min="0"
                                    step="0.01"
                                    className="pl-10"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Start Time
                                </label>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="time"
                                    value={activity.startTime}
                                    onChange={(e) => updateActivity(dayIndex, activityIndex, 'startTime', e.target.value)}
                                    className="pl-10"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  End Time
                                </label>
                                <div className="relative">
                                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                  <Input
                                    type="time"
                                    value={activity.endTime}
                                    onChange={(e) => updateActivity(dayIndex, activityIndex, 'endTime', e.target.value)}
                                    className="pl-10"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="mt-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                placeholder="Describe this activity..."
                                value={activity.description}
                                onChange={(e) => updateActivity(dayIndex, activityIndex, 'description', e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addActivity(dayIndex)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Activity
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Link href="/dashboard">
              <Button variant="outline" type="button">
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/trips">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" loading={loading}>
              Create Trip
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
