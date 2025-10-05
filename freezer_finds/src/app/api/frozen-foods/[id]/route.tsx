import { NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/api';
import { getPublicUrl } from '@/app/api/shared/sharedFunctions';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const supabase = await createAPIClient();

    const { data: frozenFood, error } = await supabase
      .from('frozen_foods')
      .select('id, food_name, picture_url, store_id, stores(id, store_name)')
      .eq('id', id)
      .single();

    if (!frozenFood) {
      throw new Error('Frozen food item not found');
    }

    if (frozenFood.picture_url) {
      const updatedUrl = await getPublicUrl(frozenFood.picture_url, 'frozen_food_images');
      frozenFood.picture_url = updatedUrl;
    }

    // Get average ratings
    const { data: ratings, error: ratingsError } = await supabase
      .schema('app')
      .from('reviews')
      .select('rating')
      .eq('frozen_food_id', frozenFood.id);

    if (ratingsError) {
      console.error('Failed to fetch ratings for food:', frozenFood.id, ratingsError);
    }
    const ratingValues = ratings?.map((r) => r.rating) || [];
    const averageRating = ratingValues.length ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length : 0;

    return NextResponse.json({ ...frozenFood, average_rating: averageRating });
  } catch (error) {
    console.error('Error in GET /api/frozen-foods/[id]:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
