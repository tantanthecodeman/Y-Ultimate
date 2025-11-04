import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { child_id, coach_id, date, values, comments } = body as {
      child_id?: string;
      coach_id?: string;
      date?: string;
      values?: unknown;
      comments?: string;
    };

    if (!child_id || !coach_id || !date || !values) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("assessments")
      .insert({ child_id, coach_id, date, values, comments })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
