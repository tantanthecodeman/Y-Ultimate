
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { match_id, team_id, scorer_profile_id, scores, notes } = await req.json();
    
    if (!match_id || !team_id || !scorer_profile_id || !scores) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const values = Object.values(scores) as number[];
    const sum = values.reduce((total, value) => total + Number(value), 0);
    const average = sum / values.length;
    
    const { data, error } = await supabase
      .from('spirit_scores')
      .insert([{ 
        match_id, 
        team_id, 
        scorer_profile_id, 
        score: Math.round(average), 
        notes, 
        scores 
      }])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ spirit: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}