import { createAPIClient } from '@/lib/supabase/api';
import { FrozenFood, FrozenFoodWithRating } from '@/types/frozen_foods';
import { AdditionalContextError } from './errors';

export async function getPublicUrl(filePath: string, bucket: string): Promise<string> {
  const supabase = await createAPIClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  if (!data) {
    throw new Error(`Error retrieving image: ${data}`);
  }
  return data.publicUrl;
}

export async function uploadImageToSupabase(file: File, bucket: string): Promise<string> {
  const supabase = await createAPIClient();
  const dateString = new Date().toISOString();
  const filePath = `images/${dateString}_${file.name}`;
  const { error: storageError } = await supabase.storage.from(bucket).upload(filePath, file);
  if (storageError) {
    throw new Error(`Error uploading image: ${storageError.message}`);
  }
  const publicFilePath = await getPublicUrl(filePath, bucket);
  return publicFilePath;
}

export async function addAverageRatingsToFoods(frozenFoods: FrozenFood[]): Promise<FrozenFoodWithRating[]> {
  const supabase = await createAPIClient();
  const extendedFrozenFoods = await Promise.all(
    frozenFoods.map(async (food) => {
      const { data: ratings, error: ratingsError } = await supabase
        .schema('app')
        .from('reviews')
        .select('rating')
        .eq('frozen_food_id', food.id);

      if (ratingsError) {
        throw new AdditionalContextError('rating');
      }

      if (!ratings) {
        throw new AdditionalContextError('rating');
      }

      // Get list of rating values, then compute average
      const ratingValues = ratings.map((r) => r.rating);
      const averageRating = ratingValues.length
        ? ratingValues.reduce((a: number, b: number) => a + b, 0) / ratingValues.length
        : 0;

      return {
        ...food,
        average_rating: Number(averageRating.toFixed(2)) // 2 decimal places
      };
    })
  );
  return extendedFrozenFoods;
}
