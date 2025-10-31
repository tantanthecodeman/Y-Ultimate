'use client';
import { useState } from 'react';

export default function AddPlayer({ teamId }: { teamId: string }) {
  const [profileId, setProfileId] = useState('');
  const [jersey, setJersey] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/tournament/team/add-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          team_id: teamId, 
          profile_id: profileId, 
          jersey_number: jersey 
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setMsg('Error: ' + data?.error);
      } else {
        setMsg('Player added: ' + data.team_player.id);
        setProfileId('');
        setJersey('');
      }
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
        Profile ID
        <br />
        <input 
          value={profileId} 
          onChange={e => setProfileId(e.target.value)} 
          required 
          disabled={loading}
        />
      </label>
      <br />
      <label>
        Jersey
        <br />
        <input 
          value={jersey} 
          onChange={e => setJersey(e.target.value)} 
          disabled={loading}
        />
      </label>
      <br />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add player'}
      </button>
      {msg && <p>{msg}</p>}
    </form>
  );
}