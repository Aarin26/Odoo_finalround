import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'

// Import routes
import authRoutes from './routes/auth'
import userRoutes from './routes/users'
import tripRoutes from './routes/trips'
import cityRoutes from './routes/cities'
import activityRoutes from './routes/activities'
import reviewRoutes from './routes/reviews'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/trips', tripRoutes)
app.use('/api/cities', cityRoutes)
app.use('/api/activities', activityRoutes)
app.use('/api/reviews', reviewRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

export { app }
