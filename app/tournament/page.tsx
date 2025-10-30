'use client';

import { useState } from 'react';

export default function TournamentHome() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createTournament(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/tournament/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      setMsg('Created: ' + data?.tournament?.name);
      setName('');
    } catch (err: any) {
      setMsg('Error: ' + (err.message || 'Unknown'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Tournament area</h2>
      <p>Work only in <code>app/tournament</code>. Minimal form to create a tournament (demo).</p>

      <form onSubmit={createTournament} style={{ marginTop: 16 }}>
        <label>
          Tournament name
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Demo Cup"
            style={{ width: 320, padding: 8, marginTop: 6 }}
            required
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: 12, padding: '8px 12px' }} disabled={loading}>
          {loading ? 'Creating…' : 'Create Tournament'}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </main>
  );
}
