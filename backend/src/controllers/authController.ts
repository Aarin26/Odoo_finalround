import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return res.status(400).json({
          error: {
            message: 'User with this email already exists'
          }
        })
      }

      // Hash password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

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
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret'
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '24h' }
      )

      return res.status(201).json({
        data: {
          user,
          token
        }
      })
    } catch (error) {
      console.error('Registration error:', error)
      return res.status(500).json({
        error: {
          message: 'Internal server error'
        }
      })
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        return res.status(401).json({
          error: {
            message: 'Invalid email or password'
          }
        })
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return res.status(401).json({
          error: {
            message: 'Invalid email or password'
          }
        })
      }

      // Generate JWT token
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret'
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
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
        data: {
          user: userData,
          token
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      return res.status(500).json({
        error: {
          message: 'Internal server error'
        }
      })
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body

      if (!refreshToken) {
        return res.status(400).json({
          error: {
            message: 'Refresh token is required'
          }
        })
      }

      // Verify refresh token
      const jwtSecret = process.env.JWT_SECRET || 'fallback-secret'
      const decoded = jwt.verify(refreshToken, jwtSecret) as any

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          createdAt: true
        }
      })

      if (!user) {
        return res.status(401).json({
          error: {
            message: 'Invalid refresh token'
          }
        })
      }

      // Generate new token
      const newToken = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '24h' }
      )

      return res.status(200).json({
        data: {
          user,
          token: newToken
        }
      })
    } catch (error) {
      console.error('Token refresh error:', error)
      return res.status(401).json({
        error: {
          message: 'Invalid refresh token'
        }
      })
    }
  }
}
