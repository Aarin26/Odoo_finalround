import { Router } from 'express'
import { tripController } from '../controllers/tripController'
import { validate, validateParams, validateQuery } from '../middleware/validation'
import { tripSchemas } from '../schemas/tripSchemas'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Public routes (no authentication required)
router.get('/public', tripController.getPublicTrips)

// Protected routes
router.use(authenticateToken)

// Get all trips for the authenticated user
router.get('/', tripController.getUserTrips)

// Create a new trip
router.post('/', validate(tripSchemas.createTrip), tripController.createTrip)

// Get a specific trip
router.get('/:id', validateParams(tripSchemas.getTripById), tripController.getTripById)

// Update a trip
router.put('/:id', validateParams(tripSchemas.getTripById), validate(tripSchemas.updateTrip), tripController.updateTrip)

// Delete a trip
router.delete('/:id', validateParams(tripSchemas.getTripById), tripController.deleteTrip)

// Search public trips
router.get('/public/search', validateQuery(tripSchemas.exploreTrips), tripController.searchPublicTrips)

export default router
