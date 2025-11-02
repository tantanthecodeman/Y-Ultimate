'use client';

import { useState } from 'react';

export default function TournamentHome() {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdTournamentId, setCreatedTournamentId] = useState<string | null>(null);

  async function createTournament(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setCreatedTournamentId(null);

    try {
      const res = await fetch('/api/tournament/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed');
      }

      setMsg('✅ Created: ' + data?.tournament?.name);
      setCreatedTournamentId(data?.tournament?.id);
      setName('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setMsg('❌ Error: ' + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Tournament Management</h2>
      <p>Create a tournament to get started.</p>

      <form onSubmit={createTournament} style={{ marginTop: 16 }}>
        <label>
          Tournament Name
          <br />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Summer Ultimate Championship 2025"
            style={{ width: 320, padding: 8, marginTop: 6 }}
            required
          />
        </label>
        <br />
        <button 
          type="submit" 
          style={{ marginTop: 12, padding: '8px 12px' }} 
          disabled={loading}
        >
          {loading ? 'Creating…' : 'Create Tournament'}
        </button>
      </form>

      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

      {createdTournamentId && (
        <div style={{ 
          marginTop: 20, 
          padding: 16, 
          border: '1px solid #ccc', 
          borderRadius: 8,
          backgroundColor: '#f0f9ff'
        }}>
          <h3>Tournament Created Successfully! 🎉</h3>
          <p><strong>Tournament ID:</strong> <code>{createdTournamentId}</code></p>
          <p style={{ fontSize: 14, color: '#666' }}>
            Copy this ID to use in Postman for creating teams, generating matches, etc.
          </p>
        </div>
      )}
    </main>
  );
}