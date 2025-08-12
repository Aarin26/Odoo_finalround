'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, DollarSign, Globe, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'

interface Trip {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  budget?: number
  isPublic: boolean
  activities: any[]
}

export default function CalendarPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  useEffect(() => {
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
      
      if (response.data?.data) {
        setTrips(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    
    return days
  }

  const getTripsForDate = (date: Date) => {
    if (!date) return []
    
    return trips.filter(trip => {
      const startDate = new Date(trip.startDate)
      const endDate = new Date(trip.endDate)
      const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      
      return currentDate >= startDate && currentDate <= endDate
    })
  }

  const previousMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getUpcomingTrips = () => {
    const now = new Date()
    return trips
      .filter(trip => new Date(trip.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5)
  }

  const getRecentTrips = () => {
    const now = new Date()
    return trips
      .filter(trip => new Date(trip.endDate) < now)
      .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime())
      .slice(0, 3)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading calendar...</p>
          </div>
        </div>
      </div>
    )
  }

  const days = getDaysInMonth(selectedMonth)
  const upcomingTrips = getUpcomingTrips()
  const recentTrips = getRecentTrips()

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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Trip Calendar</h1>
            <p className="text-gray-600">View your travel schedule and upcoming adventures</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <CalendarIcon className="h-6 w-6 mr-2" />
                      {formatDate(selectedMonth)}
                    </CardTitle>
                    <div className="flex gap-2">
                      <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {days.map((day, index) => {
                      const tripsForDay = day ? getTripsForDate(day) : []
                      const isToday = day && day.toDateString() === new Date().toDateString()
                      const isCurrentMonth = day && day.getMonth() === selectedMonth.getMonth()
                      
                      return (
                        <div
                          key={index}
                          className={`min-h-[80px] p-2 border border-gray-100 ${
                            isToday ? 'bg-blue-50 border-blue-200' : ''
                          } ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
                        >
                          {day && (
                            <>
                              <div className={`text-sm font-medium mb-1 ${
                                isToday ? 'text-blue-600' : 'text-gray-900'
                              }`}>
                                {day.getDate()}
                              </div>
                              
                              {/* Trip indicators */}
                              {tripsForDay.map((trip, tripIndex) => (
                                <div
                                  key={trip.id}
                                  className={`text-xs p-1 mb-1 rounded truncate cursor-pointer hover:bg-blue-100 transition-colors ${
                                    trip.isPublic ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                  }`}
                                  title={`${trip.name} - ${formatDay(new Date(trip.startDate))} to ${formatDay(new Date(trip.endDate))}`}
                                >
                                  {trip.name}
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Trips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingTrips.length === 0 ? (
                    <p className="text-gray-500 text-sm">No upcoming trips</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingTrips.map(trip => (
                        <div key={trip.id} className="p-3 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-1">{trip.name}</h4>
                          <div className="space-y-1 text-sm text-blue-700">
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {formatDay(new Date(trip.startDate))} - {formatDay(new Date(trip.endDate))}
                            </div>
                            {trip.budget && (
                              <div className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />
                                ${trip.budget.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Trips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTrips.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent trips</p>
                  ) : (
                    <div className="space-y-3">
                      {recentTrips.map(trip => (
                        <div key={trip.id} className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">{trip.name}</h4>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {formatDay(new Date(trip.startDate))} - {formatDay(new Date(trip.endDate))}
                            </div>
                            {trip.budget && (
                              <div className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />
                                ${trip.budget.toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Trips</span>
                      <span className="font-medium">{trips.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Upcoming</span>
                      <span className="font-medium text-blue-600">{upcomingTrips.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-medium text-green-600">{recentTrips.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Public</span>
                      <span className="font-medium text-purple-600">
                        {trips.filter(t => t.isPublic).length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
