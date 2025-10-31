import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClients';
import { generateRoundRobin } from '@/app/tournament/lib/scheduler';

export async function POST(req: Request) {
  try {
    const { tournament_id } = await req.json();
    
    if (!tournament_id) {
      return NextResponse.json({ error: 'Missing tournament_id' }, { status: 400 });
    }
    
    // 1) fetch teams for tournament
    const { data: teams, error: tErr } = await supabase
      .from('teams')
      .select('id')
      .eq('tournament_id', tournament_id);
    
    if (tErr) {
      return NextResponse.json({ error: tErr.message }, { status: 500 });
    }
    
    const teamIds = (teams || []).map((t) => t.id);
    
    if (teamIds.length < 2) {
      return NextResponse.json({ error: 'Need at least 2 teams to generate matches' }, { status: 400 });
    }
    
    // 2) generate pairings
    const pairings = generateRoundRobin(teamIds);
    
    // 3) convert to match rows and insert
    // We'll set start_time null for now; frontend or TD can schedule times per round/field later
    const matchRows = pairings.map(p => ({
      tournament_id,
      home_team_id: p.home_team_id,
      away_team_id: p.away_team_id,
      start_time: null,
      status: 'scheduled' as const
    }));
    
    // Insert matches in a single bulk operation
    const { data: inserted, error: insertErr } = await supabase
      .from('matches')
      .insert(matchRows)
      .select();
    
    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }
    
    return NextResponse.json({ matches: inserted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}