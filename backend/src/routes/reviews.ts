import { Router } from 'express'
import { reviewController } from '../controllers/reviewController'
import { validate } from '../middleware/validation'
import { reviewSchemas } from '../schemas/reviewSchemas'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Public routes (no authentication required)
router.get('/trips/:tripId', reviewController.getTripReviews)

// Protected routes
router.use(authenticateToken)

// Create a new review
router.post('/', validate(reviewSchemas.createReview), reviewController.createReview)

export default router
