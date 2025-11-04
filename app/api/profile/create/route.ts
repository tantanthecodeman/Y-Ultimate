import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  try {
    const { full_name, role, email, phone } = await req.json();
    
    if (!full_name) {
      return NextResponse.json({ error: 'Missing full_name' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['player', 'coach', 'td', 'volunteer', 'guardian'];
    const profileRole = role && validRoles.includes(role) ? role : 'player';

    // Generate a UUID for the profile
    // In production, this would come from auth.users
    const profileId = crypto.randomUUID();

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ 
        id: profileId,
        full_name,
        role: profileRole
      }])
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
