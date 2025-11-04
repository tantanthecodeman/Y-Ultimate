'use client';

import { useEffect, useState } from 'react';
import {supabase} from '@/lib/supabaseClient';

interface Standing {
  team_id: string;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  avg_spirit?: number | null;
}

interface TeamData {
  id: string;
  name: string;
}

export default function Leaderboard({ tournamentId }: { tournamentId?: string }) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [teams, setTeams] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Do not call API until tournamentId is defined
    if (!tournamentId) {
      setError('Tournament ID not ready');
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Call API with both param names for safety
        const res = await fetch(`/api/tournament/leaderboard?tournamentid=${tournamentId}`);
        const json = await res.json();

        if (!res.ok) {
          setError(json.error || 'Failed to load leaderboard');
          setStandings([]);
          return;
        }

        const rows: Standing[] = json.standings || [];
        setStandings(rows);

        if (rows.length > 0) {
          const teamIds = rows.map((s) => s.team_id);
          const { data: teamsData, error: teamsErr } = await supabase
            .from('teams')
            .select('id, name')
            .in('id', teamIds);

          if (!teamsErr && teamsData) {
            const map: Record<string, string> = {};
            teamsData.forEach((t: TeamData) => { map[t.id] = t.name; });
            setTeams(map);
          }
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Unknown error');
        setStandings([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [tournamentId]);

  if (!tournamentId) {
    return <div style={{ padding: 24, color: '#ef4444' }}>Tournament ID is not available yet.</div>;
  }

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading leaderboard...</div>;
  }

  if (error) {
    return <div style={{ padding: 24, color: '#ef4444' }}>Error: {error}</div>;
  }

  if (standings.length === 0) {
    return <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af' }}>No standings data available yet.</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Leaderboard</h3>
      <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, width: 60 }}>Rank</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700 }}>Team</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, width: 60 }}>P</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, width: 60 }}>W</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, width: 60 }}>D</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, width: 60 }}>L</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, width: 80, backgroundColor: '#fef3c7' }}>Points</th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, width: 80, backgroundColor: '#dbeafe' }}>Spirit</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((s, i) => (
              <tr key={s.team_id} style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: i < 3 ? '#f0fdf4' : '#fff' }}>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700 }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                  {teams[s.team_id] || s.team_id}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{s.played}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>{s.wins}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>{s.draws}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>{s.losses}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 700, backgroundColor: '#fef9c3' }}>{s.points}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', color: '#1e40af', fontWeight: 600, backgroundColor: '#eff6ff' }}>
                  {s.avg_spirit != null ? s.avg_spirit.toFixed(1) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
