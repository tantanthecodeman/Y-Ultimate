'use client';

import Link from 'next/link';
import { Tournament } from '../lib/types';

interface TournamentCardProps {
  tournament: Tournament;
  showActions?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TournamentCard({ 
  tournament,
  showActions = false,
  onEdit,
  onDelete
}: TournamentCardProps) {
  const startDate = tournament.start_date 
    ? new Date(tournament.start_date).toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'TBD';

  const endDate = tournament.end_date
    ? new Date(tournament.end_date).toLocaleDateString('en-IN', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    : 'TBD';

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: 12,
      padding: 20,
      backgroundColor: '#fff',
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <Link 
        href={`/tournament/${tournament.id}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <h3 style={{
          margin: '0 0 12px 0',
          fontSize: 20,
          fontWeight: 700,
          color: '#111827'
        }}>
          {tournament.name}
        </h3>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: 14,
          color: '#6b7280'
        }}>
          {/* Dates */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>📅</span>
            <span>{startDate} - {endDate}</span>
          </div>

          {/* Location */}
          {tournament.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>📍</span>
              <span>{tournament.location}</span>
            </div>
          )}

          {/* Created Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🕐</span>
            <span>
              Created {new Date(tournament.created_at).toLocaleDateString('en-IN')}
            </span>
          </div>
        </div>
      </Link>

      {/* Actions */}
      {showActions && (onEdit || onDelete) && (
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: 8
        }}>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(tournament.id);
              }}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete "${tournament.name}"? This cannot be undone.`)) {
                  onDelete(tournament.id);
                }
              }}
              style={{
                flex: 1,
                padding: '8px 16px',
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
