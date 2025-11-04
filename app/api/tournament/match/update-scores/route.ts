import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const isString = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object';
const isUuid = (s: string) =>
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);

export async function POST(req: Request) {
  try {
    const rawBody: unknown = await req.json().catch(() => undefined);
    if (!isRecord(rawBody)) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const maybeMatchId = rawBody['match_id'];
    const maybeHome = rawBody['home_score'];
    const maybeAway = rawBody['away_score'];
    const maybeStatus = rawBody['status'];

    if (!isString(maybeMatchId) || !isUuid(maybeMatchId)) {
      return NextResponse.json({ error: 'Missing or invalid match_id (must be UUID)' }, { status: 400 });
    }
    const match_id = maybeMatchId;

    const home_score_num = Number(maybeHome);
    const away_score_num = Number(maybeAway);
    if (!Number.isFinite(home_score_num) || !Number.isFinite(away_score_num)) {
      return NextResponse.json({ error: 'home_score and away_score must be numbers' }, { status: 400 });
    }
    if (!Number.isInteger(home_score_num) || !Number.isInteger(away_score_num)) {
      return NextResponse.json({ error: 'home_score and away_score must be integers' }, { status: 400 });
    }
    if (home_score_num < 0 || away_score_num < 0) {
      return NextResponse.json({ error: 'Scores must be non-negative' }, { status: 400 });
    }

    const status = isString(maybeStatus) && maybeStatus.length > 0 ? maybeStatus : 'completed';

    const updateData: Record<string, unknown> = {
      home_score: home_score_num,
      away_score: away_score_num,
      status,
    };

    // Use maybeSingle to avoid forcing a single-row coercion error.
    const { data, error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', match_id)
      .select(`
        id,
        tournament_id,
        home_team_id,
        away_team_id,
        start_time,
        status,
        home_score,
        away_score,
        field,
        home_team:teams!matches_home_team_id_fkey(id, name),
        away_team:teams!matches_away_team_id_fkey(id, name)
      `)
      .maybeSingle();

    if (error) {
      // If the error is about coercion, include hint for debugging
      if (error.message?.includes('coerce')) {
        console.error('Coercion error from Supabase select — try removing relationship selects to debug.');
      }
      return NextResponse.json({ error: error.message ?? 'Database error' }, { status: 500 });
    }

    // If data is null => no rows updated
    if (!data) {
      // As a defensive fallback, try a plain select to inspect what exists
      const { data: inspect, error: inspectErr } = await supabase
        .from('matches')
        .select('id, tournament_id')
        .eq('id', match_id);

      if (inspectErr) {
        console.error('Inspect error:', inspectErr);
      } else {
        console.log('Inspect result for match id:', inspect);
      }

      return NextResponse.json({ error: 'Match not found' }, { status: 404 });
    }

    return NextResponse.json({ match: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
