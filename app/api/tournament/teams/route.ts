import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tournament_id = url.searchParams.get('tournament_id');
    
    if (!tournament_id) {
      return NextResponse.json({ error: 'Missing tournament_id' }, { status: 400 });
    }
    
    const { data: teams, error } = await supabase
      .from('teams')
      .select(`
        id,
        tournament_id,
        name,
        captain_profile_id,
        created_at,
        captain:profiles(id, full_name, role)
      `)
      .eq('tournament_id', tournament_id)
      .order('created_at', { ascending: true });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ teams: teams || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
