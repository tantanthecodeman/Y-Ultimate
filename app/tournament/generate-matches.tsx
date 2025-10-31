'use client';
import { useState } from 'react';

export default function GenerateMatches({ tournamentId }: { tournamentId: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/tournament/generate-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournament_id: tournamentId })
      });
      const data = await res.json();

      if (!res.ok) {
        setMsg('Error: ' + (data?.error || 'Failed'));
      } else {
        setMsg('Matches generated: ' + (data.matches?.length ?? 0));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setMsg('Error: ' + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={run} disabled={loading}>
        {loading ? 'Generating…' : 'Generate Matches'}
      </button>
      {msg && <p>{msg}</p>}
    </div>
  );
}