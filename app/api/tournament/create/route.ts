import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { name, start_date, end_date, location } = await req.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Missing tournament name' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('tournaments')
      .insert([{ name, start_date, end_date, location }])
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ tournament: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}