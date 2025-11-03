import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const team_id = url.searchParams.get('team_id');
    
    if (!team_id) {
      return NextResponse.json({ error: 'Missing team_id' }, { status: 400 });
    }
    
    const { data: players, error } = await supabase
      .from('team_players')
      .select(`
        id,
        team_id,
        profile_id,
        jersey_number,
        is_captain,
        player:profiles(id, full_name, role)
      `)
      .eq('team_id', team_id)
      .order('is_captain', { ascending: false })
      .order('jersey_number', { ascending: true });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ players: players || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
