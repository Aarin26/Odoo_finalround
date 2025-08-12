import { Router } from 'express'
import { activityController } from '../controllers/activityController'
import { validate, validateParams, validateQuery } from '../middleware/validation'
import { activitySchemas } from '../schemas/activitySchemas'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Protected routes
router.use(authenticateToken)

// Get all activities for a trip
router.get('/trip/:tripId', validateParams(activitySchemas.getByTripId), activityController.getTripActivities)

// Create a new activity
router.post('/', validate(activitySchemas.createActivity), activityController.createActivity)

// Get a specific activity
router.get('/:id', validateParams(activitySchemas.getById), activityController.getActivityById)

// Update an activity
router.put('/:id', validateParams(activitySchemas.getById), validate(activitySchemas.updateActivity), activityController.updateActivity)

// Delete an activity
router.delete('/:id', validateParams(activitySchemas.getById), activityController.deleteActivity)

export default router
