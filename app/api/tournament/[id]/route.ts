import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET: Fetch tournament details by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }
    
    return NextResponse.json({ tournament: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT: Update tournament details
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, start_date, end_date, location, config } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      name,
      start_date: start_date || null,
      end_date: end_date || null,
      location: location || null,
    };

    // Only include config if it's provided
    if (config !== undefined) {
      updateData.config = config;
    }

    const { data, error } = await supabase
      .from('tournaments')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!data) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }
    
    return NextResponse.json({ tournament: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Delete tournament (cascades to teams, matches, etc.)
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: 'Tournament deleted successfully',
      deleted_id: params.id 
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
