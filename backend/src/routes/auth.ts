import { Router } from 'express'
import { authController } from '../controllers/authController'
import { validate } from '../middleware/validation'
import { authSchemas } from '../schemas/authSchemas'

const router = Router()

// Register
router.post('/register', validate(authSchemas.register), authController.register)

// Login
router.post('/login', validate(authSchemas.login), authController.login)

// Refresh token
router.post('/refresh', validate(authSchemas.refreshToken), authController.refreshToken)

export default router
