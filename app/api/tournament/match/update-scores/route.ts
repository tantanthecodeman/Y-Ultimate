import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { matchid, homescore, awayscore, status } = body as {
      matchid?: string;
      homescore?: number;
      awayscore?: number;
      status?: string;
    };

    if (!matchid) {
      return NextResponse.json({ error: "Missing matchid" }, { status: 400 });
    }

    if (homescore === undefined || awayscore === undefined) {
      return NextResponse.json({ error: "Missing scores" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      home_score: homescore,  // Changed from homescore to home_score
      away_score: awayscore,  // Changed from awayscore to away_score
    };

    if (status) {
      updateData.status = status;
    }

    const { data, error } = await supabase
      .from("matches")
      .update(updateData)
      .eq("id", matchid)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ match: data });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
