'use client';
import { useEffect, useState } from 'react';

interface TeamStanding {
  team_id: string;
  played: number;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  avg_spirit?: number | null;
}

export default function Leaderboard({ tournamentId }: { tournamentId: string }) {
  const [data, setData] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/tournament/leaderboard?tournament_id=' + tournamentId);
        const json = await res.json();

        if (res.ok) {
          setData(json.standings || []);
        } else {
          setError(json.error || 'Failed to load leaderboard');
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [tournamentId]);

  return (
    <div>
      <h3>Leaderboard</h3>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>Team</th>
              <th>Played</th>
              <th>Points</th>
              <th>Avg Spirit</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.team_id}>
                <td>{r.team_id}</td>
                <td>{r.played}</td>
                <td>{r.points}</td>
                <td>{r.avg_spirit ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}