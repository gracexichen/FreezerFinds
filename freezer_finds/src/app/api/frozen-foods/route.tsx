import { NextResponse } from 'next/server';
import { createAPIClient } from '@/lib/supabase/api';
import { frozenFoodSchema } from '@/types/frozen_foods';
import { getPublicUrl, uploadImageToSupabase } from '@/app/api/shared/sharedFunctions';

export async function GET(req: Request) {
  try {
    const supabase = await createAPIClient();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    const { data: frozenFoods, error } = await supabase
      .from('frozen_foods')
      .select('id, food_name, picture_url, store_id, stores(id, store_name)')
      .ilike('food_name', `%${query}%`);

    console.log(frozenFoods);

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

export async function POST(request: Request) {
  try {
    const supabase = await createAPIClient();
    const formData = await request.formData();

    const file = formData.get('food-image') as File;
    const filePath = await uploadImageToSupabase(file, 'frozen_food_images');

    const frozenFoodObject = {
      store_id: formData.get('store-id') as string,
      food_name: formData.get('food-name') as string,
      picture_url: filePath
    };

    const parsedBody = frozenFoodSchema
      .pick({ store_id: true, food_name: true, picture_url: true })
      .safeParse(frozenFoodObject);
    if (!parsedBody.success) {
      console.error('Validation errors:', parsedBody.error.issues);
      throw new Error(`Invalid frozen food data: ${parsedBody.error.issues.map((e) => e.message).join(', ')}`);
    }

    const { error: databaseError } = await supabase.schema('app').from('frozen_foods').insert(parsedBody.data).select();
    if (databaseError) {
      throw new Error(`Database error: ${databaseError.message}`);
    }

    return NextResponse.json({});
  } catch (error) {
    console.error('Error in POST /api/frozen-foods:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
