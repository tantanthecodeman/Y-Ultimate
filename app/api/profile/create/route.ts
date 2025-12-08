import { NextResponse } from 'next/server';
import {supabase} from '@/lib/supabaseClient';

export async function GET() {
  // Health check
  return NextResponse.json({ ok: true, hint: 'Use POST with application/json to create profile' });
}

export async function POST(req: Request) {
  try {
    // 1) Strict JSON check
    const ct = req.headers.get('content-type') || '';
    if (!ct.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 });
    }

    // 2) Parse body
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // 3) Extract fields - FIXED: Accept both full_name and fullname
    const {
      full_name,
      fullname,
      role = 'player',
      team_id = null,
      jersey_number = null,
      position = null,
      dob = null,
      contact_email = null,
      contact_phone = null,
      notes = null,
    } = body as Record<string, unknown>;

    // Use full_name if provided, otherwise fallback to fullname
    const playerName = full_name || fullname;

    if (typeof playerName !== 'string' || !playerName.trim()) {
      return NextResponse.json({ error: 'full_name is required' }, { status: 400 });
    }

    // 4) Insert - use full_name as the column name
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        full_name: playerName,
        role,
        team_id,
        jersey_number,
        position,
        dob,
        contact_email,
        contact_phone,
        notes,
      }])
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 5) Respond JSON
    return NextResponse.json({ profile: data }, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}