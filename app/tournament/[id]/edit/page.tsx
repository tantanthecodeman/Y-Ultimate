'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { NavigationHeader, TapeBanner, Card, Button } from '@/lib/ui/components';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  async function loadTournament() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tournament/${tournamentId}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to load tournament');
      }

      const t = data.tournament as Tournament;
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
          end_date: endDate || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to update tournament');
      }

      setSuccessMessage('Tournament updated successfully');
      setTournament(data.tournament as Tournament);
      
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
      <>
        <NavigationHeader currentPage="tournament" />
        <div className="loading">LOADING TOURNAMENT...</div>
      </>
    );
  }

  if (error && !tournament) {
    return (
      <>
        <NavigationHeader currentPage="tournament" />
        <div className="container" style={{ paddingTop: '48px', maxWidth: '800px' }}>
          <div className="alert alert-error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
          <Button onClick={() => router.push('/tournament')} variant="primary">
            BACK TO TOURNAMENTS
          </Button>
        </div>
      </>
    );
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: '64px', background: '#FFF' }}>
      <NavigationHeader currentPage="tournament" />

      <div className="container" style={{ maxWidth: '880px', paddingTop: '32px' }}>
        {/* Back link */}
        <Link
          href={`/tournament/${tournamentId}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginBottom: '12px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#6B7280',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          BACK TO TOURNAMENT
        </Link>

        {/* Tape banner + title block */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <TapeBanner color="red">TOURNAMENT SETTINGS</TapeBanner>
          </div>

          <h1
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: 'clamp(28px, 5vw, 40px)',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              margin: '0 0 6px 0',
            }}
          >
            EDIT TOURNAMENT
          </h1>

          {tournament && (
            <>
              <div
                style={{
                  width: '80px',
                  height: '4px',
                  borderRadius: '999px',
                  background:
                    'linear-gradient(90deg, #E63946, #1D4ED8)',
                  margin: '8px 0 10px',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '14px',
                  fontSize: '13px',
                  color: '#6B7280',
                  alignItems: 'center',
                  marginBottom: '4px',
                }}
              >
                <span>
                  Editing:{' '}
                  <span style={{ fontWeight: 600, color: '#0F1724' }}>
                    {tournament.name}
                  </span>
                </span>
                {tournament.location && (
                  <span>
                    Location: <span>{tournament.location}</span>
                  </span>
                )}
                {(tournament.start_date || tournament.end_date) && (
                  <span>
                    Dates:{' '}
                    <span>
                      {tournament.start_date || '—'}{' '}
                      {tournament.end_date ? `– ${tournament.end_date}` : ''}
                    </span>
                  </span>
                )}
              </div>
            </>
          )}

          
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="alert alert-success" style={{ marginBottom: '16px' }}>
            {successMessage}
          </div>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Form card */}
        <Card white rotation={false}>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Tournament Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Summer Ultimate Championship 2025"
                required
                disabled={saving}
              />
            </div>

            <div className="mb-3">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Bangalore"
                disabled={saving}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px',
              }}
            >
              <div>
                <label>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div>
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <Link href={`/tournament/${tournamentId}`}>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={saving}
                >
                  CANCEL
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
