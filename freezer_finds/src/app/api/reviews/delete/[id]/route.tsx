import { createAPIClient } from '@/lib/supabase/api';
import { NextResponse } from 'next/server';
import { idSchema } from '../../../shared/types';
import { InvalidRequestError } from '../../../shared/errors';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createAPIClient();

    // Validate input
    const id = params.id;
    const parsedId = idSchema.safeParse({ id: id });
    if (!parsedId.success) {
      throw new InvalidRequestError(['id']);
    }

    // Delete the review with the given id
    const response = await supabase.from('reviews').delete().eq('id', id);
    if (response.error) {
      throw new Error(response.error.message);
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/reviews/[id]', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
