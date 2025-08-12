import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../config/database'

export const userController = {
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              trips: true,
              followers: true,
              following: true
            }
          }
        }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: 'User not found' }
        })
      }

      return res.json({
        success: true,
        data: user
      })
    } catch (error) {
      console.error('Get profile error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get profile' }
      })
    }
  },

  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id
      const { firstName, lastName } = req.body

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          updatedAt: true
        }
      })

      return res.json({
        success: true,
        data: updatedUser
      })
    } catch (error) {
      console.error('Update profile error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to update profile' }
      })
    }
  },

  async getUserById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          _count: {
            select: {
              trips: true,
              followers: true,
              following: true
            }
          }
        }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: 'User not found' }
        })
      }

      return res.json({
        success: true,
        data: user
      })
    } catch (error) {
      console.error('Get user error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get user' }
      })
    }
  },

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              trips: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.json({
        success: true,
        data: users
      })
    } catch (error) {
      console.error('Get all users error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get users' }
      })
    }
  },

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: 'User not found' }
        })
      }

      // Delete user and all related data
      await prisma.user.delete({
        where: { id }
      })

      return res.json({
        success: true,
        message: 'User deleted successfully'
      })
    } catch (error) {
      console.error('Delete user error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to delete user' }
      })
    }
  }
}
