'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Match, Team } from '../../lib/types';
import SpiritScoreForm from '../../components/SpiritScoreForm';

export default function SpiritScorePage() {
  const params = useParams();
  const tournamentId = params.id as string;
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [scorerProfileId] = useState('temp-profile-id'); // TODO: Get from auth
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    loadData();
  }, [tournamentId]);

  async function loadData() {
    try {
      setLoading(true);

      // Load completed matches
      const matchRes = await fetch(`/api/tournament/matches?tournament_id=${tournamentId}`);
      const matchData = await matchRes.json();
      const completedMatches = (matchData.matches || []).filter(
        (m: Match) => m.status === 'completed'
      );
      setMatches(completedMatches);

      // Load teams
      const teamsRes = await fetch(`/api/tournament/teams?tournament_id=${tournamentId}`);
      const teamsData = await teamsRes.json();
      setTeams(teamsData.teams || []);
    } catch (err: unknown) {
      console.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  function handleSubmitSuccess() {
    setSubmitted(true);
    setSelectedMatch('');
    setSelectedTeam('');
    
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  }

  const selectedMatchData = matches.find(m => m.id === selectedMatch);
  const selectedTeamData = teams.find(t => t.id === selectedTeam);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: '0 auto' }}>
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
        
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 700,
          margin: '0 0 8px 0',
          color: '#111827'
        }}>
          Submit Spirit Score
        </h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: 14 }}>
          Rate your opponent&apos;s Spirit of the Game
        </p>
      </div>

      {/* Success Message */}
      {submitted && (
        <div style={{
          padding: 16,
          backgroundColor: '#d1fae5',
          border: '1px solid #6ee7b7',
          borderRadius: 8,
          marginBottom: 24,
          color: '#065f46',
          fontSize: 14
        }}>
          ✅ Spirit score submitted successfully!
        </div>
      )}

      {/* Match Selection */}
      <div style={{
        padding: 24,
        backgroundColor: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        marginBottom: 24
      }}>
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: 18,
          fontWeight: 700,
          color: '#111827'
        }}>
          Select Match
        </h2>

        {matches.length === 0 ? (
          <div style={{
            padding: 40,
            textAlign: 'center',
            border: '2px dashed #d1d5db',
            borderRadius: 8,
            color: '#9ca3af'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
            <p style={{ fontSize: 14, margin: 0 }}>
              No completed matches yet. Spirit scores can only be submitted after matches are completed.
            </p>
          </div>
        ) : (
          <>
            <select
              value={selectedMatch}
              onChange={(e) => {
                setSelectedMatch(e.target.value);
                setSelectedTeam('');
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                fontSize: 14,
                marginBottom: 16
              }}
            >
              <option value="">Select a completed match...</option>
              {matches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.home_team?.name || 'TBD'} vs {match.away_team?.name || 'TBD'} 
                  ({match.home_score}-{match.away_score})
                </option>
              ))}
            </select>

            {/* Team Selection */}
            {selectedMatchData && (
              <>
                <h3 style={{
                  margin: '0 0 12px 0',
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#374151'
                }}>
                  Rate Team
                </h3>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    fontSize: 14
                  }}
                >
                  <option value="">Select team to rate...</option>
                  {selectedMatchData.home_team && (
                    <option value={selectedMatchData.home_team_id || ''}>
                      {selectedMatchData.home_team.name}
                    </option>
                  )}
                  {selectedMatchData.away_team && (
                    <option value={selectedMatchData.away_team_id || ''}>
                      {selectedMatchData.away_team.name}
                    </option>
                  )}
                </select>
              </>
            )}
          </>
        )}
      </div>

      {/* Spirit Score Form */}
      {selectedMatch && selectedTeam && (
        <SpiritScoreForm
          matchId={selectedMatch}
          teamId={selectedTeam}
          scorerProfileId={scorerProfileId}
          teamName={selectedTeamData?.name}
          onSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  );
}
