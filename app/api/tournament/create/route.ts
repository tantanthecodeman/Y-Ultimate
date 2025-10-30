import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tournaments')
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ tournament: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
