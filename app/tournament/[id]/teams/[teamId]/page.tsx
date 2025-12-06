// app/tournament/[id]/teams/[teamId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Team, Standing } from '../../../lib/types';
import TeamRosterList from '../../../components/TeamRosterList';
import AddPlayerToTeamForm from '../../../components/AddPlayerToTeamForm';
import { NavigationHeader } from '@/lib/ui/components';

export default function TeamRosterDetailPage() {
  const params = useParams();
  const tournamentId = params.id as string;
  const teamId = params.teamId as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [standing, setStanding] = useState<Standing | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  useEffect(() => {
    loadTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  async function loadTeam() {
    try {
      setLoading(true);
      setError(null);

      // Team list endpoint & find the requested team
      const res = await fetch(`/api/tournament/teams?tournament_id=${tournamentId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || 'Failed to load team');
        setTeam(null);
      } else {
        const found = (data.teams || []).find((t: Team) => t.id === teamId);
        if (!found) {
          setError('Team not found');
          setTeam(null);
        } else {
          setTeam(found);
        }
      }

      // Load standings (optional)
      const sres = await fetch(`/api/tournament/leaderboard?tournament_id=${tournamentId}`);
      const sdata = await sres.json();
      if (sres.ok && Array.isArray(sdata.standings)) {
        const list: Standing[] = sdata.standings;
        const idx = list.findIndex((s) => s.team_id === teamId);
        if (idx >= 0) {
          setStanding(list[idx]);
          setRank(idx + 1);
        } else {
          setStanding(null);
          setRank(null);
        }
      } else {
        setStanding(null);
        setRank(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load team';
      setError(msg);
      setTeam(null);
    } finally {
      setLoading(false);
    }
  }

  function handlePlayerAdded() {
    setShowAddForm(false);
    // TeamRosterList will re-fetch itself if implemented that way
  }

  if (loading) {
    return (
      <>
        <NavigationHeader currentPage="tournament" />
        <div style={{ padding: 24, textAlign: 'center' }}>Loading team…</div>
      </>
    );
  }

  if (error || !team) {
    return (
      <>
        <NavigationHeader currentPage="tournament" />
        <div style={{ padding: 24 }}>
          <div style={{ padding: 24, backgroundColor: '#fee2e2', border: '3px solid #000', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ color: '#991b1b', margin: 0 }}>{error || 'Team not found'}</p>
            <div style={{ marginTop: 12 }}>
              <Link
                href={`/tournament/${tournamentId}/teams`}
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  borderRadius: 10,
                  background: '#3b82f6',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 900
                }}
              >
                Back to teams
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Derived values
  const playersCount = team.players?.length ?? 0;
  const wins = standing?.wins ?? 0;
  const losses = standing?.losses ?? 0;
  const draws = standing?.draws ?? 0;
  const points = standing?.points ?? 0;
  const totalPlayed = Math.max(1, wins + draws + losses);
  const winPct = Math.round((wins / totalPlayed) * 100);

  return (
    <>
      <NavigationHeader currentPage="tournament" />

      <main style={{ minHeight: '100vh', background: '#fff' }}>
        <div className="container" style={{ maxWidth: 1120, margin: '0 auto', padding: '14px 20px 48px' }}>
          {/* Back row (tight to header) */}
          <div style={{ width: '100%', marginBottom: 18 }}>
            <Link
              href={`/tournament/${tournamentId}/teams`}
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                textDecoration: 'none',
                color: '#1e40af',
                fontWeight: 700,
                fontSize: 16
              }}
            >
              ← Back to teams
            </Link>
          </div>

          {/* tape banner - uses the same visual style as other pages */}
          <div style={{ marginBottom: 18 }}>
            <div className="tape-banner card-jiggle" aria-hidden>
              Team
            </div>
          </div>

          {/* Team card (a bit more polished to match site) */}
          <div
            className="card-jiggle team-card"
            style={{
              borderRadius: 20,
              border: '3px solid #000',
              padding: '18px 22px',
              background: '#F9FAFB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              boxShadow: '0 10px 0 rgba(0,0,0,0.06)',
              marginBottom: 25,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 260 }}>
              <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Team
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{
                  fontFamily: '"Bangers", cursive',
                  fontSize: 32,
                  letterSpacing: '0.02em',
                  color: '#0F1724',
                  textTransform: 'uppercase',
                }}>
                  {team.name}
                </div>

                {/* small accent bar under the team name (site motif) */}
                <div style={{ width: 84, height: 6, borderRadius: 999, background: '#fff', boxShadow: 'inset 0 -6px 0 rgba(230,57,70,0.85)' }}>
                  <div style={{ width: 54, height: '100%', borderRadius: 999, background: '#1D4ED8' }} />
                </div>
              </div>
            </div>

            {/* right cluster: players & compact visual progress */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{
                width: 78,
                height: 78,
                borderRadius: 12,
                border: '3px solid #000',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 0 rgba(0,0,0,0.18)',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1D4ED8' }}>{playersCount}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Players</div>
              </div>

              <div style={{ minWidth: 260 }}>
                {/* Label row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>Performance</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0F1724' }}>{winPct}% wins</div>
                </div>

                {/* progress bar */}
                <div style={{ height: 12, borderRadius: 6, background: '#f3f4f6', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${Math.min(100, winPct)}%`,
                      height: '100%',
                      borderRadius: 6,
                      background: '#10b981',
                      boxShadow: '0 4px 0 rgba(0,0,0,0.06)',
                      transition: 'width 260ms ease',
                    }}
                  />
                </div>

                {/* small numeric summary (kept compact) */}
                <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 12, color: '#6b7280', alignItems: 'center' }}>
                  <div><strong style={{ color: '#10b981' }}>{wins}</strong> W</div>
                  <div><strong style={{ color: '#ef4444' }}>{losses}</strong> L</div>
                  <div><strong>{draws}</strong> D</div>
                  <div style={{ marginLeft: 'auto', background: '#eef2ff', padding: '4px 8px', borderRadius: 999, fontWeight: 700, color: '#1e40af' }}>
                    {points} pts{rank ? ` • #${rank}` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 22 }}>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: '3px solid #000',
                background: '#1D4ED8',
                color: '#fff',
                boxShadow: '0 6px 0 rgba(0,0,0,0.35)',
                fontWeight: 800,
              }}
            >
              {showAddForm ? 'Cancel' : '+ Add Player'}
            </button>

            <Link
              href={`/tournament/${tournamentId}/teams`}
              style={{
                padding: '10px 16px',
                borderRadius: 12,
                border: '3px dashed #000',
                textDecoration: 'none',
                color: '#111827',
                fontWeight: 700,
                background: '#fff',
              }}
            >
              View all teams
            </Link>
          </div>

          {/* Add Player */}
          {showAddForm && (
            <div style={{ marginBottom: 32 }}>
              <AddPlayerToTeamForm teamId={teamId} onSuccess={handlePlayerAdded} onCancel={() => setShowAddForm(false)} />
            </div>
          )}

          {/* Roster — let TeamRosterList render its own heading (avoid double heading) */}
          <div>
            <TeamRosterList teamId={teamId} teamName={team.name} editable={true} />
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes jiggle {
          0% { transform: translateY(0) rotate(-0.6deg); }
          30% { transform: translateY(-4px) rotate(-1.2deg); }
          60% { transform: translateY(-2px) rotate(-0.4deg); }
          100% { transform: translateY(0) rotate(-0.6deg); }
        }

        .card-jiggle:hover {
          animation: jiggle 360ms ease;
        }

        /* tape-banner style consistent with other pages */
        .tape-banner {
          display: inline-block;
          background: #ef4444;
          color: #fff;
          padding: 8px 18px;
          border: 3px solid #000;
          transform: rotate(-2deg);
          font-family: "Bangers", cursive;
          font-size: 14px;
          box-shadow: 0 6px 0 rgba(0,0,0,0.35);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .tape-banner.card-jiggle:hover {
          animation: jiggle 420ms ease;
        }

        @media (max-width: 640px) {
          .team-card { padding: 12px; }
        }
      `}</style>
    </>
  );
}
