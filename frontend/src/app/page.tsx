'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { 
  Plane, 
  MapPin, 
  Calendar, 
  Users, 
  Globe,
  ArrowRight,
  Star,
  CheckCircle
} from 'lucide-react'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('features')

  const features = [
    {
      icon: <Plane className="w-6 h-6" />,
      title: 'Multi-City Planning',
      description: 'Plan complex itineraries across multiple destinations with ease'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Smart Itineraries',
      description: 'AI-powered suggestions for activities and attractions'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Visual Timeline',
      description: 'See your entire trip laid out in an intuitive calendar view'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Sharing',
      description: 'Share your plans and discover trips from other travelers'
    }
  ]

  const stats = [
    { number: '10K+', label: 'Happy Travelers' },
    { number: '50+', label: 'Countries Covered' },
    { number: '1000+', label: 'Cities Available' },
    { number: '24/7', label: 'Support' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gradient">GlobeTrotter</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Plan Your Perfect
            <span className="text-gradient block">Travel Adventure</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create personalized multi-city itineraries, track budgets, and discover amazing destinations 
            with our intelligent travel planning platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-3">
                Start Planning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Plan the Perfect Trip
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From initial inspiration to final booking, GlobeTrotter has you covered
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-soft transition-all duration-300">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of travelers who are already planning their next adventure with GlobeTrotter
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8 py-3">
              Create Your First Trip
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-bold">GlobeTrotter</span>
              </div>
              <p className="text-gray-400">
                Making travel planning simple, fun, and personalized.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 GlobeTrotter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
