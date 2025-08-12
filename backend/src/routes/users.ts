import { Router } from 'express'
import { userController } from '../controllers/userController'
import { validate, validateParams } from '../middleware/validation'
import { userSchemas } from '../schemas/userSchemas'
import { authenticateToken, requireRole } from '../middleware/auth'

const router = Router()

// Get user profile
router.get('/profile', authenticateToken, userController.getProfile)

// Update user profile
router.put('/profile', authenticateToken, validate(userSchemas.updateProfile), userController.updateProfile)

// Get user by ID
router.get('/:id', validateParams(userSchemas.getUserById), userController.getUserById)

// Admin routes
router.get('/', authenticateToken, requireRole(['ADMIN']), userController.getAllUsers)
router.delete('/:id', authenticateToken, requireRole(['ADMIN']), validateParams(userSchemas.getUserById), userController.deleteUser)

export default router
