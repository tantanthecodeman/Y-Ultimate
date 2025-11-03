'use client';

import { Standing } from '../lib/types';

interface StandingsTableProps {
  standings: Standing[];
  loading?: boolean;
  showSpirit?: boolean;
}

export default function StandingsTable({ 
  standings, 
  loading = false,
  showSpirit = true 
}: StandingsTableProps) {
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 40,
        color: '#6b7280' 
      }}>
        Loading standings...
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: 40,
        color: '#9ca3af',
        border: '1px dashed #d1d5db',
        borderRadius: 8
      }}>
        No standings data available yet. Matches need to be completed first.
      </div>
    );
  }

  return (
    <div style={{ 
      overflowX: 'auto',
      border: '1px solid #e5e7eb',
      borderRadius: 8
    }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        backgroundColor: '#fff'
      }}>
        <thead>
          <tr style={{ 
            backgroundColor: '#f9fafb',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <th style={{ 
              padding: '12px 16px', 
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: '#374151',
              width: 60
            }}>
              Rank
            </th>
            <th style={{ 
              padding: '12px 16px', 
              textAlign: 'left',
              fontWeight: 700,
              fontSize: 14,
              color: '#374151'
            }}>
              Team
            </th>
            <th style={{ 
              padding: '12px 16px', 
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: '#374151',
              width: 60
            }}>
              P
            </th>
            <th style={{ 
              padding: '12px 16px', 
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: '#374151',
              width: 60
            }}>
              W
            </th>
            <th style={{ 
              padding: '12px 16px', 
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: '#374151',
              width: 60
            }}>
              D
            </th>
            <th style={{ 
              padding: '12px 16px', 
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: '#374151',
              width: 60
            }}>
              L
            </th>
            <th style={{ 
              padding: '12px 16px', 
              textAlign: 'center',
              fontWeight: 700,
              fontSize: 14,
              color: '#374151',
              width: 80,
              backgroundColor: '#fef3c7'
            }}>
              Points
            </th>
            {showSpirit && (
              <th style={{ 
                padding: '12px 16px', 
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 14,
                color: '#374151',
                width: 80,
                backgroundColor: '#dbeafe'
              }}>
                Spirit
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => {
            const isTopThree = index < 3;
            const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            
            return (
              <tr 
                key={standing.team_id}
                style={{ 
                  borderBottom: '1px solid #f3f4f6',
                  backgroundColor: isTopThree ? '#f0fdf4' : '#fff',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isTopThree ? '#f0fdf4' : '#fff';
                }}
              >
                <td style={{ 
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#111827'
                }}>
                  {medalEmoji || index + 1}
                </td>
                <td style={{ 
                  padding: '12px 16px',
                  fontWeight: 600,
                  fontSize: 15,
                  color: '#111827'
                }}>
                  {standing.team_id}
                </td>
                <td style={{ 
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  {standing.played}
                </td>
                <td style={{ 
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#059669',
                  fontWeight: 600
                }}>
                  {standing.wins}
                </td>
                <td style={{ 
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  {standing.draws}
                </td>
                <td style={{ 
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#dc2626',
                  fontWeight: 600
                }}>
                  {standing.losses}
                </td>
                <td style={{ 
                  padding: '12px 16px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#111827',
                  backgroundColor: '#fef9c3'
                }}>
                  {standing.points}
                </td>
                {showSpirit && (
                  <td style={{ 
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: 15,
                    color: '#1e40af',
                    backgroundColor: '#eff6ff'
                  }}>
                    {standing.avg_spirit ? standing.avg_spirit.toFixed(1) : '-'}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div style={{ 
        padding: '12px 16px',
        backgroundColor: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        fontSize: 12,
        color: '#6b7280',
        display: 'flex',
        gap: 16,
        flexWrap: 'wrap'
      }}>
        <span><strong>P</strong> = Played</span>
        <span><strong>W</strong> = Won</span>
        <span><strong>D</strong> = Draw</span>
        <span><strong>L</strong> = Lost</span>
        <span><strong>Points</strong> = W×3 + D×1</span>
        {showSpirit && <span><strong>Spirit</strong> = Average spirit score</span>}
      </div>
    </div>
  );
}
