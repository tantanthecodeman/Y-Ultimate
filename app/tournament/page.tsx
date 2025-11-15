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
    <main>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1>TOURNAMENTS</h1>
            <p>Create events, manage teams, track standings</p>
          </div>
          
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary"
          >
            {showCreateForm ? 'Cancel' : 'Create Tournament'}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {showCreateForm && (
        <div className="card mb-4">
          <h3 className="mb-3">NEW TOURNAMENT</h3>

          <form onSubmit={handleCreateTournament}>
            <div className="mb-3">
              <label>Tournament Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Summer Championship 2025"
                required
                disabled={creating}
              />
            </div>

            <div className="mb-3">
              <label>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Bangalore"
                disabled={creating}
              />
            </div>

            <div className="grid-2 mb-3">
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={creating}
                />
              </div>
              
              <div>
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={creating}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-error mb-3">{error}</div>
            )}

            <button 
              type="submit" 
              disabled={creating}
              className="btn btn-secondary"
            >
              {creating ? 'Creating...' : 'Create Tournament'}
            </button>
          </form>
        </div>
      )}

      <div>
        {loading ? (
          <div className="loading">Loading tournaments...</div>
        ) : tournaments.length === 0 ? (
          <div className="empty-state">
            <h3>NO TOURNAMENTS YET</h3>
            <p>Create your first tournament to get started</p>
            <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
              Create Tournament
            </button>
          </div>
        ) : (
          <div className="grid-auto">
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
