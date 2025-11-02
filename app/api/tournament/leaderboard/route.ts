import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

interface TeamStats {
  team_id: string;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  avg_spirit?: number | null;
}

interface SpiritData {
  team_id: string;
  avg_spirit: number;
}

/**
 * Returns a simple standings list for a tournament:
 * { team_id, played, wins, losses, draws, points, avg_spirit }
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tournament_id = url.searchParams.get('tournament_id');
    
    if (!tournament_id) {
      return NextResponse.json({ error: 'Missing tournament_id' }, { status: 400 });
    }
    
    // Fetch matches
    const { data: matches, error: matchesErr } = await supabase
      .from('matches')
      .select('id,home_team_id,away_team_id,home_score,away_score,tournament_id')
      .eq('tournament_id', tournament_id);
    
    if (matchesErr) {
      return NextResponse.json({ error: matchesErr.message }, { status: 500 });
    }
    
    // Fetch spirit averages per team
    let spirits = null;
    try {
      const { data } = await supabase
      .rpc('team_spirit_average', { t_id: tournament_id });
      spirits = data;
    } catch {
      spirits = null;
    }
    
    // Build simple map of team stats
    const stats: Record<string, TeamStats> = {};
    
    for (const m of matches || []) {
      const home = m.home_team_id;
      const away = m.away_team_id;
      
      if (!stats[home]) {
        stats[home] = { team_id: home, played: 0, wins: 0, losses: 0, draws: 0, points: 0 };
      }
      if (!stats[away]) {
        stats[away] = { team_id: away, played: 0, wins: 0, losses: 0, draws: 0, points: 0 };
      }
      
      // skip BYE matches (null team)
      if (!home || !away) continue;
      
      stats[home].played += 1;
      stats[away].played += 1;
      
      if (m.home_score == null || m.away_score == null) continue; // not finished
      
      if (m.home_score > m.away_score) {
        stats[home].wins += 1;
        stats[home].points += 3;
        stats[away].losses += 1;
      } else if (m.home_score < m.away_score) {
        stats[away].wins += 1;
        stats[away].points += 3;
        stats[home].losses += 1;
      } else {
        stats[home].draws += 1;
        stats[away].draws += 1;
        stats[home].points += 1;
        stats[away].points += 1;
      }
    }
    
    // Convert map to array and attach spirit if available
    const arr = Object.values(stats);
    
    // attach spirit average if RPC provided data
    if (spirits && Array.isArray(spirits)) {
      const spiritMap: Record<string, number> = {};
      (spirits as SpiritData[]).forEach((s) => {
        spiritMap[s.team_id] = s.avg_spirit;
      });
      arr.forEach((a) => {
        a.avg_spirit = spiritMap[a.team_id] ?? null;
      });
    }
    
    // sort by points desc, then goal diff (not computed), then spirit
    arr.sort((a, b) => (b.points - a.points) || ((b.avg_spirit || 0) - (a.avg_spirit || 0)));
    
    return NextResponse.json({ standings: arr });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}