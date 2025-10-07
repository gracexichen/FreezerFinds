import { z } from 'zod';

// Simplified user schema for frontend use
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().min(1),
  created_at: z.string().datetime({ offset: true })
});

export type User = z.infer<typeof userSchema>;
