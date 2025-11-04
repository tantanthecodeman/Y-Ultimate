'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Team } from '../../../lib/types';
import TeamRosterList from '../../../components/TeamRosterList';
import AddPlayerToTeamForm from '../../../components/AddPlayerToTeamForm';

export default function TeamRosterDetailPage() {
  const params = useParams();
  const tournamentId = params.id as string;
  const teamId = params.teamId as string;
  
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeam();
  }, [teamId]);

  async function loadTeam() {
    try {
      setLoading(true);
      setError(null);

      // Get team details
      const res = await fetch(`/api/tournament/teams?tournament_id=${tournamentId}`);
      const data = await res.json();
      
      if (res.ok) {
        const foundTeam = (data.teams || []).find((t: Team) => t.id === teamId);
        if (foundTeam) {
          setTeam(foundTeam);
        } else {
          setError('Team not found');
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load team';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handlePlayerAdded() {
    setShowAddForm(false);
    // Roster list will auto-reload
  }

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        Loading team...
      </div>
    );
  }

  if (error || !team) {
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
            ❌ {error || 'Team not found'}
          </p>
          <Link href={`/tournament/${tournamentId}/teams`}>
            <button style={{
              marginTop: 16,
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}>
              Back to Teams
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <Link 
          href={`/tournament/${tournamentId}/teams`}
          style={{
            display: 'inline-block',
            marginBottom: 16,
            color: '#3b82f6',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          ← Back to Teams
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
              {team.name}
            </h1>
            {team.captain && (
              <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
                👑 Captain: {team.captain.full_name}
              </p>
            )}
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
            {showAddForm ? 'Cancel' : '+ Add Player'}
          </button>
        </div>
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

      {/* Team Roster */}
      <TeamRosterList
        teamId={teamId}
        teamName={team.name}
        editable={true}
      />
    </div>
  );
}
