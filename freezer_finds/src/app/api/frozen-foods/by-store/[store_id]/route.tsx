import { createAPIClient } from '@/lib/supabase/api';
import { NextResponse } from 'next/server';
import { idSchema } from '../../../shared/types';
import { DatabaseError, InvalidRequestError } from '@/app/api/shared/errors';
import { addAverageRatingsToFoods } from '@/app/api/shared/sharedFunctions';

export async function GET(request: Request, { params }: { params: Promise<{ store_id: string }> }) {
  try {
    const { store_id } = await params;

    // Validate input
    const parsedId = idSchema.safeParse({ id: store_id });
    if (!parsedId.success) {
      throw new InvalidRequestError(['store_id']);
    }

    // Fetch frozen food records for the store
    const supabase = await createAPIClient();

    const { data: frozenFoods, error } = await supabase
      .schema('app')
      .from('frozen_foods')
      .select('id, created_at, food_name, picture_url, store_id, stores(id, store_name)')
      .eq('store_id', store_id);

    if (error) throw new DatabaseError(error.message);

    // Add average ratings to each frozen food item
    const extendedFrozenFoods = await addAverageRatingsToFoods(frozenFoods);

    return NextResponse.json(extendedFrozenFoods);
  } catch (error) {
    console.error('Error in GET /api/frozen-foods/by-store/[store_id]:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
