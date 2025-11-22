import { NextResponse } from "next/server";
import { supabase }from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (typeof body !== "object" || body === null) throw new Error("Invalid request body");

    const { name, age, gender, school, community } = body as {
      name?: string;
      age?: number;
      gender?: string;
      school?: string;
      community?: string;
    };

    if (!name || !community) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("children")
      .insert({ name, age, gender, school, community })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: (error as Error).message || "Internal error" }, { status: 500 });
  }
}
