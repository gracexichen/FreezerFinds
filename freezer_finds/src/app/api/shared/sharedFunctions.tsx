import { createClient } from '@/lib/supabase/client';

export async function uploadImageToSupabase(file: File, bucket: string): Promise<string> {
  const supabase = await createClient();
  const dateString = new Date().toISOString();
  const filePath = `images/${dateString}_${file.name}`;
  const { error: storageError } = await supabase.storage.from(bucket).upload(filePath, file);
  if (storageError) {
    throw new Error(`Error uploading image: ${storageError.message}`);
  }
  return filePath;
}

export async function getPublicUrl(filePath: string, bucket: string): Promise<string> {
  const supabase = await createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  if (!data) {
    throw new Error(`Error retrieving image: ${data}`);
  }
  return data.publicUrl;
}
