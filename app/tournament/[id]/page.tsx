// app/tournament/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Tournament, Match, Standing, Team } from '../../lib/types';
import MatchCard from '../components/MatchCard';
import StandingsTable from '../components/StandingsTable';
import { NavigationHeader } from '@/lib/ui/components';

type TabType = 'overview' | 'matches' | 'standings' | 'teams';

export default function TournamentDashboard() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const tournRes = await fetch(`/api/tournament/${tournamentId}`);
      const tournData = await tournRes.json();

      if (!tournRes.ok) {
        throw new Error(tournData?.error || 'Failed to load tournament');
      }

      setTournament(tournData.tournament || null);

      const matchRes = await fetch(`/api/tournament/matches?tournament_id=${tournamentId}`);
      const matchData = await matchRes.json();
      setMatches(matchData.matches || []);

      const standRes = await fetch(`/api/tournament/leaderboard?tournament_id=${tournamentId}`);
      const standData = await standRes.json();
      setStandings(standData.standings || []);

      const teamsRes = await fetch(`/api/tournament/teams?tournament_id=${tournamentId}`);
      const teamsData = await teamsRes.json();
      setTeams(teamsData.teams || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateMatches() {
    if (!confirm('Generate matches for this tournament? This will create or overwrite round-robin matches.')) {
      return;
    }

    try {
      const res = await fetch('/api/tournament/generate-matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournament_id: tournamentId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to generate matches');
      }

      alert(`Generated ${data.matches?.length ?? 0} matches!`);
      await loadData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate matches';
      alert('Error: ' + message);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#6b7280', fontSize: 16 }}>Loading tournament...</p>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div style={{ padding: 24 }}>
        <div
          style={{
            padding: 24,
            backgroundColor: '#fee2e2',
            border: '3px solid #000',
            borderRadius: 20,
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#991b1b', fontSize: 16, margin: 0 }}>
            {error || 'Tournament not found'}
          </p>
          <button
            onClick={() => router.push('/tournament')}
            className="btn btn-primary"
            style={{
              marginTop: 16,
              padding: '8px 20px',
              fontSize: 14,
            }}
          >
            BACK TO TOURNAMENTS
          </button>
        </div>
      </div>
    );
  }

  const completedMatches = matches.filter((m) => m.status === 'completed').length;
  const liveMatches = matches.filter((m) => m.status === 'live').length;
  const upcomingMatches = matches.filter((m) => m.status === 'scheduled').length;
  const hasLive = liveMatches > 0;

  const formattedStart = tournament.start_date ? new Date(tournament.start_date).toLocaleDateString() : null;
  const formattedEnd = tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : null;

  return (
    <>
      {/* use the shared NavigationHeader component for consistent header across pages */}
      <NavigationHeader currentPage="tournament" />

      <main style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <div className="container" style={{ maxWidth: 1120, margin: '0 auto', padding: '24px 20px 64px' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ marginBottom: 18 }}>
              <span className="tape-banner" style={{ display: 'inline-block', fontSize: 20 }}>
                Tournament dashboard
              </span>
            </div>

            <h1
              style={{
                fontFamily: '"Bangers", cursive',
                textTransform: 'uppercase',
                fontSize: 'clamp(28px, 4vw, 40px)',
                lineHeight: 1.05,
                margin: 0,
              }}
            >
              {tournament.name}
            </h1>

            <div style={{ width: 80, height: 4, borderRadius: 999, margin: '10px 0 14px', background: 'linear-gradient(90deg,#E63946,#1D4ED8)' }} />

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 13, color: '#6B7280', alignItems: 'center', marginBottom: 12 }}>
              {formattedStart && formattedEnd && <span>Date: {formattedStart} – {formattedEnd}</span>}
              {tournament.location && <span>Location: {tournament.location}</span>}
              <span>Format: Round robin and knockout</span>
              {hasLive && (
                <span style={{ padding: '4px 10px', borderRadius: 999, border: '2px solid #000', fontSize: 11, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em', background: '#fff', color: '#000' }}>
                  Live now
                </span>
              )}
            </div>
          </div>

          {activeTab === 'overview' && (
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, margin: '22px 0 26px' }}>
              <article className="card white" style={{ borderRadius: 20 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', marginBottom: 6 }}>Total teams</div>
                <div style={{ fontFamily: '"Bangers", cursive', fontSize: 26 }}>{teams.length}</div>
              </article>

              <article className="card white" style={{ borderRadius: 20 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', marginBottom: 6 }}>Total matches</div>
                <div style={{ fontFamily: '"Bangers", cursive', fontSize: 26 }}>{matches.length}</div>
              </article>

              <article className="card white" style={{ borderRadius: 20 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', marginBottom: 6 }}>Completed</div>
                <div style={{ fontFamily: '"Bangers", cursive', fontSize: 26 }}>{completedMatches}</div>
              </article>

              <article className="card white" style={{ borderRadius: 20 }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B7280', marginBottom: 6 }}>Live now</div>
                <div style={{ fontFamily: '"Bangers", cursive', fontSize: 26 }}>{liveMatches}</div>
              </article>
            </section>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 20 }}>
            {[
              { key: 'overview' as TabType, label: 'Overview' },
              { key: 'matches' as TabType, label: `Matches (${matches.length})` },
              { key: 'standings' as TabType, label: 'Standings' },
              { key: 'teams' as TabType, label: `Teams (${teams.length})` },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 999,
                    border: '2px solid #000',
                    background: isActive ? '#000' : '#fff',
                    color: isActive ? '#fff' : '#000',
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 6px 0 rgba(0,0,0,0.35)' : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <section className="card flat" style={{ marginBottom: 26, background: '#F9FAFB', borderRadius: 20, border: '3px solid #000', padding: '16px 18px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <h3 style={{ fontFamily: '"Bangers", cursive', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Quick actions</h3>
              <div style={{ flex: 1, height: 2, background: '#000' }} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Link href={`/tournament/${tournamentId}/teams`}>
                <button className="btn btn-accent-blue" style={{ padding: '9px 14px', borderRadius: 12, fontSize: 12 }}>
                  Manage teams
                </button>
              </Link>

              {/* regenerate matches button placed inside Quick Actions (always available when >=2 teams) */}
              {teams.length >= 2 && (
                <button onClick={handleGenerateMatches} className="btn btn-accent-blue" style={{ padding: '9px 14px', borderRadius: 12, fontSize: 12 }}>
                  {matches.length === 0 ? 'Generate matches' : 'Regenerate matches'}
                </button>
              )}

              <Link href={`/tournament/${tournamentId}/players`}>
                <button className="btn btn-accent-blue" style={{ padding: '9px 14px', borderRadius: 12, fontSize: 12 }}>
                  Manage players
                </button>
              </Link>

              <Link href={`/tournament/${tournamentId}/matches`}>
                <button className="btn btn-accent-blue" style={{ padding: '9px 14px', borderRadius: 12, fontSize: 12 }}>
                  Manage matches
                </button>
              </Link>

              <Link href={`/tournament/${tournamentId}/spirit`}>
                <button className="btn btn-accent-red" style={{ padding: '9px 14px', borderRadius: 12, fontSize: 12 }}>
                  Submit spirit scores
                </button>
              </Link>
            </div>
          </section>

          {activeTab === 'overview' && (
            <>
              {matches.length > 0 && (
                <section>
                  <div style={{ fontFamily: '"Bangers", cursive', fontSize: 16, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '10px 0 8px' }}>
                    Recent matches
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
                    {matches.slice(0, 5).map((match) => (
                      <div key={match.id} className="card" style={{ borderRadius: 18, background: '#F9FAFB', border: '3px solid #000', padding: '10px 14px' }}>
                        <MatchCard match={match} />
                      </div>
                    ))}
                  </div>

                  {matches.length > 5 && (
                    <Link href={`/tournament/${tournamentId}/matches`}>
                      <button className="btn btn-secondary" style={{ marginTop: 8, padding: '8px 16px', borderRadius: 999, fontSize: 12 }}>
                        View all matches
                      </button>
                    </Link>
                  )}
                </section>
              )}

              {matches.length === 0 && teams.length < 2 && (
                <section className="empty-state" style={{ marginTop: 16 }}>
                  <div className="empty-state-title">Get started</div>
                  <p className="empty-state-text">Add at least two teams to generate the match schedule.</p>
                  <Link href={`/tournament/${tournamentId}/teams`}>
                    <button className="btn btn-primary">Add teams</button>
                  </Link>
                </section>
              )}
            </>
          )}

          {activeTab === 'matches' && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontFamily: '"Bangers", cursive', fontSize: 24, textTransform: 'uppercase' }}>All matches</h2>
                <Link href={`/tournament/${tournamentId}/matches`}>
                  <button className="btn btn-accent-blue">Manage matches</button>
                </Link>
              </div>

              {matches.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <div className="empty-state-title">No matches yet</div>
                  <p className="empty-state-text">Generate matches or create them manually in the matches view.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'standings' && (
            <section>
              <h2 style={{ margin: '0 0 20px 0', fontFamily: '"Bangers", cursive', fontSize: 24, textTransform: 'uppercase' }}>Tournament standings</h2>
              <StandingsTable standings={standings} showSpirit={true} />
            </section>
          )}

          {activeTab === 'teams' && (
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontFamily: '"Bangers", cursive', fontSize: 24, textTransform: 'uppercase' }}>Registered teams</h2>
                <Link href={`/tournament/${tournamentId}/teams`}>
                  <button className="btn btn-accent-blue">Manage teams</button>
                </Link>
              </div>

              {teams.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <div className="empty-state-title">No teams yet</div>
                  <p className="empty-state-text">Add teams to get your tournament ready to play.</p>
                  <Link href={`/tournament/${tournamentId}/teams`}>
                    <button className="btn btn-primary">Add first team</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                  {teams.map((team) => (
                    <div key={team.id} className="card white" style={{ borderRadius: 20 }}>
                      <h3 style={{ margin: '0 0 12px 0', fontSize: 18, fontWeight: 700, color: '#111827' }}>{team.name}</h3>
                      <div style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
                        {team.captain ? <span>Captain: {team.captain.full_name}</span> : <span>No captain assigned</span>}
                      </div>
                      <Link href={`/tournament/${tournamentId}/teams/${team.id}`}>
                        <button className="btn btn-secondary" style={{ width: '100%' }}>View roster</button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  );
}
