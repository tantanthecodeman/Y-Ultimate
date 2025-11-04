'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Team } from '../../lib/types';
import TeamRegistrationForm from '../../components/TeamRegistrationForm';
import TeamRosterList from '../../components/TeamRosterList';

export default function TeamsManagementPage() {
  const params = useParams();
  const router = useRouter();
  const tournamentId = params.id as string;
  
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, [tournamentId]);

  async function loadTeams() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tournament/teams?tournament_id=${tournamentId}`);
      const data = await res.json();
      
      if (res.ok) {
        setTeams(data.teams || []);
      }
    } catch (err: unknown) {
      console.error('Failed to load teams');
    } finally {
      setLoading(false);
    }
  }

  function handleTeamCreated() {
    setShowAddForm(false);
    loadTeams();
  }

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        Loading teams...
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link 
          href={`/tournament/${tournamentId}`}
          style={{
            display: 'inline-block',
            marginBottom: 16,
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          ← Back to Tournament
        </Link>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
              Team Management
            </h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
              {teams.length} {teams.length === 1 ? 'team' : 'teams'} registered
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
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
            {showAddForm ? 'Cancel' : '+ Add Team'}
          </button>
        </div>
      </div>

      {/* Add Team Form */}
      {showAddForm && (
        <div style={{ marginBottom: 32 }}>
          <TeamRegistrationForm
            tournamentId={tournamentId}
            onSuccess={handleTeamCreated}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <div style={{
          padding: 60,
          textAlign: 'center',
          border: '2px dashed #d1d5db',
          borderRadius: 12,
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <p style={{ fontSize: 16, margin: '0 0 8px 0', fontWeight: 600 }}>
            No teams registered yet
          </p>
          <p style={{ fontSize: 14, margin: '0 0 16px 0' }}>
            Add your first team to get started with the tournament.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            Add First Team
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedTeam ? '300px 1fr' : '1fr',
          gap: 24
        }}>
          {/* Teams List */}
          <div>
            <h2 style={{
              margin: '0 0 16px 0',
              fontSize: 20,
              fontWeight: 700,
              color: '#111827'
            }}>
              Teams
            </h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {teams.map((team) => (
                <div
                  key={team.id}
                  style={{
                    padding: 16,
                    backgroundColor: selectedTeam === team.id ? '#dbeafe' : '#fff',
                    border: '1px solid',
                    borderColor: selectedTeam === team.id ? '#3b82f6' : '#e5e7eb',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div
                    onClick={() => setSelectedTeam(team.id)}
                    style={{ marginBottom: 12 }}
                  >
                    <div style={{
                      fontWeight: 600,
                      fontSize: 16,
                      color: '#111827',
                      marginBottom: 4
                    }}>
                      {team.name}
                    </div>
                    <div style={{
                      fontSize: 12,
                      color: '#6b7280'
                    }}>
                      {team.captain ? `👑 ${team.captain.full_name}` : 'No captain'}
                    </div>
                  </div>
                  
                  <Link href={`/tournament/${tournamentId}/teams/${team.id}`}>
                    <button
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        backgroundColor: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: 13,
                        fontWeight: 600
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Manage Roster →
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Team Roster */}
          {selectedTeam && (
            <div>
              <TeamRosterList
                teamId={selectedTeam}
                teamName={teams.find(t => t.id === selectedTeam)?.name}
                editable={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
