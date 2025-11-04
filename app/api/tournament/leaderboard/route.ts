import { NextResponse } from "next/server";
import {supabase} from "@/lib/supabaseClient";

interface TeamStats {
  teamid: string;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  avgspirit?: number | null;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const tournamentid = url.searchParams.get("tournamentid");

    if (!tournamentid) {
      return NextResponse.json({ error: "Missing tournamentid" }, { status: 400 });
    }

    // Fetch ALL matches (not just completed status, but must have scores)
    const { data: matches, error: matchesErr } = await supabase
      .from("matches")
      .select("id, home_team_id, away_team_id, home_score, away_score, tournament_id")
      .eq("tournament_id", tournamentid)
      .not("home_score", "is", null)
      .not("away_score", "is", null);

    if (matchesErr) {
      return NextResponse.json({ error: matchesErr.message }, { status: 500 });
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({ standings: [] });
    }

    // Fetch spirit scores
    const { data: spiritScores } = await supabase
      .from("spirit_scores")
      .select("teamid, score")
      .in("matchid", matches.map(m => m.id));

    // Calculate spirit averages per team
    const spiritMap: Record<string, { total: number; count: number }> = {};
    (spiritScores || []).forEach((s: { teamid: string; score: number }) => {
      if (!spiritMap[s.teamid]) spiritMap[s.teamid] = { total: 0, count: 0 };
      spiritMap[s.teamid].total += s.score;
      spiritMap[s.teamid].count += 1;
    });

    // Build team stats
    const stats: Record<string, TeamStats> = {};

    for (const m of matches) {
      const home = m.home_team_id;
      const away = m.away_team_id;

      if (!home || !away) continue;

      if (!stats[home]) stats[home] = { teamid: home, played: 0, wins: 0, losses: 0, draws: 0, points: 0 };
      if (!stats[away]) stats[away] = { teamid: away, played: 0, wins: 0, losses: 0, draws: 0, points: 0 };

      stats[home].played += 1;
      stats[away].played += 1;

      const homeScore = m.home_score ?? 0;
      const awayScore = m.away_score ?? 0;

      if (homeScore > awayScore) {
        stats[home].wins += 1;
        stats[home].points += 3;
        stats[away].losses += 1;
      } else if (homeScore < awayScore) {
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

    // Attach spirit averages
    const arr = Object.values(stats);
    arr.forEach((team) => {
      if (spiritMap[team.teamid]) {
        team.avgspirit = spiritMap[team.teamid].total / spiritMap[team.teamid].count;
      } else {
        team.avgspirit = null;
      }
    });

    // Sort by points desc, then spirit desc
    arr.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      return (b.avgspirit || 0) - (a.avgspirit || 0);
    });

    return NextResponse.json({ standings: arr });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
