import { createAPIClient } from '@/lib/supabase/api';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    console.log('called reviews get api:', id);
    const supabase = await createAPIClient();

    const response = await supabase.from('reviews').delete().eq('id', id);

    console.log(response);
    if (response.error) {
      console.log('Error deleting reviews:', response.error);
      throw new Error(response.error.message);
    }
    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/reviews/[id]', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
