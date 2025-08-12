import Joi from 'joi'

export const tripSchemas = {
  createTrip: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    budget: Joi.number().positive().optional(),
    isPublic: Joi.boolean().optional()
  }),

  updateTrip: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().max(500).optional(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    budget: Joi.number().positive().optional(),
    isPublic: Joi.boolean().optional()
  }),

  getTripById: Joi.object({
    id: Joi.string().required()
  }),

  exploreTrips: Joi.object({
    country: Joi.string().optional(),
    limit: Joi.number().integer().min(1).max(50).optional(),
    page: Joi.number().integer().min(1).optional()
  })
}
