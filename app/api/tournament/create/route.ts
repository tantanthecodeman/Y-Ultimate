import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, start_date, end_date, location } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tournaments')
      .insert([{ 
        name, 
        start_date: start_date || null, 
        end_date: end_date || null, 
        location: location || null 
      }])
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