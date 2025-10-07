import { createAPIClient } from "@/lib/supabase/api";
import { NextResponse } from "next/server";
import { idSchema } from "../../shared/types";
import { InvalidRequestError, DatabaseError } from "../../shared/errors";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate input
    const id = params.id;
    const parsedId = idSchema.safeParse({ id: id });
    if (!parsedId.success) {
      throw new InvalidRequestError(["frozen_food_id"]);
    }

    // Get store by id
    const supabase = await createAPIClient();

    const { data: stores, error } = await supabase
      .schema("app")
      .from("stores")
      .select("id, store_name, address, city, state, picture_url")
      .eq("id", id)
      .single();

    if (error) throw new DatabaseError(error.message);

    return NextResponse.json(stores);
  } catch (error) {
    console.error(`Error in GET /api/stores/[id]:`, (error as Error).message);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
