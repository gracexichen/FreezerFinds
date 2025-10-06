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

export const reviewWithFrozenFood = reviewSchema.extend({
  frozen_foods: z.object({
    id: z.string().uuid(),
    food_name: z.string().min(1)
  })
});

export type Review = z.infer<typeof reviewSchema>;
export type ReviewWithUser = z.infer<typeof reviewWithUserSchema>;
export type ReviewWithFrozenFood = z.infer<typeof reviewWithFrozenFood>;
