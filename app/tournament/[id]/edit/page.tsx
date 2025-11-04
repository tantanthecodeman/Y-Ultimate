'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tournament } from '../../lib/types';

export default function EditTournamentPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;
  
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTournament();
  }, [tournamentId]);

  async function loadTournament() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tournament/${tournamentId}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to load tournament');
      }

      const t = data.tournament;
      setTournament(t);
      setName(t.name);
      setLocation(t.location || '');
      setStartDate(t.start_date || '');
      setEndDate(t.end_date || '');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load tournament';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/tournament/${tournamentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location: location || null,
          start_date: startDate || null,
          end_date: endDate || null
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to update tournament');
      }

      setSuccessMessage('Tournament updated successfully!');
      setTournament(data.tournament);
      
      setTimeout(() => {
        router.push(`/tournament/${tournamentId}`);
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        Loading tournament...
      </div>
    );
  }

  if (error && !tournament) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{
          padding: 24,
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: 12,
          textAlign: 'center'
        }}>
          <p style={{ color: '#991b1b', fontSize: 16, margin: 0 }}>
            ❌ {error}
          </p>
          <button
            onClick={() => router.push('/tournament')}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link 
          href={`/tournament/${tournamentId}`}
          style={{
            display: 'inline-block',
            marginBottom: 16,
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          ← Back to Tournament
        </Link>
        
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 700,
          margin: '0 0 8px 0',
          color: '#111827'
        }}>
          Edit Tournament
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Update tournament details
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div style={{
          padding: 16,
          backgroundColor: '#d1fae5',
          border: '1px solid #6ee7b7',
          borderRadius: 8,
          marginBottom: 24,
          color: '#065f46',
          fontSize: 14
        }}>
          ✅ {successMessage}
        </div>
      )}

      {/* Edit Form */}
      <div style={{
        padding: 24,
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 14,
              fontWeight: 600,
              color: '#374151'
            }}>
              Tournament Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Ultimate Championship 2025"
              required
              disabled={saving}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                backgroundColor: saving ? '#f3f4f6' : '#fff'
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 14,
              fontWeight: 600,
              color: '#374151'
            }}>
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Bangalore"
              disabled={saving}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                backgroundColor: saving ? '#f3f4f6' : '#fff'
              }}
            />
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 16, 
            marginBottom: 16 
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 600,
                color: '#374151'
              }}>
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                  backgroundColor: saving ? '#f3f4f6' : '#fff'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: 6,
                fontSize: 14,
                fontWeight: 600,
                color: '#374151'
              }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={saving}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                  backgroundColor: saving ? '#f3f4f6' : '#fff'
                }}
              />
            </div>
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
            <Link href={`/tournament/${tournamentId}`}>
              <button
                type="button"
                disabled={saving}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: '10px 20px',
                backgroundColor: saving ? '#9ca3af' : '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}