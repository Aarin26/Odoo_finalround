import { z } from 'zod'

export const reviewSchemas = {
  createReview: z.object({
    tripId: z.string().min(1, 'Trip ID is required'),
    content: z.string().min(1, 'Review content is required').max(1000, 'Review content must be less than 1000 characters')
  })
}
