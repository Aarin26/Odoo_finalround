import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { PrismaClient } from '@prisma/client'

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'GlobeTrotter API is running' })
})

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' })
})

// Database connection test
app.get('/api/db-test', async (req, res) => {
  try {
    await prisma.$connect()
    res.json({ message: 'Database connected successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' })
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
