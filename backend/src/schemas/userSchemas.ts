import Joi from 'joi'

export const userSchemas = {
  updateProfile: Joi.object({
    firstName: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    bio: Joi.string().max(500).optional()
  }),

  getUserById: Joi.object({
    id: Joi.string().required()
  }),

  followUser: Joi.object({
    id: Joi.string().required()
  })
}
