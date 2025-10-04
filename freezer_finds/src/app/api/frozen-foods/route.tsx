import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { frozenFoodSchema } from '@/types/frozen_foods';
import { getPublicUrl, uploadImageToSupabase } from '@/app/api/shared/sharedFunctions';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    const { data: frozenFoods, error } = await supabase
      .from('frozen_foods')
      .select('id, food_name, picture_url, store_id, stores(id, store_name)')
      .ilike('food_name', `%${query}%`);

    console.log(frozenFoods);

    if (frozenFoods && Array.isArray(frozenFoods)) {
      for (const food of frozenFoods) {
        if (food.picture_url) {
          const updatedUrl = await getPublicUrl(food.picture_url, 'frozen_food_images');
          food.picture_url = updatedUrl;
        }
      }
    }

    if (error) throw new Error(error.message);

    return NextResponse.json(frozenFoods);
  } catch (error) {
    console.error('Error in GET /api/frozen-foods:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
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
      throw new Error(`Invalid frozen food data: ${parsedBody.error}`);
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
