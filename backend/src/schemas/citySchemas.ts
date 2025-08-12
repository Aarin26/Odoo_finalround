import Joi from 'joi'

export const citySchemas = {
  getAllCities: Joi.object({
    country: Joi.string().min(1).max(100).optional(),
    category: Joi.string().min(1).max(50).optional(),
    minCost: Joi.number().positive().optional(),
    maxCost: Joi.number().positive().optional(),
    search: Joi.string().min(1).max(100).optional()
  }),

  getCityById: Joi.object({
    id: Joi.string().required()
  })
}
