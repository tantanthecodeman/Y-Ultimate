import { NextResponse } from 'next/server';
import {supabase} from '@/lib/supabaseClient';

// Simple type guards
function isString(v: unknown): v is string {
  return typeof v === 'string';
}
function isRecord(v: unknown): v is Record<string, unknown> {
  return v !== null && typeof v === 'object';
}

async function getIdFromParams(paramsPromise: unknown): Promise<string | undefined> {
  // In Next 15, params is a Promise in route handlers
  let params: unknown = paramsPromise;
  try {
    // If it's thenable, await it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (params && typeof (params as any).then === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params = await (params as any);
    }
  } catch {
    // ignore
  }
  if (!isRecord(params)) return undefined;
  const maybeId = (params as Record<string, unknown>)['id'];
  return isString(maybeId) ? maybeId : undefined;
}

async function getIdFromRequest(req: Request, paramsPromise: unknown): Promise<string | undefined> {
  // Prefer path param
  const idFromParams = await getIdFromParams(paramsPromise);
  if (idFromParams) return idFromParams;

  // Fallback: query string ?id=...
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  return id ?? undefined;
}

export async function GET(req: Request, ctx?: { params?: unknown }) {
  try {
    console.log('GET /api/tournament request URL:', req.url);

    // NEVER log ctx.params directly without awaiting; it can be a Promise
    const id = await getIdFromRequest(req, ctx?.params);
    if (!id) {
      return NextResponse.json({ error: 'Missing route parameter id' }, { status: 400 });
    }

    // Validate id format (UUID optional based on your schema)
    // If your DB expects UUIDs, keep a UUID check; else remove this block.
    // const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    // if (!uuidRegex.test(id)) {
    //   return NextResponse.json({ error: `Invalid tournament id: ${id}` }, { status: 400 });
    // }

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message ?? 'Database error' }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
    }

    return NextResponse.json({ tournament: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: Request, ctx?: { params?: unknown }) {
  try {
    const id = await getIdFromRequest(req, ctx?.params);
    if (!id) {
      return NextResponse.json({ error: 'Missing route parameter id' }, { status: 400 });
    }
    const body = await req.json();
    const { data, error } = await supabase
      .from('tournaments')
      .update(body)
      .eq('id', id)
      .select('*')
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tournament: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
