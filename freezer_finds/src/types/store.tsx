import { z } from 'zod';

export const storeSchema = z.object({
  id: z.string().uuid(),
  store_name: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  address: z.string().min(1),
  picture_url: z.string().min(1)
});

export const storeExtendedSchema = storeSchema.extend({ label: z.string().min(1), value: z.string().uuid() });

export type Store = z.infer<typeof storeSchema>;
export type StoreOption = z.infer<typeof storeExtendedSchema>;
