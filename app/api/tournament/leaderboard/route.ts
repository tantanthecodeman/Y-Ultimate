import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabaseClient";

interface Standing {
  team_id: string;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  avg_spirit?: number | null;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tournamentid =
      url.searchParams.get("tournamentid") ||
      url.searchParams.get("tournament_id");

    if (!tournamentid) {
      return NextResponse.json({ error: "Missing tournament id" }, { status: 400 });
    }

    // 1) Fetch matches for tournament
    const { data: matches, error: matchesErr } = await supabase
      .from("matches")
      .select("id, home_team_id, away_team_id, home_score, away_score, tournament_id")
      .eq("tournament_id", tournamentid);

    if (matchesErr) {
      return NextResponse.json({ error: matchesErr.message }, { status: 500 });
    }

    // Only scored matches
    const scored = (matches || []).filter(
      (m) => m.home_score !== null && m.away_score !== null
    );
    if (scored.length === 0) {
      return NextResponse.json({ standings: [] });
    }

    // 2) Compute base standings
    const stats: Record<string, Standing> = {};
    for (const m of scored) {
      const home = m.home_team_id;
      const away = m.away_team_id;
      const hs = m.home_score ?? 0;
      const as = m.away_score ?? 0;
      if (!home || !away) continue;

      if (!stats[home]) stats[home] = { team_id: home, played: 0, wins: 0, losses: 0, draws: 0, points: 0 };
      if (!stats[away]) stats[away] = { team_id: away, played: 0, wins: 0, losses: 0, draws: 0, points: 0 };

      stats[home].played += 1;
      stats[away].played += 1;

      if (hs > as) {
        stats[home].wins += 1; stats[home].points += 3; stats[away].losses += 1;
      } else if (hs < as) {
        stats[away].wins += 1; stats[away].points += 3; stats[home].losses += 1;
      } else {
        stats[home].draws += 1; stats[away].draws += 1; stats[home].points += 1; stats[away].points += 1;
      }
    }

    const standings = Object.values(stats);

    // 3) Join spirit scores -> compute avg_spirit per team
    // Table/columns assumed: spirit_scores(teamid, score, matchid)
    const { data: spiritRows, error: spiritErr } = await supabase
      .from("spirit_scores")
      .select("teamid, score, matchid")
      .in("matchid", scored.map((m) => m.id));

    if (spiritErr) {
      // Do not fail standings; just return without spirit
      return NextResponse.json({ standings: standings.sort((a, b) => b.points - a.points) });
    }

    const spiritAgg: Record<string, { total: number; count: number }> = {};
    (spiritRows || []).forEach((r) => {
      if (!spiritAgg[r.teamid]) spiritAgg[r.teamid] = { total: 0, count: 0 };
      spiritAgg[r.teamid].total += Number(r.score) || 0;
      spiritAgg[r.teamid].count += 1;
    });

    standings.forEach((row) => {
      const agg = spiritAgg[row.team_id];
      row.avg_spirit = agg ? agg.total / agg.count : null;
    });

    // 4) Sort by points, then avg_spirit
    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const ba = b.avg_spirit ?? 0;
      const aa = a.avg_spirit ?? 0;
      return ba - aa;
    });

    return NextResponse.json({ standings });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
