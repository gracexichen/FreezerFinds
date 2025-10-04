import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.string().uuid(),
  created_at: z.coerce.date(),
  user_id: z.string().uuid(),
  review_text: z.string().min(1),
  rating: z.number().min(1).max(5)
});

export const reviewWithUserSchema = reviewSchema.extend({
  users: z.object({
    id: z.string().min(1),
    email: z.string().email()
  })
});

export type Review = z.infer<typeof reviewSchema>;
export type ReviewWithUser = z.infer<typeof reviewWithUserSchema>;
