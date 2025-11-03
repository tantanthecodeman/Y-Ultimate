'use client';

import { Match } from '../lib/types';

interface MatchCardProps {
  match: Match;
  showActions?: boolean;
  onUpdateScore?: (matchId: string) => void;
}

export default function MatchCard({ 
  match, 
  showActions = false,
  onUpdateScore 
}: MatchCardProps) {
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';
  const isBye = !match.home_team_id || !match.away_team_id;

  const getStatusColor = () => {
    if (isCompleted) return '#10b981'; // green
    if (isLive) return '#ef4444'; // red
    return '#6b7280'; // gray
  };

  const getStatusBg = () => {
    if (isCompleted) return '#d1fae5';
    if (isLive) return '#fee2e2';
    return '#f3f4f6';
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      backgroundColor: getStatusBg(),
      boxShadow: isLive ? '0 4px 6px rgba(239, 68, 68, 0.1)' : 'none'
    }}>
      {/* Status Badge */}
      <div style={{ 
        marginBottom: 12,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{
          fontSize: 12,
          fontWeight: 600,
          color: getStatusColor(),
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {isLive && '🔴 '}
          {match.status}
        </span>
        {match.field && (
          <span style={{
            fontSize: 12,
            color: '#6b7280',
            backgroundColor: '#fff',
            padding: '4px 8px',
            borderRadius: 4
          }}>
            Field {match.field}
          </span>
        )}
      </div>

      {/* Teams & Score */}
      {isBye ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '20px 0',
          color: '#9ca3af',
          fontStyle: 'italic'
        }}>
          BYE Match
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          gap: 16
        }}>
          {/* Home Team */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: 16,
              color: '#111827',
              marginBottom: 4
            }}>
              {match.home_team?.name || 'TBD'}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: '#6b7280' 
            }}>
              Home
            </div>
          </div>
          
          {/* Score */}
          <div style={{ 
            fontSize: 32, 
            fontWeight: 'bold', 
            color: isCompleted ? '#111827' : '#9ca3af',
            minWidth: 100,
            textAlign: 'center'
          }}>
            {match.home_score} - {match.away_score}
          </div>
          
          {/* Away Team */}
          <div style={{ flex: 1, textAlign: 'right' }}>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: 16,
              color: '#111827',
              marginBottom: 4
            }}>
              {match.away_team?.name || 'TBD'}
            </div>
            <div style={{ 
              fontSize: 12, 
              color: '#6b7280' 
            }}>
              Away
            </div>
          </div>
        </div>
      )}

      {/* Match Time */}
      {match.start_time && (
        <div style={{ 
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid #e5e7eb',
          fontSize: 13,
          color: '#6b7280',
          textAlign: 'center'
        }}>
          🕐 {new Date(match.start_time).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </div>
      )}

      {/* Actions */}
      {showActions && !isBye && onUpdateScore && (
        <div style={{ 
          marginTop: 12,
          paddingTop: 12,
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => onUpdateScore(match.id)}
            style={{
              width: '100%',
              padding: '8px 16px',
              backgroundColor: isCompleted ? '#6b7280' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            {isCompleted ? 'Update Score' : 'Enter Score'}
          </button>
        </div>
      )}
    </div>
  );
}
