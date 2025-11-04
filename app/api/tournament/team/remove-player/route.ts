import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { team_player_id } = await req.json();
    
    if (!team_player_id) {
      return NextResponse.json({ error: 'Missing team_player_id' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('team_players')
      .delete()
      .eq('id', team_player_id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Player removed from team successfully',
      deleted_id: team_player_id 
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
