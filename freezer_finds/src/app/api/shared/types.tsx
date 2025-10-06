import { z } from 'zod';

export const idSchema = z.object({
  id: z.string().uuid()
});

export const querySchema = z.object({
  query: z.string().max(100).optional()
});

export const querySchemaWithOptions = z.object({
  query: z.string().max(100).optional(),
  asOptions: z.boolean().optional()
});

export type Id = z.infer<typeof idSchema>;
export type Query = z.infer<typeof querySchema>;
export type QueryWithOptions = z.infer<typeof querySchemaWithOptions>;
