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
  onCancel 
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
          name 
        })
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
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 24,
      backgroundColor: '#fff'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0',
        fontSize: 18,
        fontWeight: 700,
        color: '#111827'
      }}>
        Register New Team
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 600,
            color: '#374151'
          }}>
            Team Name *
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
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 14,
              backgroundColor: loading ? '#f9fafb' : '#fff'
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: 12,
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 14,
            color: '#991b1b'
          }}>
            ❌ {error}
          </div>
        )}

        <div style={{ 
          display: 'flex', 
          gap: 12,
          justifyContent: 'flex-end'
        }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  );
}
