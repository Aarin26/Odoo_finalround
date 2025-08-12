import { Router } from 'express'
import { cityController } from '../controllers/cityController'
import { validateQuery, validateParams } from '../middleware/validation'
import { citySchemas } from '../schemas/citySchemas'

const router = Router()

// Get all cities with optional filtering
router.get('/', validateQuery(citySchemas.getAllCities), cityController.getAllCities)

// Get a specific city by ID
router.get('/:id', validateParams(citySchemas.getCityById), cityController.getCityById)

export default router
