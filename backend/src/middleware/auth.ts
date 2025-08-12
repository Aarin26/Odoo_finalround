import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/database'

export interface AuthRequest extends Request {
  user?: any
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      res.status(401).json({
        success: false,
        error: { message: 'Access token required' }
      })
      return
    }

    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret'
    const decoded = jwt.verify(token, jwtSecret) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })

    if (!user) {
      res.status(401).json({
        success: false,
        error: { message: 'Invalid token' }
      })
      return
    }

    req.user = user
    next()
  } catch (error) {
    res.status(403).json({
      success: false,
      error: { message: 'Invalid token' }
    })
    return
  }
}

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      })
      return
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions' }
      })
      return
    }

    next()
  }
}
