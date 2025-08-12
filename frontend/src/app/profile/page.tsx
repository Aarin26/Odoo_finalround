'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { User, Mail, Palette, Moon, Sun, Monitor, Save, Loader2, Globe, ArrowLeft } from 'lucide-react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { useTheme } from '@/contexts/ThemeContext'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  createdAt: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [changePasswordData, setChangePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return
      }

      const response = await api.get('/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data?.data) {
        const userProfile = response.data.data
        setProfile(userProfile)
        setFormData({
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      toast.error('Failed to load profile')
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

      const response = await api.put('/user/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data?.data) {
        setProfile(response.data.data)
        toast.success('Profile updated successfully!')
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error)
      const errorMessage = error.response?.data?.error?.message || 'Failed to update profile'
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as 'light' | 'dark' | 'system')
    toast.success(`Theme changed to ${newTheme}`)
  }

  const handleExportProfile = () => {
    const profileData = {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      email: profile?.email,
      role: profile?.role,
      createdAt: profile?.createdAt
    }
    
    const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'profile-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Profile data exported successfully!')
  }

  const handleChangePassword = async () => {
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (changePasswordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication required')
        return
      }

      const response = await api.put('/user/change-password', {
        currentPassword: changePasswordData.currentPassword,
        newPassword: changePasswordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success('Password changed successfully!')
      setShowChangePassword(false)
      setChangePasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      console.error('Failed to change password:', error)
      const errorMessage = error.response?.data?.error?.message || 'Failed to change password'
      toast.error(errorMessage)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Authentication required')
        return
      }

      await api.delete('/user/delete-account', {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success('Account deleted successfully')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    } catch (error: any) {
      console.error('Failed to delete account:', error)
      const errorMessage = error.response?.data?.error?.message || 'Failed to delete account'
      toast.error(errorMessage)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
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
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <Globe className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-bold text-gradient">GlobeTrotter</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/trips/my">
                <Button variant="outline">My Trips</Button>
              </Link>
              <Link href="/calendar">
                <Button variant="outline">Calendar</Button>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-6 w-6 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Account Details & Theme */}
          <div className="space-y-6">
            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-6 w-6 mr-2" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      User ID
                    </label>
                    <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {profile?.id}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Role
                    </label>
                    <p className="text-sm text-gray-900 capitalize">
                      {profile?.role}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Member Since
                    </label>
                    <p className="text-sm text-gray-900">
                      {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-6 w-6 mr-2" />
                  Theme Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Choose your preferred theme for the application
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                        theme === 'light'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Sun className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Light Theme</div>
                        <div className="text-sm text-gray-500">Clean and bright interface</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                        theme === 'dark'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Moon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Dark Theme</div>
                        <div className="text-sm text-gray-500">Easy on the eyes</div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleThemeChange('system')}
                      className={`w-full flex items-center p-3 rounded-lg border-2 transition-all ${
                        theme === 'system'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Monitor className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">System Theme</div>
                        <div className="text-sm text-gray-500">Follows your OS preference</div>
                      </div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleExportProfile()}
                    className="w-full text-left p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Export Profile Data
                  </button>
                  <button 
                    onClick={() => setShowChangePassword(true)}
                    className="w-full text-left p-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Change Password
                  </button>
                  <button 
                    onClick={() => setShowDeleteAccount(true)}
                    className="w-full text-left p-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Delete Account
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
                  </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <Input
                  type="password"
                  value={changePasswordData.currentPassword}
                  onChange={(e) => setChangePasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <Input
                  type="password"
                  value={changePasswordData.newPassword}
                  onChange={(e) => setChangePasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={changePasswordData.confirmPassword}
                  onChange={(e) => setChangePasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleChangePassword} className="flex-1">
                Change Password
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowChangePassword(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data.
            </p>
            <div className="flex space-x-3">
              <Button 
                onClick={handleDeleteAccount} 
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteAccount(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
