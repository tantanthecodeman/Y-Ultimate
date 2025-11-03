import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { match_id, home_score, away_score, status } = await req.json();
    
    if (!match_id) {
      return NextResponse.json({ error: 'Missing match_id' }, { status: 400 });
    }

    if (home_score === undefined || away_score === undefined) {
      return NextResponse.json({ error: 'Missing home_score or away_score' }, { status: 400 });
    }

    // Validate scores are non-negative integers
    if (home_score < 0 || away_score < 0 || !Number.isInteger(home_score) || !Number.isInteger(away_score)) {
      return NextResponse.json({ error: 'Scores must be non-negative integers' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      home_score,
      away_score,
      status: status || 'completed' // Default to completed if not provided
    };
    
    const { data, error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', match_id)
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
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }
    
    return NextResponse.json({ match: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
