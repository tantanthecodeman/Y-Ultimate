// app/tournament/[id]/teams/[teamId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Team, Standing } from '../../../lib/types';
import AddPlayerToTeamForm from '../../../components/AddPlayerToTeamForm';
import { NavigationHeader } from '@/lib/ui/components';

export default function TeamRosterDetailPage() {
  const params = useParams();
  const tournamentId = params.id as string;
  const teamId = params.teamId as string;

  const [team, setTeam] = useState<Team | null>(null);
  const [standing, setStanding] = useState<Standing | null>(null);
  const [rank, setRank] = useState<number | null>(null);

  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeam();
    loadPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  async function loadTeam() {
    try {
      setLoading(true);
      setError(null);

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

  async function loadPlayers() {
    try {
      setLoadingPlayers(true);
      const res = await fetch(`/api/tournament/team/players?team_id=${teamId}`);
      const data = await res.json();
      if (res.ok) {
        setPlayers(data.players || []);
      } else {
        setPlayers([]);
      }
    } catch {
      setPlayers([]);
    } finally {
      setLoadingPlayers(false);
    }
  }

  function handlePlayerAdded() {
    setShowAddForm(false);
    loadPlayers();
  }

  if (loading && !team) {
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
          <div
            style={{
              padding: 24,
              backgroundColor: '#fee2e2',
              border: '3px solid #000',
              borderRadius: 12,
              textAlign: 'center',
            }}
          >
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
                  fontWeight: 900,
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

  const playersCount = players.length;
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
        <div
          className="container"
          style={{ maxWidth: 1120, margin: '0 auto', padding: '14px 20px 48px' }}
        >
          {/* Back row */}
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
                fontSize: 16,
              }}
            >
              ← Back to teams
            </Link>
          </div>

          {/* Tape banner */}
          <div style={{ marginBottom: 18 }}>
            <div className="tape-banner card-jiggle" aria-hidden>
              Team
            </div>
          </div>

          {/* Team card */}
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
              <div
                style={{
                  fontSize: 12,
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Team
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div
                  style={{
                    fontFamily: '"Bangers", cursive',
                    fontSize: 32,
                    letterSpacing: '0.02em',
                    color: '#0F1724',
                    textTransform: 'uppercase',
                  }}
                >
                  {team.name}
                </div>

                {/* blue/red bar under team name */}
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                    alignItems: 'center',
                    marginTop: 4,
                  }}
                >
                  <div
                    style={{
                      width: 60,
                      height: 4,
                      borderRadius: 999,
                      background: '#1D4ED8',
                    }}
                  />
                  <div
                    style={{
                      width: 30,
                      height: 4,
                      borderRadius: 999,
                      background: '#E63946',
                    }}
                  />
                </div>

                {team.captain && (
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 13,
                      color: '#4b5563',
                      fontWeight: 600,
                    }}
                  >
                    Captain: {team.captain.full_name}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div
                style={{
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
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1D4ED8' }}>
                  {playersCount}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Players</div>
              </div>

              <div style={{ minWidth: 260 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: '#6b7280',
                      fontWeight: 700,
                    }}
                  >
                    Performance
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#0F1724',
                    }}
                  >
                    {winPct}% wins
                  </div>
                </div>

                <div
                  style={{
                    height: 12,
                    borderRadius: 6,
                    background: '#f3f4f6',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                  }}
                >
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

                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    marginTop: 10,
                    fontSize: 12,
                    color: '#6b7280',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <strong style={{ color: '#10b981' }}>{wins}</strong> W
                  </div>
                  <div>
                    <strong style={{ color: '#ef4444' }}>{losses}</strong> L
                  </div>
                  <div>
                    <strong>{draws}</strong> D
                  </div>
                  <div
                    style={{
                      marginLeft: 'auto',
                      background: '#eef2ff',
                      padding: '4px 8px',
                      borderRadius: 999,
                      fontWeight: 700,
                      color: '#1e40af',
                    }}
                  >
                    {points} pts{rank ? ` • #${rank}` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* actions */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginBottom: 22,
            }}
          >
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

          {/* Add Player Form */}
          {showAddForm && (
            <div style={{ marginBottom: 32 }}>
              <AddPlayerToTeamForm
                teamId={teamId}
                onSuccess={handlePlayerAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          )}

          {/* Roster */}
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                fontFamily: '"Bangers", cursive',
                textTransform: 'uppercase',
                fontSize: 26,
                marginBottom: 14,
                letterSpacing: '.03em',
                display: 'inline-block',
                padding: '8px 18px',
                border: '3px solid #000',
                background: '#1D4ED8',
                color: '#fff',
                transform: 'rotate(-2deg)',
                boxShadow: '0 6px 0 rgba(0,0,0,0.35)',
              }}
            >
              {team.name} roster
            </div>

            {loadingPlayers ? (
              <div style={{ marginTop: 16, color: '#6b7280' }}>Loading players…</div>
            ) : players.length ? (
              <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
                {players.map((player) => (
                  <PlayerCard
                    key={player.id}
                    rawPlayer={player}
                    tournamentId={tournamentId}
                    teamId={teamId}
                    onChanged={loadPlayers}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  marginTop: 12,
                  padding: 20,
                  borderRadius: 12,
                  border: '3px dashed #000',
                  background: '#fbfcfd',
                  color: '#6b7280',
                }}
              >
                No players added yet. Use <strong>Add Player</strong> above to start building the
                roster.
              </div>
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes jiggle {
          0% {
            transform: translateY(0) rotate(-0.6deg);
          }
          30% {
            transform: translateY(-4px) rotate(-1.2deg);
          }
          60% {
            transform: translateY(-2px) rotate(-0.4deg);
          }
          100% {
            transform: translateY(0) rotate(-0.6deg);
          }
        }

        .card-jiggle:hover {
          animation: jiggle 360ms ease;
        }

        .tape-banner {
          display: inline-block;
          background: #ef4444;
          color: #fff;
          padding: 8px 18px;
          border: 3px solid #000;
          transform: rotate(-2deg);
          font-family: 'Bangers', cursive;
          font-size: 14px;
          box-shadow: 0 6px 0 rgba(0, 0, 0, 0.35);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .tape-banner.card-jiggle:hover {
          animation: jiggle 420ms ease;
        }

        @keyframes playerJiggle {
          0% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-4px);
          }
          60% {
            transform: translateY(-2px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .player-card-jiggle:hover {
          animation: playerJiggle 360ms ease;
          box-shadow: 0 8px 0 rgba(0, 0, 0, 0.25);
        }

        @media (max-width: 640px) {
          .team-card {
            flex-direction: column;
            align-items: flex-start;
            padding: 12px;
          }
        }
      `}</style>
    </>
  );
}

/* ================== PLAYER CARD ================== */

function PlayerCard({
  rawPlayer,
  tournamentId,
  teamId,
  onChanged,
}: {
  rawPlayer: any;
  tournamentId: string;
  teamId: string;
  onChanged?: () => void;
}) {
  const profile =
    rawPlayer.profile ||
    rawPlayer.profiles ||
    rawPlayer.player ||
    rawPlayer.user ||
    null;

  const name =
    rawPlayer.full_name ||
    rawPlayer.fullname ||
    rawPlayer.name ||
    profile?.full_name ||
    profile?.fullname ||
    'Unnamed player';

  const position = rawPlayer.position ?? profile?.position ?? '';
  const jersey =
    rawPlayer.jersey_number ??
    rawPlayer.jerseyNumber ??
    profile?.jersey_number ??
    null;

  const isCaptain =
    rawPlayer.is_captain ??
    rawPlayer.isCaptain ??
    profile?.is_captain ??
    false;

  const playerId = rawPlayer.id ?? profile?.id;

  const [open, setOpen] = useState(false);
  const [stats, setStats] = useState<any | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [removing, setRemoving] = useState(false);

  async function toggleStats() {
    const willOpen = !open;
    setOpen(willOpen);

    if (!willOpen || stats || loadingStats || !playerId) return;

    setLoadingStats(true);
    try {
      const res = await fetch(
        `/api/tournament/player-stats?player_id=${playerId}&tournament_id=${tournamentId}`,
      );
      const data = await res.json();
      if (res.ok) {
        setStats(data || {});
      } else {
        setStats(null);
      }
    } catch {
      setStats(null);
    } finally {
      setLoadingStats(false);
    }
  }

  async function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (!playerId) return;
    if (!confirm(`Remove ${name} from this team?`)) return;

    try {
      setRemoving(true);
      const res = await fetch('/api/tournament/team/remove-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: teamId,
          profile_id: playerId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || 'Failed to remove player');
      } else if (onChanged) {
        onChanged();
      }
    } catch {
      alert('Failed to remove player');
    } finally {
      setRemoving(false);
    }
  }

  const totalGoals = stats?.total_goals ?? 0;
  const totalAssists = stats?.total_assists ?? 0;
  const totalBlocks = stats?.total_blocks ?? 0;
  const matchesArray: any[] = Array.isArray(stats?.matches) ? stats.matches : [];

  return (
    <div
      className="player-card-jiggle"
      style={{
        border: '3px solid #000',
        borderRadius: 14,
        background: '#FFFFFF',
        padding: '10px 14px',
        boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
        maxWidth: 900,
      }}
    >
      {/* main row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
        }}
      >
        {/* left: name + chips */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: '"Bangers", cursive',
              fontSize: 20,
              textTransform: 'uppercase',
              letterSpacing: '.02em',
              color: '#0F1724',
            }}
          >
            {name}
          </div>

          <div style={{ marginTop: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
            {isCaptain && (
              <span
                style={{
                  padding: '2px 8px',
                  background: '#FEF3C7',
                  border: '2px solid #000',
                  borderRadius: 8,
                  fontWeight: 700,
                  fontSize: 11,
                }}
              >
                Captain
              </span>
            )}

            {position && (
              <span
                style={{
                  padding: '2px 8px',
                  background: '#DBEAFE',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#1D4ED8',
                }}
              >
                {position}
              </span>
            )}
          </div>
        </div>

        {/* right: jersey + remove */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            alignItems: 'flex-end',
            minWidth: 130,
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {jersey != null && jersey !== '' && (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: '3px solid #000',
                  background: '#111827',
                  color: '#fff',
                  fontFamily: '"Bangers", cursive',
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {jersey}
              </div>
            )}

            <button
              type="button"
              onClick={handleRemove}
              disabled={removing}
              style={{
                padding: '6px 12px',
                borderRadius: 10,
                border: '3px solid #000',
                background: '#F3F4F6',
                fontSize: 12,
                fontWeight: 700,
                cursor: removing ? 'not-allowed' : 'pointer',
              }}
            >
              {removing ? 'Removing…' : 'Remove'}
            </button>
          </div>
        </div>
      </div>

      {/* view performance button under content */}
      <div
        style={{
          marginTop: 8,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button
          type="button"
          onClick={toggleStats}
          style={{
            padding: '6px 14px',
            borderRadius: 999,
            border: '3px solid #000',
            background: open ? '#E63946' : '#1D4ED8',
            color: '#fff',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            boxShadow: '0 3px 0 rgba(0,0,0,0.35)',
            cursor: 'pointer',
          }}
        >
          {open ? 'Hide performance' : 'View performance'}
        </button>
      </div>

      {/* Stats panel – clean & rectangular, no rotation */}
      {open && (
        <div
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            border: '2px solid #e5e7eb',
            background: '#F9FAFB',
          }}
        >
          {loadingStats ? (
            <div style={{ fontSize: 12, color: '#4b5563', fontWeight: 600 }}>
              Loading stats…
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  marginBottom: 8,
                  fontSize: 12,
                }}
              >
                <SimpleStat label="Goals" value={totalGoals} />
                <SimpleStat label="Assists" value={totalAssists} />
                <SimpleStat label="Blocks" value={totalBlocks} />
              </div>

              {matchesArray.length > 0 ? (
                <div style={{ display: 'grid', gap: 6 }}>
                  {matchesArray.map((m) => (
                    <div
                      key={m.match_id ?? m.id}
                      style={{
                        borderRadius: 8,
                        border: '1px solid #d1d5db',
                        background: '#fff',
                        padding: 8,
                        fontSize: 12,
                      }}
                    >
                      <div style={{ fontWeight: 700, marginBottom: 2 }}>
                        {m.opponent || m.opponent_name || 'Opponent'}
                      </div>
                      <div style={{ color: '#6b7280', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <span>Goals: {m.goals ?? 0}</span>
                        <span>Assists: {m.assists ?? 0}</span>
                        <span>Blocks: {m.blocks ?? 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 12, color: '#4b5563' }}>
                  No per-match stats recorded yet.
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SimpleStat({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        flex: 1,
        borderRadius: 8,
        border: '1px solid #d1d5db',
        background: '#fff',
        padding: 6,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: '#6b7280',
          textTransform: 'uppercase',
          letterSpacing: '.06em',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"Bangers", cursive',
          fontSize: 16,
        }}
      >
        {value}
      </div>
    </div>
  );
}
