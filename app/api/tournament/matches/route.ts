import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tournament_id = url.searchParams.get('tournament_id');
    
    if (!tournament_id) {
      return NextResponse.json({ error: 'Missing tournament_id' }, { status: 400 });
    }
    
    const { data: matches, error } = await supabase
      .from('matches')
      .select(`
        id,
        tournament_id,
        home_team_id,
        away_team_id,
        start_time,
        status,
        home_score,
        away_score,
        field,
        home_team:teams!matches_home_team_id_fkey(id, name),
        away_team:teams!matches_away_team_id_fkey(id, name)
      `)
      .eq('tournament_id', tournament_id)
      .order('start_time', { ascending: true });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ matches });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}