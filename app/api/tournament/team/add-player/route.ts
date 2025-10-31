import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClients';

export async function POST(req: Request) {
  try {
    const { team_id, profile_id, jersey_number, is_captain } = await req.json();
    
    if (!team_id || !profile_id) {
      return NextResponse.json({ error: 'Missing team_id or profile_id' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('team_players')
      .insert([{ team_id, profile_id, jersey_number, is_captain }])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ team_player: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}