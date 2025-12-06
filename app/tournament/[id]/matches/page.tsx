
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Match } from '../../lib/types';
import MatchCard from '../../components/MatchCard';
import MatchScoreUpdateForm from '../../components/MatchScoreUpdateForm';

export default function MatchesManagementPage() {
  const params = useParams();
  const tournamentId = params.id as string;
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'live' | 'completed'>('all');

  useEffect(() => {
    loadMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  async function loadMatches() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tournament/matches?tournament_id=${tournamentId}`);
      const data = await res.json();
      
      if (res.ok) {
        setMatches(data.matches || []);
      }
    } catch (err: unknown) {
      console.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  }

  function handleUpdateScore(matchId: string) {
    const match = matches.find((m) => m.id === matchId);
    if (match) {
      setSelectedMatch(match);
    }
  }

  function handleScoreUpdated() {
    setSelectedMatch(null);
    loadMatches();
  }

  const filteredMatches = matches.filter((m) => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  if (loading) {
    return (
      <>
        {/* Header */}
        <header
          style={{
            borderBottom: '3px solid #000',
            padding: '14px 0',
            background: '#ffffff',
          }}
        >
          <div
            style={{
              maxWidth: 1120,
              margin: '0 auto',
              padding: '0 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg,#E63946,#1D4ED8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-6deg)',
                  border: '2px solid #000',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                }}
              >
                <span
                  style={{
                    fontFamily: '"Bangers", cursive',
                    color: '#fff',
                    fontSize: 22,
                  }}
                >
                  Y
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontFamily: '"Bangers", cursive',
                    fontSize: 22,
                    letterSpacing: 0.5,
                    lineHeight: 1,
                  }}
                >
                  Y-ULTIMATE
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#6B7280',
                    marginTop: 2,
                  }}
                >
                  Tournament &amp; Coaching portal
                </div>
              </div>
            </div>

            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: 13,
              }}
            >
              <Link
                href="/tournament"
                style={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: '#0F1724',
                  position: 'relative',
                }}
              >
                Tournament
              </Link>
              <Link
                href="/coaching"
                style={{
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: '#0F1724',
                  position: 'relative',
                }}
              >
                Coaching
              </Link>
            </nav>
          </div>
        </header>

        <main
          style={{
            minHeight: '100vh',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <p style={{ color: '#6B7280', fontSize: 16 }}>Loading matches...</p>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <header
        style={{
          borderBottom: '3px solid #000',
          padding: '14px 0',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            maxWidth: 1120,
            margin: '0 auto',
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg,#E63946,#1D4ED8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'rotate(-6deg)',
                border: '2px solid #000',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              }}
            >
              <span
                style={{
                  fontFamily: '"Bangers", cursive',
                  color: '#fff',
                  fontSize: 22,
                }}
              >
                Y
              </span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: '"Bangers", cursive',
                  fontSize: 22,
                  letterSpacing: 0.5,
                  lineHeight: 1,
                }}
              >
                Y-ULTIMATE
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#6B7280',
                  marginTop: 2,
                }}
              >
                Tournament &amp; Coaching portal
              </div>
            </div>
          </div>

          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 13,
            }}
          >
            <Link
              href="/tournament"
              style={{
                fontWeight: 600,
                textDecoration: 'none',
                color: '#0F1724',
                position: 'relative',
              }}
            >
              Tournament
            </Link>
            <Link
              href="/coaching"
              style={{
                fontWeight: 600,
                textDecoration: 'none',
                color: '#0F1724',
                position: 'relative',
              }}
            >
              Coaching
            </Link>
          </nav>
        </div>
      </header>

      <main style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <div
          className="container"
          style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 20px 64px' }}
        >
          {/* Header / title block */}
          <Link
            href={`/tournament/${tournamentId}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: '#6B7280',
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Back to tournament
          </Link>

          <div
            style={{
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  marginBottom: 10,
                }}
              >
                <span
                  className="tape-banner"
                  style={{
                    display: 'inline-block',
                  }}
                >
                  Match management
                </span>
              </div>

              <h1
                style={{
                  fontFamily: '"Bangers", cursive',
                  fontSize: 'clamp(26px, 4vw, 36px)',
                  margin: 0,
                  textTransform: 'uppercase',
                  lineHeight: 1.1,
                }}
              >
                Matches overview
              </h1>
              <div
                style={{
                  width: 80,
                  height: 4,
                  borderRadius: 999,
                  margin: '8px 0 8px',
                  background: 'linear-gradient(90deg,#E63946,#1D4ED8)',
                }}
              />
              <p
                style={{
                  margin: 0,
                  color: '#6B7280',
                  fontSize: 14,
                }}
              >
                {matches.length} total matches across all rounds.
              </p>
            </div>
          </div>

          {/* Filters */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: 24,
              overflowX: 'auto',
            }}
          >
            {[
              { key: 'all' as const, label: 'All', count: matches.length },
              {
                key: 'scheduled' as const,
                label: 'Scheduled',
                count: matches.filter((m) => m.status === 'scheduled').length,
              },
              {
                key: 'live' as const,
                label: 'Live',
                count: matches.filter((m) => m.status === 'live').length,
              },
              {
                key: 'completed' as const,
                label: 'Completed',
                count: matches.filter((m) => m.status === 'completed').length,
              },
            ].map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 999,
                    border: '2px solid #000',
                    background: active ? '#000' : '#fff',
                    color: active ? '#fff' : '#000',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: active ? '0 6px 0 rgba(0,0,0,0.35)' : 'none',
                  }}
                >
                  {f.label} ({f.count})
                </button>
              );
            })}
          </div>

          {/* Modal for Score Update */}
          {selectedMatch && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 24,
              }}
            >
              <div
                style={{
                  maxWidth: 600,
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                }}
              >
                <MatchScoreUpdateForm
                  match={selectedMatch}
                  onSuccess={handleScoreUpdated}
                  onCancel={() => setSelectedMatch(null)}
                />
              </div>
            </div>
          )}

          {/* Matches List */}
          {filteredMatches.length === 0 ? (
            <div
              className="empty-state"
              style={{
                padding: 40,
              }}
            >
              <div className="empty-state-title">
                {filter === 'all' ? 'No matches yet' : `No ${filter} matches`}
              </div>
              <p className="empty-state-text">
                {filter === 'all'
                  ? 'Schedule matches to see them here.'
                  : 'Try switching filters or updating match status.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {filteredMatches.map((match) => (
                <div
                  key={match.id}
                  className="card white"
                  style={{
                    borderRadius: 18,
                  }}
                >
                  <MatchCard
                    match={match}
                    showActions={true}
                    onUpdateScore={handleUpdateScore}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
