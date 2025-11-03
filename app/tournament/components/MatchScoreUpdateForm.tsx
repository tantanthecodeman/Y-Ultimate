'use client';

import { useState } from 'react';
import { Match } from '../lib/types';

interface MatchScoreUpdateFormProps {
  match: Match;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function MatchScoreUpdateForm({ 
  match, 
  onSuccess,
  onCancel 
}: MatchScoreUpdateFormProps) {
  const [homeScore, setHomeScore] = useState(match.home_score.toString());
  const [awayScore, setAwayScore] = useState(match.away_score.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    if (isNaN(homeScoreNum) || isNaN(awayScoreNum)) {
      setError('Scores must be valid numbers');
      setLoading(false);
      return;
    }

    if (homeScoreNum < 0 || awayScoreNum < 0) {
      setError('Scores cannot be negative');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/tournament/match/update-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match_id: match.id,
          home_score: homeScoreNum,
          away_score: awayScoreNum,
          status: 'completed'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to update score');
      }

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
      backgroundColor: '#fff',
      maxWidth: 500
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0',
        fontSize: 18,
        fontWeight: 700,
        color: '#111827'
      }}>
        Update Match Score
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Home Team Score */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 600,
            color: '#374151'
          }}>
            {match.home_team?.name || 'Home Team'} Score *
          </label>
          <input
            type="number"
            min="0"
            value={homeScore}
            onChange={(e) => setHomeScore(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
              backgroundColor: loading ? '#f9fafb' : '#fff'
            }}
          />
        </div>

        {/* Away Team Score */}
        <div style={{ marginBottom: 16 }}>
          <label style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 14,
            fontWeight: 600,
            color: '#374151'
          }}>
            {match.away_team?.name || 'Away Team'} Score *
          </label>
          <input
            type="number"
            min="0"
            value={awayScore}
            onChange={(e) => setAwayScore(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: 6,
              fontSize: 16,
              fontWeight: 600,
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
              backgroundColor: loading ? '#9ca3af' : '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {loading ? 'Updating...' : 'Update Score'}
          </button>
        </div>
      </form>
    </div>
  );
}
