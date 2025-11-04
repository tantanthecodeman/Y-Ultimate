import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const tokenHeader = req.headers.get('authorization') || '';
    const token = tokenHeader.replace('Bearer ', '').trim();

    if (!token) {
      return NextResponse.json({ error: 'Missing access token' }, { status: 401 });
    }

    // Validate and get user from token
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const { full_name, role } = await req.json();
    if (!full_name) {
      return NextResponse.json({ error: 'Missing full_name' }, { status: 400 });
    }

    const validRoles = ['player', 'coach', 'td', 'volunteer', 'guardian'];
    const profileRole = role && validRoles.includes(role) ? role : 'player';

    // Use the authenticated user's id (not a random UUID)
    const profileId = userData.user.id;

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: profileId, full_name, role: profileRole }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
