'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Team } from '../../lib/types';
import TeamRegistrationForm from '../../components/TeamRegistrationForm';
import TeamRosterList from '../../components/TeamRosterList';
import { NavigationHeader } from '@/lib/ui/components';

export default function TeamsManagementPage() {
  const params = useParams();
  const tournamentId = params.id as string;

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, [tournamentId]);

  async function loadTeams() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tournament/teams?tournament_id=${tournamentId}`);
      const data = await res.json();
      if (res.ok) setTeams(data.teams || []);
    } catch (err) {
      console.error('Failed to load teams', err);
    } finally {
      setLoading(false);
    }
  }

  function handleTeamCreated() {
    setShowAddForm(false);
    loadTeams();
  }

  return (
    <>
      <NavigationHeader currentPage="tournament" />

      <div className="container" style={{ paddingTop: 20 }}>

        {/* --------------------------------------------------- */}
        {/* BACK TO TOURNAMENT                                  */}
        {/* --------------------------------------------------- */}
        <div style={{ marginBottom: 18 }}>
          <Link
            href={`/tournament/${tournamentId}`}
            style={{
              display: 'inline-block',
              padding: '6px 10px',
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: '#1e40af',
              fontWeight: 700,
              fontSize: 15
            }}
          >
            ← Back to tournament
          </Link>
        </div>

        {/* Page header */}
        <div style={{ marginBottom: 20 }}>
          <div
            className="tape-banner"
            style={{ display: 'inline-block', marginBottom: 12, fontSize: 20 }}
          >
            Team Management
          </div>

          <h1
            style={{
              fontFamily: '"Bangers", cursive',
              fontSize: 38,
              margin: '6px 0 8px 0',
              lineHeight: 1,
            }}
          >
            Manage Teams
          </h1>

          <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
            Add, edit and manage team rosters for this tournament.
          </p>
        </div>

        {/* top controls + fun Team Hub */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
            flexWrap: 'wrap',
          }}
        >
          {/* Fun Team Hub */}
          <div
            className="team-hub"
            style={{
              display: 'flex',
              gap: 18,
              alignItems: 'center',
              border: '3px solid #000',
              padding: '12px 18px',
              borderRadius: 14,
              background: '#fff',
              boxShadow: '0 6px 0 rgba(0,0,0,0.35)',
              minWidth: 260,
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 12,
                border: '3px solid #000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f3f4f6',
                fontFamily: '"Bangers", cursive',
                fontSize: 34,
                letterSpacing: '0.02em',
                transform: 'rotate(-2deg)',
                boxShadow: '0 8px 0 rgba(0,0,0,0.12)',
              }}
            >
              {teams.length}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                Teams registered
              </div>

              <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                {/* tiny pixel squares */}
                <div style={{ display: 'flex', gap: 4 }}>
                  {Array.from({ length: Math.min(6, Math.max(1, teams.length)) }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 2,
                        border: '2px solid #000',
                        background: i < teams.length ? '#1D4ED8' : '#fff',
                        boxShadow: '0 2px 0 rgba(0,0,0,0.12)',
                      }}
                    />
                  ))}
                </div>

                {/* progress bar */}
                <div style={{ flex: 1 }}>
                  <div style={{ height: 8, borderRadius: 6, background: '#f3f4f6', border: '1px solid #e5e7eb' }}>
                    <div
                      style={{
                        width: `${Math.min(100, teams.length * 12)}%`,
                        height: '100%',
                        borderRadius: 6,
                        background: '#1D4ED8',
                        boxShadow: '0 4px 0 rgba(0,0,0,0.08)',
                        transition: 'width 220ms ease',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 8, fontSize: 13, color: '#6b7280' }}>
                Add teams to increase play-time and diversity.
              </div>
            </div>
          </div>

          {/* controls */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
              style={{
                padding: '10px 18px',
                borderRadius: 12,
                border: '3px solid #000',
                boxShadow: '0 6px 0 rgba(0,0,0,0.35)',
                fontWeight: 800,
              }}
            >
              {showAddForm ? 'Close' : '+ Add Team'}
            </button>

            <Link href={`/tournament/${tournamentId}/teams`}>
              <button
                className="btn btn-secondary"
                style={{
                  padding: '10px 16px',
                  borderRadius: 12,
                  border: '3px dashed #000',
                  fontWeight: 700,
                }}
              >
                View all teams
              </button>
            </Link>
          </div>
        </div>

        {/* Add Team Form */}
        {showAddForm && (
          <div style={{ marginBottom: 20, maxWidth: 760 }}>
            <TeamRegistrationForm
              tournamentId={tournamentId}
              onSuccess={handleTeamCreated}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Main grid (team list + roster) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: selectedTeam ? '420px 1fr' : '1fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          {/* left list */}
          <div>
            <h2
              style={{
                margin: '0 0 12px 0',
                fontFamily: '"Bangers", cursive',
                fontSize: 28,
                letterSpacing: '.02em',
              }}
            >
              Registered Teams
            </h2>

            {loading ? (
              <div style={{ padding: 20, color: '#6b7280' }}>Loading teams…</div>
            ) : teams.length === 0 ? (
              <div
                style={{
                  padding: 24,
                  border: '3px dashed #000',
                  borderRadius: 12,
                  background: '#fbfcfd',
                  color: '#6b7280',
                }}
              >
                No teams registered yet. Click <strong>+ Add Team</strong> to create the first team.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 18 }}>
                {teams.map((team) => {
                  const isSelected = selectedTeam === team.id;
                  const isHovered = hoveredTeam === team.id;

                  return (
                    <div
                      key={team.id}
                      onClick={() => setSelectedTeam(team.id)}
                      onMouseEnter={() => setHoveredTeam(team.id)}
                      onMouseLeave={() => setHoveredTeam(null)}
                      style={{
                        padding: 18,
                        borderRadius: 14,
                        border: isSelected ? '3px solid #1D4ED8' : '3px solid #000',
                        background: isSelected ? '#EFF6FF' : '#F9FAFB',
                        boxShadow: isHovered ? '0 12px 20px rgba(0,0,0,0.08)' : '0 6px 0 rgba(0,0,0,0.06)',
                        transform: isHovered ? 'translateY(-6px) rotate(-0.8deg)' : 'translateY(0) rotate(-0.6deg)',
                        transition: 'transform 180ms ease, box-shadow 180ms ease, background 160ms',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        overflow: 'visible',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div
                          style={{
                            fontFamily: '"Bangers", cursive',
                            fontSize: 26,
                            fontWeight: 600,
                            color: '#0F1724',
                            textTransform: 'uppercase',
                            letterSpacing: '0.02em',
                          }}
                        >
                          {team.name}
                        </div>

                        <div style={{ fontSize: 12, color: '#6b7280' }}>
                          {team.captain ? `Captain: ${team.captain.full_name}` : 'No captain'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/tournament/${tournamentId}/teams/${team.id}`}>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: 10,
                              border: '3px solid #000',
                              background: '#1D4ED8',
                              color: '#fff',
                              fontWeight: 800,
                              boxShadow: '0 6px 0 rgba(0,0,0,0.35)',
                              cursor: 'pointer',
                            }}
                          >
                            Manage roster
                          </button>
                        </Link>

                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (!confirm(`Remove team "${team.name}"? This cannot be undone.`)) return;
                            try {
                              const res = await fetch('/api/tournament/team/remove', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ tournament_id: tournamentId, team_id: team.id }),
                              });
                              if (res.ok) {
                                setTeams((prev) => prev.filter((t) => t.id !== team.id));
                                if (selectedTeam === team.id) setSelectedTeam(null);
                              } else {
                                const d = await res.json();
                                alert(d?.error || 'Failed to remove team');
                              }
                            } catch {
                              alert('Failed to remove team');
                            }
                          }}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 10,
                            border: '3px solid #000',
                            background: '#F3F4F6',
                            color: '#111827',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right panel */}
          {selectedTeam && (
            <div
              style={{
                padding: 12,
                borderRadius: 12,
                border: '3px solid #e5e7eb',
                background: '#fff',
              }}
            >
              <TeamRosterList
                teamId={selectedTeam}
                teamName={teams.find((t) => t.id === selectedTeam)?.name}
                editable={true}
              />
            </div>
          )}
        </div>
      </div>

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
        @font-face {
          font-family: "BangersFallback";
          src: local("Bangers"), local("Bangers-Regular");
        }
      `}</style>
    </>
  );
}
