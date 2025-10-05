import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.string().uuid(),
  created_at: z.coerce.date(),
  frozen_food_id: z.string().uuid(),
  review_text: z.string().min(1),
  rating: z.number().min(1).max(5),
  user_id: z.string().uuid()
});

export const reviewWithUserSchema = reviewSchema.extend({
  user: z.object({
    id: z.string().min(1),
    email: z.string().email()
  })
});

export type Review = z.infer<typeof reviewSchema>;
export type ReviewWithUser = z.infer<typeof reviewWithUserSchema>;
