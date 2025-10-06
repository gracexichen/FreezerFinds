import { createAPIClient } from '@/lib/supabase/api';
import { getPublicUrl } from '@/app/api/shared/sharedFunctions';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { store_id: string } }) {
  const store_id = params.store_id;

  try {
    const supabase = await createAPIClient();

    const { data: frozenFoods, error } = await supabase
      .from('frozen_foods')
      .select('id, food_name, picture_url, store_id, stores(id, store_name)')
      .eq('store_id', store_id);

    if (error) throw new Error(error.message);

    // Update picture URLs to public URLs and add average ratings
    if (!frozenFoods || Array.isArray(frozenFoods) === false) {
      throw new Error('Invalid data format received from database');
    }

    // Add extended info
    const extendedFrozenFoods = await Promise.all(
      frozenFoods.map(async (food) => {
        // Update picture url to public url
        let updatedPictureUrl = food.picture_url;
        if (food.picture_url) {
          updatedPictureUrl = await getPublicUrl(food.picture_url, 'frozen_food_images');
        }

        // Get average ratings
        const { data: ratings, error: ratingsError } = await supabase
          .from('reviews')
          .select('rating')
          .eq('frozen_food_id', food.id);

        if (ratingsError) {
          console.error('Failed to fetch ratings for food:', food.id, ratingsError);
        }

        const ratingValues = ratings?.map((r) => r.rating) || [];
        const averageRating = ratingValues.length ? ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length : 0;

        return {
          ...food,
          picture_url: updatedPictureUrl,
          average_rating: Number(averageRating.toFixed(2)) // 2 decimal places
        };
      })
    );

    return NextResponse.json(extendedFrozenFoods);
  } catch (error) {
    console.error('Error in GET /api/frozen-foods:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
