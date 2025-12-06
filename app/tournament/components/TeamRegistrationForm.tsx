'use client';

import { useState } from 'react';

interface TeamRegistrationFormProps {
  tournamentId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function TeamRegistrationForm({
  tournamentId,
  onSuccess,
  onCancel,
}: TeamRegistrationFormProps) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/tournament/team/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tournament_id: tournamentId,
          name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to create team');
      }

      setName('');
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card white" style={{ borderRadius: 20, padding: 24, border: '3px solid #000' }}>
      {/* Heading */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'inline-block', marginBottom: 8 }}>
          <span
            className="tape-banner"
            style={{ display: 'inline-block', fontSize: 16, padding: '6px 14px', textTransform: 'uppercase' }}
          >
            Register new team
          </span>
        </div>

        <h3
          style={{
            margin: 5,
            fontFamily: '"Bangers", cursive',
            fontSize: 24,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Team details
        </h3>

        <p style={{ margin: 0, color: '#6B7280', fontSize: 14}}>
          Add a team to this tournament.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 20,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Team name 
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Flying Dragons"
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '3px solid #000',
              borderRadius: 12,
              fontSize: 16,
              backgroundColor: loading ? '#f9fafb' : '#fff',
              boxShadow: '0 6px 0 rgba(0,0,0,0.06)',
            }}
          />
        </div>

        {error && (
          <div
            className="alert alert-error"
            style={{ marginBottom: 16 }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="btn btn-secondary"
              style={{ padding: '10px 20px', borderRadius: 12 }}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              opacity: loading ? 0.8 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creating...' : 'Create team'}
          </button>
        </div>
      </form>
    </div>
  );
}
