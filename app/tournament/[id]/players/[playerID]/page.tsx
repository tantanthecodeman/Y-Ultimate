/* eslint-disable @typescript-eslint/no-explicit-any */
// app/tournament/[id]/players/[playerId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { NavigationHeader } from '@/lib/ui/components';
import type { Profile } from '../../../lib/types';

type PlayerStats = {
  total_wins: number;
  total_losses: number;
  total_matches: number;
  best_score: number;
  current_streak: number;
  win_rate: number; // 0–100
  rank: number | null;
  recent_matches?: {
    id: string;
    result: 'WIN' | 'LOSS';
    opponent: string;
    mode?: string;
    date?: string;
    score?: string;
  }[];
  achievements?: {
    id: string;
    name: string;
    tier: 'gold' | 'silver' | 'bronze' | 'normal';
    description?: string;
  }[];
};

export default function PlayerProfilePage() {
  const params = useParams();
  const tournamentId = params.id as string;
  const playerId = params.playerId as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamName, setTeamName] = useState<string>('Unassigned');
  const [teamId, setTeamId] = useState<string | null>(null);

  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, tournamentId]);

  async function loadAll() {
    try {
      setLoading(true);
      setError(null);

      // 1) Load profile
      const profileRes = await fetch(`/api/profile/${playerId}`);
      const profileJson = await profileRes.json();

      let p: any = null;
      if (profileRes.ok) {
        p = profileJson.profile || profileJson || null;
        setProfile(p as Profile);
      } else {
        setProfile(null);
      }

      // 2) Resolve team info using team_id (or nested team)
      let resolvedTeamName = 'Unassigned';
      let resolvedTeamId: string | null = null;

      const rawTeamId: string | null =
        (p && (p.team_id as string)) ||
        (p && p.team && (p.team.id as string)) ||
        null;

      if (rawTeamId) {
        resolvedTeamId = rawTeamId;

        try {
          const teamsRes = await fetch(`/api/tournament/teams?tournament_id=${tournamentId}`);
          const teamsJson = await teamsRes.json();
          if (teamsRes.ok && Array.isArray(teamsJson.teams)) {
            const found = teamsJson.teams.find((t: any) => t.id === rawTeamId);
            if (found) {
              resolvedTeamName = found.name;
            }
          }
        } catch {
          // ignore, keep default
        }
      }

      setTeamId(resolvedTeamId);
      setTeamName(resolvedTeamName);

      // 3) Load stats
      const statsRes = await fetch(
        `/api/tournament/player-stats?player_id=${playerId}&tournament_id=${tournamentId}`,
      );
      const statsJson = await statsRes.json();

      if (statsRes.ok) {
        const s = statsJson.stats || statsJson;
        const coerced: PlayerStats = {
          total_wins: Number(s?.total_wins ?? 0),
          total_losses: Number(s?.total_losses ?? 0),
          total_matches: Number(s?.total_matches ?? 0),
          best_score: Number(s?.best_score ?? 0),
          current_streak: Number(s?.current_streak ?? 0),
          win_rate: Number(s?.win_rate ?? 0),
          rank: s?.rank ?? null,
          recent_matches: Array.isArray(s?.recent_matches) ? s.recent_matches : [],
          achievements: Array.isArray(s?.achievements) ? s.achievements : [],
        };
        setStats(coerced);
      } else {
        setStats(null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load player profile';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const displayName =
    profile?.full_name ||
    // @ts-expect-error – some schemas might use fullname/name
    (profile as any)?.fullname ||
    // @ts-expect-error
    (profile as any)?.name ||
    'Unnamed player';

  const jerseyNumber =
    (profile as any)?.jersey_number ??
    (profile as any)?.jerseyNumber ??
    null;

  const position = (profile as any)?.position ?? '';

  const totalWins = stats?.total_wins ?? 0;
  const totalLosses = stats?.total_losses ?? 0;
  const totalMatches = stats?.total_matches ?? totalWins + totalLosses;
  const bestScore = stats?.best_score ?? 0;
  const streak = stats?.current_streak ?? 0;
  const winRate =
    stats?.win_rate ??
    (totalMatches > 0 ? Math.round((totalWins / totalMatches) * 100) : 0);
  const rank = stats?.rank ?? null;

  const achievements = stats?.achievements ?? [];
  const recentMatches = stats?.recent_matches ?? [];

  if (loading) {
    return (
      <>
        <NavigationHeader currentPage="tournament" />
        <div
          style={{
            padding: 24,
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
          }}
        >
          Loading player profile…
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationHeader currentPage="tournament" />
        <div style={{ padding: 24 }}>
          <div
            style={{
              padding: 24,
              backgroundColor: '#fee2e2',
              border: '3px solid #000',
              borderRadius: 16,
              textAlign: 'center',
            }}
          >
            <p style={{ margin: 0, color: '#991b1b' }}>{error}</p>
            <div style={{ marginTop: 12 }}>
              <Link
                href={`/tournament/${tournamentId}`}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  borderRadius: 999,
                  border: '3px solid #000',
                  background: '#003DA5',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 800,
                }}
              >
                Back to tournament
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationHeader currentPage="tournament" />

      <main style={{ minHeight: '100vh', background: '#F5F5F5' }}>
        <div
          className="container"
          style={{ maxWidth: 1120, margin: '0 auto', padding: '20px 20px 64px' }}
        >
          {/* Back links */}
          <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Link
              href={`/tournament/${tournamentId}`}
              style={{
                display: 'inline-block',
                padding: '6px 10px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                textDecoration: 'none',
                color: '#003DA5',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              ← Back to tournament
            </Link>

            {teamId && (
              <Link
                href={`/tournament/${tournamentId}/teams/${teamId}`}
                style={{
                  display: 'inline-block',
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                  color: '#003DA5',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                ← Back to team roster
              </Link>
            )}
          </div>

          {/* HEADER BANNER */}
          <div style={{ marginBottom: 20 }}>
            <div className="tape-banner card-jiggle" style={{ marginBottom: 10 }}>
              Player profile
            </div>

            <div
              style={{
                display: 'flex',
                gap: 4,
                height: 4,
              }}
            >
              <div style={{ flex: 1, background: '#003DA5' }} />
              <div style={{ width: 40, background: '#EE2737' }} />
            </div>
          </div>

          {/* TOP: PLAYER IDENTITY CARD */}
          <section
            className="card-jiggle"
            style={{
              border: '3px solid #000',
              borderRadius: 22,
              background: '#FFFFFF',
              padding: '18px 20px',
              marginBottom: 24,
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2.5fr) minmax(0, 2.5fr)',
              gap: 18,
              boxShadow: '0 10px 0 rgba(0,0,0,0.08)',
            }}
          >
            {/* LEFT: avatar + name + status */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 999,
                  border: '4px solid #000',
                  background: '#FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 0 rgba(0,0,0,0.3)',
                }}
              >
                <span
                  style={{
                    fontFamily: '"Bangers", cursive',
                    fontSize: 32,
                    transform: 'rotate(-5deg)',
                    color: '#000',
                  }}
                >
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: '"Bangers", cursive',
                    fontSize: 32,
                    textTransform: 'uppercase',
                    letterSpacing: '.04em',
                    color: '#000',
                  }}
                >
                  {displayName}
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    marginTop: 6,
                    flexWrap: 'wrap',
                    fontSize: 12,
                    color: '#4b5563',
                    fontWeight: 600,
                  }}
                >
                  <span>
                    Team: <span style={{ color: '#003DA5' }}>{teamName}</span>
                  </span>

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

                  {jerseyNumber != null && jerseyNumber !== '' && (
                    <span
                      style={{
                        padding: '2px 8px',
                        background: '#111827',
                        color: '#fff',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      #{jerseyNumber}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 8 }}>
                  <span
                    className="active-pill"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: '3px solid #000',
                      background: '#EE2737',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '.1em',
                    }}
                  >
                    <span className="status-dot" />
                    In tournament
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT: stat row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 10,
                alignItems: 'stretch',
              }}
            >
              <StatPill label="Rank" value={rank ? `#${rank}` : '--'} />
              <StatPill label="Win rate" value={`${winRate}%`} />
              <StatPill label="Matches" value={`${totalMatches}`} />
            </div>
          </section>

          {/* QUICK STATS BOXES */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12,
              marginBottom: 26,
            }}
          >
            <QuickStatBox label="Total wins" value={totalWins} />
            <QuickStatBox label="Total losses" value={totalLosses} />
            <QuickStatBox label="Current streak" value={streak} suffix="W" />
            <QuickStatBox label="Best score" value={bestScore} />
          </section>

          {/* MAIN 2-COLUMN: Achievements + Recent */}
          <section
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)',
              gap: 20,
            }}
          >
            {/* LEFT COLUMN – ACHIEVEMENTS + QUICK ACTIONS */}
            <div>
              {/* Achievements */}
              <div style={{ marginBottom: 18 }}>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: '"Bangers", cursive',
                    fontSize: 22,
                    textTransform: 'uppercase',
                    letterSpacing: '.07em',
                  }}
                >
                  Achievements unlocked
                </h2>
                <div style={{ marginTop: 4, fontSize: 12, color: '#6b7280' }}>
                  {achievements.length} / 25 unlocked
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                {(achievements.length ? achievements : defaultAchievements()).map((a) => (
                  <AchievementBadge key={a.id} achievement={a} />
                ))}
              </div>

              {/* Quick Actions – View stats + Edit profile */}
              <div
                style={{
                  border: '3px solid #000',
                  borderRadius: 18,
                  background: '#FFFFFF',
                  padding: '14px 16px',
                  boxShadow: '0 6px 0 rgba(0,0,0,0.08)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <h3
                    style={{
                      margin: 0,
                      fontFamily: '"Bangers", cursive',
                      fontSize: 18,
                      textTransform: 'uppercase',
                    }}
                  >
                    Quick actions
                  </h3>
                  <div style={{ flex: 1, height: 2, background: '#000' }} />
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                  }}
                >
                  <ActionButton label="View stats" color="blue" />
                  <ActionButton label="Edit profile" color="blue-outline" />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN – RECENT MATCHES ONLY */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <h2
                  style={{
                    margin: '0 0 10px 0',
                    fontFamily: '"Bangers", cursive',
                    fontSize: 20,
                    textTransform: 'uppercase',
                    letterSpacing: '.06em',
                  }}
                >
                  Recent matches
                </h2>

                {recentMatches.length === 0 ? (
                  <div
                    style={{
                      padding: 16,
                      borderRadius: 14,
                      border: '3px dashed #000',
                      background: '#FFFFFF',
                      color: '#6b7280',
                      fontSize: 13,
                    }}
                  >
                    No match history yet. Once this player plays, their recent games will show up
                    here.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {recentMatches.slice(0, 4).map((m) => (
                      <RecentMatchCard key={m.id} match={m} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
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

        @keyframes pulse-dot {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.4);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .card-jiggle:hover {
          animation: jiggle 360ms ease;
        }

        .tape-banner {
          display: inline-block;
          background: #ee2737;
          color: #ffffff;
          padding: 8px 20px;
          border: 3px solid #000000;
          transform: rotate(-2deg);
          font-family: 'Bangers', cursive;
          font-size: 18px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          box-shadow: 0 6px 0 rgba(0, 0, 0, 0.35);
        }

        .active-pill .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #22c55e;
          border: 2px solid #000000;
          animation: pulse-dot 900ms infinite;
        }

        @media (max-width: 768px) {
          section.card-jiggle {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

/* ---------- Small subcomponents ---------- */

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: '3px solid #000',
        background: '#FFFFFF',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          color: '#6b7280',
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"Bangers", cursive',
          fontSize: 20,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function QuickStatBox({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: '3px solid #000',
        background: '#FFFFFF',
        padding: '12px 14px',
        boxShadow: '0 6px 0 rgba(0,0,0,0.1)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          color: '#6b7280',
          marginBottom: 4,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: '"Bangers", cursive',
          fontSize: 24,
        }}
      >
        {value}
        {suffix ? ` ${suffix}` : ''}
      </div>
    </div>
  );
}

function AchievementBadge({
  achievement,
}: {
  achievement: {
    id: string;
    name: string;
    tier: 'gold' | 'silver' | 'bronze' | 'normal';
    description?: string;
  };
}) {
  let bg = '#FFFFFF';
  let borderColor = '#000000';

  if (achievement.tier === 'gold') {
    bg = '#FFF7CC';
    borderColor = '#FFD700';
  } else if (achievement.tier === 'silver') {
    bg = '#E5E7EB';
    borderColor = '#9CA3AF';
  } else if (achievement.tier === 'bronze') {
    bg = '#F9731633';
    borderColor = '#EA580C';
  }

  return (
    <div
      style={{
        borderRadius: 16,
        border: `3px solid ${borderColor}`,
        background: bg,
        padding: '10px 12px',
        boxShadow: '0 4px 0 rgba(0,0,0,0.15)',
      }}
    >
      <div
        style={{
          fontFamily: '"Bangers", cursive',
          fontSize: 14,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}
      >
        {achievement.name}
      </div>
      {achievement.description && (
        <div style={{ fontSize: 11, color: '#4b5563' }}>{achievement.description}</div>
      )}
    </div>
  );
}

function ActionButton({ label, color }: { label: string; color: 'blue' | 'blue-outline' }) {
  const base = {
    padding: '9px 14px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 800,
    textTransform: 'uppercase' as const,
    letterSpacing: '.08em',
    cursor: 'pointer',
    boxShadow: '0 4px 0 rgba(0, 0, 0, 0.35)',
  };

  if (color === 'blue') {
    return (
      <button
        type="button"
        style={{
          ...base,
          border: '3px solid #000',
          background: '#003DA5',
          color: '#FFFFFF',
        }}
      >
        {label}
      </button>
    );
  }

  // blue-outline
  return (
    <button
      type="button"
      style={{
        ...base,
        border: '3px dashed #000',
        background: '#FFFFFF',
        color: '#003DA5',
        boxShadow: 'none',
      }}
    >
      {label}
    </button>
  );
}

function RecentMatchCard({
  match,
}: {
  match: { id: string; result: 'WIN' | 'LOSS'; opponent: string; mode?: string; date?: string; score?: string };
}) {
  const isWin = match.result === 'WIN';

  return (
    <div
      style={{
        borderRadius: 16,
        border: '3px solid #000',
        background: '#FFFFFF',
        padding: '10px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        boxShadow: '0 4px 0 rgba(0,0,0,0.12)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: 999,
            border: '3px solid #000',
            background: isWin ? '#10B981' : '#EE2737',
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
          }}
        >
          {isWin ? 'Win' : 'Loss'}
        </div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{match.opponent}</div>
        <div style={{ fontSize: 12, color: '#6b7280' }}>
          {match.mode || 'Match'} • {match.date || 'Date TBA'}
        </div>
      </div>

      <div
        style={{
          textAlign: 'right',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontFamily: '"Bangers", cursive',
            fontSize: 18,
          }}
        >
          {match.score || '-- : --'}
        </div>
      </div>
    </div>
  );
}

/* ---------- Fallback achievements ---------- */

function defaultAchievements() {
  return [
    {
      id: 'a1',
      name: 'First blood',
      tier: 'gold' as const,
      description: 'Scored first in a match.',
    },
    {
      id: 'a2',
      name: 'Flawless victory',
      tier: 'silver' as const,
      description: 'Win without conceding.',
    },
    {
      id: 'a3',
      name: 'Comeback king',
      tier: 'bronze' as const,
      description: 'Won after trailing.',
    },
    {
      id: 'a4',
      name: 'Speed demon',
      tier: 'normal' as const,
      description: 'Fastest score in a game.',
    },
  ];
}
