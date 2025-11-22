// app/tournament/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TapeBanner, Card, Button, PageHeader, Modal } from '@/lib/ui/components';
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
      }
    } catch (err) {
      console.error('Failed to create tournament');
    }
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '64px' }}>
      {/* Header */}
      <header style={{ borderBottom: '3px solid #000', padding: '24px 0', marginBottom: '48px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <TapeBanner color="blue">LEAGUE MODE</TapeBanner>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              + NEW TOURNAMENT
            </Button>
          </div>
        </div>
      </header>

      <div className="container">
        <PageHeader
          title="Tournaments"
          subtitle="Create, manage, and dominate the leaderboard"
        />

        {/* Create Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create Tournament"
        >
          <form onSubmit={handleCreateTournament}>
            <div className="mb-3">
              <label>Tournament Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Summer Championship"
              />
            </div>
            <div className="mb-3">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Bangalore"
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="mb-3">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              CREATE
            </Button>
          </form>
        </Modal>

        {/* Tournament List */}
        {loading ? (
          <div className="loading">LOADING...</div>
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
              <Link key={tournament.id} href={`/tournament/${tournament.id}`}>
                <Card
                  sticker={{
                    label: `${tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : 'TBD'}`,
                  }}
                >
                  <h3 className="mb-2">{tournament.name}</h3>
                  {tournament.location && (
                    <p className="mb-2">📍 {tournament.location}</p>
                  )}
                  <p className="mb-4 text-subtle">
                    {tournament.start_date && tournament.end_date
                      ? `${new Date(tournament.start_date).toLocaleDateString()} - ${new Date(tournament.end_date).toLocaleDateString()}`
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