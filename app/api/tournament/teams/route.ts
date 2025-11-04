import { NextResponse } from 'next/server';
import {supabase} from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tournament_id = url.searchParams.get('tournament_id');

    const query = supabase.from('teams').select('id, name, tournament_id');

    const { data, error } = tournament_id
      ? await query.eq('tournament_id', tournament_id)
      : await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ teams: data || [] });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unexpected error' }, { status: 500 });
  }
}
