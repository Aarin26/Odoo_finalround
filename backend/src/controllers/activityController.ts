import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../config/database'

export const activityController = {
  async getTripActivities(req: AuthRequest, res: Response) {
    try {
      const { tripId } = req.params
      const userId = req.user.id

      // Check if user has access to this trip
      const trip = await prisma.trip.findFirst({
        where: {
          id: tripId,
          OR: [
            { userId },
            { isPublic: true }
          ]
        }
      })

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: { message: 'Trip not found' }
        })
      }

      const activities = await prisma.activity.findMany({
        where: { tripId },
        orderBy: { startTime: 'asc' }
      })

      return res.json({
        success: true,
        data: activities
      })
    } catch (error) {
      console.error('Get trip activities error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get activities' }
      })
    }
  },

  async createActivity(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id
      const { name, description, type, cost, location, startTime, endTime, tripId } = req.body

      // Check if user owns the trip
      const trip = await prisma.trip.findFirst({
        where: { id: tripId, userId }
      })

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: { message: 'Trip not found' }
        })
      }

      const activity = await prisma.activity.create({
        data: {
          name,
          description,
          type,
          cost,
          location,
          startTime: startTime ? new Date(startTime) : null,
          endTime: endTime ? new Date(endTime) : null,
          tripId
        }
      })

      return res.status(201).json({
        success: true,
        data: activity
      })
    } catch (error) {
      console.error('Create activity error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to create activity' }
      })
    }
  },

  async getActivityById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const activity = await prisma.activity.findFirst({
        where: {
          id,
          trip: {
            OR: [
              { userId },
              { isPublic: true }
            ]
          }
        },
        include: {
          trip: {
            select: {
              id: true,
              name: true,
              isPublic: true
            }
          }
        }
      })

      if (!activity) {
        return res.status(404).json({
          success: false,
          error: { message: 'Activity not found' }
        })
      }

      return res.json({
        success: true,
        data: activity
      })
    } catch (error) {
      console.error('Get activity error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get activity' }
      })
    }
  },

  async updateActivity(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user.id
      const updateData = req.body

      // Check if user owns the trip that contains this activity
      const existingActivity = await prisma.activity.findFirst({
        where: {
          id,
          trip: {
            userId
          }
        }
      })

      if (!existingActivity) {
        return res.status(404).json({
          success: false,
          error: { message: 'Activity not found' }
        })
      }

      const updatedActivity = await prisma.activity.update({
        where: { id },
        data: {
          ...updateData,
          startTime: updateData.startTime ? new Date(updateData.startTime) : undefined,
          endTime: updateData.endTime ? new Date(updateData.endTime) : undefined
        }
      })

      return res.json({
        success: true,
        data: updatedActivity
      })
    } catch (error) {
      console.error('Update activity error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to update activity' }
      })
    }
  },

  async deleteActivity(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user.id

      // Check if user owns the trip that contains this activity
      const existingActivity = await prisma.activity.findFirst({
        where: {
          id,
          trip: {
            userId
          }
        }
      })

      if (!existingActivity) {
        return res.status(404).json({
          success: false,
          error: { message: 'Activity not found' }
        })
      }

      await prisma.activity.delete({
        where: { id }
      })

      return res.json({
        success: true,
        message: 'Activity deleted successfully'
      })
    } catch (error) {
      console.error('Delete activity error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to delete activity' }
      })
    }
  }
}
