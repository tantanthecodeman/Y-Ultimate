'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Tournament, Match, Standing, Team } from '../lib/types';
import MatchCard from '../components/MatchCard';
import StandingsTable from '../components/StandingsTable';

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
  }, [tournamentId]);

  async function loadData() {
    setLoading(true);
    setError(null);
    
    try {
      // Load tournament details
      const tournRes = await fetch(`/api/tournament/${tournamentId}`);
      const tournData = await tournRes.json();
      
      if (!tournRes.ok) {
        throw new Error(tournData?.error || 'Failed to load tournament');
      }
      
      setTournament(tournData.tournament);

      // Load matches
      const matchRes = await fetch(`/api/tournament/matches?tournament_id=${tournamentId}`);
      const matchData = await matchRes.json();
      setMatches(matchData.matches || []);

      // Load standings
      const standRes = await fetch(`/api/tournament/leaderboard?tournament_id=${tournamentId}`);
      const standData = await standRes.json();
      setStandings(standData.standings || []);

      // Load teams
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
    if (!confirm('Generate matches for this tournament? This will create all round-robin matches.')) {
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

      alert(`✅ Generated ${data.matches.length} matches!`);
      loadData(); // Reload all data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate matches';
      alert('Error: ' + message);
    }
  }

  if (loading) {
    return (
      <div style={{ 
        padding: 24,
        textAlign: 'center',
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ color: '#6b7280', fontSize: 16 }}>Loading tournament...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{
          padding: 24,
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: 12,
          textAlign: 'center'
        }}>
          <p style={{ color: '#991b1b', fontSize: 16, margin: 0 }}>
            ❌ {error || 'Tournament not found'}
          </p>
          <button
            onClick={() => router.push('/tournament')}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const completedMatches = matches.filter(m => m.status === 'completed').length;
  const liveMatches = matches.filter(m => m.status === 'live').length;
  const upcomingMatches = matches.filter(m => m.status === 'scheduled').length;

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link 
          href="/tournament"
          style={{
            display: 'inline-block',
            marginBottom: 16,
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          ← Back to Tournaments
        </Link>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <h1 style={{ 
              fontSize: 32, 
              fontWeight: 700,
              margin: '0 0 8px 0',
              color: '#111827'
            }}>
              {tournament.name}
            </h1>
            <div style={{ 
              fontSize: 14,
              color: '#6b7280',
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap'
            }}>
              {tournament.start_date && tournament.end_date && (
                <span>
                  📅 {new Date(tournament.start_date).toLocaleDateString()} - {new Date(tournament.end_date).toLocaleDateString()}
                </span>
              )}
              {tournament.location && (
                <span>📍 {tournament.location}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Link href={`/tournament/${tournamentId}/edit`}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}>
                Edit Tournament
              </button>
            </Link>
            
            {matches.length === 0 && teams.length >= 2 && (
              <button
                onClick={handleGenerateMatches}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Generate Matches
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: 8,
        marginBottom: 24,
        borderBottom: '2px solid #e5e7eb',
        overflowX: 'auto'
      }}>
        {[
          { key: 'overview' as TabType, label: 'Overview', icon: '📊' },
          { key: 'matches' as TabType, label: `Matches (${matches.length})`, icon: '⚡' },
          { key: 'standings' as TabType, label: 'Standings', icon: '🏆' },
          { key: 'teams' as TabType, label: `Teams (${teams.length})`, icon: '👥' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: 15,
              color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === tab.key ? '3px solid #3b82f6' : '3px solid transparent',
              marginBottom: -2,
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 32
          }}>
            <div style={{
              padding: 20,
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                Total Teams
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#111827' }}>
                {teams.length}
              </div>
            </div>

            <div style={{
              padding: 20,
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                Total Matches
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#111827' }}>
                {matches.length}
              </div>
            </div>

            <div style={{
              padding: 20,
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                Completed
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>
                {completedMatches}
              </div>
            </div>

            <div style={{
              padding: 20,
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 12
            }}>
              <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>
                Live Now
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#ef4444' }}>
                {liveMatches}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            padding: 24,
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            marginBottom: 32
          }}>
            <h3 style={{ 
              margin: '0 0 16px 0',
              fontSize: 18,
              fontWeight: 700,
              color: '#111827'
            }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href={`/tournament/${tournamentId}/teams`}>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  👥 Manage Teams
                </button>
              </Link>
              
              <Link href={`/tournament/${tournamentId}/matches`}>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  ⚡ Manage Matches
                </button>
              </Link>
              
              <Link href={`/tournament/${tournamentId}/spirit`}>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  🕊️ Submit Spirit Scores
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Matches */}
          {matches.length > 0 && (
            <div>
              <h3 style={{ 
                margin: '0 0 16px 0',
                fontSize: 20,
                fontWeight: 700,
                color: '#111827'
              }}>
                Recent Matches
              </h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {matches.slice(0, 5).map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
              {matches.length > 5 && (
                <Link href={`/tournament/${tournamentId}/matches`}>
                  <button style={{
                    marginTop: 16,
                    padding: '10px 20px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600
                  }}>
                    View All Matches →
                  </button>
                </Link>
              )}
            </div>
          )}

          {/* No matches yet */}
          {matches.length === 0 && teams.length < 2 && (
            <div style={{
              padding: 40,
              textAlign: 'center',
              border: '2px dashed #d1d5db',
              borderRadius: 12,
              color: '#6b7280'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
              <p style={{ fontSize: 16, margin: '0 0 8px 0', fontWeight: 600 }}>
                Get Started
              </p>
              <p style={{ fontSize: 14, margin: 0 }}>
                Add at least 2 teams to generate the match schedule.
              </p>
              <Link href={`/tournament/${tournamentId}/teams`}>
                <button style={{
                  marginTop: 16,
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  Add Teams
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'matches' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>
              All Matches
            </h2>
            <Link href={`/tournament/${tournamentId}/matches`}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}>
                Manage Matches
              </button>
            </Link>
          </div>

          {matches.length === 0 ? (
            <div style={{
              padding: 60,
              textAlign: 'center',
              border: '2px dashed #d1d5db',
              borderRadius: 12,
              color: '#9ca3af'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
              <p style={{ fontSize: 16, margin: 0 }}>
                No matches scheduled yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'standings' && (
        <div>
          <h2 style={{ 
            margin: '0 0 20px 0',
            fontSize: 24,
            fontWeight: 700,
            color: '#111827'
          }}>
            Tournament Standings
          </h2>
          <StandingsTable standings={standings} showSpirit={true} />
        </div>
      )}

      {activeTab === 'teams' && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20
          }}>RetryTGContinuetypescript            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>
              Registered Teams
            </h2>
            <Link href={`/tournament/${tournamentId}/teams`}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}>
                Manage Teams
              </button>
            </Link>
          </div>

          {teams.length === 0 ? (
            <div style={{
              padding: 60,
              textAlign: 'center',
              border: '2px dashed #d1d5db',
              borderRadius: 12,
              color: '#9ca3af'
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
              <p style={{ fontSize: 16, margin: '0 0 16px 0' }}>
                No teams registered yet.
              </p>
              <Link href={`/tournament/${tournamentId}/teams`}>
                <button style={{
                  padding: '10px 20px',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  Add First Team
                </button>
              </Link>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16
            }}>
              {teams.map((team) => (
                <div
                  key={team.id}
                  style={{
                    padding: 20,
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#111827'
                  }}>
                    {team.name}
                  </h3>
                  <div style={{
                    fontSize: 14,
                    color: '#6b7280',
                    marginBottom: 16
                  }}>
                    {team.captain ? (
                      <span>👑 Captain: {team.captain.full_name}</span>
                    ) : (
                      <span>No captain assigned</span>
                    )}
                  </div>
                  <Link href={`/tournament/${tournamentId}/teams/${team.id}`}>
                    <button style={{
                      width: '100%',
                      padding: '8px 16px',
                      backgroundColor: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: 14,
                      fontWeight: 600
                    }}>
                      View Roster
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}