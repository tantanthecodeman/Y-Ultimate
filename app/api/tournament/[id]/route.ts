import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/* ---------- helpers (type-safe, no `any`) ---------- */

const isString = (v: unknown): v is string => typeof v === 'string' && v.length > 0;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object';

const isUuid = (s?: string): boolean =>
  typeof s === 'string' &&
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);

function extractIdFromPath(pathname: string): string | undefined {
  const parts = pathname.split('/').filter(Boolean);
  for (let i = parts.length - 1; i >= 0; i--) {
    if (isUuid(parts[i])) return parts[i];
  }
  return undefined;
}

function getIdFromParams(params: unknown): string | undefined {
  if (!isRecord(params)) return undefined;
  const maybeId = params['id'];
  return isString(maybeId) ? maybeId : undefined;
}

/* ---------- unified id extractor (tries multiple sources) ---------- */

async function getIdFromRequest(req: Request, params: unknown): Promise<string | undefined> {
  // 1) try params object (App Router should populate this)
  const fromParams = getIdFromParams(params);
  if (fromParams) return fromParams;

  // 2) try req.nextUrl (some runtimes expose nextUrl)
  // Use unknown-safe access
  const reqAny = req as unknown;
  if (isRecord(reqAny) && isRecord((reqAny as Record<string, unknown>).nextUrl)) {
    const nextUrl = (reqAny as Record<string, unknown>).nextUrl as Record<string, unknown>;
    if (isString(nextUrl.pathname)) {
      const id = extractIdFromPath(nextUrl.pathname);
      if (id) return id;
    }
  }

  // 3) fallback: parse req.url directly
  try {
    const url = new URL(req.url);
    const id = extractIdFromPath(url.pathname);
    if (id) return id;
  } catch (e) {
    // ignore parse errors
  }

  // 4) check common forwarded headers
  const forwarded = req.headers.get('x-forwarded-url') ?? req.headers.get('x-original-url');
  if (isString(forwarded)) {
    try {
      const fUrl = new URL(forwarded);
      const id = extractIdFromPath(fUrl.pathname);
      if (id) return id;
    } catch (e) {
      // ignore
    }
  }

  return undefined;
}

/* ---------- API handlers ---------- */

// GET
export async function GET(
  req: Request,
  ctx: { params?: unknown } | undefined
) {
  try {
    const params = ctx?.params;
    console.log('GET /api/tournament request URL:', req.url);
    console.log('GET /api/tournament incoming params:', params);

    const id = await getIdFromRequest(req, params);
    if (!id) {
      return NextResponse.json({ error: 'Missing route parameter: id' }, { status: 400 });
    }
    if (!isUuid(id)) {
      return NextResponse.json({ error: `Invalid tournament id: ${id}` }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // Supabase error objects can be descriptive
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

// PUT
export async function PUT(
  req: Request,
  ctx: { params?: unknown } | undefined
) {
  try {
    const params = ctx?.params;
    console.log('PUT /api/tournament request URL:', req.url);
    console.log('PUT /api/tournament incoming params:', params);

    const id = await getIdFromRequest(req, params);
    if (!id) {
      return NextResponse.json({ error: 'Missing route parameter: id' }, { status: 400 });
    }
    if (!isUuid(id)) {
      return NextResponse.json({ error: `Invalid tournament id: ${id}` }, { status: 400 });
    }

    // Parse body (unknown) and validate fields individually
    const rawBody: unknown = await req.json().catch(() => undefined);
    if (!isRecord(rawBody)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // pick allowed fields and validate types
    const updateData: Record<string, unknown> = {};

    if ('name' in rawBody) {
      const val = rawBody['name'];
      if (!isString(val)) return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
      updateData.name = val;
    }

    if ('start_date' in rawBody) {
      const val = rawBody['start_date'];
      // accept string iso or null
      if (val === null) updateData.start_date = null;
      else if (isString(val)) updateData.start_date = val;
      else return NextResponse.json({ error: 'Invalid start_date' }, { status: 400 });
    }

    if ('end_date' in rawBody) {
      const val = rawBody['end_date'];
      if (val === null) updateData.end_date = null;
      else if (isString(val)) updateData.end_date = val;
      else return NextResponse.json({ error: 'Invalid end_date' }, { status: 400 });
    }

    if ('location' in rawBody) {
      const val = rawBody['location'];
      if (val === null) updateData.location = null;
      else if (isString(val)) updateData.location = val;
      else return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
    }

    if ('config' in rawBody) {
      // config can be object or null — accept as-is if object
      const val = rawBody['config'];
      if (val === null) updateData.config = null;
      else if (isRecord(val)) updateData.config = val;
      else return NextResponse.json({ error: 'Invalid config' }, { status: 400 });
    }

    // ensure we have at least one field to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('tournaments')
      .update(updateData)
      .eq('id', id)
      .select()
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

// DELETE
export async function DELETE(
  req: Request,
  ctx: { params?: unknown } | undefined
) {
  try {
    const params = ctx?.params;
    console.log('DELETE /api/tournament request URL:', req.url);
    console.log('DELETE /api/tournament incoming params:', params);

    const id = await getIdFromRequest(req, params);
    if (!id) {
      return NextResponse.json({ error: 'Missing route parameter: id' }, { status: 400 });
    }
    if (!isUuid(id)) {
      return NextResponse.json({ error: `Invalid tournament id: ${id}` }, { status: 400 });
    }

    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message ?? 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Tournament deleted successfully', deleted_id: id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


