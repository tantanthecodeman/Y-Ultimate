'use client';
import { useState } from 'react';

export default function CreateTeam({ tournamentId }: { tournamentId: string }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/tournament/team/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournament_id: tournamentId, name })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.error || 'Failed');
      }
      
      setMsg('Team created: ' + data.team.name);
      setName('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setMsg('Error: ' + message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Team name
        <br />
        <input 
          value={name} 
          onChange={e => setName(e.target.value)} 
          required 
        />
      </label>
      <button 
        type="submit" 
        disabled={loading} 
        style={{ marginLeft: 8 }}
      >
        {loading ? '...' : 'Create'}
      </button>
      {msg && <p>{msg}</p>}
    </form>
  );
}