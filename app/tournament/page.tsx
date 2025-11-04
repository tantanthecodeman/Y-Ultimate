'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tournament } from './lib/types';
import TournamentCard from './components/TournamentCard';

export default function TournamentHome() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadTournaments();
  }, []);

  async function loadTournaments() {
    try {
      setLoading(true);
      const res = await fetch('/api/tournament/list');
      const data = await res.json();
      
      if (res.ok) {
        setTournaments(data.tournaments || []);
      }
    } catch (err: unknown) {
      console.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTournament(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/tournament/create', {
        method: 'POST',
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
        throw new Error(data?.error || 'Failed to create tournament');
      }

      setSuccessMessage(`Tournament "${data.tournament.name}" created successfully!`);
      setName('');
      setLocation('');
      setStartDate('');
      setEndDate('');
      setShowCreateForm(false);
      
      // Reload tournaments
      loadTournaments();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteTournament(id: string) {
    try {
      const res = await fetch(`/api/tournament/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to delete tournament');
      }

      setSuccessMessage('Tournament deleted successfully');
      loadTournaments();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete tournament';
      alert('Error: ' + message);
    }
  }

  return (
    <main style={{ 
      padding: 24, 
      maxWidth: 1200, 
      margin: '0 auto' 
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 700,
            margin: '0 0 8px 0',
            color: '#111827'
          }}>
            Tournament Management
          </h1>
          <p style={{ 
            margin: 0,
            color: '#6b7280',
            fontSize: 16
          }}>
            Create and manage Ultimate Frisbee tournaments
          </p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {showCreateForm ? 'Cancel' : '+ Create Tournament'}
        </button>
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

      {/* Create Tournament Form */}
      {showCreateForm && (
        <div style={{ 
          border: '1px solid #e5e7eb', 
          borderRadius: 12, 
          padding: 24, 
          marginBottom: 32,
          backgroundColor: '#f9fafb'
        }}>
          <h2 style={{ 
            marginBottom: 20,
            fontSize: 20,
            fontWeight: 700,
            color: '#111827'
          }}>
            Create New Tournament
          </h2>

          <form onSubmit={handleCreateTournament}>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer Ultimate Championship 2025"
                required
                disabled={creating}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                  backgroundColor: creating ? '#f3f4f6' : '#fff'
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Bangalore"
                disabled={creating}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  fontSize: 14,
                  backgroundColor: creating ? '#f3f4f6' : '#fff'
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
                  disabled={creating}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14,
                    backgroundColor: creating ? '#f3f4f6' : '#fff'
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
                  disabled={creating}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14,
                    backgroundColor: creating ? '#f3f4f6' : '#fff'
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

            <button 
              type="submit" 
              disabled={creating}
              style={{
                padding: '12px 24px',
                backgroundColor: creating ? '#9ca3af' : '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: creating ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              {creating ? 'Creating...' : 'Create Tournament'}
            </button>
          </form>
        </div>
      )}

      {/* Tournaments List */}
      <div>
        <h2 style={{ 
          marginBottom: 20,
          fontSize: 24,
          fontWeight: 700,
          color: '#111827'
        }}>
          All Tournaments
        </h2>

        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 60,
            color: '#6b7280' 
          }}>
            Loading tournaments...
          </div>
        ) : tournaments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 60,
            border: '2px dashed #d1d5db',
            borderRadius: 12,
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
            <p style={{ fontSize: 16, margin: 0 }}>
              No tournaments created yet. Click &quot;Create Tournament&quot; to get started!
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))'
          }}>
            {tournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                showActions={true}
                onEdit={(id) => window.location.href = `/tournament/${id}/edit`}
                onDelete={handleDeleteTournament}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
