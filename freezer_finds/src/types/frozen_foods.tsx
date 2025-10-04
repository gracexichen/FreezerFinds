import { z } from 'zod';

export const frozenFoodSchema = z.object({
  id: z.string().uuid(),
  created_at: z.coerce.date(),
  food_name: z.string().min(1),
  picture_url: z.string().min(1),
  store_id: z.string().min(1)
});

// extend store info
export const frozenFoodsExtendedSchema = frozenFoodSchema.extend({
  stores: z
    .object({
      id: z.string().uuid(),
      store_name: z.string().min(1),
      address: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1)
    })
    .nullable()
});

export type FrozenFood = z.infer<typeof frozenFoodSchema>;
export type FrozenFoodExtended = z.infer<typeof frozenFoodsExtendedSchema>;
