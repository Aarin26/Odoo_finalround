import Joi from 'joi'

export const activitySchemas = {
  createActivity: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional(),
    type: Joi.string().valid('SIGHTSEEING', 'FOOD', 'SHOPPING', 'ADVENTURE', 'CULTURE', 'RELAXATION', 'TRANSPORT', 'ACCOMMODATION').required(),
    cost: Joi.number().positive().optional(),
    location: Joi.string().max(200).optional(),
    startTime: Joi.date().iso().optional(),
    endTime: Joi.date().iso().optional(),
    tripId: Joi.string().required()
  }),

  updateActivity: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().max(500).optional(),
    type: Joi.string().valid('SIGHTSEEING', 'FOOD', 'SHOPPING', 'ADVENTURE', 'CULTURE', 'RELAXATION', 'TRANSPORT', 'ACCOMMODATION').optional(),
    cost: Joi.number().positive().optional(),
    location: Joi.string().max(200).optional(),
    startTime: Joi.date().iso().optional(),
    endTime: Joi.date().iso().optional()
  }),

  getById: Joi.object({
    id: Joi.string().required()
  }),

  getByTripId: Joi.object({
    tripId: Joi.string().required()
  })
}
