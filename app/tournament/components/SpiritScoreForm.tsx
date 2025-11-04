'use client';

import { useState } from 'react';
import { SPIRIT_CATEGORIES, SpiritCategory } from '../lib/types';

interface SpiritScoreFormProps {
  matchId: string;
  teamId: string;
  scorerProfileId: string;
  teamName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SpiritScoreForm({
  matchId,
  teamId,
  scorerProfileId,
  teamName,
  onSuccess,
  onCancel
}: SpiritScoreFormProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isComplete = Object.keys(scores).length === Object.keys(SPIRIT_CATEGORIES).length;
  const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);
  const avgScore = isComplete ? (totalScore / Object.keys(SPIRIT_CATEGORIES).length).toFixed(1) : '-';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isComplete) {
      setError('Please rate all categories');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/tournament/spirit/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          match_id: matchId,
          team_id: teamId,
          scorer_profile_id: scorerProfileId,
          scores,
          notes
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to submit spirit score');
      }

      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message :
'An unexpected error occurred';
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
maxWidth: 600
}}>
<div style={{ marginBottom: 20 }}>
<h3 style={{
margin: '0 0 8px 0',
fontSize: 18,
fontWeight: 700,
color: '#111827'
}}>
Spirit of the Game Score
</h3>
{teamName && (
<p style={{
margin: 0,
fontSize: 14,
color: '#6b7280'
}}>
Rating for: <strong>{teamName}</strong>
</p>
)}
</div>
<form onSubmit={handleSubmit}>
    {/* Spirit Categories */}
    <div style={{ marginBottom: 20 }}>
      {Object.entries(SPIRIT_CATEGORIES).map(([key, label]) => (
        <div 
          key={key}
          style={{
            marginBottom: 16,
            padding: 16,
            backgroundColor: '#f9fafb',
            borderRadius: 8,
            border: '1px solid #e5e7eb'
          }}
        >
          <label style={{
            display: 'block',
            marginBottom: 8,
            fontSize: 14,
            fontWeight: 600,
            color: '#374151'
          }}>
            {label}
          </label>
          
          <div style={{ 
            display: 'flex', 
            gap: 8,
            alignItems: 'center'
          }}>
            {[0, 1, 2, 3, 4].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setScores({ ...scores, [key]: value })}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: 16,
                  fontWeight: 600,
                  border: '2px solid',
                  borderColor: scores[key] === value ? '#3b82f6' : '#d1d5db',
                  backgroundColor: scores[key] === value ? '#dbeafe' : '#fff',
                  color: scores[key] === value ? '#1e40af' : '#6b7280',
                  borderRadius: 6,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {value}
              </button>
            ))}
          </div>
          
          <div style={{
            marginTop: 6,
            fontSize: 12,
            color: '#6b7280',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>0 = Poor</span>
            <span>4 = Excellent</span>
          </div>
        </div>
      ))}
    </div>

    {/* Average Score Display */}
    {isComplete && (
      <div style={{
        padding: 16,
        backgroundColor: '#dbeafe',
        border: '2px solid #3b82f6',
        borderRadius: 8,
        marginBottom: 16,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: 14, color: '#1e40af', marginBottom: 4 }}>
          Average Spirit Score
        </div>
        <div style={{ 
          fontSize: 32, 
          fontWeight: 700, 
          color: '#1e3a8a' 
        }}>
          {avgScore} / 4.0
        </div>
      </div>
    )}

    {/* Notes */}
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: 'block',
        marginBottom: 6,
        fontSize: 14,
        fontWeight: 600,
        color: '#374151'
      }}>
        Additional Comments (Optional)
      </label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        disabled={loading}
        placeholder="Any additional feedback about the spirit of the game..."
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #d1d5db',
          borderRadius: 6,
          fontSize: 14,
          resize: 'vertical',
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
        disabled={loading || !isComplete}
        style={{
          padding: '10px 20px',
          backgroundColor: loading || !isComplete ? '#9ca3af' : '#3b82f6',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: loading || !isComplete ? 'not-allowed' : 'pointer',
          fontSize: 14,
          fontWeight: 600
        }}
      >
        {loading ? 'Submitting...' : 'Submit Spirit Score'}
      </button>
    </div>
  </form>
</div>
);
}
