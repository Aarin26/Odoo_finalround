import { Request, Response } from 'express'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../config/database'

export const reviewController = {
  async getTripReviews(req: Request, res: Response) {
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
        success: true,
        data: reviews
      })
    } catch (error) {
      console.error('Get trip reviews error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to get reviews' }
      })
    }
  },

  async createReview(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id
      const { tripId, content } = req.body

      // Check if trip exists and is public
      const trip = await prisma.trip.findFirst({
        where: { 
          id: tripId,
          isPublic: true
        }
      })

      if (!trip) {
        return res.status(404).json({
          success: false,
          error: { message: 'Public trip not found' }
        })
      }

      const review = await prisma.comment.create({
        data: {
          content,
          userId,
          tripId
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      return res.status(201).json({
        success: true,
        data: { review }
      })
    } catch (error) {
      console.error('Create review error:', error)
      return res.status(500).json({
        success: false,
        error: { message: 'Failed to create review' }
      })
    }
  }
}
