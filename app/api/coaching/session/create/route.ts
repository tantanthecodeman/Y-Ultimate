import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (typeof body !== "object" || body === null) throw new Error("Invalid request body");

    const {
      child_id,
      coach_profile_id,
      session_date,
      visit_type,
      location,
      notes,
      topic,
      attendance,
    } = body as {
      child_id?: string;
      coach_profile_id?: string;
      session_date?: string;
      visit_type?: string;
      location?: string;
      notes?: string;
      topic?: string;
      attendance?: boolean | null;
    };

    if (!child_id || !coach_profile_id || !session_date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("coaching_sessions")
      .insert({
        child_id,
        coach_profile_id,
        session_date,
        visit_type,
        location,
        notes,
        topic,
        attendance,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}
