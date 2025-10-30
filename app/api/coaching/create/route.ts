import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClients';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { child_name, notes } = body;
    if (!child_name) {
      return NextResponse.json({ error: 'Missing child_name' }, { status: 400 });
    }

    // Create a child record (basic)
    const { data: child, error: childErr } = await supabase
      .from('children')
      .insert([{ name: child_name }])
      .select()
      .single();

    if (childErr) {
      return NextResponse.json({ error: childErr.message }, { status: 500 });
    }

    const { data: session, error: sessionErr } = await supabase
      .from('coaching_sessions')
      .insert([{ child_id: child.id, notes, coach_profile_id: null }])
      .select()
      .single();

    if (sessionErr) {
      return NextResponse.json({ error: sessionErr.message }, { status: 500 });
    }

    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
