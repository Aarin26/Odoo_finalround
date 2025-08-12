import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../config/database'

export const tripController = {
  async getUserTrips(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id

      const trips = await prisma.trip.findMany({
        where: { userId },
        include: {
          stops: {
            orderBy: { order: 'asc' }
          },
          activities: true,
          _count: {
            select: {
              stops: true,
              activities: true,
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { startDate: 'desc' }
      })

      return res.json({
        success: true,
        data: trips
      })
    } catch (error) {
      console.error('Get user trips error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get trips' }
      })
    }
  },

  async getPublicTrips(req: Request, res: Response) {
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
              activities: true,
              likes: true,
              comments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.json({
        success: true,
        data: trips
      })
    } catch (error) {
      console.error('Get public trips error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get public trips' }
      })
    }
  },

  async createTrip(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id
      const { name, description, startDate, endDate, budget, isPublic } = req.body

      const trip = await prisma.trip.create({
        data: {
          name,
          description,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          budget,
          isPublic: isPublic || false,
          userId
        },
        include: {
          stops: true,
          activities: true,
          _count: {
            select: {
              stops: true,
              activities: true,
              likes: true,
              comments: true
            }
          }
        }
      })

      return res.status(201).json({
        success: true,
        data: trip
      })
    } catch (error) {
      console.error('Create trip error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to create trip' }
      })
    }
  },

  async getTripById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const trip = await prisma.trip.findFirst({
        where: {
          id,
          OR: [
            { userId },
            { isPublic: true }
          ]
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          stops: {
            orderBy: { order: 'asc' }
          },
          _count: {
            select: {
              stops: true,
              activities: true,
              likes: true,
              comments: true
            }
          }
        }
      })

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: { message: 'Trip not found' }
        })
      }

      return res.json({
        success: true,
        data: trip
      })
    } catch (error) {
      console.error('Get trip error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get trip' }
      })
    }
  },

  async updateTrip(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const updateData = req.body

      // Check if trip exists and belongs to user
      const existingTrip = await prisma.trip.findFirst({
        where: { id, userId }
      })

      if (!existingTrip) {
        return res.status(404).json({
          success: false,
          error: { message: 'Trip not found' }
        })
      }

      // Update trip
      const updatedTrip = await prisma.trip.update({
        where: { id },
        data: {
          ...updateData,
          startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
          endDate: updateData.endDate ? new Date(updateData.endDate) : undefined
        },
        include: {
          stops: {
            orderBy: { order: 'asc' }
          },
          activities: true,
          _count: {
            select: {
              stops: true,
              activities: true,
              likes: true,
              comments: true
            }
          }
        }
      })

      return res.json({
        success: true,
        data: updatedTrip
      })
    } catch (error) {
      console.error('Update trip error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to update trip' }
      })
    }
  },

  async deleteTrip(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Check if trip exists and belongs to user
      const existingTrip = await prisma.trip.findFirst({
        where: { id, userId }
      })

      if (!existingTrip) {
        return res.status(404).json({
          success: false,
          error: { message: 'Trip not found' }
        })
      }

      // Delete trip (cascade will handle related data)
      await prisma.trip.delete({
        where: { id }
      })

      return res.json({
        success: true,
        message: 'Trip deleted successfully'
      })
    } catch (error) {
      console.error('Delete trip error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to delete trip' }
      })
    }
  },

  async searchPublicTrips(req: Request, res: Response) {
    try {
      const { q, page = 1, limit = 10 } = req.query
      const skip = (Number(page) - 1) * Number(limit)

      const where = {
        isPublic: true,
        ...(q && {
          OR: [
            { name: { contains: String(q), mode: 'insensitive' } },
            { description: { contains: String(q), mode: 'insensitive' } }
          ]
        })
      }

      const [trips, total] = await Promise.all([
        prisma.trip.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            },
            stops: {
              orderBy: { order: 'asc' },
              take: 3 // Only get first 3 stops for preview
            },
            _count: {
              select: {
                stops: true,
                activities: true,
                likes: true,
                comments: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: Number(limit)
        }),
        prisma.trip.count({ where })
      ])

      return res.json({
        success: true,
        data: {
          trips,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
          }
        }
      })
    } catch (error) {
      console.error('Search public trips error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to search trips' }
      })
    }
  }
}
