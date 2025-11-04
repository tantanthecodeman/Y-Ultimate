'use client';

import { useState, useEffect } from 'react';
import { TeamPlayer } from '../lib/types';

interface TeamRosterListProps {
  teamId: string;
  teamName?: string;
  editable?: boolean;
}

export default function TeamRosterList({ 
  teamId, 
  teamName,
  editable = false 
}: TeamRosterListProps) {
  const [players, setPlayers] = useState<TeamPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers();
  }, [teamId]);

  async function loadPlayers() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/tournament/team/players?team_id=${teamId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to load players');
      }

      setPlayers(data.players || []);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemovePlayer(playerId: string) {
    if (!confirm('Remove this player from the team?')) return;

    try {
      // TODO: Implement remove player API
      alert('Remove player API not yet implemented');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to remove player';
      alert('Error: ' + message);
    }
  }
  

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 40,
        color: '#6b7280' 
      }}>
        Loading roster...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: 16,
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: 8,
        color: '#991b1b'
      }}>
        ❌ {error}
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        marginBottom: 16,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ 
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: '#111827'
        }}>
          {teamName ? `${teamName} Roster` : 'Team Roster'}
        </h3>
        <span style={{
          fontSize: 14,
          color: '#6b7280',
          backgroundColor: '#f3f4f6',
          padding: '4px 12px',
          borderRadius: 12,
          fontWeight: 600
        }}>
          {players.length} {players.length === 1 ? 'Player' : 'Players'}
        </span>
      </div>

      {players.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 40,
          border: '1px dashed #d1d5db',
          borderRadius: 8,
          color: '#9ca3af'
        }}>
          No players added yet. Add players to build your roster.
        </div>
      ) : (
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          overflow: 'hidden'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse' 
          }}>
            <thead>
              <tr style={{ 
                backgroundColor: '#f9fafb',
                borderBottom: '2px solid #e5e7eb'
              }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#374151'
                }}>
                  Player
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#374151',
                  width: 100
                }}>
                  Jersey #
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#374151',
                  width: 100
                }}>
                  Role
                </th>
                {editable && (
                  <th style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    color: '#374151',
                    width: 100
                  }}>
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr 
                  key={player.id}
                  style={{ 
                    borderBottom: '1px solid #f3f4f6',
                    backgroundColor: player.is_captain ? '#fef3c7' : '#fff'
                  }}
                >
                  <td style={{ 
                    padding: '12px 16px',
                    fontWeight: player.is_captain ? 700 : 500,
                    color: '#111827'
                  }}>
                    {player.is_captain && '👑 '}
                    {player.player?.full_name || 'Unknown Player'}
                  </td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontWeight: 600
                  }}>
                    {player.jersey_number || '-'}
                  </td>
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: 12,
                    color: '#6b7280'
                  }}>
                    {player.is_captain ? (
                      <span style={{
                        backgroundColor: '#fbbf24',
                        color: '#78350f',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontWeight: 600
                      }}>
                        Captain
                      </span>
                    ) : (
                      <span style={{
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontWeight: 600
                      }}>
                        Player
                      </span>
                    )}
                  </td>
                  {editable && (
                    <td style={{ 
                      padding: '12px 16px',
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => handleRemovePlayer(player.id)}
                        style={{
                          padding: '4px 12px',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
