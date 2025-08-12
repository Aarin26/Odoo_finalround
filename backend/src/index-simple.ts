import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

// Authentication middleware
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: { message: 'Access token required' } })
  }

  try {
    const decoded = jwt.verify(token, 'fallback-secret') as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })
    
    if (!user) {
      return res.status(401).json({ error: { message: 'Invalid token' } })
    }
    
    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ error: { message: 'Invalid token' } })
  }
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'GlobeTrotter API is running' })
})

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' })
})

// User registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        error: { message: 'User with this email already exists' }
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'USER'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'fallback-secret',
      { expiresIn: '24h' }
    )

    return res.status(201).json({
      data: { user, token }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({
      error: { message: 'Internal server error' }
    })
  }
})

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({
        error: { message: 'Invalid email or password' }
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'fallback-secret',
      { expiresIn: '24h' }
    )

    // Return user data (without password) and token
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }

    return res.status(200).json({
      data: { user: userData, token }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      error: { message: 'Internal server error' }
    })
  }
})

// Get cities with sample data
app.get('/api/cities', async (req, res) => {
  try {
    let cities = await prisma.city.findMany({
      orderBy: { name: 'asc' }
    })

    // If no cities exist, create sample destinations
    if (cities.length === 0) {
      console.log('🌍 Creating sample destinations...')
      
      const sampleDestinations = [
        { name: 'Paris', country: 'France', category: 'Cultural', priceRange: 'HIGH', description: 'The City of Light, famous for art, fashion, gastronomy and culture' },
        { name: 'Tokyo', country: 'Japan', category: 'Urban', priceRange: 'HIGH', description: 'Ultra-modern city with traditional temples' },
        { name: 'New York', country: 'USA', category: 'Urban', priceRange: 'HIGH', description: 'The Big Apple with endless entertainment' },
        { name: 'Bali', country: 'Indonesia', category: 'Beach', priceRange: 'MEDIUM', description: 'Island paradise with rice terraces and beaches' },
        { name: 'London', country: 'UK', category: 'Cultural', priceRange: 'HIGH', description: 'Historic capital with world-class museums' },
        { name: 'Rome', country: 'Italy', category: 'Cultural', priceRange: 'HIGH', description: 'Eternal city with ancient ruins and Renaissance art' },
        { name: 'Barcelona', country: 'Spain', category: 'Cultural', priceRange: 'MEDIUM', description: 'Vibrant city with unique architecture' },
        { name: 'Amsterdam', country: 'Netherlands', category: 'Cultural', priceRange: 'HIGH', description: 'Canals, museums, and cycling culture' },
        { name: 'Santorini', country: 'Greece', category: 'Beach', priceRange: 'HIGH', description: 'Stunning sunsets and white-washed buildings' },
        { name: 'Bangkok', country: 'Thailand', category: 'Urban', priceRange: 'MEDIUM', description: 'Bustling city with street food and temples' },
        { name: 'Singapore', country: 'Singapore', category: 'Urban', priceRange: 'HIGH', description: 'Modern city-state with diverse culture' },
        { name: 'Seoul', country: 'South Korea', category: 'Urban', priceRange: 'MEDIUM', description: 'Dynamic city with K-pop culture' },
        { name: 'Dubai', country: 'UAE', category: 'Urban', priceRange: 'HIGH', description: 'Luxury shopping and futuristic architecture' },
        { name: 'Cape Town', country: 'South Africa', category: 'Nature', priceRange: 'MEDIUM', description: 'Table Mountain and beautiful coastline' },
        { name: 'Sydney', country: 'Australia', category: 'Urban', priceRange: 'HIGH', description: 'Opera House and beautiful harbor' },
        { name: 'Reykjavik', country: 'Iceland', category: 'Nature', priceRange: 'HIGH', description: 'Northern lights and geothermal wonders' },
        { name: 'Kyoto', country: 'Japan', category: 'Cultural', priceRange: 'HIGH', description: 'Ancient capital with traditional gardens and temples' },
        { name: 'Prague', country: 'Czech Republic', category: 'Cultural', priceRange: 'MEDIUM', description: 'Medieval architecture and rich history' },
        { name: 'Vienna', country: 'Austria', category: 'Cultural', priceRange: 'HIGH', description: 'Imperial palaces and classical music heritage' },
        { name: 'Budapest', country: 'Hungary', category: 'Cultural', priceRange: 'MEDIUM', description: 'Thermal baths and stunning Danube views' },
        { name: 'Mykonos', country: 'Greece', category: 'Beach', priceRange: 'HIGH', description: 'Party island with beautiful beaches' },
        { name: 'Hong Kong', country: 'China', category: 'Urban', priceRange: 'HIGH', description: 'Skyscrapers and vibrant street life' },
        { name: 'Mumbai', country: 'India', category: 'Urban', priceRange: 'LOW', description: 'Bollywood city with rich history' },
        { name: 'Jaipur', country: 'India', category: 'Cultural', priceRange: 'LOW', description: 'Pink City with magnificent palaces' },
        { name: 'Varanasi', country: 'India', category: 'Spiritual', priceRange: 'LOW', description: 'Sacred city on the Ganges River' },
        { name: 'Los Angeles', country: 'USA', category: 'Urban', priceRange: 'HIGH', description: 'Hollywood, beaches, and perfect weather' },
        { name: 'San Francisco', country: 'USA', category: 'Urban', priceRange: 'HIGH', description: 'Golden Gate Bridge and tech innovation' },
        { name: 'Miami', country: 'USA', category: 'Beach', priceRange: 'HIGH', description: 'Art Deco architecture and vibrant nightlife' },
        { name: 'New Orleans', country: 'USA', category: 'Cultural', priceRange: 'MEDIUM', description: 'Jazz, Mardi Gras, and Creole cuisine' },
        { name: 'Toronto', country: 'Canada', category: 'Urban', priceRange: 'HIGH', description: 'Multicultural city with iconic CN Tower' },
        { name: 'Vancouver', country: 'Canada', category: 'Nature', priceRange: 'HIGH', description: 'Mountains meet ocean in beautiful setting' },
        { name: 'Mexico City', country: 'Mexico', category: 'Cultural', priceRange: 'MEDIUM', description: 'Ancient Aztec ruins and colonial architecture' },
        { name: 'Cancun', country: 'Mexico', category: 'Beach', priceRange: 'MEDIUM', description: 'Caribbean beaches and Mayan ruins' },
        { name: 'Rio de Janeiro', country: 'Brazil', category: 'Beach', priceRange: 'MEDIUM', description: 'Christ the Redeemer and Copacabana Beach' },
        { name: 'Buenos Aires', country: 'Argentina', category: 'Cultural', priceRange: 'MEDIUM', description: 'Tango, steak, and European architecture' },
        { name: 'Lima', country: 'Peru', category: 'Cultural', priceRange: 'MEDIUM', description: 'Gastronomic capital with colonial charm' },
        { name: 'Marrakech', country: 'Morocco', category: 'Cultural', priceRange: 'MEDIUM', description: 'Medina markets and traditional riads' },
        { name: 'Cairo', country: 'Egypt', category: 'Cultural', priceRange: 'MEDIUM', description: 'Pyramids and ancient Egyptian history' },
        { name: 'Nairobi', country: 'Kenya', category: 'Nature', priceRange: 'MEDIUM', description: 'Gateway to African safari adventures' },
        { name: 'Zanzibar', country: 'Tanzania', category: 'Beach', priceRange: 'MEDIUM', description: 'Spice island with pristine beaches' },
        { name: 'Melbourne', country: 'Australia', category: 'Urban', priceRange: 'HIGH', description: 'Coffee culture and arts scene' },
        { name: 'Auckland', country: 'New Zealand', category: 'Nature', priceRange: 'HIGH', description: 'City of Sails with volcanic landscapes' },
        { name: 'Queenstown', country: 'New Zealand', category: 'Adventure', priceRange: 'HIGH', description: 'Adventure capital of the world' },
        { name: 'Fiji', country: 'Fiji', category: 'Beach', priceRange: 'HIGH', description: 'Tropical paradise with coral reefs' },
        { name: 'Istanbul', country: 'Turkey', category: 'Cultural', priceRange: 'MEDIUM', description: 'Where East meets West' },
        { name: 'Petra', country: 'Jordan', category: 'Cultural', priceRange: 'MEDIUM', description: 'Ancient rock-cut architecture' },
        { name: 'Jerusalem', country: 'Israel', category: 'Spiritual', priceRange: 'HIGH', description: 'Holy city for three religions' },
        { name: 'Banff', country: 'Canada', category: 'Nature', priceRange: 'HIGH', description: 'Rocky Mountains and turquoise lakes' },
        { name: 'Patagonia', country: 'Chile', category: 'Nature', priceRange: 'HIGH', description: 'Dramatic landscapes and hiking trails' },
        { name: 'Machu Picchu', country: 'Peru', category: 'Cultural', priceRange: 'MEDIUM', description: 'Ancient Incan citadel in the mountains' },
        { name: 'Angkor Wat', country: 'Cambodia', category: 'Cultural', priceRange: 'LOW', description: 'Largest religious monument in the world' }
      ]

      for (const dest of sampleDestinations) {
        await prisma.city.create({
          data: dest
        })
      }

      cities = await prisma.city.findMany({
        orderBy: { name: 'asc' }
      })
      
      console.log(`✅ Created ${cities.length} sample destinations`)
    }

    return res.json({
      data: cities
    })
  } catch (error) {
    console.error('Get cities error:', error)
    return res.status(500).json({
      error: { message: 'Failed to get cities' }
    })
  }
})

// Create demo user (for testing)
app.post('/api/auth/demo', async (req, res) => {
  try {
    // Check if demo user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'demo@globetrotter.com' }
    })

    if (existingUser) {
      return res.status(200).json({
        data: { 
          message: 'Demo user already exists',
          user: {
            id: existingUser.id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            role: existingUser.role
          }
        }
      })
    }

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10)
    const demoUser = await prisma.user.create({
      data: {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@globetrotter.com',
        password: hashedPassword,
        role: 'USER'
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    console.log('✅ Demo user created:', demoUser.email)
    
    return res.status(201).json({
      data: { 
        message: 'Demo user created successfully',
        user: demoUser
      }
    })
  } catch (error) {
    console.error('Demo user creation error:', error)
    return res.status(500).json({
      error: { message: 'Internal server error' }
    })
  }
})

// Create trip
app.post('/api/trips', authenticateToken, async (req, res) => {
  try {
    const { name, description, startDate, endDate, budget, isPublic, itinerary } = req.body
    const userId = req.user.id

    const trip = await prisma.trip.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        budget: parseFloat(budget) || 0,
        isPublic: isPublic || false,
        userId
      }
    })

    // Create itinerary if provided
    if (itinerary && Array.isArray(itinerary)) {
      for (const day of itinerary) {
        await prisma.activity.create({
          data: {
            name: day.title || 'Day Activity',
            description: day.description || '',
            type: day.type || 'SIGHTSEEING',
            cost: parseFloat(day.cost) || 0,
            location: day.location || '',
            startTime: day.startTime ? new Date(day.startTime) : null,
            endTime: day.endTime ? new Date(day.endTime) : null,
            tripId: trip.id
          }
        })
      }
    }

    return res.status(201).json({
      data: { trip }
    })
  } catch (error) {
    console.error('Create trip error:', error)
    return res.status(500).json({
      error: { message: 'Failed to create trip' }
    })
  }
})

// Get user trips
app.get('/api/trips/my', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    
    const trips = await prisma.trip.findMany({
      where: { userId },
      include: {
        activities: true,
        _count: {
          select: {
            stops: true,
            activities: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return res.json({
      data: trips
    })
  } catch (error) {
    console.error('Get user trips error:', error)
    return res.status(500).json({
      error: { message: 'Failed to get trips' } 
    })
  }
})

// Get trips (public)
app.get('/api/trips/public', async (req, res) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        },
        activities: true,
        _count: {
          select: {
            stops: true,
            activities: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return res.json({
      data: trips
    })
  } catch (error) {
    console.error('Get public trips error:', error)
    return res.status(500).json({
      error: { message: 'Failed to get trips' }
    })
  }
})

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return res.json({
      data: { user }
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    return res.status(500).json({
      error: { message: 'Failed to get profile' }
    })
  }
})

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const { firstName, lastName, email } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        email
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return res.json({
      data: { user }
    })
  } catch (error) {
    console.error('Update user profile error:', error)
    return res.status(500).json({
      error: { message: 'Failed to update profile' }
    })
  }
})

// Create review
app.post('/api/reviews', authenticateToken, async (req, res) => {
  try {
    const { tripId, rating, comment } = req.body
    const userId = req.user.id

    const review = await prisma.comment.create({
      data: {
        content: comment,
        userId,
        tripId
      }
    })

    return res.status(201).json({
      data: { review }
    })
  } catch (error) {
    console.error('Create review error:', error)
    return res.status(500).json({
      error: { message: 'Failed to create review' }
    })
  }
})

// Get trip reviews
app.get('/api/trips/:tripId/reviews', async (req, res) => {
  try {
    const { tripId } = req.params

    const reviews = await prisma.comment.findMany({
      where: { tripId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return res.json({
      data: { reviews }
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    return res.status(500).json({
      error: { message: 'Failed to get reviews' }
    })
  }
})





// Start server
async function startServer() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection established')
    
    app.listen(PORT, () => {
      console.log('🚀 Server running on port', PORT)
      console.log('📱 Frontend: http://localhost:3000')
      console.log('🔌 API: http://localhost:5000/api')
      console.log('🌍 Environment: development')
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})
