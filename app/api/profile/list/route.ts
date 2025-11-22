import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const role = url.searchParams.get('role');
    const search = url.searchParams.get('search');
    
    let query = supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .order('full_name', { ascending: true });
    
    // Filter by role if provided
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }
    
    // Search by name if provided
    if (search) {
      query = query.ilike('full_name', `%${search}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ profiles: data || [] });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
