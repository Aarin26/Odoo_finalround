'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { 
  Search, 
  MapPin, 
  Globe, 
  Filter,
  Star,
  DollarSign,
  Calendar
} from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { getDestinationPhoto } from '@/lib/photos'
import { DestinationImage } from '@/components/DestinationImage'

export default function ExplorePage() {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  useEffect(() => {
    fetchCities()
  }, [])

  const fetchCities = async () => {
    try {
      const response = await api.get('/cities')
      setCities(response.data.data)
    } catch (error) {
      console.error('Failed to fetch cities:', error)
      toast.error('Failed to load destinations')
    } finally {
      setLoading(false)
    }
  }

  const filteredCities = cities.filter((city: any) => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         city.country.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCountry = !selectedCountry || city.country === selectedCountry
    const matchesCategory = !selectedCategory || city.category === selectedCategory
    
    const matchesPrice = (!priceRange.min || city.avgCost >= parseFloat(priceRange.min)) &&
                        (!priceRange.max || city.avgCost <= parseFloat(priceRange.max))
    
    return matchesSearch && matchesCountry && matchesCategory && matchesPrice
  })

  const countries = Array.from(new Set(cities.map((city: any) => city.country)))
  const categories = Array.from(new Set(cities.map((city: any) => city.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading destinations...</p>
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Explore Amazing Destinations</h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover incredible cities, plan your next adventure, and find inspiration for your travels
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="City or country..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-1/2"
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-1/2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {filteredCities.length} Destinations Found
          </h2>
        </div>

        {/* Cities Grid */}
        {filteredCities.length === 0 ? (
          <Card className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={() => {
              setSearchTerm('')
              setSelectedCountry('')
              setSelectedCategory('')
              setPriceRange({ min: '', max: '' })
            }}>
              Clear Filters
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city: any) => (
              <Card key={city.id} className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
                {/* Destination Photo */}
                <div className="relative w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500">
                  <DestinationImage
                    src={getDestinationPhoto(city.name)}
                    alt={`${city.name}, ${city.country}`}
                    destinationName={city.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{city.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {city.country}
                  </div>
                  {city.description && (
                    <p className="text-gray-600 text-sm">{city.description}</p>
                  )}
                </div>

                <div className="flex justify-between items-center mb-4">
                  {city.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {city.category}
                    </span>
                  )}
                  {city.avgCost && (
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {city.avgCost}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>Popular destination</span>
                  </div>
                  <Link href={`/trips/create?city=${city.id}`}>
                    <Button size="sm">Plan Trip</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
