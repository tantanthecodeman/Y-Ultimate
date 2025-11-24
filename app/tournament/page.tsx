// app/tournament/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { NavigationHeader, TapeBanner, Card, Button, PageHeader, Modal } from '@/lib/ui/components';
import { Tournament } from './lib/types';

export default function TournamentPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    start_date: '',
    end_date: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadTournaments();
  }, []);

  async function loadTournaments() {
    try {
      setLoading(true);
      const res = await fetch('/api/tournament/list');
      const data = await res.json();
      setTournaments(data.tournaments || []);
    } catch (err) {
      console.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTournament(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch('/api/tournament/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setShowModal(false);
        setFormData({ name: '', location: '', start_date: '', end_date: '' });
        loadTournaments();
      } else {
        alert('Failed to create tournament');
      }
    } catch (err) {
      console.error('Failed to create tournament');
      alert('Failed to create tournament');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '64px', background: '#FFF' }}>
      <NavigationHeader currentPage="tournament" />

      <div className="container">
        <div style={{ marginBottom: '32px' }}>
          <TapeBanner color="blue">LEAGUE MODE</TapeBanner>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '48px',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <h1 style={{
              fontFamily: 'Bangers, cursive',
              fontSize: 'clamp(32px, 6vw, 56px)',
              margin: '0 0 8px 0',
              textTransform: 'uppercase'
            }}>
              TOURNAMENTS
            </h1>
            <p style={{
              color: '#6B7280',
              fontSize: '15px',
              margin: 0
            }}>
              Create, manage, and dominate the leaderboard
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            style={{ minWidth: '200px' }}
          >
            + NEW TOURNAMENT
          </Button>
        </div>

        {/* Create Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Tournament"
        >
          <form onSubmit={handleCreateTournament}>
            <div className="mb-3">
              <label>Tournament Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Summer Championship 2025"
                disabled={submitting}
              />
            </div>
            <div className="mb-3">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Bangalore"
                disabled={submitting}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="mb-3">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  disabled={submitting}
                />
              </div>
              <div className="mb-3">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  disabled={submitting}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button 
                type="button" 
                variant="secondary" 
                className="flex-1"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                CANCEL
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                className="flex-1"
                disabled={submitting}
              >
                {submitting ? 'CREATING...' : 'CREATE TOURNAMENT'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Tournament List */}
        {loading ? (
          <div className="loading">LOADING TOURNAMENTS...</div>
        ) : tournaments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏆</div>
            <div className="empty-state-title">NO TOURNAMENTS YET</div>
            <p className="empty-state-text">Time to start your first tournament!</p>
            <Button variant="primary" onClick={() => setShowModal(true)}>
              CREATE TOURNAMENT
            </Button>
          </div>
        ) : (
          <div className="grid grid-3">
            {tournaments.map((tournament) => (
              <Link 
                key={tournament.id} 
                href={`/tournament/${tournament.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card
                  sticker={{
                    label: tournament.start_date 
                      ? new Date(tournament.start_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                      : 'TBD',
                    color: 'blue'
                  }}
                >
                  <h3 className="mb-2" style={{
                    fontFamily: 'Bangers, cursive',
                    fontSize: '24px'
                  }}>
                    {tournament.name}
                  </h3>
                  {tournament.location && (
                    <p className="mb-2" style={{ fontSize: '14px' }}>
                      📍 {tournament.location}
                    </p>
                  )}
                  <p className="mb-4 text-subtle" style={{ fontSize: '13px' }}>
                    {tournament.start_date && tournament.end_date
                      ? `${new Date(tournament.start_date).toLocaleDateString('en-IN')} - ${new Date(tournament.end_date).toLocaleDateString('en-IN')}`
                      : 'Dates TBD'}
                  </p>
                  <Button variant="primary" className="w-full">
                    MANAGE →
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}